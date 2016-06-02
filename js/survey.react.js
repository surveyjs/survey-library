/*!
* surveyjs - Survey JavaScript library v0.9.7
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
        emptySurvey: "There is no any visible page or visible question in the survey.",
        completingSurvey: "Thank You for Completing the Survey!",
        loadingSurvey: "Survey is loading from the server...",
        optionsCaption: "Choose...",
        requiredError: "Please answer the question.",
        numericError: "The value should be a numeric.",
        textMinLength: "Please enter at least {0} symbols.",
        minSelectError: "Please select at least {0} variants.",
        maxSelectError: "Please select not more than {0} variants.",
        numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
        numericMin: "The '{0}' should be equal or more than {1}",
        numericMax: "The '{0}' should be equal or less than {1}",
        invalidEmail: "Please enter a valid e-mail.",
        otherRequiredError: "Please enter the others value."
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
            if (value == null)
                return;
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
        Object.defineProperty(PageModel.prototype, "processedTitle", {
            get: function () { return this.data != null ? this.data.processText(this.title) : this.title; },
            enumerable: true,
            configurable: true
        });
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
            this.text = "";
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
    var RegexValidator = (function (_super) {
        __extends(RegexValidator, _super);
        function RegexValidator(regex) {
            if (regex === void 0) { regex = null; }
            _super.call(this);
            this.regex = regex;
        }
        RegexValidator.prototype.getType = function () { return "regexvalidator"; };
        RegexValidator.prototype.validate = function (value, name) {
            if (name === void 0) { name = null; }
            if (!this.regex || !value)
                return null;
            var re = new RegExp(this.regex);
            if (re.test(value))
                return null;
            return new ValidatorResult(value, new Survey.CustomError(this.getErrorText(name)));
        };
        return RegexValidator;
    }(SurveyValidator));
    Survey.RegexValidator = RegexValidator;
    var EmailValidator = (function (_super) {
        __extends(EmailValidator, _super);
        function EmailValidator() {
            _super.call(this);
            this.re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        }
        EmailValidator.prototype.getType = function () { return "emailvalidator"; };
        EmailValidator.prototype.validate = function (value, name) {
            if (name === void 0) { name = null; }
            if (!value)
                return null;
            if (this.re.test(value))
                return null;
            return new ValidatorResult(value, new Survey.CustomError(this.getErrorText(name)));
        };
        EmailValidator.prototype.getDefaultErrorText = function (name) {
            return Survey.surveyLocalization.getString("invalidEmail");
        };
        return EmailValidator;
    }(SurveyValidator));
    Survey.EmailValidator = EmailValidator;
    Survey.JsonObject.metaData.addClass("surveyvalidator", ["text"]);
    Survey.JsonObject.metaData.addClass("numericvalidator", ["minValue:number", "maxValue:number"], function () { return new NumericValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("textvalidator", ["minLength:number"], function () { return new TextValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("answercountvalidator", ["minCount:number", "maxCount:number"], function () { return new AnswerCountValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("regexvalidator", ["regex"], function () { return new RegexValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("emailvalidator", [], function () { return new EmailValidator(); }, "surveyvalidator");
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
        Object.defineProperty(Question.prototype, "processedTitle", {
            get: function () { return this.data != null ? this.data.processText(this.title) : this.title; },
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
        Object.defineProperty(Question.prototype, "requiredText", {
            get: function () { return this.data != null ? this.data.requiredText : ""; },
            enumerable: true,
            configurable: true
        });
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
                text = Survey.surveyLocalization.getString("otherRequiredError");
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
        Object.defineProperty(QuestionHtmlModel.prototype, "processedHtml", {
            get: function () { return this.data ? this.data.processHtml(this.html) : this.html; },
            enumerable: true,
            configurable: true
        });
        return QuestionHtmlModel;
    }(Survey.QuestionBase));
    Survey.QuestionHtmlModel = QuestionHtmlModel;
    Survey.JsonObject.metaData.addClass("html", ["html:html"], function () { return new QuestionHtmlModel(""); }, "questionbase");
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
            set: function (value) { this.columnsValue = value; },
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
    Survey.JsonObject.metaData.addClass("matrixdropdown", ["columns:matrixdropdowncolumns", "rows:itemvalues", "choices:itemvalues", "optionsCaption"], function () { return new QuestionMatrixDropdownModel(""); }, "question");
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
            this.colCountValue = 1;
            this.itemSize = 25;
            this.itemsValues = new Array();
            this.isMultipleItemValueChanging = false;
            var self = this;
            this.items.push = function (value) {
                value.setData(self);
                var result = Array.prototype.push.call(this, value);
                self.fireCallback(self.colCountChangedCallback);
                return result;
            };
        }
        QuestionMultipleTextModel.prototype.getType = function () {
            return "multipletext";
        };
        Object.defineProperty(QuestionMultipleTextModel.prototype, "items", {
            get: function () { return this.itemsValues; },
            set: function (value) {
                this.itemsValues = value;
                this.fireCallback(this.colCountChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        QuestionMultipleTextModel.prototype.AddItem = function (name, title) {
            if (title === void 0) { title = null; }
            var item = this.createTextItem(name, title);
            this.items.push(item);
            return item;
        };
        Object.defineProperty(QuestionMultipleTextModel.prototype, "colCount", {
            get: function () { return this.colCountValue; },
            set: function (value) {
                if (value < 1 || value > 4)
                    return;
                this.colCountValue = value;
                this.fireCallback(this.colCountChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        QuestionMultipleTextModel.prototype.getRows = function () {
            var colCount = this.colCount;
            var items = this.items;
            var rows = [];
            var index = 0;
            for (var i = 0; i < items.length; i++) {
                if (index == 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(items[i]);
                index++;
                if (index >= colCount) {
                    index = 0;
                }
            }
            return rows;
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
    Survey.JsonObject.metaData.addClass("multipletext", ["!items:textitems", "itemSize:number", "colCount:number"], function () { return new QuestionMultipleTextModel(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("multipletext", "items", "multipletextitem");
    Survey.JsonObject.metaData.setPropertyValues("multipletext", "itemSize", null, 25);
    Survey.JsonObject.metaData.setPropertyValues("multipletext", "colCount", null, 1);
    Survey.JsonObject.metaData.setPropertyChoices("multipletext", "colCount", [1, 2, 3, 4]);
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
            this.owner = null;
        }
        SurveyTrigger.prototype.setOwner = function (owner) {
            this.owner = owner;
        };
        Object.defineProperty(SurveyTrigger.prototype, "isOnNextPage", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        return SurveyTrigger;
    }(Trigger));
    Survey.SurveyTrigger = SurveyTrigger;
    var SurveyTriggerVisible = (function (_super) {
        __extends(SurveyTriggerVisible, _super);
        function SurveyTriggerVisible() {
            _super.call(this);
            this.pages = [];
            this.questions = [];
        }
        SurveyTriggerVisible.prototype.getType = function () { return "visibletrigger"; };
        SurveyTriggerVisible.prototype.onSuccess = function () { this.onTrigger(this.onItemSuccess); };
        SurveyTriggerVisible.prototype.onFailure = function () { this.onTrigger(this.onItemFailure); };
        SurveyTriggerVisible.prototype.onTrigger = function (func) {
            if (!this.owner)
                return;
            var objects = this.owner.getObjects(this.pages, this.questions);
            for (var i = 0; i < objects.length; i++) {
                func(objects[i]);
            }
        };
        SurveyTriggerVisible.prototype.onItemSuccess = function (item) { item.visible = true; };
        SurveyTriggerVisible.prototype.onItemFailure = function (item) { item.visible = false; };
        return SurveyTriggerVisible;
    }(SurveyTrigger));
    Survey.SurveyTriggerVisible = SurveyTriggerVisible;
    var SurveyTriggerComplete = (function (_super) {
        __extends(SurveyTriggerComplete, _super);
        function SurveyTriggerComplete() {
            _super.call(this);
        }
        SurveyTriggerComplete.prototype.getType = function () { return "completetrigger"; };
        Object.defineProperty(SurveyTriggerComplete.prototype, "isOnNextPage", {
            get: function () { return true; },
            enumerable: true,
            configurable: true
        });
        SurveyTriggerComplete.prototype.onSuccess = function () { if (this.owner)
            this.owner.doComplete(); };
        return SurveyTriggerComplete;
    }(SurveyTrigger));
    Survey.SurveyTriggerComplete = SurveyTriggerComplete;
    var SurveyTriggerSetValue = (function (_super) {
        __extends(SurveyTriggerSetValue, _super);
        function SurveyTriggerSetValue() {
            _super.call(this);
        }
        SurveyTriggerSetValue.prototype.getType = function () { return "setvaluetrigger"; };
        SurveyTriggerSetValue.prototype.onSuccess = function () {
            if (!this.setToName || !this.owner)
                return;
            this.owner.setTriggerValue(this.setToName, this.setValue, this.isVariable);
        };
        return SurveyTriggerSetValue;
    }(SurveyTrigger));
    Survey.SurveyTriggerSetValue = SurveyTriggerSetValue;
    Survey.JsonObject.metaData.addClass("trigger", ["operator", "!value"]);
    Survey.JsonObject.metaData.addClass("surveytrigger", ["!name"], null, "trigger");
    Survey.JsonObject.metaData.addClass("visibletrigger", ["pages", "questions"], function () { return new SurveyTriggerVisible(); }, "surveytrigger");
    Survey.JsonObject.metaData.addClass("completetrigger", [], function () { return new SurveyTriggerComplete(); }, "surveytrigger");
    Survey.JsonObject.metaData.addClass("setvaluetrigger", ["!setToName", "setValue", "isVariable:boolean"], function () { return new SurveyTriggerSetValue(); }, "surveytrigger");
})(Survey || (Survey = {}));

var Survey;
(function (Survey) {
    var TextPreProcessorItem = (function () {
        function TextPreProcessorItem() {
        }
        return TextPreProcessorItem;
    }());
    var TextPreProcessor = (function () {
        function TextPreProcessor() {
        }
        TextPreProcessor.prototype.process = function (text) {
            if (!text)
                return text;
            if (!this.onProcess)
                return text;
            var items = this.getItems(text);
            for (var i = items.length - 1; i >= 0; i--) {
                var item = items[i];
                var name = this.getName(text.substring(item.start + 1, item.end));
                if (!this.canProcessName(name))
                    continue;
                if (this.onHasValue && !this.onHasValue(name))
                    continue;
                var value = this.onProcess(name);
                if (value == null)
                    value = "";
                text = text.substr(0, item.start) + value + text.substr(item.end + 1);
            }
            return text;
        };
        TextPreProcessor.prototype.getItems = function (text) {
            var items = [];
            var length = text.length;
            var start = -1;
            var ch = '';
            for (var i = 0; i < length; i++) {
                ch = text[i];
                if (ch == '{')
                    start = i;
                if (ch == '}') {
                    if (start > -1) {
                        var item = new TextPreProcessorItem();
                        item.start = start;
                        item.end = i;
                        items.push(item);
                    }
                    start = -1;
                }
            }
            return items;
        };
        TextPreProcessor.prototype.getName = function (name) {
            if (!name)
                return;
            return name.trim();
        };
        TextPreProcessor.prototype.canProcessName = function (name) {
            if (!name)
                return false;
            for (var i = 0; i < name.length; i++) {
                var ch = name[i];
                //TODO
                if (ch == ' ' || ch == '-' || ch == '&')
                    return false;
            }
            return true;
        };
        return TextPreProcessor;
    }());
    Survey.TextPreProcessor = TextPreProcessor;
})(Survey || (Survey = {}));

/// <reference path="base.ts" />
/// <reference path="page.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dxSurveyService.ts" />
/// <reference path="textPreProcessor.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Survey;
(function (Survey) {
    var SurveyModel = (function (_super) {
        __extends(SurveyModel, _super);
        function SurveyModel(jsonObj) {
            if (jsonObj === void 0) { jsonObj = null; }
            _super.call(this);
            this.surveyId = null;
            this.surveyPostId = null;
            this.clientId = null;
            this.cookieName = null;
            this.sendResultOnPageNext = false;
            this.commentPrefix = "-Comment";
            this.title = "";
            this.showNavigationButtons = true;
            this.showTitle = true;
            this.showPageTitles = true;
            this.completedHtml = "";
            this.requiredText = "* ";
            this.showProgressBar = "off";
            this.pages = new Array();
            this.triggers = new Array();
            this.currentPageValue = null;
            this.valuesHash = {};
            this.variablesHash = {};
            this.showPageNumbersValue = false;
            this.showQuestionNumbersValue = "on";
            this.localeValue = "";
            this.isCompleted = false;
            this.isLoading = false;
            this.processedTextValues = {};
            this.onComplete = new Survey.Event();
            this.onCurrentPageChanged = new Survey.Event();
            this.onValueChanged = new Survey.Event();
            this.onVisibleChanged = new Survey.Event();
            this.onPageVisibleChanged = new Survey.Event();
            this.onQuestionAdded = new Survey.Event();
            this.onQuestionRemoved = new Survey.Event();
            this.onValidateQuestion = new Survey.Event();
            this.onProcessHtml = new Survey.Event();
            this.onSendResult = new Survey.Event();
            this.onGetResult = new Survey.Event();
            this.jsonErrors = null;
            this.mode = "normal";
            var self = this;
            this.textPreProcessor = new Survey.TextPreProcessor();
            this.textPreProcessor.onHasValue = function (name) { return self.processedTextValues[name.toLowerCase()]; };
            this.textPreProcessor.onProcess = function (name) { return self.getProcessedTextValue(name); };
            this.pages.push = function (value) {
                value.data = self;
                return Array.prototype.push.call(this, value);
            };
            this.triggers.push = function (value) {
                value.setOwner(self);
                return Array.prototype.push.call(this, value);
            };
            this.updateProcessedTextValues();
            this.onBeforeCreating();
            if (jsonObj) {
                this.setJsonObject(jsonObj);
                if (this.surveyId) {
                    this.loadSurveyFromService(this.surveyId);
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
        SurveyModel.prototype.getLocString = function (str) { return Survey.surveyLocalization.getString(str); };
        Object.defineProperty(SurveyModel.prototype, "emptySurveyText", {
            get: function () { return this.getLocString("emptySurvey"); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "pagePrevText", {
            get: function () { return (this.pagePrevTextValue) ? this.pagePrevTextValue : this.getLocString("pagePrevText"); },
            set: function (newValue) { this.pagePrevTextValue = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "pageNextText", {
            get: function () { return (this.pageNextTextValue) ? this.pageNextTextValue : this.getLocString("pageNextText"); },
            set: function (newValue) { this.pageNextTextValue = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "completeText", {
            get: function () { return (this.completeTextValue) ? this.completeTextValue : this.getLocString("completeText"); },
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
                        this.checkTriggers(key, data[key], false);
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
        Object.defineProperty(SurveyModel.prototype, "state", {
            get: function () {
                if (this.isLoading)
                    return "loading";
                if (this.isCompleted)
                    return "completed";
                return (this.currentPage) ? "running" : "empty";
            },
            enumerable: true,
            configurable: true
        });
        SurveyModel.prototype.clear = function () {
            this.data = null;
            this.variablesHash = {};
            this.isCompleted = false;
            if (this.visiblePageCount > 0) {
                this.currentPage = this.visiblePages[0];
            }
        };
        SurveyModel.prototype.mergeValues = function (src, dest) {
            if (!dest || !src)
                return;
            for (var key in src) {
                var value = src[key];
                if (value && typeof value === 'object') {
                    if (!dest[key])
                        dest[key] = {};
                    this.mergeValues(value, dest[key]);
                }
                else {
                    dest[key] = value;
                }
            }
        };
        SurveyModel.prototype.currentPageChanged = function (newValue, oldValue) {
            this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': newValue });
        };
        SurveyModel.prototype.getProgress = function () {
            if (this.currentPage == null)
                return 0;
            var index = this.visiblePages.indexOf(this.currentPage) + 1;
            return Math.ceil((index * 100 / this.visiblePageCount));
        };
        Object.defineProperty(SurveyModel.prototype, "isDesignMode", {
            get: function () { return this.mode == "designer"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "hasCookie", {
            get: function () {
                if (!this.cookieName)
                    return false;
                var cookies = document.cookie;
                return cookies && cookies.indexOf(this.cookieName + "=true") > -1;
            },
            enumerable: true,
            configurable: true
        });
        SurveyModel.prototype.setCookie = function () {
            if (!this.cookieName)
                return;
            document.cookie = this.cookieName + "=true; expires=Fri, 31 Dec 9999 0:0:0 GMT";
        };
        SurveyModel.prototype.deleteCookie = function () {
            if (!this.cookieName)
                return;
            document.cookie = this.cookieName + "=;";
        };
        SurveyModel.prototype.nextPage = function () {
            if (this.isLastPage)
                return false;
            if (this.isCurrentPageHasErrors)
                return false;
            this.checkOnPageTriggers();
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
            this.doComplete();
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
        SurveyModel.prototype.doComplete = function () {
            this.setCookie();
            this.setCompleted();
            this.onComplete.fire(this, null);
            if (this.surveyPostId) {
                this.sendResult();
            }
        };
        SurveyModel.prototype.setCompleted = function () {
            this.isCompleted = true;
        };
        Object.defineProperty(SurveyModel.prototype, "processedCompletedHtml", {
            get: function () {
                if (this.completedHtml) {
                    return this.processHtml(this.completedHtml);
                }
                return "<h3>" + this.getLocString("completingSurvey") + "</h3>";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "processedLoadingHtml", {
            get: function () {
                return "<h3>" + this.getLocString("loadingSurvey") + "</h3>";
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
                return this.getLocString("progressText")["format"](index, vPages.length);
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
        SurveyModel.prototype.getQuestionByName = function (name, caseInsensitive) {
            if (caseInsensitive === void 0) { caseInsensitive = false; }
            var questions = this.getAllQuestions();
            if (caseInsensitive)
                name = name.toLowerCase();
            for (var i = 0; i < questions.length; i++) {
                var questionName = questions[i].name;
                if (caseInsensitive)
                    questionName = questionName.toLowerCase();
                if (questionName == name)
                    return questions[i];
            }
            return null;
        };
        SurveyModel.prototype.getQuestionsByNames = function (names, caseInsensitive) {
            if (caseInsensitive === void 0) { caseInsensitive = false; }
            var result = [];
            if (!names)
                return result;
            for (var i = 0; i < names.length; i++) {
                if (!names[i])
                    continue;
                var question = this.getQuestionByName(names[i], caseInsensitive);
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
            var question = null;
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].name != name)
                    continue;
                question = questions[i];
                this.doSurveyValueChanged(question, newValue);
            }
            this.onValueChanged.fire(this, { 'name': name, 'question': question, 'value': newValue });
        };
        SurveyModel.prototype.notifyAllQuestionsOnValueChanged = function () {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                this.doSurveyValueChanged(questions[i], this.getValue(questions[i].name));
            }
        };
        SurveyModel.prototype.doSurveyValueChanged = function (question, newValue) {
            question.onSurveyValueChanged(newValue);
        };
        SurveyModel.prototype.checkOnPageTriggers = function () {
            var page = this.currentPage;
            for (var i = 0; i < page.questions.length; i++) {
                var question = page.questions[i];
                if (!question.visible || !question.name)
                    continue;
                var value = this.getValue(question.name);
                this.checkTriggers(question.name, value, true);
            }
        };
        SurveyModel.prototype.checkTriggers = function (name, newValue, isOnNextPage) {
            for (var i = 0; i < this.triggers.length; i++) {
                var trigger = this.triggers[i];
                if (trigger.name == name && trigger.isOnNextPage == isOnNextPage) {
                    trigger.check(newValue);
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
        SurveyModel.prototype.loadSurveyFromService = function (surveyId) {
            if (surveyId === void 0) { surveyId = null; }
            if (surveyId) {
                this.surveyId = surveyId;
            }
            var self = this;
            this.isLoading = true;
            this.onLoadingSurveyFromService();
            new Survey.dxSurveyService().loadSurvey(this.surveyId, function (success, result, response) {
                self.isLoading = false;
                if (success && result) {
                    self.setJsonObject(result);
                    self.notifyAllQuestionsOnValueChanged();
                    self.onLoadSurveyFromService();
                }
            });
        };
        SurveyModel.prototype.onLoadingSurveyFromService = function () {
        };
        SurveyModel.prototype.onLoadSurveyFromService = function () {
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
            this.updateProcessedTextValues();
            if (this.hasCookie) {
                this.doComplete();
            }
            this.updateVisibleIndexes();
        };
        SurveyModel.prototype.onBeforeCreating = function () { };
        SurveyModel.prototype.onCreating = function () { };
        SurveyModel.prototype.updateProcessedTextValues = function () {
            this.processedTextValues = {};
            var self = this;
            this.processedTextValues["pageno"] = function (name) { return self.currentPage != null ? self.visiblePages.indexOf(self.currentPage) + 1 : 0; };
            this.processedTextValues["pagecount"] = function (name) { return self.visiblePageCount; };
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                this.addQuestionToProcessedTextValues(questions[i]);
            }
        };
        SurveyModel.prototype.addQuestionToProcessedTextValues = function (question) {
            this.processedTextValues[question.name.toLowerCase()] = "question";
        };
        SurveyModel.prototype.getProcessedTextValue = function (name) {
            var name = name.toLowerCase();
            var val = this.processedTextValues[name];
            if (!val)
                return null;
            if (val == "question") {
                var question = this.getQuestionByName(name, true);
                return question != null ? this.getValue(question.name) : null;
            }
            if (val == "value") {
                return this.getValue(name);
            }
            if (val == "variable") {
                return this.getVariable(name);
            }
            return val(name);
        };
        SurveyModel.prototype.getVariable = function (name) {
            if (!name)
                return null;
            return this.variablesHash[name];
        };
        SurveyModel.prototype.setVariable = function (name, newValue) {
            if (!name)
                return;
            this.variablesHash[name] = newValue;
            this.processedTextValues[name.toLowerCase()] = "variable";
        };
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
                this.processedTextValues[name.toLowerCase()] = "value";
            }
            this.notifyQuestionOnValueChanged(name, newValue);
            this.checkTriggers(name, newValue, false);
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
            this.addQuestionToProcessedTextValues(question);
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
        SurveyModel.prototype.processHtml = function (html) {
            var options = { html: html };
            this.onProcessHtml.fire(this, options);
            return this.processText(options.html);
        };
        SurveyModel.prototype.processText = function (text) {
            return this.textPreProcessor.process(text);
        };
        //ISurveyTriggerOwner
        SurveyModel.prototype.getObjects = function (pages, questions) {
            var result = [];
            Array.prototype.push.apply(result, this.getPagesByNames(pages));
            Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
            return result;
        };
        SurveyModel.prototype.setTriggerValue = function (name, value, isVariable) {
            if (!name)
                return;
            if (isVariable) {
                this.setVariable(name, value);
            }
            else {
                this.setValue(name, value);
            }
        };
        return SurveyModel;
    }(Survey.Base));
    Survey.SurveyModel = SurveyModel;
    Survey.JsonObject.metaData.addClass("survey", ["locale", "title", "completedHtml:html", "pages", "questions", "triggers:triggers", "surveyId", "surveyPostId", "cookieName", "sendResultOnPageNext:boolean",
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
    var finnishSurveyStrings = {
        pagePrevText: "Edellinen",
        pageNextText: "Seuraava",
        completeText: "Valmis",
        otherItemText: "Muu (kuvaile)",
        progressText: "Sivu {0}/{1}",
        emptySurvey: "Tässä kyselyssä ei ole yhtäkään näkyvillä olevaa sivua tai kysymystä.",
        completingSurvey: "Kiitos kyselyyn vastaamisesta!",
        loadingSurvey: "Kyselyä ladataan palvelimelta...",
        optionsCaption: "Valitse...",
        requiredError: "Vastaa kysymykseen, kiitos.",
        numericError: "Arvon tulee olla numeerinen.",
        textMinLength: "Ole hyvä ja syötä vähintään {0} merkkiä.",
        minSelectError: "Ole hyvä ja valitse vähintään {0} vaihtoehtoa.",
        maxSelectError: "Ole hyvä ja valitse enintään {0} vaihtoehtoa.",
        numericMinMax: "'{0}' täytyy olla enemmän tai yhtä suuri kuin {1} ja vähemmän tai yhtä suuri kuin {2}",
        numericMin: "'{0}' täytyy olla enemmän tai yhtä suuri kuin {1}",
        numericMax: "'{0}' täytyy olla vähemmän tai yhtä suuri kuin {1}",
        invalidEmail: "Syötä validi sähköpostiosoite.",
        otherRequiredError: "Ole hyvä ja syötä \"Muu (kuvaile)\""
    };
    Survey.surveyLocalization.locales["fi"] = finnishSurveyStrings;
})(Survey || (Survey = {}));

/// <reference path="..//surveyStrings.ts" />
var Survey;
(function (Survey) {
    var germanSurveyStrings = {
        pagePrevText: "Zurück",
        pageNextText: "Weiter",
        completeText: "Fertig",
        progressText: "Seite {0} von {1}",
        emptySurvey: "Es gibt keine sichtbare Frage.",
        completingSurvey: "Vielen Dank für das Ausfüllen des Fragebogens!",
        loadingSurvey: "Der Fragebogen wird vom Server geladen...",
        otherItemText: "Andere (beschreiben)",
        optionsCaption: "Wählen...",
        requiredError: "Bitte antworten Sie auf die Frage.",
        numericError: "Der Wert sollte eine Zahl sein.",
        textMinLength: "Bitte geben Sie mindestens {0} Symbole.",
        minSelectError: "Bitte wählen Sie mindestens {0} Varianten.",
        maxSelectError: "Bitte wählen Sie nicth mehr als {0} Varianten.",
        numericMinMax: "'{0}' solte gleich oder größer sein als {1} und gleich oder kleiner als {2}",
        numericMin: "'{0}' solte gleich oder größer sein als {1}",
        numericMax: "'{0}' solte gleich oder kleiner als {1}",
        invalidEmail: "Bitte geben Sie eine gültige Email-Adresse ein."
    };
    Survey.surveyLocalization.locales["de"] = germanSurveyStrings;
})(Survey || (Survey = {}));

/// <reference path="..//surveyStrings.ts" />
var Survey;
(function (Survey) {
    var russianSurveyStrings = {
        pagePrevText: "Назад",
        pageNextText: "Далее",
        completeText: "Готово",
        progressText: "Страница {0} из {1}",
        emptySurvey: "Нет ни одного вопроса.",
        completingSurvey: "Благодарим Вас за заполнение анкеты!",
        loadingSurvey: "Загрузка с сервера...",
        otherItemText: "Другое (пожалуйста, опишите)",
        optionsCaption: "Выбрать...",
        requiredError: "Пожалуйста, ответьте на вопрос.",
        numericError: "Ответ должен быть числом.",
        textMinLength: "Пожалуйста, введите хотя бы {0} символов.",
        minSelectError: "Пожалуйста, выберите хотя бы {0} вариантов.",
        maxSelectError: "Пожалуйста, выберите не более {0} вариантов.",
        numericMinMax: "'{0}' должно быть равным или больше, чем {1}, и равным или меньше, чем {2}",
        numericMin: "'{0}' должно быть равным или больше, чем {1}",
        numericMax: "'{0}' должно быть равным или меньше, чем {1}",
        invalidEmail: "Пожалуйста, введите действительный адрес электронной почты.",
        otherRequiredError: "Пожалуйста, введите данные в поле \"Другое\""
    };
    Survey.surveyLocalization.locales["ru"] = russianSurveyStrings;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../question_comment.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestioncomment = (function (_super) {
    __extends(ReactSurveyQuestioncomment, _super);
    function ReactSurveyQuestioncomment(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.state = { value: this.question.value };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestioncomment.prototype.handleOnChange = function (event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    };
    ReactSurveyQuestioncomment.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
    };
    ReactSurveyQuestioncomment.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("textarea", {className: this.css, type: "text", value: this.state.value, onChange: this.handleOnChange, cols: this.question.cols, rows: this.question.rows}));
    };
    return ReactSurveyQuestioncomment;
}(React.Component));
var ReactSurveyQuestionCommentItem = (function (_super) {
    __extends(ReactSurveyQuestionCommentItem, _super);
    function ReactSurveyQuestionCommentItem(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.state = { value: this.question.comment };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestionCommentItem.prototype.handleOnChange = function (event) {
        this.question.comment = event.target.value;
        this.setState({ value: this.question.comment });
    };
    ReactSurveyQuestionCommentItem.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
    };
    ReactSurveyQuestionCommentItem.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("input", {type: "text", className: this.css.question.comment, value: this.state.value, onChange: this.handleOnChange}));
    };
    return ReactSurveyQuestionCommentItem;
}(React.Component));

/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../surveyStrings.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="reactQuestioncomment.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurveyQuestion = (function (_super) {
    __extends(ReactSurveyQuestion, _super);
    function ReactSurveyQuestion(props) {
        _super.call(this, props);
        this.setQuestion(props.question);
        this.creator = props.creator;
        this.css = props.css;
    }
    ReactSurveyQuestion.prototype.componentWillReceiveProps = function (nextProps) {
        this.creator = nextProps.creator;
        this.css = nextProps.css;
        this.setQuestion(nextProps.question);
    };
    ReactSurveyQuestion.prototype.setQuestion = function (question) {
        this.questionBase = question;
        this.question = question instanceof Survey.Question ? question : null;
        if (this.question) {
            var self = this;
            this.question.errorsChangedCallback = function () {
                self.state.error = self.state.error + 1;
                self.setState(self.state);
            };
        }
        var value = this.question ? this.question.value : null;
        this.state = { visible: this.questionBase.visible, value: value, error: 0 };
    };
    ReactSurveyQuestion.prototype.render = function () {
        if (!this.questionBase || !this.creator)
            return null;
        this.questionBase["react"] = this; //TODO
        if (!this.questionBase.visible)
            return null;
        var className = "ReactSurveyQuestion" + this.questionBase.getType();
        var questionRender = this.creator.createQuestionElement(this.questionBase);
        var title = this.questionBase.hasTitle ? this.renderTitle() : null;
        var comment = (this.question && this.question.hasComment) ? this.renderComment() : null;
        var errors = (this.question && this.question.errors.length > 0) ? this.renderErrors() : null;
        return (React.createElement("div", {className: this.css.question.root}, title, errors, questionRender, comment));
    };
    ReactSurveyQuestion.prototype.renderTitle = function () {
        var titleText = "";
        if (this.question.visibleIndex > -1) {
            titleText = (this.question.visibleIndex + 1).toString() + ". ";
        }
        if (this.question.isRequired) {
            titleText += this.question.requiredText;
        }
        titleText += this.question.processedTitle;
        return (React.createElement("h5", {className: this.css.question.title}, titleText));
    };
    ReactSurveyQuestion.prototype.renderComment = function () {
        var otherText = Survey.surveyLocalization.getString("otherItemText");
        return (React.createElement("div", null, React.createElement("div", null, otherText), React.createElement("div", {className: this.css.question.comment}, React.createElement(ReactSurveyQuestionCommentItem, {question: this.question}))));
    };
    ReactSurveyQuestion.prototype.renderErrors = function () {
        var errors = [];
        for (var i = 0; i < this.question.errors.length; i++) {
            var errorText = this.question.errors[i].getText();
            var key = "error" + i;
            errors.push(this.creator.renderError(key, errorText));
        }
        return (React.createElement("div", {className: this.css.error.root}, errors));
    };
    return ReactSurveyQuestion;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="reactquestion.tsx" />
var ReactSurveyPage = (function (_super) {
    __extends(ReactSurveyPage, _super);
    function ReactSurveyPage(props) {
        _super.call(this, props);
        this.page = props.page;
        this.survey = props.survey;
        this.creator = props.creator;
        this.css = props.css;
    }
    ReactSurveyPage.prototype.componentWillReceiveProps = function (nextProps) {
        this.page = nextProps.page;
        this.survey = nextProps.survey;
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    };
    ReactSurveyPage.prototype.render = function () {
        if (this.page == null || this.survey == null || this.creator == null)
            return;
        var title = this.renderTitle();
        var questions = [];
        for (var i = 0; i < this.page.questions.length; i++) {
            var question = this.page.questions[i];
            questions.push(this.createQuestion(question));
        }
        return (React.createElement("div", null, title, questions));
    };
    ReactSurveyPage.prototype.createQuestion = function (question) {
        return React.createElement(ReactSurveyQuestion, {key: question.name, question: question, creator: this.creator, css: this.css});
    };
    ReactSurveyPage.prototype.renderTitle = function () {
        if (!this.page.title || !this.survey.showPageTitles)
            return null;
        var text = this.page.processedTitle;
        if (this.page.num > 0) {
            text = this.page.num + ". " + text;
        }
        return (React.createElement("h4", {className: this.css.pageTitle}, text));
    };
    return ReactSurveyPage;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question_checkbox.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestioncheckbox = (function (_super) {
    __extends(ReactSurveyQuestioncheckbox, _super);
    function ReactSurveyQuestioncheckbox(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
    }
    ReactSurveyQuestioncheckbox.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
    };
    ReactSurveyQuestioncheckbox.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("form", {className: this.css.root}, this.getItems()));
    };
    ReactSurveyQuestioncheckbox.prototype.getItems = function () {
        var items = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            items.push(this.renderItem(key, item));
        }
        return items;
    };
    Object.defineProperty(ReactSurveyQuestioncheckbox.prototype, "textStyle", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    ReactSurveyQuestioncheckbox.prototype.renderItem = function (key, item) {
        return React.createElement(ReactSurveyQuestioncheckboxItem, {key: key, question: this.question, css: this.css, rootCss: this.rootCss, item: item, textStyle: this.textStyle});
    };
    return ReactSurveyQuestioncheckbox;
}(React.Component));
var ReactSurveyQuestioncheckboxItem = (function (_super) {
    __extends(ReactSurveyQuestioncheckboxItem, _super);
    function ReactSurveyQuestioncheckboxItem(props) {
        _super.call(this, props);
        this.item = props.item;
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.textStyle = props.textStyle;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestioncheckboxItem.prototype.componentWillReceiveProps = function (nextProps) {
        this.item = nextProps.item;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.textStyle = nextProps.textStyle;
        this.question = nextProps.question;
    };
    ReactSurveyQuestioncheckboxItem.prototype.handleOnChange = function (event) {
        var newValue = this.question.value;
        if (!newValue) {
            newValue = [];
        }
        var index = newValue.indexOf(this.item.value);
        if (event.target.checked) {
            if (index < 0) {
                newValue.push(this.item.value);
            }
        }
        else {
            if (index > -1) {
                newValue.splice(index, 1);
            }
        }
        this.question.value = newValue;
        this.setState({ value: this.question.value });
    };
    ReactSurveyQuestioncheckboxItem.prototype.render = function () {
        if (!this.item || !this.question)
            return null;
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { marginRight: marginRight };
        if (itemWidth) {
            divStyle["width"] = itemWidth;
        }
        var isChecked = this.question.value && this.question.value.indexOf(this.item.value) > -1;
        var otherItem = (this.item.value === this.question.otherItem.value && isChecked) ? this.renderOther() : null;
        return this.renderCheckbox(isChecked, divStyle, otherItem);
    };
    Object.defineProperty(ReactSurveyQuestioncheckboxItem.prototype, "inputStyle", {
        get: function () { return { marginRight: "3px" }; },
        enumerable: true,
        configurable: true
    });
    ReactSurveyQuestioncheckboxItem.prototype.renderCheckbox = function (isChecked, divStyle, otherItem) {
        return (React.createElement("div", {className: this.css.item, style: divStyle}, React.createElement("label", {className: this.css.item}, React.createElement("input", {type: "checkbox", style: this.inputStyle, checked: isChecked, onChange: this.handleOnChange}), React.createElement("span", null, this.item.text)), otherItem));
    };
    ReactSurveyQuestioncheckboxItem.prototype.renderOther = function () {
        return (React.createElement("div", {className: this.css.other}, React.createElement(ReactSurveyQuestionCommentItem, {question: this.question, css: this.rootCss})));
    };
    return ReactSurveyQuestioncheckboxItem;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question_dropdown.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestiondropdown = (function (_super) {
    __extends(ReactSurveyQuestiondropdown, _super);
    function ReactSurveyQuestiondropdown(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.state = { value: this.question.value };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestiondropdown.prototype.handleOnChange = function (event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    };
    ReactSurveyQuestiondropdown.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
    };
    ReactSurveyQuestiondropdown.prototype.render = function () {
        if (!this.question)
            return null;
        var options = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            var option = React.createElement("option", {key: key, value: item.value}, item.text);
            options.push(option);
        }
        var comment = this.question.value === this.question.otherItem.value ? this.renderOther() : null;
        return (React.createElement("div", null, React.createElement("select", {className: this.css, value: this.state.value, onChange: this.handleOnChange}, React.createElement("option", {value: ""}, this.question.optionsCaption), options), comment));
    };
    ReactSurveyQuestiondropdown.prototype.renderOther = function () {
        var style = { marginTop: "3px" };
        return React.createElement("div", {style: style}, React.createElement(ReactSurveyQuestionCommentItem, {question: this.question, css: this.rootCss}));
    };
    return ReactSurveyQuestiondropdown;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../question_html.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestionhtml = (function (_super) {
    __extends(ReactSurveyQuestionhtml, _super);
    function ReactSurveyQuestionhtml(props) {
        _super.call(this, props);
        this.question = props.question;
    }
    ReactSurveyQuestionhtml.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
    };
    ReactSurveyQuestionhtml.prototype.render = function () {
        if (!this.question || !this.question.html)
            return null;
        var htmlValue = { __html: this.question.processedHtml };
        return (React.createElement("div", {dangerouslySetInnerHTML: htmlValue}));
    };
    return ReactSurveyQuestionhtml;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question_matrix.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestionmatrix = (function (_super) {
    __extends(ReactSurveyQuestionmatrix, _super);
    function ReactSurveyQuestionmatrix(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
    }
    ReactSurveyQuestionmatrix.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
    };
    ReactSurveyQuestionmatrix.prototype.render = function () {
        if (!this.question)
            return null;
        var firstTH = this.question.hasRows ? React.createElement("th", null) : null;
        var headers = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "column" + i;
            headers.push(React.createElement("th", {key: key}, column.text));
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row" + i;
            rows.push(React.createElement(ReactSurveyQuestionmatrixRow, {key: key, question: this.question, row: row}));
        }
        return (React.createElement("table", {className: this.css.root}, React.createElement("thead", null, React.createElement("tr", null, firstTH, headers)), React.createElement("tbody", null, rows)));
    };
    return ReactSurveyQuestionmatrix;
}(React.Component));
var ReactSurveyQuestionmatrixRow = (function (_super) {
    __extends(ReactSurveyQuestionmatrixRow, _super);
    function ReactSurveyQuestionmatrixRow(props) {
        _super.call(this, props);
        this.question = props.question;
        this.row = props.row;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestionmatrixRow.prototype.handleOnChange = function (event) {
        this.row.value = event.target.value;
        this.setState({ value: this.row.value });
    };
    ReactSurveyQuestionmatrixRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.row = nextProps.row;
    };
    ReactSurveyQuestionmatrixRow.prototype.render = function () {
        if (!this.row)
            return null;
        var firstTD = this.question.hasRows ? React.createElement("td", null, this.row.text) : null;
        var tds = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "value" + i;
            var isChecked = this.row.value == column.value;
            var td = React.createElement("td", {key: key}, React.createElement("input", {type: "radio", name: this.row.fullName, value: column.value, checked: isChecked, onChange: this.handleOnChange}));
            tds.push(td);
        }
        return (React.createElement("tr", null, firstTD, tds));
    };
    return ReactSurveyQuestionmatrixRow;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question_matrixdropdown.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestionmatrixdropdown = (function (_super) {
    __extends(ReactSurveyQuestionmatrixdropdown, _super);
    function ReactSurveyQuestionmatrixdropdown(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
    }
    ReactSurveyQuestionmatrixdropdown.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
    };
    ReactSurveyQuestionmatrixdropdown.prototype.render = function () {
        if (!this.question)
            return null;
        var headers = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "column" + i;
            headers.push(React.createElement("th", {key: key}, column.title));
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row" + i;
            rows.push(React.createElement(ReactSurveyQuestionmatrixdropdownRow, {key: key, row: row}));
        }
        return (React.createElement("table", {className: this.css.root}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null), headers)), React.createElement("tbody", null, rows)));
    };
    return ReactSurveyQuestionmatrixdropdown;
}(React.Component));
var ReactSurveyQuestionmatrixdropdownRow = (function (_super) {
    __extends(ReactSurveyQuestionmatrixdropdownRow, _super);
    function ReactSurveyQuestionmatrixdropdownRow(props) {
        _super.call(this, props);
        this.row = props.row;
    }
    ReactSurveyQuestionmatrixdropdownRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.row = nextProps.row;
    };
    ReactSurveyQuestionmatrixdropdownRow.prototype.render = function () {
        if (!this.row)
            return null;
        var tds = [];
        for (var i = 0; i < this.row.cells.length; i++) {
            var select = this.renderSelect(this.row.cells[i]);
            tds.push(React.createElement("td", {key: "row" + i}, select));
        }
        return (React.createElement("tr", null, React.createElement("td", null, this.row.text), tds));
    };
    ReactSurveyQuestionmatrixdropdownRow.prototype.renderSelect = function (cell) {
        return React.createElement(ReactSurveyQuestionmatrixdropdownCell, {cell: cell});
    };
    return ReactSurveyQuestionmatrixdropdownRow;
}(React.Component));
var ReactSurveyQuestionmatrixdropdownCell = (function (_super) {
    __extends(ReactSurveyQuestionmatrixdropdownCell, _super);
    function ReactSurveyQuestionmatrixdropdownCell(props) {
        _super.call(this, props);
        this.cell = props.cell;
        this.state = { value: this.cell.value };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestionmatrixdropdownCell.prototype.handleOnChange = function (event) {
        this.cell.value = event.target.value;
        this.setState({ value: this.cell.value });
    };
    ReactSurveyQuestionmatrixdropdownCell.prototype.componentWillReceiveProps = function (nextProps) {
        this.cell = nextProps.cell;
        this.state = { value: this.cell.value };
    };
    ReactSurveyQuestionmatrixdropdownCell.prototype.render = function () {
        if (!this.cell)
            return null;
        var options = this.getOptions();
        return (React.createElement("select", {value: this.state.value, onChange: this.handleOnChange}, React.createElement("option", {value: ""}, this.cell.optionsCaption), options));
    };
    ReactSurveyQuestionmatrixdropdownCell.prototype.getOptions = function () {
        var options = [];
        for (var i = 0; i < this.cell.choices.length; i++) {
            var item = this.cell.choices[i];
            var key = "op" + i;
            var option = React.createElement("option", {key: key, value: item.value}, item.text);
            options.push(option);
        }
        return options;
    };
    return ReactSurveyQuestionmatrixdropdownCell;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question_multipletext.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestionmultipletext = (function (_super) {
    __extends(ReactSurveyQuestionmultipletext, _super);
    function ReactSurveyQuestionmultipletext(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
    }
    ReactSurveyQuestionmultipletext.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
    };
    ReactSurveyQuestionmultipletext.prototype.render = function () {
        if (!this.question)
            return null;
        var tableRows = this.question.getRows();
        var rows = [];
        for (var i = 0; i < tableRows.length; i++) {
            rows.push(this.renderRow("item" + i, tableRows[i]));
        }
        return (React.createElement("table", {className: this.css.root}, React.createElement("tbody", null, rows)));
    };
    ReactSurveyQuestionmultipletext.prototype.renderRow = function (key, items) {
        var tds = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            tds.push(React.createElement("td", {key: "label" + i}, React.createElement("span", {className: this.css.itemTitle}, item.title)));
            tds.push(React.createElement("td", {key: "value" + i}, this.renderItem(item)));
        }
        return React.createElement("tr", {key: key}, tds);
    };
    ReactSurveyQuestionmultipletext.prototype.renderItem = function (item) {
        return React.createElement(ReactSurveyQuestionmultipletextItem, {item: item, css: this.css});
    };
    return ReactSurveyQuestionmultipletext;
}(React.Component));
var ReactSurveyQuestionmultipletextItem = (function (_super) {
    __extends(ReactSurveyQuestionmultipletextItem, _super);
    function ReactSurveyQuestionmultipletextItem(props) {
        _super.call(this, props);
        this.item = props.item;
        this.css = props.css;
        this.state = { value: this.item.value };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestionmultipletextItem.prototype.handleOnChange = function (event) {
        this.item.value = event.target.value;
        this.setState({ value: this.item.value });
    };
    ReactSurveyQuestionmultipletextItem.prototype.componentWillReceiveProps = function (nextProps) {
        this.item = nextProps.item;
        this.css = nextProps.css;
    };
    ReactSurveyQuestionmultipletextItem.prototype.render = function () {
        if (!this.item)
            return null;
        var style = { float: "left" };
        return (React.createElement("input", {className: this.css.itemValue, style: style, type: "text", value: this.state.value, onChange: this.handleOnChange}));
    };
    Object.defineProperty(ReactSurveyQuestionmultipletextItem.prototype, "mainClassName", {
        get: function () { return ""; },
        enumerable: true,
        configurable: true
    });
    return ReactSurveyQuestionmultipletextItem;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question_radiogroup.ts" />
// <reference path="../question_baseselect.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestionradiogroup = (function (_super) {
    __extends(ReactSurveyQuestionradiogroup, _super);
    function ReactSurveyQuestionradiogroup(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestionradiogroup.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.handleOnChange = this.handleOnChange.bind(this);
    };
    ReactSurveyQuestionradiogroup.prototype.handleOnChange = function (event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    };
    ReactSurveyQuestionradiogroup.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("form", {className: this.css.root}, this.getItems()));
    };
    ReactSurveyQuestionradiogroup.prototype.getItems = function () {
        var items = [];
        for (var i = 0; i < this.question.visibleChoices.length; i++) {
            var item = this.question.visibleChoices[i];
            var key = "item" + i;
            items.push(this.renderItem(key, item));
        }
        return items;
    };
    Object.defineProperty(ReactSurveyQuestionradiogroup.prototype, "textStyle", {
        get: function () { return { marginLeft: "3px" }; },
        enumerable: true,
        configurable: true
    });
    ReactSurveyQuestionradiogroup.prototype.renderItem = function (key, item) {
        var itemWidth = this.question.colCount > 0 ? (100 / this.question.colCount) + "%" : "";
        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
        var divStyle = { marginRight: marginRight };
        if (itemWidth) {
            divStyle["width"] = itemWidth;
        }
        var isChecked = this.question.value == item.value;
        var otherItem = (isChecked && item.value === this.question.otherItem.value) ? this.renderOther() : null;
        return this.renderRadio(key, item, isChecked, divStyle, otherItem);
    };
    ReactSurveyQuestionradiogroup.prototype.renderRadio = function (key, item, isChecked, divStyle, otherItem) {
        return (React.createElement("div", {key: key, className: this.css.item, style: divStyle}, React.createElement("label", {className: this.css.item}, React.createElement("input", {type: "radio", checked: isChecked, value: item.value, onChange: this.handleOnChange}), React.createElement("span", {style: this.textStyle}, item.text)), otherItem));
    };
    ReactSurveyQuestionradiogroup.prototype.renderOther = function () {
        return (React.createElement("div", {className: this.css.other}, React.createElement(ReactSurveyQuestionCommentItem, {question: this.question, css: this.rootCss})));
    };
    return ReactSurveyQuestionradiogroup;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
/// <reference path="../question_text.ts" />
/// <reference path="../../typings/react/react.d.ts" />
var ReactSurveyQuestiontext = (function (_super) {
    __extends(ReactSurveyQuestiontext, _super);
    function ReactSurveyQuestiontext(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.state = { value: this.question.value };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestiontext.prototype.handleOnChange = function (event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    };
    ReactSurveyQuestiontext.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
    };
    ReactSurveyQuestiontext.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("input", {className: this.css, type: "text", value: this.question.value, onChange: this.handleOnChange}));
    };
    return ReactSurveyQuestiontext;
}(React.Component));

/// <reference path="../survey.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurveyModel = (function (_super) {
    __extends(ReactSurveyModel, _super);
    function ReactSurveyModel(jsonObj) {
        if (jsonObj === void 0) { jsonObj = null; }
        _super.call(this, jsonObj);
    }
    ReactSurveyModel.prototype.render = function () {
        if (this.renderCallback) {
            this.renderCallback();
        }
    };
    ReactSurveyModel.prototype.mergeCss = function (src, dest) {
        this.mergeValues(src, dest);
    };
    ReactSurveyModel.prototype.onLoadSurveyFromService = function () {
        this.render();
    };
    ReactSurveyModel.prototype.onLoadingSurveyFromService = function () {
        this.render();
    };
    return ReactSurveyModel;
}(Survey.SurveyModel));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurveyNavigation = (function (_super) {
    __extends(ReactSurveyNavigation, _super);
    function ReactSurveyNavigation(props) {
        _super.call(this, props);
        this.survey = props.survey;
        this.css = props.css;
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleCompleteClick = this.handleCompleteClick.bind(this);
    }
    ReactSurveyNavigation.prototype.componentWillReceiveProps = function (nextProps) {
        this.survey = nextProps.survey;
        this.css = nextProps.css;
    };
    ReactSurveyNavigation.prototype.handlePrevClick = function (event) {
        this.survey.prevPage();
    };
    ReactSurveyNavigation.prototype.handleNextClick = function (event) {
        this.survey.nextPage();
    };
    ReactSurveyNavigation.prototype.handleCompleteClick = function (event) {
        this.survey.completeLastPage();
    };
    ReactSurveyNavigation.prototype.render = function () {
        if (!this.survey)
            return null;
        var prevButton = !this.survey.isFirstPage ? this.renderButton(this.handlePrevClick, this.survey.pagePrevText) : null;
        var nextButton = !this.survey.isLastPage ? this.renderButton(this.handleNextClick, this.survey.pageNextText) : null;
        var completeButton = this.survey.isLastPage ? this.renderButton(this.handleCompleteClick, this.survey.completeText) : null;
        return (React.createElement("div", {className: this.css.footer}, prevButton, nextButton, completeButton));
    };
    ReactSurveyNavigation.prototype.renderButton = function (click, text) {
        var style = { marginRight: "5px" };
        return React.createElement("input", {className: this.css.navigationButton, style: style, type: "button", onClick: click, value: text});
    };
    return ReactSurveyNavigation;
}(React.Component));

/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../survey.ts" />
/// <reference path="reactsurveymodel.tsx" />
/// <reference path="reactPage.tsx" />
/// <reference path="reactQuestion.tsx" />
/// <reference path="reactSurveyNavigation.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurveyBase = (function (_super) {
    __extends(ReactSurveyBase, _super);
    function ReactSurveyBase(props) {
        _super.call(this, props);
        this.css = this.createCssObject();
        if (!this.css)
            throw "You should not return null for createCssObject() method.";
        this.updateSurvey(props);
    }
    ReactSurveyBase.prototype.componentWillReceiveProps = function (nextProps) {
        this.updateSurvey(nextProps);
    };
    ReactSurveyBase.prototype.render = function () {
        if (this.survey.state == "completed")
            return this.renderCompleted();
        if (this.survey.state == "loading")
            return this.renderLoading();
        return this.renderSurvey();
    };
    ReactSurveyBase.prototype.createCssObject = function () { return null; };
    ReactSurveyBase.prototype.renderCompleted = function () {
        var htmlValue = { __html: this.survey.processedCompletedHtml };
        return (React.createElement("div", {dangerouslySetInnerHTML: htmlValue}));
    };
    ReactSurveyBase.prototype.renderLoading = function () {
        var htmlValue = { __html: this.survey.processedLoadingHtml };
        return (React.createElement("div", {dangerouslySetInnerHTML: htmlValue}));
    };
    ReactSurveyBase.prototype.renderSurvey = function () {
        var title = this.survey.title && this.survey.showTitle ? this.renderTitle() : null;
        var currentPage = this.survey.currentPage ? this.renderPage() : null;
        var topProgress = this.survey.showProgressBar == "top" ? this.renderProgress(true) : null;
        var bottomProgress = this.survey.showProgressBar == "bottom" ? this.renderProgress(false) : null;
        var buttons = (currentPage && this.survey.showNavigationButtons) ? this.renderNavigation() : null;
        if (!currentPage) {
            currentPage = this.renderEmptySurvey();
        }
        return (React.createElement("div", {className: this.css.root}, title, React.createElement("div", {className: this.css.body}, topProgress, currentPage, bottomProgress), buttons));
    };
    ReactSurveyBase.prototype.renderTitle = function () {
        return React.createElement("div", {className: this.css.header}, React.createElement("h3", null, this.survey.title));
    };
    ReactSurveyBase.prototype.renderPage = function () {
        return React.createElement(ReactSurveyPage, {survey: this.survey, page: this.survey.currentPage, css: this.css, creator: this});
    };
    ReactSurveyBase.prototype.renderProgress = function (isTop) {
        return null;
    };
    ReactSurveyBase.prototype.renderNavigation = function () {
        return React.createElement(ReactSurveyNavigation, {survey: this.survey, css: this.css});
    };
    ReactSurveyBase.prototype.renderEmptySurvey = function () {
        return (React.createElement("span", null, this.survey.emptySurveyText));
    };
    ReactSurveyBase.prototype.updateSurvey = function (newProps) {
        if (newProps) {
            if (newProps.model) {
                this.survey = newProps.model;
            }
            else {
                if (newProps.json) {
                    this.survey = new ReactSurveyModel(newProps.json);
                }
            }
        }
        else {
            this.survey = new ReactSurveyModel();
        }
        if (newProps) {
            if (newProps.clientId)
                this.survey.clientId = newProps.clientId;
            if (newProps.data)
                this.survey.data = newProps.data;
            if (newProps.css)
                this.survey.mergeCss(newProps.css, this.css);
        }
        //set the first page
        var dummy = this.survey.currentPage;
        this.state = { pageIndexChange: 0, isCompleted: false, modelChanged: 0 };
        this.setSurveyEvents(newProps);
    };
    ReactSurveyBase.prototype.setSurveyEvents = function (newProps) {
        var self = this;
        this.survey.renderCallback = function () {
            self.state.modelChanged = self.state.modelChanged + 1;
            self.setState(self.state);
        };
        this.survey.onComplete.add(function (sender) { self.state.isCompleted = true; self.setState(self.state); });
        this.survey.onCurrentPageChanged.add(function (sender, options) {
            self.state.pageIndexChange = self.state.pageIndexChange + 1;
            self.setState(self.state);
            if (newProps && newProps.onCurrentPageChanged)
                newProps.onCurrentPageChanged(sender, options);
        });
        this.survey.onVisibleChanged.add(function (sender, options) {
            if (options.question && options.question.react) {
                var state = options.question.react.state;
                state.visible = options.question.visible;
                options.question.react.setState(state);
            }
        });
        this.survey.onValueChanged.add(function (sender, options) {
            if (options.question && options.question.react) {
                var state = options.question.react.state;
                state.value = options.value;
                options.question.react.setState(state);
            }
        });
        if (!newProps)
            return;
        this.survey.onValueChanged.add(function (sender, options) {
            if (newProps.data)
                newProps.data[options.name] = options.value;
            if (newProps.onValueChanged)
                newProps.onValueChanged(sender, options);
        });
        if (newProps.onComplete) {
            this.survey.onComplete.add(function (sender) { newProps.onComplete(sender); });
        }
        this.survey.onPageVisibleChanged.add(function (sender, options) { if (newProps.onPageVisibleChanged)
            newProps.onPageVisibleChanged(sender, options); });
        if (newProps.onQuestionAdded) {
            this.survey.onQuestionAdded.add(function (sender, options) { newProps.onQuestionAdded(sender, options); });
        }
        if (newProps.onQuestionRemoved) {
            this.survey.onQuestionRemoved.add(function (sender, options) { newProps.onQuestionRemoved(sender, options); });
        }
        if (newProps.onValidateQuestion) {
            this.survey.onValidateQuestion.add(function (sender, options) { newProps.onValidateQuestion(sender, options); });
        }
        if (newProps.onSendResult) {
            this.survey.onSendResult.add(function (sender, options) { newProps.onSendResult(sender, options); });
        }
        if (newProps.onGetResult) {
            this.survey.onGetResult.add(function (sender, options) { newProps.onGetResult(sender, options); });
        }
        if (newProps.onProcessHtml) {
            this.survey.onProcessHtml.add(function (sender, options) { newProps.onProcessHtml(sender, options); });
        }
    };
    ReactSurveyBase.prototype.getReactQuestionClass = function (question) {
        var className = "ReactSurveyQuestion" + question.getType();
        return window[className];
    };
    //IReactSurveyCreator
    ReactSurveyBase.prototype.createQuestionElement = function (question) {
        var questionCss = this.css[question.getType()];
        return React.createElement(this.getReactQuestionClass(question), { question: question, css: questionCss, rootCss: this.css });
    };
    ReactSurveyBase.prototype.renderError = function (key, errorText) {
        return React.createElement("div", {key: key, className: this.css.error.item}, errorText);
    };
    return ReactSurveyBase;
}(React.Component));

/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../survey.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurveyProgressBase = (function (_super) {
    __extends(ReactSurveyProgressBase, _super);
    function ReactSurveyProgressBase(props) {
        _super.call(this, props);
        this.survey = props.survey;
        this.css = props.css;
        this.isTop = props.isTop;
    }
    ReactSurveyProgressBase.prototype.componentWillReceiveProps = function (nextProps) {
        this.survey = nextProps.survey;
        this.css = nextProps.css;
        this.isTop = nextProps.isTop;
    };
    Object.defineProperty(ReactSurveyProgressBase.prototype, "progress", {
        get: function () { return this.survey.getProgress(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReactSurveyProgressBase.prototype, "progressText", {
        get: function () { return this.survey.progressText; },
        enumerable: true,
        configurable: true
    });
    return ReactSurveyProgressBase;
}(React.Component));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../survey.ts" />
/// <reference path="../../question_rating.ts" />
/// <reference path="../../../typings/react/react.d.ts" />
var ReactSurveyQuestionrating = (function (_super) {
    __extends(ReactSurveyQuestionrating, _super);
    function ReactSurveyQuestionrating(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestionrating.prototype.handleOnChange = function (event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value });
    };
    ReactSurveyQuestionrating.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
    };
    ReactSurveyQuestionrating.prototype.render = function () {
        if (!this.question)
            return null;
        var headers = [];
        var values = [];
        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
            var keyHeader = "header" + i;
            var keyValue = "value" + i;
            var item = this.question.visibleRateValues[i];
            headers.push(React.createElement("th", {key: keyHeader}, item.text));
            values.push(React.createElement("td", {key: keyValue}, React.createElement("input", {type: "radio", name: this.question.name, value: item.value, checked: this.question.value == item.value, onChange: this.handleOnChange})));
        }
        var comment = this.question.hasOther ? this.renderOther() : null;
        return (React.createElement("div", null, React.createElement("table", {className: this.css.root}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null), headers, React.createElement("th", null))), React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, this.question.mininumRateDescription), values, React.createElement("td", null, this.question.maximumRateDescription)))), comment));
    };
    ReactSurveyQuestionrating.prototype.renderOther = function () {
        return (React.createElement("div", {className: this.css.other}, React.createElement(ReactSurveyQuestionCommentItem, {question: this.question, css: this.rootCss})));
    };
    return ReactSurveyQuestionrating;
}(React.Component));

/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurveyProgress.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurveyProgress = (function (_super) {
    __extends(ReactSurveyProgress, _super);
    function ReactSurveyProgress(props) {
        _super.call(this, props);
    }
    ReactSurveyProgress.prototype.render = function () {
        var style = this.isTop ? {} : { marginTop: "10px", marginBottom: "5px" };
        return (React.createElement("div", {className: this.css.progress, style: style}, this.progressText));
    };
    return ReactSurveyProgress;
}(ReactSurveyProgressBase));

/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="reactSurveyProgressStandard.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurvey = (function (_super) {
    __extends(ReactSurvey, _super);
    function ReactSurvey(props) {
        _super.call(this, props);
    }
    ReactSurvey.prototype.renderProgress = function (isTop) {
        return React.createElement(ReactSurveyProgress, {survey: this.survey, css: this.css, isTop: isTop});
    };
    ReactSurvey.prototype.createCssObject = function () {
        return {
            root: "sv_main",
            header: "",
            body: "sv_body",
            footer: "sv_nav",
            navigationButton: "",
            progress: "sv_progress",
            pageTitle: "sv_p_title",
            question: { root: "sv_q", title: "sv_q_title", comment: "" },
            error: { root: "sv_q_erbox", item: "" },
            checkbox: { root: "sv_qcbc", item: "sv_q_checkbox", other: "sv_q_other" },
            comment: "",
            dropdown: "",
            matrix: { root: "sv_q_matrix" },
            matrixdropdown: { root: "sv_q_matrix" },
            multipletext: { root: "", itemTitle: "", itemValue: "" },
            radiogroup: { root: "sv_qcbc", item: "sv_q_radiogroup", other: "sv_q_other" },
            rating: { root: "sv_q_rating", item: "" },
            text: ""
        };
    };
    return ReactSurvey;
}(ReactSurveyBase));

/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="reactSurveyStandard.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactSurveyWindow = (function (_super) {
    __extends(ReactSurveyWindow, _super);
    function ReactSurveyWindow(props) {
        _super.call(this, props);
        this.handleOnExpanded = this.handleOnExpanded.bind(this);
    }
    ReactSurveyWindow.prototype.handleOnExpanded = function (event) {
        this.state.expanded = !this.state.expanded;
        this.setState(this.state);
    };
    ReactSurveyWindow.prototype.render = function () {
        if (this.state.hidden)
            return null;
        var header = this.renderHeader();
        var body = this.state.expanded ? this.renderBody() : null;
        return React.createElement("div", {className: "sv_window"}, header, body);
    };
    ReactSurveyWindow.prototype.renderHeader = function () {
        var styleA = { width: "100%" };
        return React.createElement("div", {className: "sv_window_title"}, React.createElement("a", {href: "#", onClick: this.handleOnExpanded, style: styleA}, React.createElement("span", null, this.title)));
    };
    ReactSurveyWindow.prototype.renderBody = function () {
        return React.createElement("div", {class: "sv_window_content"}, this.renderSurvey());
    };
    ReactSurveyWindow.prototype.updateSurvey = function (newProps) {
        _super.prototype.updateSurvey.call(this, newProps);
        this.title = newProps.title ? newProps.title : this.survey.title;
        var hasExpanded = newProps["expanded"] ? newProps.expanded : false;
        this.state = { expanded: hasExpanded, hidden: false };
        var self = this;
        this.survey.onComplete.add(function (s) {
            self.state.hidden = true;
            self.setState(self.state);
        });
    };
    return ReactSurveyWindow;
}(ReactSurvey));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN1cnZleS5yZWFjdC5qcyIsImJhc2UudHMiLCJkeFN1cnZleVNlcnZpY2UudHMiLCJzdXJ2ZXlTdHJpbmdzLnRzIiwiZXJyb3IudHMiLCJqc29ub2JqZWN0LnRzIiwicXVlc3Rpb25iYXNlLnRzIiwicXVlc3Rpb25mYWN0b3J5LnRzIiwicGFnZS50cyIsInZhbGlkYXRvci50cyIsInF1ZXN0aW9uLnRzIiwicXVlc3Rpb25fYmFzZXNlbGVjdC50cyIsInF1ZXN0aW9uX2NoZWNrYm94LnRzIiwicXVlc3Rpb25fY29tbWVudC50cyIsInF1ZXN0aW9uX2Ryb3Bkb3duLnRzIiwicXVlc3Rpb25faHRtbC50cyIsInF1ZXN0aW9uX21hdHJpeC50cyIsInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzIiwicXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwicXVlc3Rpb25fcmFkaW9ncm91cC50cyIsInF1ZXN0aW9uX3JhdGluZy50cyIsInF1ZXN0aW9uX3RleHQudHMiLCJ0cmlnZ2VyLnRzIiwidGV4dFByZVByb2Nlc3Nvci50cyIsInN1cnZleS50cyIsInN1cnZleVdpbmRvdy50cyIsImxvY2FsaXphdGlvbi9maW5uaXNoLnRzIiwibG9jYWxpemF0aW9uL2dlcm1hbi50cyIsImxvY2FsaXphdGlvbi9ydXNzaWFuLnRzIiwicmVhY3QvcmVhY3RxdWVzdGlvbmNvbW1lbnQudHN4IiwicmVhY3QvcmVhY3RxdWVzdGlvbi50c3giLCJyZWFjdC9yZWFjdHBhZ2UudHN4IiwicmVhY3QvcmVhY3RxdWVzdGlvbmNoZWNrYm94LnRzeCIsInJlYWN0L3JlYWN0cXVlc3Rpb25kcm9wZG93bi50c3giLCJyZWFjdC9yZWFjdHF1ZXN0aW9uaHRtbC50c3giLCJyZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4LnRzeCIsInJlYWN0L3JlYWN0cXVlc3Rpb25tYXRyaXhkcm9wZG93bi50c3giLCJyZWFjdC9yZWFjdHF1ZXN0aW9ubXVsdGlwbGV0ZXh0LnRzeCIsInJlYWN0L3JlYWN0cXVlc3Rpb25yYWRpb2dyb3VwLnRzeCIsInJlYWN0L3JlYWN0cXVlc3Rpb250ZXh0LnRzeCIsInJlYWN0L3JlYWN0c3VydmV5bW9kZWwudHN4IiwicmVhY3QvcmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uLnRzeCIsInJlYWN0L3JlYWN0U3VydmV5LnRzeCIsInJlYWN0L3JlYWN0U3VydmV5UHJvZ3Jlc3MudHN4IiwicmVhY3Qvc3RhbmRhcmQvcmVhY3RxdWVzdGlvbnJhdGluZ1N0YW5kYXJkLnRzeCIsInJlYWN0L3N0YW5kYXJkL3JlYWN0U3VydmV5UHJvZ3Jlc3NTdGFuZGFyZC50c3giLCJyZWFjdC9zdGFuZGFyZC9yZWFjdFN1cnZleVN0YW5kYXJkLnRzeCIsInJlYWN0L3N0YW5kYXJkL3JlYWN0U3VydmV5V2luZG93U3RhbmRhcmQudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDTkksSUFBTyxNQUFNLENBMEhoQjtBQTFIRyxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBOEJmO1FBOEJJLG1CQUFZLEtBQVUsRUFBRSxJQUFtQjtZQUFuQixvQkFBbUIsR0FBbkIsV0FBbUI7WUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQztRQS9CYSxpQkFBTyxHQUFyQixVQUFzQixLQUF1QixFQUFFLE1BQWtCO1lBQzdELEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFP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SUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFxQjtZQUN0RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQTVDQSxBQTRDQyxDQTVDK0IsV0FBVyxHQTRDMUMiLCJmaWxlIjoic3VydmV5LnJlYWN0LmpzIiwic291cmNlc0NvbnRlbnQiOltudWxsLCIgICAgbW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEhhc2hUYWJsZTxUPiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogVDtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleSB7XHJcbiAgICAgICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSk7XHJcbiAgICAgICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpO1xyXG4gICAgICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IElRdWVzdGlvbiwgaW5kZXg6IG51bWJlcik7XHJcbiAgICAgICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pO1xyXG4gICAgICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3I7XHJcbiAgICAgICAgcHJvY2Vzc0h0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgICAgIHByb2Nlc3NUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZztcclxuICAgICAgICBpc0Rlc2lnbk1vZGU6IGJvb2xlYW47XHJcbiAgICAgICAgcmVxdWlyZWRUZXh0OiBzdHJpbmc7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElRdWVzdGlvbiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICAgICAgaGFzVGl0bGU6IGJvb2xlYW47XHJcbiAgICAgICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpO1xyXG4gICAgICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUGFnZSB7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSXRlbVZhbHVlIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFNlcGFyYXRvciA9ICd8JztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldERhdGEoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4sIHZhbHVlczogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBpdGVtcy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgSXRlbVZhbHVlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUudmFsdWUpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHZhbHVlW1widGV4dFwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWVbXCJ2YWx1ZVwiXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldERhdGEoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4pOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5oYXNUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyB2YWx1ZTogaXRlbS52YWx1ZSwgdGV4dDogaXRlbS50ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGl0ZW1WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgaXRlbVRleHQ6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCB0ZXh0OiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiaXRlbXZhbHVlXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLml0ZW1WYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXRlbVZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBzdHI6IHN0cmluZyA9IHRoaXMuaXRlbVZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHN0ci5pbmRleE9mKEl0ZW1WYWx1ZS5TZXBhcmF0b3IpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWUgPSBzdHIuc2xpY2UoMCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gc3RyLnNsaWNlKGluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUZXh0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pdGVtVGV4dCA/IHRydWUgOiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNUZXh0KSByZXR1cm4gdGhpcy5pdGVtVGV4dDtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUpIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRleHQobmV3VGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVRleHQgPSBuZXdUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQmFzZSB7XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZlbnQ8VCBleHRlbmRzIEZ1bmN0aW9uLCBPcHRpb25zPiAge1xyXG4gICAgICAgIHByaXZhdGUgY2FsbGJhY2tzOiBBcnJheTxUPjtcclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmNhbGxiYWNrcyA9PSBudWxsIHx8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICAgICAgcHVibGljIGZpcmUoc2VuZGVyOiBhbnksIG9wdGlvbnM6IE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsUmVzdWx0ID0gdGhpcy5jYWxsYmFja3NbaV0oc2VuZGVyLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZChmdW5jOiBUKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IG5ldyBBcnJheTxUPigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goZnVuYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW1vdmUoZnVuYzogVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNhbGxiYWNrcy5pbmRleE9mKGZ1bmMsIDApO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgZHhTdXJ2ZXlTZXJ2aWNlIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VVcmw6IHN0cmluZyA9IFwiaHR0cHM6Ly9keHN1cnZleWFwaS5henVyZXdlYnNpdGVzLm5ldC9hcGkvU3VydmV5XCI7XHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIHNlcnZpY2VVcmw6IHN0cmluZyA9IFwiaHR0cDovL2xvY2FsaG9zdDo1MDQ4OC9hcGkvU3VydmV5XCI7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcsIG9uTG9hZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9nZXRTdXJ2ZXk/c3VydmV5SWQ9JyArIHN1cnZleUlkKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBvbkxvYWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNlbmRSZXN1bHQocG9zdElkOiBzdHJpbmcsIHJlc3VsdDogSlNPTiwgb25TZW5kUmVzdWx0OiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSk9PiB2b2lkLCBjbGllbnRJZDogc3RyaW5nID0gbnVsbCwgaXNQYXJ0aWFsQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignUE9TVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9wb3N0LycpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7IHBvc3RJZDogcG9zdElkLCBzdXJ2ZXlSZXN1bHQ6IEpTT04uc3RyaW5naWZ5KHJlc3VsdCkgfTtcclxuICAgICAgICAgICAgaWYgKGNsaWVudElkKSBkYXRhWydjbGllbnRJZCddID0gY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIGlmIChpc1BhcnRpYWxDb21wbGV0ZWQpIGRhdGFbJ2lzUGFydGlhbENvbXBsZXRlZCddID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIGRhdGFTdHJpbmdpZnk6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBvblNlbmRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKGRhdGFTdHJpbmdpZnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVzdWx0KHJlc3VsdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgb25HZXRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBBcnJheTxhbnk+LCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZuYW1lPScgKyBuYW1lO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFJlc3VsdD8nICsgZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzdWx0LlF1ZXN0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHsgbmFtZToga2V5LCB2YWx1ZTogcmVzdWx0LlF1ZXN0aW9uUmVzdWx0W2tleV0gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvbkdldFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCBsaXN0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNDb21wbGV0ZWQocmVzdWx0SWQ6IHN0cmluZywgY2xpZW50SWQ6IHN0cmluZywgb25Jc0NvbXBsZXRlZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZjbGllbnRJZD0nICsgY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvaXNDb21wbGV0ZWQ/JyArIGRhdGEpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9uSXNDb21wbGV0ZWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCB2YXIgc3VydmV5TG9jYWxpemF0aW9uID0ge1xyXG4gICAgICAgIGN1cnJlbnRMb2NhbGU6IFwiXCIsXHJcbiAgICAgICAgbG9jYWxlczoge30sXHJcbiAgICAgICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSB0aGlzLmN1cnJlbnRMb2NhbGUgPyB0aGlzLmxvY2FsZXNbdGhpcy5jdXJyZW50TG9jYWxlXSA6IHN1cnZleVN0cmluZ3M7XHJcbiAgICAgICAgICAgIGlmICghbG9jIHx8ICFsb2Nbc3RyTmFtZV0pIGxvYyA9IHN1cnZleVN0cmluZ3M7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2Nbc3RyTmFtZV07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRMb2NhbGVzOiBmdW5jdGlvbiAoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICAgICAgcmVzLnB1c2goXCJcIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxvY2FsZXMpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0IHZhciBzdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICAgIHBhZ2VQcmV2VGV4dDogXCJQcmV2aW91c1wiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCJOZXh0XCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcIkNvbXBsZXRlXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJPdGhlciAoZGVzY3JpYmUpXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2UgezB9IG9mIHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcIlRoZXJlIGlzIG5vIGFueSB2aXNpYmxlIHBhZ2Ugb3IgdmlzaWJsZSBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LlwiLFxyXG4gICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiVGhhbmsgWW91IGZvciBDb21wbGV0aW5nIHRoZSBTdXJ2ZXkhXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCJTdXJ2ZXkgaXMgbG9hZGluZyBmcm9tIHRoZSBzZXJ2ZXIuLi5cIixcclxuICAgICAgICBvcHRpb25zQ2FwdGlvbjogXCJDaG9vc2UuLi5cIixcclxuICAgICAgICByZXF1aXJlZEVycm9yOiBcIlBsZWFzZSBhbnN3ZXIgdGhlIHF1ZXN0aW9uLlwiLFxyXG4gICAgICAgIG51bWVyaWNFcnJvcjogXCJUaGUgdmFsdWUgc2hvdWxkIGJlIGEgbnVtZXJpYy5cIixcclxuICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcIlBsZWFzZSBlbnRlciBhdCBsZWFzdCB7MH0gc3ltYm9scy5cIixcclxuICAgICAgICBtaW5TZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IGF0IGxlYXN0IHswfSB2YXJpYW50cy5cIixcclxuICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IG5vdCBtb3JlIHRoYW4gezB9IHZhcmlhbnRzLlwiLFxyXG4gICAgICAgIG51bWVyaWNNaW5NYXg6IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9IGFuZCBlcXVhbCBvciBsZXNzIHRoYW4gezJ9XCIsXHJcbiAgICAgICAgbnVtZXJpY01pbjogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIG1vcmUgdGhhbiB7MX1cIixcclxuICAgICAgICBudW1lcmljTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbGVzcyB0aGFuIHsxfVwiLFxyXG4gICAgICAgIGludmFsaWRFbWFpbDogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlLW1haWwuXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIlBsZWFzZSBlbnRlciB0aGUgb3RoZXJzIHZhbHVlLlwiXHJcbiAgICB9XHJcbiAgICBzdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImVuXCJdID0gc3VydmV5U3RyaW5ncztcclxuXHJcbiAgICBpZiAoIVN0cmluZy5wcm90b3R5cGVbXCJmb3JtYXRcIl0pIHtcclxuICAgICAgICBTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgPyBhcmdzW251bWJlcl1cclxuICAgICAgICAgICAgICAgICAgICA6IG1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBBbnN3ZXJSZXF1aXJlZEVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJyZXF1aXJlZEVycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBSZXF1cmVOdW1lcmljRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY0Vycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBDdXN0b21FcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgIHByaXZhdGUgdHlwZVZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNmdW5jOiAoKSA9PiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGFzc05hbWVQYXJ0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnR5cGVWYWx1ZSA/IHRoaXMudHlwZVZhbHVlIDogXCJzdHJpbmdcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudHlwZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlR2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uR2V0VmFsdWU7IH0gXHJcbiAgICAgICAgcHVibGljIGlzRGVmYXVsdFZhbHVlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmRlZmF1bHRWYWx1ZSkgPyAodGhpcy5kZWZhdWx0VmFsdWUgPT0gdmFsdWUpIDogISh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRWYWx1ZShvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uR2V0VmFsdWUpIHJldHVybiB0aGlzLm9uR2V0VmFsdWUob2JqKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVG9Vc2VTZXRWYWx1ZSgpIHsgcmV0dXJuIHRoaXMub25TZXRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25TZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNldFZhbHVlKG9iaiwgdmFsdWUsIGpzb25Db252KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0T2JqVHlwZShvYmpUeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsYXNzTmFtZVBhcnQpIHJldHVybiBvYmpUeXBlO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqVHlwZS5yZXBsYWNlKHRoaXMuY2xhc3NOYW1lUGFydCwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY2xhc3NOYW1lUGFydCAmJiBjbGFzc05hbWUuaW5kZXhPZih0aGlzLmNsYXNzTmFtZVBhcnQpIDwgMCkgPyBjbGFzc05hbWUgKyB0aGlzLmNsYXNzTmFtZVBhcnQgOiBjbGFzc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc1ZhbHVlICE9IG51bGwpIHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc2Z1bmMgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc2Z1bmMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRDaG9pY2VzKHZhbHVlOiBBcnJheTxhbnk+LCB2YWx1ZUZ1bmM6ICgpID0+IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzZnVuYyA9IHZhbHVlRnVuYztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgIHN0YXRpYyByZXF1aXJlZFN5bWJvbCA9ICchJztcclxuICAgICAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgICAgICBwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+ID0gbnVsbDtcclxuICAgICAgICByZXF1aXJlZFByb3BlcnRpZXM6IEFycmF5PHN0cmluZz4gPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgcHVibGljIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydGllc05hbWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZUluZGV4ID0gcHJvcGVydHlOYW1lLmluZGV4T2YoSnNvbk1ldGFkYXRhQ2xhc3MudHlwZVN5bWJvbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKHR5cGVJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHJpbmcoMCwgdHlwZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBuZXcgSnNvbk9iamVjdFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUubGVuZ3RoID09IDAgfHwgcHJvcGVydHlOYW1lWzBdICE9IEpzb25NZXRhZGF0YUNsYXNzLnJlcXVpcmVkU3ltYm9sKSByZXR1cm4gcHJvcGVydHlOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NZXRhZGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc2VzOiBIYXNoVGFibGU8SnNvbk1ldGFkYXRhQ2xhc3M+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc1Byb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NSZXF1aXJlZFByb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxzdHJpbmc+PiA9IHt9O1xyXG4gICAgICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllc05hbWVzLCBjcmVhdG9yLCBwYXJlbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGVDbGFzc0NyZWF0b3JlKG5hbWU6IHN0cmluZywgY3JlYXRvcjogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhRGF0YUNsYXNzLmNyZWF0b3IgPSBjcmVhdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRQcm9wZXJ0eVZhbHVlcyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eUNsYXNzTmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwsIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbCwgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmNsYXNzTmFtZSA9IHByb3BlcnR5Q2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5Lm9uR2V0VmFsdWUgPSBvbkdldFZhbHVlO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5vblNldFZhbHVlID0gb25TZXRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFByb3BlcnR5Q2hvaWNlcyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBjaG9pY2VzOiBBcnJheTxhbnk+LCBjaG9pY2VzRnVuYzogKCkgPT4gQXJyYXk8YW55PiA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkobmFtZSwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5zZXRDaG9pY2VzKGNob2ljZXMsIGNob2ljZXNGdW5jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFByb3BlcnR5Q2xhc3NJbmZvKG5hbWU6IHN0cmluZywgcHJvcGVydHlOYW1lOiBzdHJpbmcsIGJhc2VDbGFzc05hbWU6IHN0cmluZywgY2xhc3NOYW1lUGFydDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmJhc2VDbGFzc05hbWUgPSBiYXNlQ2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5jbGFzc05hbWVQYXJ0ID0gY2xhc3NOYW1lUGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5jbGFzc1Byb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKG5hbWUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1Byb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlQ2xhc3MobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MuY3JlYXRvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW5DbGFzc2VzKG5hbWU6IHN0cmluZywgY2FuQmVDcmVhdGVkOiBib29sZWFuID0gZmFsc2UpOiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFJlcXVpcmVkUHJvcGVydGllcyhuYW1lLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4sIHJlc3VsdDogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+KSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2FuQmVDcmVhdGVkIHx8IGNoaWxkcmVuW2ldLmNyZWF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxDaGlsZHJlbkNsYXNzZXMoY2hpbGRyZW5baV0ubmFtZSwgY2FuQmVDcmVhdGVkLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmluZENsYXNzKG5hbWU6IHN0cmluZyk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaW5kUHJvcGVydHkobmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzID8gbWV0YURhdGFDbGFzcy5maW5kKHByb3BlcnR5TmFtZSkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pikge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUHJvcGVydGllcyhtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUsIGxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFByb3BlcnR5KG1ldGFEYXRhQ2xhc3MucHJvcGVydGllc1tpXSwgbGlzdCwgbGlzdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkUHJvcGVydHkocHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiwgZW5kSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmRJbmRleDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdFtpXS5uYW1lID09IHByb3BlcnR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChwcm9wZXJ0eSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpc3RbaW5kZXhdID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShsaXN0LCBtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbkVycm9yIHtcclxuICAgICAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIGF0OiBOdW1iZXIgPSAtMTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRGdWxsRGVzY3JpcHRpb24oKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UgKyAodGhpcy5kZXNjcmlwdGlvbiA/IFwiXFxuXCIgKyB0aGlzLmRlc2NyaXB0aW9uIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25Vbmtub3duUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJ1bmtub3ducHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJyBpcyB1bmtub3duLlwiKTtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBsaXN0IG9mIGF2YWlsYWJsZSBwcm9wZXJ0aWVzIGFyZTogXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gcHJvcGVydGllc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSAnLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHR5cGUsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJUaGUgZm9sbG93aW5nIHR5cGVzIGFyZSBhdmFpbGFibGU6IFwiO1xyXG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhiYXNlQ2xhc3NOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLCBcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gXCInXCIgKyB0eXBlc1tpXS5uYW1lICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIi5cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3IgZXh0ZW5kcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcIm1pc3Npbmd0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBtaXNzaW5nIGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbkluY29ycmVjdFR5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwiaW5jb3JyZWN0dHlwZXByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5IHR5cGUgaXMgaW5jb3JyZWN0IGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJyZXF1aXJlZHByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBpcyByZXF1aXJlZCBpbiBjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk9iamVjdCB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdHlwZVByb3BlcnR5TmFtZSA9IFwidHlwZVwiO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHBvc2l0aW9uUHJvcGVydHlOYW1lID0gXCJwb3NcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtZXRhRGF0YVZhbHVlID0gbmV3IEpzb25NZXRhZGF0YSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IG1ldGFEYXRhKCkgeyByZXR1cm4gSnNvbk9iamVjdC5tZXRhRGF0YVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGVycm9ycyA9IG5ldyBBcnJheTxKc29uRXJyb3I+KCk7XHJcbiAgICAgICAgcHVibGljIHRvSnNvbk9iamVjdChvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvSnNvbk9iamVjdENvcmUob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHRvT2JqZWN0KGpzb25PYmo6IGFueSwgb2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFqc29uT2JqKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG9iai5nZXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBqc29uT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IobmV3IEpzb25Vbmtub3duUHJvcGVydHlFcnJvcihrZXkudG9TdHJpbmcoKSwgb2JqLmdldFR5cGUoKSksIGpzb25PYmopOyBcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb09iaihqc29uT2JqW2tleV0sIG9iaiwga2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHRvSnNvbk9iamVjdENvcmUob2JqOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW9iai5nZXRUeXBlKSByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmICghcHJvcGVydHkuY2xhc3NOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eS5nZXRPYmpUeXBlKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvSnNvbihvYmosIHJlc3VsdCwgcHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9Kc29uKG9iajogYW55LCByZXN1bHQ6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaGFzVG9Vc2VHZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwcm9wZXJ0eS5nZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyVmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJWYWx1ZS5wdXNoKHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZVtpXSwgcHJvcGVydHkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyVmFsdWUubGVuZ3RoID4gMCA/IGFyclZhbHVlIDogbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wZXJ0eS5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvT2JqKHZhbHVlOiBhbnksIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5oYXNUb1VzZVNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eS5zZXRWYWx1ZShvYmosIHZhbHVlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9BcnJheSh2YWx1ZSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdPYmoubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlLCBuZXdPYmoubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbmV3T2JqLm5ld09iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIW5ld09iai5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVBcnJheSh2YWx1ZTogYW55KTogYm9vbGVhbiB7IHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLmluZGV4T2YoXCJBcnJheVwiKSA+IC0xOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVOZXdPYmoodmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7IG5ld09iajogbnVsbCwgZXJyb3I6IG51bGwgfTtcclxuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHZhbHVlW0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgIGlmICghY2xhc3NOYW1lICYmIHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gcHJvcGVydHkuZ2V0Q2xhc3NOYW1lKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5uZXdPYmogPSAoY2xhc3NOYW1lKSA/IEpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoY2xhc3NOYW1lKSA6IG51bGw7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IHRoaXMuY2hlY2tOZXdPYmplY3RPbkVycm9ycyhyZXN1bHQubmV3T2JqLCB2YWx1ZSwgcHJvcGVydHksIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tOZXdPYmplY3RPbkVycm9ycyhuZXdPYmo6IGFueSwgdmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBKc29uRXJyb3Ige1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAobmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZWRQcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRSZXF1aXJlZFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcXVpcmVkUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlW3JlcXVpcmVkUHJvcGVydGllc1tpXV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IocmVxdWlyZWRQcm9wZXJ0aWVzW2ldLCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuYmFzZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25NaXNzaW5nVHlwZUVycm9yKHByb3BlcnR5Lm5hbWUsIHByb3BlcnR5LmJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25JbmNvcnJlY3RUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihlcnJvciwgdmFsdWUpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkTmV3RXJyb3IoZXJyb3I6IEpzb25FcnJvciwganNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uT2JqICYmIGpzb25PYmpbSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmF0ID0ganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXS5zdGFydDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZVRvQXJyYXkodmFsdWU6IEFycmF5PGFueT4sIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUFycmF5KG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZVtpXSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLm5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2gobmV3VmFsdWUubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlW2ldLCBuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2godmFsdWVbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBrZXk6IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBrZXkpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkJhc2UgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVF1ZXN0aW9uIHtcclxuICAgICAgICBwcm90ZWN0ZWQgZGF0YTogSVN1cnZleTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlSW5kZXhWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHVibGljIHdpZHRoOiBzdHJpbmcgPSBcIjEwMCVcIjtcclxuICAgICAgICB2aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZCg8SVF1ZXN0aW9uPnRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudmlzaWJsZUluZGV4VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25TZXREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBmaXJlQ2FsbGJhY2soY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICAvL0lRdWVzdGlvblxyXG4gICAgICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uYmFzZVwiLCBbXCIhbmFtZVwiLCBcInZpc2libGU6Ym9vbGVhblwiLCBcIndpZHRoXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJxdWVzdGlvbmJhc2VcIiwgXCJ2aXNpYmxlXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInF1ZXN0aW9uYmFzZVwiLCBcIndpZHRoXCIsIG51bGwsIFwiMTAwJVwiKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogUXVlc3Rpb25GYWN0b3J5ID0gbmV3IFF1ZXN0aW9uRmFjdG9yeSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRGVmYXVsdENob2ljZXMgPSBbXCJvbmVcIiwgXCJ0d298c2Vjb25kIHZhbHVlXCIsIHsgdmFsdWU6IDMsIHRleHQ6IFwidGhpcmQgdmFsdWVcIiB9XTtcclxuICAgICAgICBwcml2YXRlIGNyZWF0b3JIYXNoOiBIYXNoVGFibGU8KG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb25CYXNlPiA9IHt9O1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdID0gcXVlc3Rpb25DcmVhdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0QWxsVHlwZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgICAgIHZhciBjcmVhdG9yID0gdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdO1xyXG4gICAgICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0b3IobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlTW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVBhZ2Uge1xyXG4gICAgICAgIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IG5ldyBBcnJheTxRdWVzdGlvbkJhc2U+KCk7XHJcbiAgICAgICAgcHVibGljIGRhdGE6IElTdXJ2ZXkgPSBudWxsO1xyXG5cclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBudW1WYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEucHJvY2Vzc1RleHQodGhpcy50aXRsZSkgOiB0aGlzLnRpdGxlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBudW0oKSB7IHJldHVybiB0aGlzLm51bVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBudW0odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5udW1WYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm51bVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25OdW1DaGFuZ2VkKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGFnZVZpc2liaWxpdHlDaGFuZ2VkKHRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicGFnZVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc1Zpc2libGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSwgaW5kZXg6IG51bWJlciA9IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbiA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5xdWVzdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMCwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24uc2V0RGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnF1ZXN0aW9uQWRkZWQocXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkTmV3UXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHRoaXMuZGF0YS5xdWVzdGlvblJlbW92ZWQocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlICYmIHRoaXMucXVlc3Rpb25zW2ldLmhhc0Vycm9ycygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb25zVG9MaXN0KGxpc3Q6IEFycmF5PElRdWVzdGlvbj4sIHZpc2libGVPbmx5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICF0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMucXVlc3Rpb25zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25OdW1DaGFuZ2VkKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicGFnZVwiLCBbXCJuYW1lXCIsIFwicXVlc3Rpb25zXCIsIFwidmlzaWJsZTpib29sZWFuXCIsIFwidGl0bGVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQYWdlTW9kZWwoKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicGFnZVwiLCBcInZpc2libGVcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwicGFnZVwiLCBcInF1ZXN0aW9uc1wiLCBcInF1ZXN0aW9uXCIpO1xyXG4gfSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImVycm9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogYW55LCBwdWJsaWMgZXJyb3I6IFN1cnZleUVycm9yID0gbnVsbCkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZhbGlkYXRvciBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0KSByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0RXJyb3JUZXh0KG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPjtcclxuICAgICAgICB2YWx1ZTogYW55O1xyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZztcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBWYWxpZGF0b3JSdW5uZXIge1xyXG4gICAgICAgIHB1YmxpYyBydW4ob3duZXI6IElWYWxpZGF0b3JPd25lcik6IFN1cnZleUVycm9yIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25lci52YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yUmVzdWx0ID0gb3duZXIudmFsaWRhdG9yc1tpXS52YWxpZGF0ZShvd25lci52YWx1ZSwgb3duZXIuZ2V0VmFsaWRhdG9yVGl0bGUoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LmVycm9yKSByZXR1cm4gdmFsaWRhdG9yUmVzdWx0LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIudmFsdWUgPSB2YWxpZGF0b3JSZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgTnVtZXJpY1ZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pblZhbHVlOiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4VmFsdWU6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwibnVtZXJpY3ZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlIHx8ICF0aGlzLmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IFJlcXVyZU51bWVyaWNFcnJvcigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFZhbGlkYXRvclJlc3VsdChwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlICYmIHRoaXMubWluVmFsdWUgPiByZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFZhbHVlICYmIHRoaXMubWF4VmFsdWUgPCByZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgPyBudWxsIDogcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHZOYW1lID0gbmFtZSA/IG5hbWUgOiBcInZhbHVlXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlICYmIHRoaXMubWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01pbk1heFwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5taW5WYWx1ZSwgdGhpcy5tYXhWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taW5WYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01pblwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5taW5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljTWF4XCIpW1wiZm9ybWF0XCJdKHZOYW1lLCB0aGlzLm1heFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzTnVtYmVyKHZhbHVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5MZW5ndGg6IG51bWJlciA9IDApIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidGV4dHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5MZW5ndGggPD0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoIDwgdGhpcy5taW5MZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ0ZXh0TWluTGVuZ3RoXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluTGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFuc3dlckNvdW50VmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluQ291bnQ6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhDb3VudDogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJhbnN3ZXJjb3VudHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciAhPSBBcnJheSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IHZhbHVlLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluQ291bnQgJiYgY291bnQgPCB0aGlzLm1pbkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQoc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1pblNlbGVjdEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluQ291bnQpKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heENvdW50ICYmIGNvdW50ID4gdGhpcy5tYXhDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtYXhTZWxlY3RFcnJvclwiKVtcImZvcm1hdFwiXSh0aGlzLm1heENvdW50KSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVnZXhWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWdleDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJyZWdleHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVnZXggfHwgIXZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cCh0aGlzLnJlZ2V4KTtcclxuICAgICAgICAgICAgaWYgKHJlLnRlc3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQodmFsdWUsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBFbWFpbFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgcHJpdmF0ZSByZSA9IC9eKChbXjw+KClcXFtcXF1cXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVxcW1xcXVxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFtePD4oKVtcXF1cXC4sOzpcXHNAXFxcIl0rXFwuKStbXjw+KClbXFxdXFwuLDs6XFxzQFxcXCJdezIsfSkkL2k7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImVtYWlsdmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZS50ZXN0KHZhbHVlKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KHZhbHVlLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImludmFsaWRFbWFpbFwiKTtcclxuICAgICAgICB9XHJcbiAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5dmFsaWRhdG9yXCIsIFtcInRleHRcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm51bWVyaWN2YWxpZGF0b3JcIiwgW1wibWluVmFsdWU6bnVtYmVyXCIsIFwibWF4VmFsdWU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTnVtZXJpY1ZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0dmFsaWRhdG9yXCIsIFtcIm1pbkxlbmd0aDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBUZXh0VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImFuc3dlcmNvdW50dmFsaWRhdG9yXCIsIFtcIm1pbkNvdW50Om51bWJlclwiLCBcIm1heENvdW50Om51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFuc3dlckNvdW50VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJlZ2V4dmFsaWRhdG9yXCIsIFtcInJlZ2V4XCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUmVnZXhWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiZW1haWx2YWxpZGF0b3JcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBFbWFpbFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuIFxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJlcnJvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ2YWxpZGF0b3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbiBleHRlbmRzIFF1ZXN0aW9uQmFzZSBpbXBsZW1lbnRzIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICAgICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgaXNSZXF1aXJlZFZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBoYXNDb21tZW50VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc090aGVyVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPiA9IFtdO1xyXG4gICAgICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG4gICAgICAgIHZhbHVlQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgZXJyb3JzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuICh0aGlzLnRpdGxlVmFsdWUpID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZShuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRUaXRsZSgpIHsgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLnByb2Nlc3NUZXh0KHRoaXMudGl0bGUpIDogdGhpcy50aXRsZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc1JlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1JlcXVpcmVkVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGlzUmVxdWlyZWQodmFsOiBib29sZWFuKSB7IHRoaXMuaXNSZXF1aXJlZFZhbHVlID0gdmFsOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNDb21tZW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGhhc0NvbW1lbnQodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0Q29tbWVudCgpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaGFzQ29tbWVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNDb21tZW50KSB0aGlzLmhhc090aGVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzT3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc090aGVyVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGhhc090aGVyKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydE90aGVyKCkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5oYXNPdGhlclZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikgdGhpcy5oYXNDb21tZW50ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uU2V0RGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uU3VydmV5VmFsdWVDaGFuZ2VkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkgcmV0dXJuIHRoaXMuZGF0YS5nZXRWYWx1ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvblZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudmFsdWVDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbW1lbnQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLmdldENvbW1lbnQodGhpcy5uYW1lKSA6IFwiXCI7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmFsdWUgPT0gbnVsbDsgfVxyXG4gICAgICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JFcnJvcnMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcmVxdWlyZWRUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5yZXF1aXJlZFRleHQgOiBcIlwiOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZvckVycm9ycygpIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yTGVuZ3RoID0gdGhpcy5lcnJvcnMgPyB0aGlzLmVycm9ycy5sZW5ndGggOiAwO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hlY2tGb3JFcnJvcnModGhpcy5lcnJvcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMucnVuVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAmJiB0aGlzLmVycm9ycy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5kYXRhLnZhbGlkYXRlUXVlc3Rpb24odGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvckxlbmd0aCAhPSB0aGlzLmVycm9ycy5sZW5ndGggfHwgZXJyb3JMZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmVycm9yc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQW5zd2VyUmVxdWlyZWRFcnJvcigpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJ1bm5lcigpLnJ1bih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgJiYgdGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRWYWx1ZSh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7IH1cclxuICAgICAgICBwcml2YXRlIHNldE5ld0NvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRDb21tZW50KHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVF1ZXN0aW9uXHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lWYWxpZGF0b3JPd25lclxyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZyB7IHJldHVybiBudWxsOyB9XHJcbiAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJxdWVzdGlvblwiLCBbXCJ0aXRsZVwiLCBcImlzUmVxdWlyZWQ6Ym9vbGVhblwiLCBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiXSwgbnVsbCwgXCJxdWVzdGlvbmJhc2VcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicXVlc3Rpb25cIiwgXCJ0aXRsZVwiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcInF1ZXN0aW9uXCIsIFwidmFsaWRhdG9yc1wiLCBcInN1cnZleXZhbGlkYXRvclwiLCBcInZhbGlkYXRvclwiKTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VydmV5c3RyaW5ncy50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uU2VsZWN0QmFzZSBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBvdGhlckl0ZW06IEl0ZW1WYWx1ZSA9IG5ldyBJdGVtVmFsdWUoXCJvdGhlclwiLCBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKSk7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXNWYWx1ZXM6IEFycmF5PEl0ZW1WYWx1ZT4gPSBuZXcgQXJyYXk8SXRlbVZhbHVlPigpO1xyXG4gICAgICAgIHB1YmxpYyBvdGhlckVycm9yVGV4dDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBjaG9pY2VzT3JkZXJWYWx1ZTogc3RyaW5nID0gXCJub25lXCI7XHJcbiAgICAgICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWVzOyB9XHJcbiAgICAgICAgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjaG9pY2VzT3JkZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY2hvaWNlc09yZGVyVmFsdWU7IH1cclxuICAgICAgICBzZXQgY2hvaWNlc09yZGVyKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IHRoaXMuY2hvaWNlc09yZGVyVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgb3RoZXJUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm90aGVySXRlbS50ZXh0OyB9XHJcbiAgICAgICAgc2V0IG90aGVyVGV4dCh2YWx1ZTogc3RyaW5nKSB7IHRoaXMub3RoZXJJdGVtLnRleHQgPSB2YWx1ZTsgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlQ2hvaWNlcygpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc090aGVyICYmIHRoaXMuY2hvaWNlc09yZGVyID09IFwibm9uZVwiKSByZXR1cm4gdGhpcy5jaG9pY2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5zb3J0VmlzaWJsZUNob2ljZXModGhpcy5jaG9pY2VzLnNsaWNlKCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5vdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3RoZXJTZWxlY3RlZCB8fCB0aGlzLmNvbW1lbnQpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLm90aGVyRXJyb3JUZXh0O1xyXG4gICAgICAgICAgICBpZiAoIXRleHQpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJSZXF1aXJlZEVycm9yXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKG5ldyBDdXN0b21FcnJvcih0ZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNvcnRWaXNpYmxlQ2hvaWNlcyhhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICB2YXIgb3JkZXIgPSB0aGlzLmNob2ljZXNPcmRlci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJhc2NcIikgcmV0dXJuIHRoaXMuc29ydEFycmF5KGFycmF5LCAxKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwiZGVzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIC0xKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwicmFuZG9tXCIpIHJldHVybiB0aGlzLnJhbmRvbWl6ZUFycmF5KGFycmF5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzb3J0QXJyYXkoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4sIG11bHQ6IG51bWJlcik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGEudGV4dCA8IGIudGV4dCkgcmV0dXJuIC0xICogbXVsdDtcclxuICAgICAgICAgICAgICAgIGlmIChhLnRleHQgPiBiLnRleHQpIHJldHVybiAxICogbXVsdDtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmFuZG9taXplQXJyYXkoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICAgICAgICAgICAgICAgIGFycmF5W2pdID0gdGVtcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94QmFzZSBleHRlbmRzIFF1ZXN0aW9uU2VsZWN0QmFzZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgICAgIGNvbENvdW50Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sQ291bnRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNvbENvdW50VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNlbGVjdGJhc2VcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLCBcIiFjaG9pY2VzOml0ZW12YWx1ZXNcIiwgXCJjaG9pY2VzT3JkZXJcIiwgXCJvdGhlclRleHRcIiwgXCJvdGhlckVycm9yVGV4dFwiXSwgbnVsbCwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzZWxlY3RiYXNlXCIsIFwiY2hvaWNlc1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBJdGVtVmFsdWUuc2V0RGF0YShvYmouY2hvaWNlcywgdmFsdWUpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzZWxlY3RiYXNlXCIsIFwiY2hvaWNlc09yZGVyXCIsIG51bGwsIFwibm9uZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDaG9pY2VzKFwic2VsZWN0YmFzZVwiLCBcImNob2ljZXNPcmRlclwiLCBbXCJub25lXCIsIFwiYXNjXCIsIFwiZGVzY1wiLCBcInJhbmRvbVwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic2VsZWN0YmFzZVwiLCBcIm90aGVyVGV4dFwiLCBudWxsLCBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKSk7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94YmFzZVwiLCBbXCJjb2xDb3VudDpudW1iZXJcIl0sIG51bGwsIFwic2VsZWN0YmFzZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJjaGVja2JveGJhc2VcIiwgXCJjb2xDb3VudFwiLCBudWxsLCAxKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDaG9pY2VzKFwiY2hlY2tib3hiYXNlXCIsIFwiY29sQ291bnRcIiwgWzAsIDEsIDIsIDMsIDRdKTtcclxufVxyXG4iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc090aGVyU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5pbmRleE9mKHRoaXMub3RoZXJJdGVtLnZhbHVlKSA+PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2hlY2tib3hcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNoZWNrYm94TW9kZWwoXCJcIik7IH0sIFwiY2hlY2tib3hiYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjaGVja2JveFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkNoZWNrYm94TW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNvbW1lbnRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBwdWJsaWMgcm93czogbnVtYmVyID0gNDtcclxuICAgICAgICBwdWJsaWMgY29sczogbnVtYmVyID0gNTA7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY29tbWVudFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaXNFbXB0eSgpIHx8IHRoaXMudmFsdWUgPT0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY29tbWVudFwiLCBbXCJjb2xzOm51bWJlclwiLCBcInJvd3M6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwiY29tbWVudFwiLCBcImNvbHNcIiwgbnVsbCwgNTApO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcImNvbW1lbnRcIiwgXCJyb3dzXCIsIG51bGwsIDQpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjb21tZW50XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50TW9kZWwobmFtZSk7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fc2VsZWN0YmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRHJvcGRvd25Nb2RlbCBleHRlbmRzIFF1ZXN0aW9uU2VsZWN0QmFzZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBvcHRpb25zQ2FwdGlvblZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvcHRpb25zQ2FwdGlvbigpIHsgcmV0dXJuICh0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUpID8gdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wdGlvbnNDYXB0aW9uXCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBvcHRpb25zQ2FwdGlvbihuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZHJvcGRvd25cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiZHJvcGRvd25cIiwgW1wib3B0aW9uc0NhcHRpb25cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwoXCJcIik7IH0sIFwic2VsZWN0YmFzZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJkcm9wZG93blwiLCBcIm9wdGlvbnNDYXB0aW9uXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoub3B0aW9uc0NhcHRpb25WYWx1ZTsgfSk7XHJcblxyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25IdG1sTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgaHRtbFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiaHRtbFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGh0bWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaHRtbFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBodG1sKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5odG1sVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRIdG1sKCkgeyByZXR1cm4gdGhpcy5kYXRhID8gdGhpcy5kYXRhLnByb2Nlc3NIdG1sKHRoaXMuaHRtbCkgOiB0aGlzLmh0bWw7IH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJodG1sXCIsIFtcImh0bWw6aHRtbFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uYmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiaHRtbFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElNYXRyaXhEYXRhIHtcclxuICAgICAgICBvbk1hdHJpeFJvd0NoYW5nZWQocm93OiBNYXRyaXhSb3dNb2RlbCk7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4Um93TW9kZWwgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGRhdGE6IElNYXRyaXhEYXRhO1xyXG4gICAgICAgIHByb3RlY3RlZCByb3dWYWx1ZTogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZywgZGF0YTogSU1hdHJpeERhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5yb3dWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHRoaXMuZGF0YS5vbk1hdHJpeFJvd0NoYW5nZWQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeE1vZGVsIGV4dGVuZHMgUXVlc3Rpb24gaW1wbGVtZW50cyBJTWF0cml4RGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb2x1bW5zVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSByb3dzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSBpc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBnZW5lcmF0ZWRWaXNpYmxlUm93czogQXJyYXk8TWF0cml4Um93TW9kZWw+O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm1hdHJpeFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1Jvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvd3NWYWx1ZS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY29sdW1ucygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY29sdW1uc1ZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGNvbHVtbnMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jb2x1bW5zVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHJvd3MoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJvd3NWYWx1ZTsgfVxyXG4gICAgICAgIHNldCByb3dzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucm93c1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeFJvd01vZGVsPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4Um93TW9kZWw+KCk7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucm93c1tpXS52YWx1ZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyh0aGlzLnJvd3NbaV0udmFsdWUsIHRoaXMucm93c1tpXS50ZXh0LCB0aGlzLm5hbWUgKyAnXycgKyB0aGlzLnJvd3NbaV0udmFsdWUudG9TdHJpbmcoKSwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3cobnVsbCwgXCJcIiwgdGhpcy5uYW1lLCB2YWwpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCBmdWxsTmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4Um93TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeFJvd01vZGVsKG5hbWUsIHRleHQsIGZ1bGxOYW1lLCB0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZyB8fCAhKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHx8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucm93cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1swXS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dWYWwgPSB2YWxbcm93Lm5hbWVdID8gdmFsW3Jvdy5uYW1lXSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS52YWx1ZSA9IHJvd1ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JTWF0cml4RGF0YVxyXG4gICAgICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvd01vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUm93Q2hhbmdpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUocm93LnZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlW3Jvdy5uYW1lXSA9IHJvdy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeFwiLCBbXCJjb2x1bW5zOml0ZW12YWx1ZXNcIiwgXCJyb3dzOml0ZW12YWx1ZXNcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeFwiLCBcImNvbHVtbnNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jb2x1bW5zKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNvbHVtbnMgPSB2YWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4XCIsIFwicm93c1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucm93cyA9IHZhbHVlOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4TW9kZWwobmFtZSk7IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuY29sdW1ucyA9IFtcIkNvbHVtbiAxXCIsIFwiQ29sdW1uIDJcIiwgXCJDb2x1bW4gM1wiXTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERyb3Bkb3duRGF0YSB7XHJcbiAgICAgICAgb25DZWxsQ2hhbmdlZChjZWxsOiBNYXRyaXhEcm9wZG93bkNlbGxNb2RlbCk7XHJcbiAgICAgICAgY29sdW1uczogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+O1xyXG4gICAgICAgIGNob2ljZXM6IEFycmF5PGFueT47XHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IHN0cmluZztcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93bkNvbHVtbiBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBvcHRpb25zQ2FwdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCkgeyByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25DZWxsTW9kZWwge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YVxyXG4gICAgICAgIHByaXZhdGUgY2VsbFZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHB1YmxpYyByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWwsIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jb2x1bW4uY2hvaWNlcyAmJiB0aGlzLmNvbHVtbi5jaG9pY2VzLmxlbmd0aCA+IDAgPyB0aGlzLmNvbHVtbi5jaG9pY2VzIDogdGhpcy5kYXRhLmNob2ljZXM7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbHVtbi5vcHRpb25zQ2FwdGlvbiA/IHRoaXMuY29sdW1uLm9wdGlvbnNDYXB0aW9uIDogdGhpcy5kYXRhLm9wdGlvbnNDYXB0aW9uOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5jZWxsVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLm9uQ2VsbENoYW5nZWQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93blJvd01vZGVsICB7XHJcbiAgICAgICAgcHJvdGVjdGVkIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGE7XHJcbiAgICAgICAgcHJvdGVjdGVkIHJvd1ZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGNlbGxzOiBBcnJheTxNYXRyaXhEcm9wZG93bkNlbGxNb2RlbD4gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRDZWxscygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5yb3dWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXS52YWx1ZSA9IHRoaXMuZ2V0Q2VsbFZhbHVlKHRoaXMuY2VsbHNbaV0uY29sdW1uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGJ1aWxkQ2VsbHMoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5zID0gdGhpcy5kYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbHVtbiA9IGNvbHVtbnNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2godGhpcy5jcmVhdGVDZWxsKGNvbHVtbiwgdGhpcy5nZXRDZWxsVmFsdWUoY29sdW1uKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHZhbHVlOiBhbnkpOiBNYXRyaXhEcm9wZG93bkNlbGxNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25DZWxsTW9kZWwoY29sdW1uLCB0aGlzLCB0aGlzLmRhdGEsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldENlbGxWYWx1ZShjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvd1ZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93VmFsdWVbY29sdW1uLm5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY29sdW1uc1ZhbHVlOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGdlbmVyYXRlZFZpc2libGVSb3dzOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2x1bW5zKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPiB7IHJldHVybiB0aGlzLmNvbHVtbnNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29sdW1ucyh2YWx1ZTogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+KSB7IHRoaXMuY29sdW1uc1ZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJvd3MoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJvd3NWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgcm93cyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJvd3NWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY2hvaWNlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCkgeyByZXR1cm4gKHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSkgPyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3B0aW9uc0NhcHRpb25cIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9wdGlvbnNDYXB0aW9uKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgYWRkQ29sdW1uKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpOiBNYXRyaXhEcm9wZG93bkNvbHVtbiB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSBuZXcgTWF0cml4RHJvcGRvd25Db2x1bW4obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbnNWYWx1ZS5wdXNoKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWw+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPigpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm93cyB8fCB0aGlzLnJvd3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3NbaV0udmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5yb3dzW2ldLnZhbHVlLCB0aGlzLnJvd3NbaV0udGV4dCwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25Sb3dNb2RlbChuYW1lLCB0ZXh0LCB0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZyB8fCAhKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHx8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByb3dWYWwgPSB2YWxbcm93Lm5hbWVdID8gdmFsW3Jvdy5uYW1lXSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLnZhbHVlID0gcm93VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9JTWF0cml4RHJvcGRvd25EYXRhXHJcbiAgICAgICAgb25DZWxsQ2hhbmdlZChjZWxsOiBNYXRyaXhEcm9wZG93bkNlbGxNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByb3dWYWx1ZSA9IG5ld1ZhbHVlW2NlbGwucm93Lm5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXJvd1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByb3dWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWVbY2VsbC5yb3cubmFtZV0gPSByb3dWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY2VsbC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcm93VmFsdWVbY2VsbC5jb2x1bW4ubmFtZV0gPSBjZWxsLnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHJvd1ZhbHVlW2NlbGwuY29sdW1uLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJvd1ZhbHVlKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBuZXdWYWx1ZVtjZWxsLnJvdy5uYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobmV3VmFsdWUpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiLCBbXCJuYW1lXCIsIFwidGl0bGVcIiwgXCJjaG9pY2VzOml0ZW12YWx1ZXNcIiwgXCJvcHRpb25zQ2FwdGlvblwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKFwiXCIpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiLCBcInRpdGxlXCIsIG51bGwsIG51bGwsIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIsIFwiY2hvaWNlc1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmouY2hvaWNlcyA9IHZhbHVlOyB9KTtcclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHJvcGRvd25cIiwgW1wiY29sdW1uczptYXRyaXhkcm9wZG93bmNvbHVtbnNcIiwgXCJyb3dzOml0ZW12YWx1ZXNcIiwgXCJjaG9pY2VzOml0ZW12YWx1ZXNcIiwgXCJvcHRpb25zQ2FwdGlvblwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtYXRyaXhkcm9wZG93blwiLCBcImNvbHVtbnNcIiwgXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtYXRyaXhkcm9wZG93blwiLCBcImNob2ljZXNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXMgPSB2YWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4ZHJvcGRvd25cIiwgXCJyb3dzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucm93cyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yb3dzID0gdmFsdWU7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeGRyb3Bkb3duXCIsIFwib3B0aW9uc0NhcHRpb25cIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5vcHRpb25zQ2FwdGlvblZhbHVlOyB9KTtcclxuXHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeGRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gWzEsIDIsIDMsIDQsIDVdOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmFkZENvbHVtbihcIkNvbHVtbiAxXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAyXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAzXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU11bHRpcGxlVGV4dERhdGE7XHJcbiAgICAgICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnkgPSBudWxsLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dGl0ZW1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VGV4dDogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IG5ld1RleHQ7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhID8gdGhpcy5kYXRhLmdldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb25WYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lWYWxpZGF0b3JPd25lclxyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRpdGxlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNdWx0aXBsZVRleHREYXRhIHtcclxuICAgICAgICBwcml2YXRlIGNvbENvdW50VmFsdWU6IG51bWJlciA9IDE7XHJcbiAgICAgICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHVibGljIGl0ZW1TaXplOiBudW1iZXIgPSAyNTtcclxuICAgICAgICBwcml2YXRlIGl0ZW1zVmFsdWVzOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+ID0gbmV3IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4oKTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmKTtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuZmlyZUNhbGxiYWNrKHNlbGYuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibXVsdGlwbGV0ZXh0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXRlbXMoKTogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPiB7IHJldHVybiB0aGlzLml0ZW1zVmFsdWVzOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBpdGVtcyh2YWx1ZTogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPikge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zVmFsdWVzID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgQWRkSXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmNyZWF0ZVRleHRJdGVtKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDEgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbENvdW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJvd3MoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgICAgIHZhciBjb2xDb3VudCA9IHRoaXMuY29sQ291bnQ7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMuaXRlbXM7XHJcbiAgICAgICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXS5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gY29sQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBzdXBlci5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uSXRlbVZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtTW9kZWwobmFtZSwgdGl0bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICYmICh0aGlzLml0ZW1zW2ldLm5hbWUgaW4gdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSB0aGlzLnZhbHVlW3RoaXMuaXRlbXNbaV0ubmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zW2ldLm9uVmFsdWVDaGFuZ2VkKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBzdXBlci5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAvL0lNdWx0aXBsZVRleHREYXRhXHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRpdGVtXCIsIFtcIm5hbWVcIiwgXCJ0aXRsZVwiLCBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbChcIlwiKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBcInZhbGlkYXRvcnNcIiwgXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgXCJ2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBcInRpdGxlXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSk7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dFwiLCBbXCIhaXRlbXM6dGV4dGl0ZW1zXCIsIFwiaXRlbVNpemU6bnVtYmVyXCIsIFwiY29sQ291bnQ6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtdWx0aXBsZXRleHRcIiwgXCJpdGVtc1wiLCBcIm11bHRpcGxldGV4dGl0ZW1cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibXVsdGlwbGV0ZXh0XCIsIFwiaXRlbVNpemVcIiwgbnVsbCwgMjUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm11bHRpcGxldGV4dFwiLCBcImNvbENvdW50XCIsIG51bGwsIDEpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJtdWx0aXBsZXRleHRcIiwgXCJjb2xDb3VudFwiLCBbMSwgMiwgMywgNF0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtdWx0aXBsZXRleHRcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChuYW1lKTsgcS5BZGRJdGVtKFwidGV4dDFcIik7IHEuQWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYWRpb2dyb3VwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhZGlvZ3JvdXBcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7fSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmF0aW5nTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRSYXRlVmFsdWVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgcmF0ZXM6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHVibGljIG1pbmludW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG1heGltdW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgIHJhdGVWYWx1ZXNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCByYXRlVmFsdWVzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5yYXRlczsgfVxyXG4gICAgICAgIHNldCByYXRlVmFsdWVzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucmF0ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yYXRlVmFsdWVzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVSYXRlVmFsdWVzKCk6IEl0ZW1WYWx1ZVtdIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmF0ZVZhbHVlcy5sZW5ndGggPiAwKSByZXR1cm4gdGhpcy5yYXRlVmFsdWVzO1xyXG4gICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25SYXRpbmdNb2RlbC5kZWZhdWx0UmF0ZVZhbHVlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmF0aW5nXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH0gXHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIH1cclxuICAgIEl0ZW1WYWx1ZS5zZXREYXRhKFF1ZXN0aW9uUmF0aW5nTW9kZWwuZGVmYXVsdFJhdGVWYWx1ZXMsIFsxLCAyLCAzLCA0LCA1XSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmF0aW5nXCIsIFtcImhhc0NvbW1lbnQ6Ym9vbGVhblwiLCBcInJhdGVWYWx1ZXM6aXRlbXZhbHVlc1wiLCBcIm1pbmludW1SYXRlRGVzY3JpcHRpb25cIiwgXCJtYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmdNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJyYXRpbmdcIiwgXCJyYXRlVmFsdWVzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucmF0ZVZhbHVlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yYXRlVmFsdWVzID0gdmFsdWU7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZ01vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25UZXh0TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHVibGljIHNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHRcIiwgW1wic2l6ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJ0ZXh0XCIsIFwic2l6ZVwiLCBudWxsLCAyNSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInRleHRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHRNb2RlbChuYW1lKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgVHJpZ2dlciBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICAgICAgc3RhdGljIGdldCBvcGVyYXRvcnMoKSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlICE9IG51bGwpIHJldHVybiBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgICAgICBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gISghdmFsdWUpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlICE9IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBjb250YWluczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtcImluZGV4T2ZcIl0gJiYgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA+IC0xOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlIHx8ICF2YWx1ZVtcImluZGV4T2ZcIl0gfHwgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPiBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPD0gZXhwZWN0ZWRWYWx1ZTsgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFUcmlnZ2VyLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGVjayh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25GYWlsdXJlKCkgeyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtdO1xyXG4gICAgICAgIGRvQ29tcGxldGUoKTtcclxuICAgICAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlciBleHRlbmRzIFRyaWdnZXIge1xyXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHJvdGVjdGVkIG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldE93bmVyKG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc09uTmV4dFBhZ2UoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSBleHRlbmRzIFN1cnZleVRyaWdnZXIge1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ2aXNpYmxldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1TdWNjZXNzKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgICAgICBwcml2YXRlIG9uVHJpZ2dlcihmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3duZXIpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm93bmVyLmdldE9iamVjdHModGhpcy5wYWdlcywgdGhpcy5xdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMob2JqZWN0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbVN1Y2Nlc3MoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtRmFpbHVyZShpdGVtOiBhbnkpIHsgaXRlbS52aXNpYmxlID0gZmFsc2U7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiY29tcGxldGV0cmlnZ2VyXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzT25OZXh0UGFnZSgpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TdWNjZXNzKCkgeyBpZiAodGhpcy5vd25lcikgdGhpcy5vd25lci5kb0NvbXBsZXRlKCk7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBwdWJsaWMgc2V0VG9OYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHNldFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGlzVmFyaWFibGU6IGJvb2xlYW47XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInNldHZhbHVldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNldFRvTmFtZSB8fCAhdGhpcy5vd25lcikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLnNldFRyaWdnZXJWYWx1ZSh0aGlzLnNldFRvTmFtZSwgdGhpcy5zZXRWYWx1ZSwgdGhpcy5pc1ZhcmlhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRyaWdnZXJcIiwgW1wib3BlcmF0b3JcIiwgXCIhdmFsdWVcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIl0sIG51bGwsIFwidHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ2aXNpYmxldHJpZ2dlclwiLCBbXCJwYWdlc1wiLCBcInF1ZXN0aW9uc1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFN1cnZleVRyaWdnZXJWaXNpYmxlKCk7IH0sIFwic3VydmV5dHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21wbGV0ZXRyaWdnZXJcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNldHZhbHVldHJpZ2dlclwiLCBbXCIhc2V0VG9OYW1lXCIsIFwic2V0VmFsdWVcIiwgXCJpc1ZhcmlhYmxlOmJvb2xlYW5cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG59IiwibW9kdWxlIFN1cnZleSB7XHJcbiAgICBjbGFzcyBUZXh0UHJlUHJvY2Vzc29ySXRlbSB7XHJcbiAgICAgICAgcHVibGljIHN0YXJ0OiBudW1iZXI7XHJcbiAgICAgICAgcHVibGljIGVuZDogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRQcmVQcm9jZXNzb3Ige1xyXG4gICAgICAgIHB1YmxpYyBvblByb2Nlc3M6IChuYW1lOiBzdHJpbmcpID0+IGFueTtcclxuICAgICAgICBwdWJsaWMgb25IYXNWYWx1ZTogKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbjtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBwcm9jZXNzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghdGV4dCkgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vblByb2Nlc3MpIHJldHVybiB0ZXh0O1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmdldEl0ZW1zKHRleHQpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0TmFtZSh0ZXh0LnN1YnN0cmluZyhpdGVtLnN0YXJ0ICsgMSwgaXRlbS5lbmQpKTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYW5Qcm9jZXNzTmFtZShuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbkhhc1ZhbHVlICYmICF0aGlzLm9uSGFzVmFsdWUobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5vblByb2Nlc3MobmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKDAsIGl0ZW0uc3RhcnQpICsgdmFsdWUgKyB0ZXh0LnN1YnN0cihpdGVtLmVuZCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEl0ZW1zKHRleHQ6IHN0cmluZyk6IEFycmF5PFRleHRQcmVQcm9jZXNzb3JJdGVtPiB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBzdGFydCA9IC0xO1xyXG4gICAgICAgICAgICB2YXIgY2ggPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2ggPSB0ZXh0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoID09ICd7Jykgc3RhcnQgPSBpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoID09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IFRleHRQcmVQcm9jZXNzb3JJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhcnQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXROYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2FuUHJvY2Vzc05hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaCA9IG5hbWVbaV07XHJcbiAgICAgICAgICAgICAgICAvL1RPRE9cclxuICAgICAgICAgICAgICAgIGlmIChjaCA9PSAnICcgfHwgY2ggPT0gJy0nIHx8IGNoID09ICcmJykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInBhZ2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidHJpZ2dlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImR4U3VydmV5U2VydmljZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZXh0UHJlUHJvY2Vzc29yLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElTdXJ2ZXksIElTdXJ2ZXlUcmlnZ2VyT3duZXIge1xyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY29va2llTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdE9uUGFnZU5leHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIGNvbW1lbnRQcmVmaXg6IHN0cmluZyA9IFwiLUNvbW1lbnRcIjtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dOYXZpZ2F0aW9uQnV0dG9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dUaXRsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dQYWdlVGl0bGVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgY29tcGxldGVkSHRtbDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgcmVxdWlyZWRUZXh0OiBzdHJpbmcgPSBcIiogXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dQcm9ncmVzc0Jhcjogc3RyaW5nID0gXCJvZmZcIjtcclxuICAgICAgICBwdWJsaWMgcGFnZXM6IEFycmF5PFBhZ2VNb2RlbD4gPSBuZXcgQXJyYXk8UGFnZU1vZGVsPigpO1xyXG4gICAgICAgIHB1YmxpYyB0cmlnZ2VyczogQXJyYXk8U3VydmV5VHJpZ2dlcj4gPSBuZXcgQXJyYXk8U3VydmV5VHJpZ2dlcj4oKTtcclxuICAgICAgICBwcml2YXRlIGN1cnJlbnRQYWdlVmFsdWU6IFBhZ2VNb2RlbCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZXNIYXNoOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgdmFyaWFibGVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHBhZ2VQcmV2VGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBwYWdlTmV4dFRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgY29tcGxldGVUZXh0VmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHNob3dQYWdlTnVtYmVyc1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93UXVlc3Rpb25OdW1iZXJzVmFsdWU6IHN0cmluZyA9IFwib25cIjtcclxuICAgICAgICBwcml2YXRlIGxvY2FsZVZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHByaXZhdGUgaXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgcHJvY2Vzc2VkVGV4dFZhbHVlczogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNvbXBsZXRlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25DdXJyZW50UGFnZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblBhZ2VWaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblF1ZXN0aW9uQWRkZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25RdWVzdGlvblJlbW92ZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWxpZGF0ZVF1ZXN0aW9uOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUHJvY2Vzc0h0bWw6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25TZW5kUmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uR2V0UmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIGpzb25FcnJvcnM6IEFycmF5PEpzb25FcnJvcj4gPSBudWxsO1xyXG5cclxuICAgICAgICBwdWJsaWMgbW9kZTogc3RyaW5nID0gXCJub3JtYWxcIjtcclxuXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3IgPSBuZXcgVGV4dFByZVByb2Nlc3NvcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25IYXNWYWx1ZSA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25Qcm9jZXNzID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5nZXRQcm9jZXNzZWRUZXh0VmFsdWUobmFtZSk7IH07XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuZGF0YSA9IHNlbGY7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0T3duZXIoc2VsZik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvY2Vzc2VkVGV4dFZhbHVlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlQ3JlYXRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGpzb25PYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SnNvbk9iamVjdChqc29uT2JqKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU3VydmV5RnJvbVNlcnZpY2UodGhpcy5zdXJ2ZXlJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInN1cnZleVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBsb2NhbGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jYWxlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGxvY2FsZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9jYWxlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgc3VydmV5TG9jYWxpemF0aW9uLmN1cnJlbnRMb2NhbGUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldExvY1N0cmluZyhzdHI6IHN0cmluZykgeyByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhzdHIpOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBlbXB0eVN1cnZleVRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0TG9jU3RyaW5nKFwiZW1wdHlTdXJ2ZXlcIik7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHBhZ2VQcmV2VGV4dCgpIHsgcmV0dXJuICh0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlKSA/IHRoaXMucGFnZVByZXZUZXh0VmFsdWUgOiB0aGlzLmdldExvY1N0cmluZyhcInBhZ2VQcmV2VGV4dFwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgcGFnZVByZXZUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5wYWdlUHJldlRleHRWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBwYWdlTmV4dFRleHQoKSB7IHJldHVybiAodGhpcy5wYWdlTmV4dFRleHRWYWx1ZSkgPyB0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlIDogdGhpcy5nZXRMb2NTdHJpbmcoXCJwYWdlTmV4dFRleHRcIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHBhZ2VOZXh0VGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMucGFnZU5leHRUZXh0VmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tcGxldGVUZXh0KCkgeyByZXR1cm4gKHRoaXMuY29tcGxldGVUZXh0VmFsdWUpID8gdGhpcy5jb21wbGV0ZVRleHRWYWx1ZSA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwiY29tcGxldGVUZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb21wbGV0ZVRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLmNvbXBsZXRlVGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNob3dQYWdlTnVtYmVycygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHNob3dQYWdlTnVtYmVycyh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuc2hvd1BhZ2VOdW1iZXJzKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNob3dRdWVzdGlvbk51bWJlcnMoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOyB9O1xyXG4gICAgICAgIHB1YmxpYyBzZXQgc2hvd1F1ZXN0aW9uTnVtYmVycyh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHB1YmxpYyBnZXQgZGF0YSgpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnZhbHVlc0hhc2gpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCBkYXRhKGRhdGE6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2ggPSB7fTtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW2tleV0gPSBkYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKGtleSwgZGF0YVtrZXldLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbW1lbnRzKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKHRoaXMuY29tbWVudFByZWZpeCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLnZhbHVlc0hhc2hba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZVBhZ2VzKCk6IEFycmF5PFBhZ2VNb2RlbD4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiB0aGlzLnBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5pc1Zpc2libGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBhZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFnZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjdXJyZW50UGFnZSgpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9PSBudWxsICYmIHZQYWdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZQYWdlcy5pbmRleE9mKHZhbHVlKSA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLmN1cnJlbnRQYWdlVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdGF0ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRpbmcpIHJldHVybiBcImxvYWRpbmdcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wbGV0ZWQpIHJldHVybiBcImNvbXBsZXRlZFwiO1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudFBhZ2UpID8gXCJydW5uaW5nXCIgOiBcImVtcHR5XCJcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc0hhc2ggPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlUGFnZUNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMudmlzaWJsZVBhZ2VzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBtZXJnZVZhbHVlcyhzcmM6IGFueSwgZGVzdDogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghZGVzdCB8fCAhc3JjKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNyY1trZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRlc3Rba2V5XSkgZGVzdFtrZXldID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXJnZVZhbHVlcyh2YWx1ZSwgZGVzdFtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGN1cnJlbnRQYWdlQ2hhbmdlZChuZXdWYWx1ZTogUGFnZU1vZGVsLCBvbGRWYWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DdXJyZW50UGFnZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRDdXJyZW50UGFnZSc6IG9sZFZhbHVlLCAnbmV3Q3VycmVudFBhZ2UnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFByb2dyZXNzKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiAwO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoaW5kZXggKiAxMDAgLyB0aGlzLnZpc2libGVQYWdlQ291bnQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0Rlc2lnbk1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT0gXCJkZXNpZ25lclwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNDb29raWUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llO1xyXG4gICAgICAgICAgICByZXR1cm4gY29va2llcyAmJiBjb29raWVzLmluZGV4T2YodGhpcy5jb29raWVOYW1lICsgXCI9dHJ1ZVwiKSA+IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0Q29va2llKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29va2llTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSB0aGlzLmNvb2tpZU5hbWUgKyBcIj10cnVlOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMDowOjAgR01UXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkZWxldGVDb29raWUoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPTtcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG5leHRQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xhc3RQYWdlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja09uUGFnZVRyaWdnZXJzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbmRSZXN1bHRPblBhZ2VOZXh0ICYmIHRoaXMuY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCh0aGlzLnN1cnZleVBvc3RJZCwgdGhpcy5jbGllbnRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCArIDFdO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlzQ3VycmVudFBhZ2VIYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZS5oYXNFcnJvcnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHByZXZQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0ZpcnN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjb21wbGV0ZUxhc3RQYWdlKCkgOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzTGFzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHJldHVybiB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSB2UGFnZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRvQ29tcGxldGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29va2llKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29tcGxldGVkKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZS5maXJlKHRoaXMsIG51bGwpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRDb21wbGV0ZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZENvbXBsZXRlZEh0bWwoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkSHRtbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0h0bWwodGhpcy5jb21wbGV0ZWRIdG1sKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXCI8aDM+XCIgKyB0aGlzLmdldExvY1N0cmluZyhcImNvbXBsZXRpbmdTdXJ2ZXlcIikgKyBcIjwvaDM+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkTG9hZGluZ0h0bWwoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiPGgzPlwiICsgdGhpcy5nZXRMb2NTdHJpbmcoXCJsb2FkaW5nU3VydmV5XCIpICsgXCI8L2gzPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2dyZXNzVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSArIDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldExvY1N0cmluZyhcInByb2dyZXNzVGV4dFwiKVtcImZvcm1hdFwiXShpbmRleCwgdlBhZ2VzLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFBhZ2UoaW5kZXg6IG51bWJlcik6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW2luZGV4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkUGFnZShwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmNyZWF0ZU5ld1BhZ2UobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbW92ZVBhZ2UocGFnZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucGFnZXMuaW5kZXhPZihwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoID4gMCA/IHRoaXMucGFnZXNbMF0gOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uQnlOYW1lKG5hbWU6IHN0cmluZywgY2FzZUluc2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2UpOiBJUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTmFtZSA9IHF1ZXN0aW9uc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkgcXVlc3Rpb25OYW1lID0gcXVlc3Rpb25OYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihxdWVzdGlvbk5hbWUgPT0gbmFtZSkgcmV0dXJuIHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdLCBjYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IElRdWVzdGlvbltdIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lc1tpXSwgY2FzZUluc2Vuc2l0aXZlKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbikgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbjogSVF1ZXN0aW9uKTogUGFnZU1vZGVsIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKDxRdWVzdGlvbkJhc2U+cXVlc3Rpb24pID4gLTEpIHJldHVybiBwYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZUJ5TmFtZShuYW1lOiBzdHJpbmcpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFBhZ2VzQnlOYW1lcyhuYW1lczogc3RyaW5nW10pOiBQYWdlTW9kZWxbXXtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldFBhZ2VCeU5hbWUobmFtZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UpIHJlc3VsdC5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRBbGxRdWVzdGlvbnModmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PElRdWVzdGlvbj4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PElRdWVzdGlvbj4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0uYWRkUXVlc3Rpb25zVG9MaXN0KHJlc3VsdCwgdmlzaWJsZU9ubHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVOZXdQYWdlKG5hbWU6IHN0cmluZykgeyByZXR1cm4gbmV3IFBhZ2VNb2RlbChuYW1lKTsgfVxyXG4gICAgICAgIHByaXZhdGUgbm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0ubmFtZSAhPSBuYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uID0gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbiwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICduYW1lJzogbmFtZSwgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICd2YWx1ZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbnNbaV0sIHRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZG9TdXJ2ZXlWYWx1ZUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5vblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tPblBhZ2VUcmlnZ2VycygpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBwYWdlLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICghcXVlc3Rpb24udmlzaWJsZSB8fCAhcXVlc3Rpb24ubmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKHF1ZXN0aW9uLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKHF1ZXN0aW9uLm5hbWUsIHZhbHVlLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrVHJpZ2dlcnMobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBpc09uTmV4dFBhZ2U6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMudHJpZ2dlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gdGhpcy50cmlnZ2Vyc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyLm5hbWUgPT0gbmFtZSAmJiB0cmlnZ2VyLmlzT25OZXh0UGFnZSA9PSBpc09uTmV4dFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyLmNoZWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZyA9IG51bGwsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoIXBvc3RJZCAmJiB0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgcG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwb3N0SWQpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGNsaWVudElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuc2VuZFJlc3VsdChwb3N0SWQsIHRoaXMuZGF0YSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25TZW5kUmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCByZXNwb25zZTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuZ2V0UmVzdWx0KHJlc3VsdElkLCBuYW1lLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogYW55W10sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25HZXRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGE6IGRhdGEsIGRhdGFMaXN0OiBkYXRhTGlzdCwgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5SWQgPSBzdXJ2ZXlJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5vbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkubG9hZFN1cnZleSh0aGlzLnN1cnZleUlkLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAmJiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldEpzb25PYmplY3QocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkxvYWRTdXJ2ZXlGcm9tU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVmlzaWJsZUluZGV4ZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHRoaXMuc2hvd1BhZ2VOdW1iZXJzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uUGFnZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlzUGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzUGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXModmlzUGFnZXNbaV0ucXVlc3Rpb25zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSksIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0udmlzaWJsZUluZGV4ID0gdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gKGluZGV4KyspIDogLTE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLm51bSA9IHNob3dJbmRleCAmJiB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyB0aGlzLnBhZ2VzW2ldLnZpc2libGVJbmRleCArIDEgOiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXMocXVlc3Rpb25zOiBJUXVlc3Rpb25bXSwgc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbnNbaV0uc2V0VmlzaWJsZUluZGV4KHNob3dJbmRleCAmJiBxdWVzdGlvbnNbaV0udmlzaWJsZSAmJiBxdWVzdGlvbnNbaV0uaGFzVGl0bGUgPyAoaW5kZXgrKykgOiAtMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZXRKc29uT2JqZWN0KGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5qc29uRXJyb3JzID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGpzb25Db252ZXJ0ZXIgPSBuZXcgSnNvbk9iamVjdCgpO1xyXG4gICAgICAgICAgICBqc29uQ29udmVydGVyLnRvT2JqZWN0KGpzb25PYmosIHRoaXMpO1xyXG4gICAgICAgICAgICBpZiAoanNvbkNvbnZlcnRlci5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qc29uRXJyb3JzID0ganNvbkNvbnZlcnRlci5lcnJvcnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0Nvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25CZWZvcmVDcmVhdGluZygpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbXCJwYWdlbm9cIl0gPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gc2VsZi5jdXJyZW50UGFnZSAhPSBudWxsID8gc2VsZi52aXNpYmxlUGFnZXMuaW5kZXhPZihzZWxmLmN1cnJlbnRQYWdlKSArIDEgOiAwOyB9XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tcInBhZ2Vjb3VudFwiXSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBzZWxmLnZpc2libGVQYWdlQ291bnQ7IH1cclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1txdWVzdGlvbi5uYW1lLnRvTG93ZXJDYXNlKCldID0gXCJxdWVzdGlvblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAodmFsID09IFwicXVlc3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBxdWVzdGlvbiAhPSBudWxsID8gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbCA9PSBcInZhbHVlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhbHVlKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gXCJ2YXJpYWJsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRWYXJpYWJsZShuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VmFyaWFibGUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFZhcmlhYmxlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YXJpYWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lTdXJ2ZXkgZGF0YVxyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YWx1ZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhuYW1lLCBuZXdWYWx1ZSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmRhdGFbbmFtZSArIHRoaXMuY29tbWVudFByZWZpeF07XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXg7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYWdlVmlzaWJpbGl0eUNoYW5nZWQocGFnZTogSVBhZ2UsIG5ld1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblBhZ2VWaXNpYmxlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ3BhZ2UnOiBwYWdlLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXN0aW9uQWRkZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICdpbmRleCc6IGluZGV4IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25RdWVzdGlvblJlbW92ZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWxpZGF0ZVF1ZXN0aW9uLmlzRW1wdHkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHsgbmFtZTogbmFtZSwgdmFsdWU6IHRoaXMuZ2V0VmFsdWUobmFtZSksIGVycm9yOiBudWxsIH07XHJcbiAgICAgICAgICAgIHRoaXMub25WYWxpZGF0ZVF1ZXN0aW9uLmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmVycm9yID8gbmV3IEN1c3RvbUVycm9yKG9wdGlvbnMuZXJyb3IpIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvY2Vzc0h0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7IGh0bWw6IGh0bWwgfTtcclxuICAgICAgICAgICAgdGhpcy5vblByb2Nlc3NIdG1sLmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NUZXh0KG9wdGlvbnMuaHRtbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2Nlc3NUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHRQcmVQcm9jZXNzb3IucHJvY2Vzcyh0ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JU3VydmV5VHJpZ2dlck93bmVyXHJcbiAgICAgICAgZ2V0T2JqZWN0cyhwYWdlczogc3RyaW5nW10sIHF1ZXN0aW9uczogc3RyaW5nW10pOiBhbnlbXXtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UGFnZXNCeU5hbWVzKHBhZ2VzKSk7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdCwgdGhpcy5nZXRRdWVzdGlvbnNCeU5hbWVzKHF1ZXN0aW9ucykpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoaXNWYXJpYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYXJpYWJsZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlKG5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5XCIsIFtcImxvY2FsZVwiLCBcInRpdGxlXCIsIFwiY29tcGxldGVkSHRtbDpodG1sXCIsIFwicGFnZXNcIiwgXCJxdWVzdGlvbnNcIiwgXCJ0cmlnZ2Vyczp0cmlnZ2Vyc1wiLCBcInN1cnZleUlkXCIsIFwic3VydmV5UG9zdElkXCIsIFwiY29va2llTmFtZVwiLCBcInNlbmRSZXN1bHRPblBhZ2VOZXh0OmJvb2xlYW5cIixcclxuICAgICAgICBcInNob3dOYXZpZ2F0aW9uQnV0dG9uczpib29sZWFuXCIsIFwic2hvd1RpdGxlOmJvb2xlYW5cIiwgXCJzaG93UGFnZVRpdGxlczpib29sZWFuXCIsIFwic2hvd1BhZ2VOdW1iZXJzOmJvb2xlYW5cIiwgXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIFwic2hvd1Byb2dyZXNzQmFyXCIsXHJcbiAgICAgICAgXCJyZXF1aXJlZFRleHRcIiwgXCJwYWdlUHJldlRleHRcIiwgXCJwYWdlTmV4dFRleHRcIiwgXCJjb21wbGV0ZVRleHRcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInBhZ2VzXCIsIFwicGFnZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJxdWVzdGlvbnNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBudWxsOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmosIHZhbHVlLCBqc29uQ29udmVydGVyKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gb2JqLmFkZE5ld1BhZ2UoXCJcIik7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoeyBxdWVzdGlvbnM6IHZhbHVlIH0sIHBhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInNob3dOYXZpZ2F0aW9uQnV0dG9uc1wiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJzaG93VGl0bGVcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1BhZ2VUaXRsZXNcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBudWxsLCBcIm9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJzdXJ2ZXlcIiwgXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJzaG93UHJvZ3Jlc3NCYXJcIiwgbnVsbCwgXCJvZmZcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2hvaWNlcyhcInN1cnZleVwiLCBcInNob3dQcm9ncmVzc0JhclwiLCBbXCJvZmZcIiwgXCJ0b3BcIiwgXCJib3R0b21cIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInJlcXVpcmVkVGV4dFwiLCBudWxsLCBcIiogXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInBhZ2VQcmV2VGV4dFwiLCBudWxsLCBudWxsLCBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5wYWdlUHJldlRleHRWYWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwicGFnZU5leHRUZXh0XCIsIG51bGwsIG51bGwsIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnBhZ2VOZXh0VGV4dFZhbHVlOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJjb21wbGV0ZVRleHRcIiwgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tcGxldGVUZXh0VmFsdWU7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcInN1cnZleVwiLCBcInRyaWdnZXJzXCIsIFwic3VydmV5dHJpZ2dlclwiLCBcInRyaWdnZXJcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwic3VydmV5XCIsIFwicXVlc3Rpb25zXCIsIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2hvaWNlcyhcInN1cnZleVwiLCBcImxvY2FsZVwiLCBudWxsLCAoKSA9PiB7IHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0TG9jYWxlcygpIH0pO1xyXG59IiwibW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5V2luZG93TW9kZWwgZXh0ZW5kcyBCYXNlICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdXJ2ZXlFbGVtZW50TmFtZSA9IFwid2luZG93U3VydmV5SlNcIjtcclxuICAgICAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5TW9kZWw7XHJcbiAgICAgICAgd2luZG93RWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgaXNTaG93aW5nVmFsdWU6IGJvb2xlYW47XHJcbiAgICAgICAgaXNFeHBhbmRlZFZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgICAgICB0ZW1wbGF0ZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB0aGlzLmNyZWF0ZVN1cnZleShqc29uT2JqKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5zaG93VGl0bGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dFbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCkgOiBzdHJpbmcgeyByZXR1cm4gXCJ3aW5kb3dcIiB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5TW9kZWwgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNTaG93aW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1Nob3dpbmdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNFeHBhbmRlZFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5zdXJ2ZXkudGl0bGU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZXhwYW5kKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY29sbGFwc2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlU3VydmV5KGpzb25PYmo6IGFueSk6IFN1cnZleU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlNb2RlbChqc29uT2JqKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZXhwYW5kY29sbGFwc2UodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc0V4cGFuZGVkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICB2YXIgZmlubmlzaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgIHBhZ2VQcmV2VGV4dDogXCJFZGVsbGluZW5cIixcclxuICAgICAgcGFnZU5leHRUZXh0OiBcIlNldXJhYXZhXCIsXHJcbiAgICAgIGNvbXBsZXRlVGV4dDogXCJWYWxtaXNcIixcclxuICAgICAgb3RoZXJJdGVtVGV4dDogXCJNdXUgKGt1dmFpbGUpXCIsXHJcbiAgICAgIHByb2dyZXNzVGV4dDogXCJTaXZ1IHswfS97MX1cIixcclxuICAgICAgZW1wdHlTdXJ2ZXk6IFwiVMOkc3PDpCBreXNlbHlzc8OkIGVpIG9sZSB5aHTDpGvDpMOkbiBuw6RreXZpbGzDpCBvbGV2YWEgc2l2dWEgdGFpIGt5c3lteXN0w6QuXCIsXHJcbiAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiS2lpdG9zIGt5c2VseXluIHZhc3RhYW1pc2VzdGEhXCIsXHJcbiAgICAgIGxvYWRpbmdTdXJ2ZXk6IFwiS3lzZWx5w6QgbGFkYXRhYW4gcGFsdmVsaW1lbHRhLi4uXCIsXHJcbiAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIlZhbGl0c2UuLi5cIixcclxuICAgICAgcmVxdWlyZWRFcnJvcjogXCJWYXN0YWEga3lzeW15a3NlZW4sIGtpaXRvcy5cIixcclxuICAgICAgbnVtZXJpY0Vycm9yOiBcIkFydm9uIHR1bGVlIG9sbGEgbnVtZWVyaW5lbi5cIixcclxuICAgICAgdGV4dE1pbkxlbmd0aDogXCJPbGUgaHl2w6QgamEgc3nDtnTDpCB2w6RoaW50w6TDpG4gezB9IG1lcmtracOkLlwiLFxyXG4gICAgICBtaW5TZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSB2w6RoaW50w6TDpG4gezB9IHZhaWh0b2VodG9hLlwiLFxyXG4gICAgICBtYXhTZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSBlbmludMOkw6RuIHswfSB2YWlodG9laHRvYS5cIixcclxuICAgICAgbnVtZXJpY01pbk1heDogXCInezB9JyB0w6R5dHl5IG9sbGEgZW5lbW3DpG4gdGFpIHlodMOkIHN1dXJpIGt1aW4gezF9IGphIHbDpGhlbW3DpG4gdGFpIHlodMOkIHN1dXJpIGt1aW4gezJ9XCIsXHJcbiAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgdMOkeXR5eSBvbGxhIGVuZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgICBudW1lcmljTWF4OiBcIid7MH0nIHTDpHl0eXkgb2xsYSB2w6RoZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgICBpbnZhbGlkRW1haWw6IFwiU3nDtnTDpCB2YWxpZGkgc8OkaGvDtnBvc3Rpb3NvaXRlLlwiLFxyXG4gICAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiT2xlIGh5dsOkIGphIHN5w7Z0w6QgXFxcIk11dSAoa3V2YWlsZSlcXFwiXCJcclxuICB9XHJcblxyXG4gIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZmlcIl0gPSBmaW5uaXNoU3VydmV5U3RyaW5ncztcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIHZhciBnZXJtYW5TdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICAgIHBhZ2VQcmV2VGV4dDogXCJadXLDvGNrXCIsXHJcbiAgICAgICAgcGFnZU5leHRUZXh0OiBcIldlaXRlclwiLFxyXG4gICAgICAgIGNvbXBsZXRlVGV4dDogXCJGZXJ0aWdcIixcclxuICAgICAgICBwcm9ncmVzc1RleHQ6IFwiU2VpdGUgezB9IHZvbiB7MX1cIixcclxuICAgICAgICBlbXB0eVN1cnZleTogXCJFcyBnaWJ0IGtlaW5lIHNpY2h0YmFyZSBGcmFnZS5cIixcclxuICAgICAgICBjb21wbGV0aW5nU3VydmV5OiBcIlZpZWxlbiBEYW5rIGbDvHIgZGFzIEF1c2bDvGxsZW4gZGVzIEZyYWdlYm9nZW5zIVwiLFxyXG4gICAgICAgIGxvYWRpbmdTdXJ2ZXk6IFwiRGVyIEZyYWdlYm9nZW4gd2lyZCB2b20gU2VydmVyIGdlbGFkZW4uLi5cIixcclxuICAgICAgICBvdGhlckl0ZW1UZXh0OiBcIkFuZGVyZSAoYmVzY2hyZWliZW4pXCIsXHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiV8OkaGxlbi4uLlwiLFxyXG4gICAgICAgIHJlcXVpcmVkRXJyb3I6IFwiQml0dGUgYW50d29ydGVuIFNpZSBhdWYgZGllIEZyYWdlLlwiLFxyXG4gICAgICAgIG51bWVyaWNFcnJvcjogXCJEZXIgV2VydCBzb2xsdGUgZWluZSBaYWhsIHNlaW4uXCIsXHJcbiAgICAgICAgdGV4dE1pbkxlbmd0aDogXCJCaXR0ZSBnZWJlbiBTaWUgbWluZGVzdGVucyB7MH0gU3ltYm9sZS5cIixcclxuICAgICAgICBtaW5TZWxlY3RFcnJvcjogXCJCaXR0ZSB3w6RobGVuIFNpZSBtaW5kZXN0ZW5zIHswfSBWYXJpYW50ZW4uXCIsXHJcbiAgICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiQml0dGUgd8OkaGxlbiBTaWUgbmljdGggbWVociBhbHMgezB9IFZhcmlhbnRlbi5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGdyw7bDn2VyIHNlaW4gYWxzIHsxfSB1bmQgZ2xlaWNoIG9kZXIga2xlaW5lciBhbHMgezJ9XCIsXHJcbiAgICAgICAgbnVtZXJpY01pbjogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBncsO2w59lciBzZWluIGFscyB7MX1cIixcclxuICAgICAgICBudW1lcmljTWF4OiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGtsZWluZXIgYWxzIHsxfVwiLFxyXG4gICAgICAgIGludmFsaWRFbWFpbDogXCJCaXR0ZSBnZWJlbiBTaWUgZWluZSBnw7xsdGlnZSBFbWFpbC1BZHJlc3NlIGVpbi5cIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJkZVwiXSA9IGdlcm1hblN1cnZleVN0cmluZ3M7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIHZhciBydXNzaWFuU3VydmV5U3RyaW5ncyA9IHtcclxuICAgICAgICBwYWdlUHJldlRleHQ6IFwi0J3QsNC30LDQtFwiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCLQlNCw0LvQtdC1XCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcItCT0L7RgtC+0LLQvlwiLFxyXG4gICAgICAgIHByb2dyZXNzVGV4dDogXCLQodGC0YDQsNC90LjRhtCwIHswfSDQuNC3IHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcItCd0LXRgiDQvdC4INC+0LTQvdC+0LPQviDQstC+0L/RgNC+0YHQsC5cIixcclxuICAgICAgICBjb21wbGV0aW5nU3VydmV5OiBcItCR0LvQsNCz0L7QtNCw0YDQuNC8INCS0LDRgSDQt9CwINC30LDQv9C+0LvQvdC10L3QuNC1INCw0L3QutC10YLRiyFcIixcclxuICAgICAgICBsb2FkaW5nU3VydmV5OiBcItCX0LDQs9GA0YPQt9C60LAg0YEg0YHQtdGA0LLQtdGA0LAuLi5cIixcclxuICAgICAgICBvdGhlckl0ZW1UZXh0OiBcItCU0YDRg9Cz0L7QtSAo0L/QvtC20LDQu9GD0LnRgdGC0LAsINC+0L/QuNGI0LjRgtC1KVwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcItCS0YvQsdGA0LDRgtGMLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7RgtCy0LXRgtGM0YLQtSDQvdCwINCy0L7Qv9GA0L7RgS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwi0J7RgtCy0LXRgiDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0YfQuNGB0LvQvtC8LlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INGF0L7RgtGPINCx0YsgezB9INGB0LjQvNCy0L7Qu9C+0LIuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0YvQsdC10YDQuNGC0LUg0YXQvtGC0Y8g0LHRiyB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgICAgIG1heFNlbGVjdEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstGL0LHQtdGA0LjRgtC1INC90LUg0LHQvtC70LXQtSB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9LCDQuCDRgNCw0LLQvdGL0Lwg0LjQu9C4INC80LXQvdGM0YjQtSwg0YfQtdC8IHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCInezB9JyDQtNC+0LvQttC90L4g0LHRi9GC0Ywg0YDQsNCy0L3Ri9C8INC40LvQuCDQvNC10L3RjNGI0LUsINGH0LXQvCB7MX1cIixcclxuICAgICAgICBpbnZhbGlkRW1haWw6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC00LXQudGB0YLQstC40YLQtdC70YzQvdGL0Lkg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YsuXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNCw0L3QvdGL0LUg0LIg0L/QvtC70LUgXFxcItCU0YDRg9Cz0L7QtVxcXCJcIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJydVwiXSA9IHJ1c3NpYW5TdXJ2ZXlTdHJpbmdzO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9jb21tZW50LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25jb21tZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25Db21tZW50TW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT17dGhpcy5jc3N9IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSBjb2xzPXt0aGlzLnF1ZXN0aW9uLmNvbHN9IHJvd3M9e3RoaXMucXVlc3Rpb24ucm93c30gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQgfSk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT17dGhpcy5jc3MucXVlc3Rpb24uY29tbWVudH0gdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSAvPik7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9yZWFjdC9yZWFjdC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0UXVlc3Rpb25jb21tZW50LnRzeFwiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVJlYWN0U3VydmV5Q3JlYXRvciB7XHJcbiAgICAgICAgY3JlYXRlUXVlc3Rpb25FbGVtZW50KHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBKU1guRWxlbWVudDtcclxuICAgICAgICByZW5kZXJFcnJvcihrZXk6IHN0cmluZywgZXJyb3JUZXh0OiBzdHJpbmcpOiBKU1guRWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2U7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbjtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogU3VydmV5LklSZWFjdFN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24ocHJvcHMucXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24obmV4dFByb3BzLnF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UXVlc3Rpb24ocXVlc3Rpb24pIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZSA9IHF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbiBpbnN0YW5jZW9mIFN1cnZleS5RdWVzdGlvbiA/IHF1ZXN0aW9uIDogbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24uZXJyb3JzQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdGF0ZS5lcnJvciA9IHNlbGYuc3RhdGUuZXJyb3IgKyAxO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnF1ZXN0aW9uID8gdGhpcy5xdWVzdGlvbi52YWx1ZSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmlzaWJsZTogdGhpcy5xdWVzdGlvbkJhc2UudmlzaWJsZSwgdmFsdWU6IHZhbHVlLCBlcnJvcjogMCB9O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25CYXNlIHx8ICF0aGlzLmNyZWF0b3IpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25CYXNlW1wicmVhY3RcIl0gPSB0aGlzOyAvL1RPRE9cclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25CYXNlLnZpc2libGUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBcIlJlYWN0U3VydmV5UXVlc3Rpb25cIiArIHRoaXMucXVlc3Rpb25CYXNlLmdldFR5cGUoKTtcclxuICAgICAgICB2YXIgcXVlc3Rpb25SZW5kZXIgPSB0aGlzLmNyZWF0b3IuY3JlYXRlUXVlc3Rpb25FbGVtZW50KHRoaXMucXVlc3Rpb25CYXNlKTtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnF1ZXN0aW9uQmFzZS5oYXNUaXRsZSA/IHRoaXMucmVuZGVyVGl0bGUoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGNvbW1lbnQgPSAodGhpcy5xdWVzdGlvbiAmJiB0aGlzLnF1ZXN0aW9uLmhhc0NvbW1lbnQpID8gdGhpcy5yZW5kZXJDb21tZW50KCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBlcnJvcnMgPSAodGhpcy5xdWVzdGlvbiAmJiB0aGlzLnF1ZXN0aW9uLmVycm9ycy5sZW5ndGggPiAwKSA/IHRoaXMucmVuZGVyRXJyb3JzKCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5xdWVzdGlvbi5yb290fT5cclxuICAgICAgICAgICAgICAgIHt0aXRsZX1cclxuICAgICAgICAgICAgICAgIHtlcnJvcnN9XHJcbiAgICAgICAgICAgICAgICB7cXVlc3Rpb25SZW5kZXJ9XHJcbiAgICAgICAgICAgICAgICB7Y29tbWVudH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJUaXRsZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHRpdGxlVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb24udmlzaWJsZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdGl0bGVUZXh0ID0gKHRoaXMucXVlc3Rpb24udmlzaWJsZUluZGV4ICsgMSkudG9TdHJpbmcoKSArIFwiLiBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb24uaXNSZXF1aXJlZCkge1xyXG4gICAgICAgICAgICB0aXRsZVRleHQgKz0gdGhpcy5xdWVzdGlvbi5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRpdGxlVGV4dCArPSB0aGlzLnF1ZXN0aW9uLnByb2Nlc3NlZFRpdGxlO1xyXG4gICAgICAgIHJldHVybiAoPGg1IGNsYXNzTmFtZT17dGhpcy5jc3MucXVlc3Rpb24udGl0bGV9Pnt0aXRsZVRleHR9PC9oNT4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckNvbW1lbnQoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBvdGhlclRleHQgPSBTdXJ2ZXkuc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVySXRlbVRleHRcIik7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj57b3RoZXJUZXh0fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLmNvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgPFJlYWN0U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSAgcXVlc3Rpb249e3RoaXMucXVlc3Rpb259Lz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckVycm9ycygpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi5lcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yVGV4dCA9IHRoaXMucXVlc3Rpb24uZXJyb3JzW2ldLmdldFRleHQoKTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiZXJyb3JcIiArIGk7XHJcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKHRoaXMuY3JlYXRvci5yZW5kZXJFcnJvcihrZXksIGVycm9yVGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5lcnJvci5yb290fT57ZXJyb3JzfTwvZGl2Pik7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWFjdHF1ZXN0aW9uLnRzeFwiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBwYWdlOiBTdXJ2ZXkuUGFnZU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXlNb2RlbDtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogU3VydmV5LklSZWFjdFN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucGFnZSA9IHByb3BzLnBhZ2U7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBwcm9wcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gcHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnBhZ2UgPSBuZXh0UHJvcHMucGFnZTtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IG5leHRQcm9wcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5wYWdlID09IG51bGwgfHwgdGhpcy5zdXJ2ZXkgPT0gbnVsbCB8fCB0aGlzLmNyZWF0b3IgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciB0aXRsZSA9IHRoaXMucmVuZGVyVGl0bGUoKTtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucGFnZS5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIHF1ZXN0aW9ucy5wdXNoKHRoaXMuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb24pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHt0aXRsZX1cclxuICAgICAgICAgICAgICAgIHtxdWVzdGlvbnN9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlRdWVzdGlvbiBrZXk9e3F1ZXN0aW9uLm5hbWV9IHF1ZXN0aW9uPXtxdWVzdGlvbn0gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSBjc3M9e3RoaXMuY3NzfSAvPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJUaXRsZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhZ2UudGl0bGUgfHwgIXRoaXMuc3VydmV5LnNob3dQYWdlVGl0bGVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGV4dCA9IHRoaXMucGFnZS5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICBpZiAodGhpcy5wYWdlLm51bSA+IDApIHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMucGFnZS5udW0gKyBcIi4gXCIgKyB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxoNCBjbGFzc05hbWU9e3RoaXMuY3NzLnBhZ2VUaXRsZX0+e3RleHR9PC9oND4pO1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9jaGVja2JveC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3JlYWN0L3JlYWN0LmQudHNcIiAvPlxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9uY2hlY2tib3ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByb3RlY3RlZCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBwcm9wcy5yb290Q3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgIHt0aGlzLmdldEl0ZW1zKCkgfVxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SXRlbXMoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLnZpc2libGVDaG9pY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiaXRlbVwiICsgaTtcclxuICAgICAgICAgICAgaXRlbXMucHVzaCh0aGlzLnJlbmRlckl0ZW0oa2V5LCBpdGVtKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgdGV4dFN0eWxlKCk6IGFueSB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySXRlbShrZXk6IHN0cmluZywgaXRlbTogYW55KTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlRdWVzdGlvbmNoZWNrYm94SXRlbSBrZXk9e2tleX0gcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5jc3N9IHJvb3RDc3M9e3RoaXMucm9vdENzc30gaXRlbT17aXRlbX0gdGV4dFN0eWxlPXt0aGlzLnRleHRTdHlsZX0gLz47XHJcbiAgICB9XHJcbn1cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbmNoZWNrYm94SXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJvdGVjdGVkIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveE1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGl0ZW06IFN1cnZleS5JdGVtVmFsdWU7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgcm9vdENzczogYW55O1xyXG4gICAgcHJvdGVjdGVkIHRleHRTdHlsZTogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLml0ZW0gPSBwcm9wcy5pdGVtO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBwcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMudGV4dFN0eWxlID0gcHJvcHMudGV4dFN0eWxlO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5pdGVtID0gbmV4dFByb3BzLml0ZW07XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMudGV4dFN0eWxlID0gbmV4dFByb3BzLnRleHRTdHlsZTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnF1ZXN0aW9uLnZhbHVlO1xyXG4gICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgbmV3VmFsdWUgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gbmV3VmFsdWUuaW5kZXhPZih0aGlzLml0ZW0udmFsdWUpO1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZS5wdXNoKHRoaXMuaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMuaXRlbSB8fCAhdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGl0ZW1XaWR0aCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPiAwID8gKDEwMCAvIHRoaXMucXVlc3Rpb24uY29sQ291bnQpICsgXCIlXCIgOiBcIlwiO1xyXG4gICAgICAgIHZhciBtYXJnaW5SaWdodCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFwiNXB4XCIgOiBcIjBweFwiO1xyXG4gICAgICAgIHZhciBkaXZTdHlsZSA9IHsgbWFyZ2luUmlnaHQ6IG1hcmdpblJpZ2h0IH07XHJcbiAgICAgICAgaWYgKGl0ZW1XaWR0aCkge1xyXG4gICAgICAgICAgICBkaXZTdHlsZVtcIndpZHRoXCJdID0gaXRlbVdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5xdWVzdGlvbi52YWx1ZSAmJiB0aGlzLnF1ZXN0aW9uLnZhbHVlLmluZGV4T2YodGhpcy5pdGVtLnZhbHVlKSA+IC0xO1xyXG4gICAgICAgIHZhciBvdGhlckl0ZW0gPSAodGhpcy5pdGVtLnZhbHVlID09PSB0aGlzLnF1ZXN0aW9uLm90aGVySXRlbS52YWx1ZSAmJiBpc0NoZWNrZWQpID8gdGhpcy5yZW5kZXJPdGhlcigpIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDaGVja2JveChpc0NoZWNrZWQsIGRpdlN0eWxlLCBvdGhlckl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBpbnB1dFN0eWxlKCk6IGFueSB7IHJldHVybiB7IG1hcmdpblJpZ2h0OiBcIjNweFwiIH07IH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJDaGVja2JveChpc0NoZWNrZWQ6IGJvb2xlYW4sIGRpdlN0eWxlOiBhbnksIG90aGVySXRlbTogSlNYLkVsZW1lbnQpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3MuaXRlbX0gc3R5bGU9e2RpdlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBzdHlsZT17dGhpcy5pbnB1dFN0eWxlfSAgY2hlY2tlZD17aXNDaGVja2VkfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57dGhpcy5pdGVtLnRleHR9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICB7b3RoZXJJdGVtfVxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlck90aGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5vdGhlcn0+PFJlYWN0U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSAgcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSAvPjwvZGl2Pik7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2Ryb3Bkb3duLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25kcm9wZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uRHJvcGRvd25Nb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gcHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLnZpc2libGVDaG9pY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiaXRlbVwiICsgaTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IDxvcHRpb24ga2V5PXtrZXl9IHZhbHVlPXtpdGVtLnZhbHVlfT57aXRlbS50ZXh0fTwvb3B0aW9uPjtcclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb21tZW50ID0gdGhpcy5xdWVzdGlvbi52YWx1ZSA9PT0gdGhpcy5xdWVzdGlvbi5vdGhlckl0ZW0udmFsdWUgPyB0aGlzLnJlbmRlck90aGVyKCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3NOYW1lPXt0aGlzLmNzc30gdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfT5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+e3RoaXMucXVlc3Rpb24ub3B0aW9uc0NhcHRpb259PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAge29wdGlvbnN9XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICB7Y29tbWVudH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJPdGhlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0geyBtYXJnaW5Ub3A6IFwiM3B4XCIgfTtcclxuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9PjxSZWFjdFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfS8+PC9kaXY+O1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9odG1sLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25odG1sIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25IdG1sTW9kZWw7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24gfHwgIXRoaXMucXVlc3Rpb24uaHRtbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGh0bWxWYWx1ZSA9IHsgX19odG1sOiB0aGlzLnF1ZXN0aW9uLnByb2Nlc3NlZEh0bWwgfVxyXG4gICAgICAgIHJldHVybiAoPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17aHRtbFZhbHVlfSAvPiApO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbWF0cml4LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tYXRyaXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbk1hdHJpeE1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGZpcnN0VEggPSB0aGlzLnF1ZXN0aW9uLmhhc1Jvd3MgPyA8dGg+PC90aD4gOiBudWxsO1xyXG4gICAgICAgIHZhciBoZWFkZXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMucXVlc3Rpb24uY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiY29sdW1uXCIgKyBpO1xyXG4gICAgICAgICAgICBoZWFkZXJzLnB1c2goPHRoIGtleT17a2V5fT57Y29sdW1uLnRleHR9PC90aD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm93cyA9IFtdO1xyXG4gICAgICAgIHZhciB2aXNpYmxlUm93cyA9IHRoaXMucXVlc3Rpb24udmlzaWJsZVJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gdmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInJvd1wiICsgaTtcclxuICAgICAgICAgICAgcm93cy5wdXNoKDxSZWFjdFN1cnZleVF1ZXN0aW9ubWF0cml4Um93IGtleT17a2V5fSBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gcm93PXtyb3d9IC8+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zmlyc3RUSH1cclxuICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbm1hdHJpeFJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uTWF0cml4TW9kZWw7XHJcbiAgICBwcml2YXRlIHJvdzogU3VydmV5Lk1hdHJpeFJvd01vZGVsO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5yb3cgPSBwcm9wcy5yb3c7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5yb3cudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnJvdy52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMucm93ID0gbmV4dFByb3BzLnJvdztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvdykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGZpcnN0VEQgPSB0aGlzLnF1ZXN0aW9uLmhhc1Jvd3MgPyA8dGQ+e3RoaXMucm93LnRleHR9PC90ZD4gOiBudWxsO1xyXG4gICAgICAgIHZhciB0ZHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24uY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5xdWVzdGlvbi5jb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJ2YWx1ZVwiICsgaTtcclxuICAgICAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IHRoaXMucm93LnZhbHVlID09IGNvbHVtbi52YWx1ZTtcclxuICAgICAgICAgICAgdmFyIHRkID0gPHRkIGtleT17a2V5fT48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT17dGhpcy5yb3cuZnVsbE5hbWV9IHZhbHVlPXtjb2x1bW4udmFsdWV9IGNoZWNrZWQ9e2lzQ2hlY2tlZH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9Lz48L3RkPjtcclxuICAgICAgICAgICAgdGRzLnB1c2godGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDx0cj57Zmlyc3RURH17dGRzfTwvdHI+KTtcclxuICAgIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tYXRyaXhkcm9wZG93biBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBoZWFkZXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMucXVlc3Rpb24uY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiY29sdW1uXCIgKyBpO1xyXG4gICAgICAgICAgICBoZWFkZXJzLnB1c2goPHRoIGtleT17a2V5fT57Y29sdW1uLnRpdGxlfTwvdGg+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICB2YXIgdmlzaWJsZVJvd3MgPSB0aGlzLnF1ZXN0aW9uLnZpc2libGVSb3dzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJyb3dcIiArIGk7XHJcbiAgICAgICAgICAgIHJvd3MucHVzaCg8UmVhY3RTdXJ2ZXlRdWVzdGlvbm1hdHJpeGRyb3Bkb3duUm93IGtleT17a2V5fSByb3c9e3Jvd30gLz4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyc31cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICB7cm93c31cclxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9ubWF0cml4ZHJvcGRvd25Sb3cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcm93OiBTdXJ2ZXkuTWF0cml4RHJvcGRvd25Sb3dNb2RlbDtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5yb3cgPSBwcm9wcy5yb3c7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5yb3cgPSBuZXh0UHJvcHMucm93O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucm93KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvdy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZWN0ID0gdGhpcy5yZW5kZXJTZWxlY3QodGhpcy5yb3cuY2VsbHNbaV0pO1xyXG4gICAgICAgICAgICB0ZHMucHVzaCg8dGQga2V5PXtcInJvd1wiICsgaX0+e3NlbGVjdH08L3RkPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPHRyPjx0ZD57dGhpcy5yb3cudGV4dH08L3RkPnt0ZHN9PC90cj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclNlbGVjdChjZWxsOiBTdXJ2ZXkuTWF0cml4RHJvcGRvd25DZWxsTW9kZWwpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxSZWFjdFN1cnZleVF1ZXN0aW9ubWF0cml4ZHJvcGRvd25DZWxsIGNlbGw9e2NlbGx9IC8+XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tYXRyaXhkcm9wZG93bkNlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgY2VsbDogU3VydmV5Lk1hdHJpeERyb3Bkb3duQ2VsbE1vZGVsO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmNlbGwgPSBwcm9wcy5jZWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLmNlbGwudmFsdWUgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNlbGwudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLmNlbGwudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5jZWxsID0gbmV4dFByb3BzLmNlbGw7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMuY2VsbC52YWx1ZSB9O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMuY2VsbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLmdldE9wdGlvbnMoKTtcclxuICAgICAgICByZXR1cm4gKDxzZWxlY3QgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfT5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+e3RoaXMuY2VsbC5vcHRpb25zQ2FwdGlvbn08L29wdGlvbj5cclxuICAgICAgICAgICAgICB7b3B0aW9uc31cclxuICAgICAgICAgICAgPC9zZWxlY3Q+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRPcHRpb25zKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNlbGwuY2hvaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY2VsbC5jaG9pY2VzW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJvcFwiICsgaTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IDxvcHRpb24ga2V5PXtrZXl9IHZhbHVlPXtpdGVtLnZhbHVlfT57aXRlbS50ZXh0fTwvb3B0aW9uPjtcclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tdWx0aXBsZXRleHQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhYmxlUm93cyA9IHRoaXMucXVlc3Rpb24uZ2V0Um93cygpO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcm93cy5wdXNoKHRoaXMucmVuZGVyUm93KFwiaXRlbVwiICsgaSwgdGFibGVSb3dzW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUm93KGtleTogc3RyaW5nLCBpdGVtczogQXJyYXk8U3VydmV5Lk11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4pIHtcclxuICAgICAgICB2YXIgdGRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICB0ZHMucHVzaCg8dGQga2V5PXtcImxhYmVsXCIgKyBpfT48c3BhbiBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW1UaXRsZX0+e2l0ZW0udGl0bGV9PC9zcGFuPjwvdGQ+KTtcclxuICAgICAgICAgICAgdGRzLnB1c2goPHRkIGtleT17XCJ2YWx1ZVwiICsgaX0+e3RoaXMucmVuZGVySXRlbShpdGVtKX08L3RkPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8dHIga2V5PXtrZXl9Pnt0ZHN9PC90cj47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySXRlbShpdGVtOiBTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbU1vZGVsKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlRdWVzdGlvbm11bHRpcGxldGV4dEl0ZW0gaXRlbT17aXRlbX0gY3NzPXt0aGlzLmNzc30gLz47XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tdWx0aXBsZXRleHRJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIGl0ZW06IFN1cnZleS5NdWx0aXBsZVRleHRJdGVtTW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IHByb3BzLml0ZW07XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMuaXRlbS52YWx1ZSB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMuaXRlbS52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMuaXRlbS52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLml0ZW0gPSBuZXh0UHJvcHMuaXRlbTtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5pdGVtKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgc3R5bGUgPSB7IGZsb2F0OiBcImxlZnRcIiB9O1xyXG4gICAgICAgIHJldHVybiAoPGlucHV0ICBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW1WYWx1ZX0gc3R5bGU9e3N0eWxlfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBtYWluQ2xhc3NOYW1lKCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25yYWRpb2dyb3VwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvblJhZGlvZ3JvdXBNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBwcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gbmV4dFByb3BzLnJvb3RDc3M7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAge3RoaXMuZ2V0SXRlbXMoKSB9XHJcbiAgICAgICAgICAgIDwvZm9ybT4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcIml0ZW1cIiArIGk7XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5yZW5kZXJJdGVtKGtleSwgaXRlbSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHRleHRTdHlsZSgpOiBhbnkgeyByZXR1cm4geyBtYXJnaW5MZWZ0OiBcIjNweFwiIH07IH1cclxuICAgIHByaXZhdGUgcmVuZGVySXRlbShrZXk6IHN0cmluZywgaXRlbTogU3VydmV5Lkl0ZW1WYWx1ZSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgaXRlbVdpZHRoID0gdGhpcy5xdWVzdGlvbi5jb2xDb3VudCA+IDAgPyAoMTAwIC8gdGhpcy5xdWVzdGlvbi5jb2xDb3VudCkgKyBcIiVcIiA6IFwiXCI7XHJcbiAgICAgICAgdmFyIG1hcmdpblJpZ2h0ID0gdGhpcy5xdWVzdGlvbi5jb2xDb3VudCA9PSAwID8gXCI1cHhcIiA6IFwiMHB4XCI7XHJcbiAgICAgICAgdmFyIGRpdlN0eWxlID0geyBtYXJnaW5SaWdodDogbWFyZ2luUmlnaHQgfTtcclxuICAgICAgICBpZiAoaXRlbVdpZHRoKSB7XHJcbiAgICAgICAgICAgIGRpdlN0eWxlW1wid2lkdGhcIl0gPSBpdGVtV2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpc0NoZWNrZWQgPSB0aGlzLnF1ZXN0aW9uLnZhbHVlID09IGl0ZW0udmFsdWU7XHJcbiAgICAgICAgdmFyIG90aGVySXRlbSA9IChpc0NoZWNrZWQgJiYgaXRlbS52YWx1ZSA9PT0gdGhpcy5xdWVzdGlvbi5vdGhlckl0ZW0udmFsdWUpID8gdGhpcy5yZW5kZXJPdGhlcigpIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJSYWRpbyhrZXksIGl0ZW0sIGlzQ2hlY2tlZCwgZGl2U3R5bGUsIG90aGVySXRlbSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUmFkaW8oa2V5OiBzdHJpbmcsIGl0ZW06IFN1cnZleS5JdGVtVmFsdWUsIGlzQ2hlY2tlZDogYm9vbGVhbiwgZGl2U3R5bGU6IGFueSwgb3RoZXJJdGVtOiBKU1guRWxlbWVudCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXYga2V5PXtrZXl9IGNsYXNzTmFtZT17dGhpcy5jc3MuaXRlbX0gc3R5bGU9e2RpdlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiAgY2hlY2tlZD17aXNDaGVja2VkfSB2YWx1ZT17aXRlbS52YWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3RoaXMudGV4dFN0eWxlfT57aXRlbS50ZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAge290aGVySXRlbX1cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJPdGhlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mub3RoZXJ9PjxSZWFjdFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30gLz48L2Rpdj4pO1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl90ZXh0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvcmVhY3QvcmVhY3QuZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb250ZXh0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25UZXh0TW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9e3RoaXMuY3NzfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnF1ZXN0aW9uLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleU1vZGVsIGV4dGVuZHMgU3VydmV5LlN1cnZleU1vZGVsIHtcclxuICAgIHJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKGpzb25PYmopO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW5kZXJDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIG1lcmdlQ3NzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcclxuICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHNyYywgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcbiIsImNsYXNzIFJlYWN0U3VydmV5TmF2aWdhdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXlNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBwcm9wcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVQcmV2Q2xpY2sgPSB0aGlzLmhhbmRsZVByZXZDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlTmV4dENsaWNrID0gdGhpcy5oYW5kbGVOZXh0Q2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZUNvbXBsZXRlQ2xpY2sgPSB0aGlzLmhhbmRsZUNvbXBsZXRlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IG5leHRQcm9wcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlUHJldkNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucHJldlBhZ2UoKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU5leHRDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm5leHRQYWdlKCk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVDb21wbGV0ZUNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkuY29tcGxldGVMYXN0UGFnZSgpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMuc3VydmV5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcHJldkJ1dHRvbiA9ICF0aGlzLnN1cnZleS5pc0ZpcnN0UGFnZSA/IHRoaXMucmVuZGVyQnV0dG9uKHRoaXMuaGFuZGxlUHJldkNsaWNrLCB0aGlzLnN1cnZleS5wYWdlUHJldlRleHQpIDogbnVsbDtcclxuICAgICAgICB2YXIgbmV4dEJ1dHRvbiA9ICF0aGlzLnN1cnZleS5pc0xhc3RQYWdlID8gdGhpcy5yZW5kZXJCdXR0b24odGhpcy5oYW5kbGVOZXh0Q2xpY2ssIHRoaXMuc3VydmV5LnBhZ2VOZXh0VGV4dCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBjb21wbGV0ZUJ1dHRvbiA9IHRoaXMuc3VydmV5LmlzTGFzdFBhZ2UgPyB0aGlzLnJlbmRlckJ1dHRvbih0aGlzLmhhbmRsZUNvbXBsZXRlQ2xpY2ssIHRoaXMuc3VydmV5LmNvbXBsZXRlVGV4dCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5mb290ZXJ9PlxyXG4gICAgICAgICAgICAgICAge3ByZXZCdXR0b259XHJcbiAgICAgICAgICAgICAgICB7bmV4dEJ1dHRvbn1cclxuICAgICAgICAgICAgICAgIHtjb21wbGV0ZUJ1dHRvbn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQnV0dG9uKGNsaWNrOiBhbnksIHRleHQ6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGUgPSB7IG1hcmdpblJpZ2h0OiBcIjVweFwiIH07XHJcbiAgICAgICAgcmV0dXJuIDxpbnB1dCBjbGFzc05hbWU9e3RoaXMuY3NzLm5hdmlnYXRpb25CdXR0b259IHN0eWxlPXtzdHlsZX0gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e2NsaWNrfSB2YWx1ZT17dGV4dH0gLz47XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9yZWFjdC9yZWFjdC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWFjdHN1cnZleW1vZGVsLnRzeFwiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWFjdFBhZ2UudHN4XCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0UXVlc3Rpb24udHN4XCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0U3VydmV5TmF2aWdhdGlvbi50c3hcIiAvPlxyXG5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiBpbXBsZW1lbnRzIFN1cnZleS5JUmVhY3RTdXJ2ZXlDcmVhdG9yIHtcclxuICAgIHByb3RlY3RlZCBzdXJ2ZXk6IFJlYWN0U3VydmV5TW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuY3NzID0gdGhpcy5jcmVhdGVDc3NPYmplY3QoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY3NzKSB0aHJvdyBcIllvdSBzaG91bGQgbm90IHJldHVybiBudWxsIGZvciBjcmVhdGVDc3NPYmplY3QoKSBtZXRob2QuXCI7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTdXJ2ZXkocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3VydmV5KG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleS5zdGF0ZSA9PSBcImNvbXBsZXRlZFwiKSByZXR1cm4gdGhpcy5yZW5kZXJDb21wbGV0ZWQoKTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkuc3RhdGUgPT0gXCJsb2FkaW5nXCIpIHJldHVybiB0aGlzLnJlbmRlckxvYWRpbmcoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJTdXJ2ZXkoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDc3NPYmplY3QoKTogYW55IHsgcmV0dXJuIG51bGw7IH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJDb21wbGV0ZWQoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBodG1sVmFsdWUgPSB7IF9faHRtbDogdGhpcy5zdXJ2ZXkucHJvY2Vzc2VkQ29tcGxldGVkSHRtbCB9XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtodG1sVmFsdWV9IC8+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJMb2FkaW5nKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgaHRtbFZhbHVlID0geyBfX2h0bWw6IHRoaXMuc3VydmV5LnByb2Nlc3NlZExvYWRpbmdIdG1sIH1cclxuICAgICAgICByZXR1cm4gKDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e2h0bWxWYWx1ZX0gLz4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclN1cnZleSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5zdXJ2ZXkudGl0bGUgJiYgdGhpcy5zdXJ2ZXkuc2hvd1RpdGxlID8gdGhpcy5yZW5kZXJUaXRsZSgpIDogbnVsbDtcclxuICAgICAgICB2YXIgY3VycmVudFBhZ2UgPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSA/IHRoaXMucmVuZGVyUGFnZSgpIDogbnVsbDtcclxuICAgICAgICB2YXIgdG9wUHJvZ3Jlc3MgPSB0aGlzLnN1cnZleS5zaG93UHJvZ3Jlc3NCYXIgPT0gXCJ0b3BcIiA/IHRoaXMucmVuZGVyUHJvZ3Jlc3ModHJ1ZSkgOiBudWxsO1xyXG4gICAgICAgIHZhciBib3R0b21Qcm9ncmVzcyA9IHRoaXMuc3VydmV5LnNob3dQcm9ncmVzc0JhciA9PSBcImJvdHRvbVwiID8gdGhpcy5yZW5kZXJQcm9ncmVzcyhmYWxzZSkgOiBudWxsO1xyXG4gICAgICAgIHZhciBidXR0b25zID0gKGN1cnJlbnRQYWdlICYmIHRoaXMuc3VydmV5LnNob3dOYXZpZ2F0aW9uQnV0dG9ucykgPyB0aGlzLnJlbmRlck5hdmlnYXRpb24oKSA6IG51bGw7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50UGFnZSkge1xyXG4gICAgICAgICAgICBjdXJyZW50UGFnZSA9IHRoaXMucmVuZGVyRW1wdHlTdXJ2ZXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmJvZHl9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0b3BQcm9ncmVzc31cclxuICAgICAgICAgICAgICAgICAgICB7Y3VycmVudFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAge2JvdHRvbVByb2dyZXNzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7YnV0dG9uc31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJUaXRsZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5oZWFkZXJ9PjxoMz57dGhpcy5zdXJ2ZXkudGl0bGV9PC9oMz48L2Rpdj47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUGFnZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxSZWFjdFN1cnZleVBhZ2Ugc3VydmV5PXt0aGlzLnN1cnZleX0gcGFnZT17dGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2V9IGNzcz17dGhpcy5jc3N9IGNyZWF0b3I9e3RoaXN9IC8+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb2dyZXNzKGlzVG9wOiBib29sZWFuKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlck5hdmlnYXRpb24oKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uIHN1cnZleSA9IHt0aGlzLnN1cnZleX0gY3NzPXt0aGlzLmNzc30vPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJFbXB0eVN1cnZleSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8c3Bhbj57dGhpcy5zdXJ2ZXkuZW1wdHlTdXJ2ZXlUZXh0fTwvc3Bhbj4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTdXJ2ZXkobmV3UHJvcHM6IGFueSkge1xyXG4gICAgICAgIGlmIChuZXdQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMubW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3UHJvcHMubW9kZWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3UHJvcHMuanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3IFJlYWN0U3VydmV5TW9kZWwobmV3UHJvcHMuanNvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleSA9IG5ldyBSZWFjdFN1cnZleU1vZGVsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMuY2xpZW50SWQpIHRoaXMuc3VydmV5LmNsaWVudElkID0gbmV3UHJvcHMuY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5kYXRhKSB0aGlzLnN1cnZleS5kYXRhID0gbmV3UHJvcHMuZGF0YTtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmNzcykgdGhpcy5zdXJ2ZXkubWVyZ2VDc3MobmV3UHJvcHMuY3NzLCB0aGlzLmNzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3NldCB0aGUgZmlyc3QgcGFnZVxyXG4gICAgICAgIHZhciBkdW1teSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0geyBwYWdlSW5kZXhDaGFuZ2U6IDAsIGlzQ29tcGxldGVkOiBmYWxzZSwgbW9kZWxDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdGhpcy5zZXRTdXJ2ZXlFdmVudHMobmV3UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldFN1cnZleUV2ZW50cyhuZXdQcm9wczogYW55KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlckNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlLm1vZGVsQ2hhbmdlZCA9IHNlbGYuc3RhdGUubW9kZWxDaGFuZ2VkICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXIpID0+IHsgc2VsZi5zdGF0ZS5pc0NvbXBsZXRlZCA9IHRydWU7IHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uQ3VycmVudFBhZ2VDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUucGFnZUluZGV4Q2hhbmdlID0gc2VsZi5zdGF0ZS5wYWdlSW5kZXhDaGFuZ2UgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMgJiYgbmV3UHJvcHMub25DdXJyZW50UGFnZUNoYW5nZWQpIG5ld1Byb3BzLm9uQ3VycmVudFBhZ2VDaGFuZ2VkKHNlbmRlciwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25WaXNpYmxlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5xdWVzdGlvbiAmJiBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0LnN0YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhdGUudmlzaWJsZSA9IG9wdGlvbnMucXVlc3Rpb24udmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMucXVlc3Rpb24ucmVhY3Quc2V0U3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25WYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucXVlc3Rpb24gJiYgb3B0aW9ucy5xdWVzdGlvbi5yZWFjdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gb3B0aW9ucy5xdWVzdGlvbi5yZWFjdC5zdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gb3B0aW9ucy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMucXVlc3Rpb24ucmVhY3Quc2V0U3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCFuZXdQcm9wcykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uVmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5kYXRhKSBuZXdQcm9wcy5kYXRhW29wdGlvbnMubmFtZV0gPSBvcHRpb25zLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMub25WYWx1ZUNoYW5nZWQpIG5ld1Byb3BzLm9uVmFsdWVDaGFuZ2VkKHNlbmRlciwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25Db21wbGV0ZS5hZGQoKHNlbmRlcikgPT4geyBuZXdQcm9wcy5vbkNvbXBsZXRlKHNlbmRlcik7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleS5vblBhZ2VWaXNpYmxlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBpZiAobmV3UHJvcHMub25QYWdlVmlzaWJsZUNoYW5nZWQpIG5ld1Byb3BzLm9uUGFnZVZpc2libGVDaGFuZ2VkKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblF1ZXN0aW9uQWRkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25RdWVzdGlvbkFkZGVkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uUXVlc3Rpb25BZGRlZChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uUXVlc3Rpb25SZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUXVlc3Rpb25SZW1vdmVkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uUXVlc3Rpb25SZW1vdmVkKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25WYWxpZGF0ZVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uVmFsaWRhdGVRdWVzdGlvbi5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBuZXdQcm9wcy5vblZhbGlkYXRlUXVlc3Rpb24oc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblNlbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25TZW5kUmVzdWx0LmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uU2VuZFJlc3VsdChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uR2V0UmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uR2V0UmVzdWx0LmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uR2V0UmVzdWx0KHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25Qcm9jZXNzSHRtbCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblByb2Nlc3NIdG1sLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uUHJvY2Vzc0h0bWwoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldFJlYWN0UXVlc3Rpb25DbGFzcyhxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSk6IGFueSB7XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiUmVhY3RTdXJ2ZXlRdWVzdGlvblwiICsgcXVlc3Rpb24uZ2V0VHlwZSgpO1xyXG4gICAgICAgIHJldHVybiB3aW5kb3dbY2xhc3NOYW1lXTtcclxuICAgIH1cclxuICAgIC8vSVJlYWN0U3VydmV5Q3JlYXRvclxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25Dc3MgPSB0aGlzLmNzc1txdWVzdGlvbi5nZXRUeXBlKCldO1xyXG4gICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KHRoaXMuZ2V0UmVhY3RRdWVzdGlvbkNsYXNzKHF1ZXN0aW9uKSwgeyBxdWVzdGlvbjogcXVlc3Rpb24sIGNzczogcXVlc3Rpb25Dc3MsIHJvb3RDc3M6IHRoaXMuY3NzIH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbmRlckVycm9yKGtleTogc3RyaW5nLCBlcnJvclRleHQ6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPGRpdiBrZXk9e2tleX0gY2xhc3NOYW1lPXt0aGlzLmNzcy5lcnJvci5pdGVtfT57ZXJyb3JUZXh0fTwvZGl2PjtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3JlYWN0L3JlYWN0LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5UHJvZ3Jlc3NCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHN1cnZleTogU3VydmV5LlN1cnZleU1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGlzVG9wOiBib29sZWFuO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IHByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLmlzVG9wID0gcHJvcHMuaXNUb3A7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXh0UHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLmlzVG9wID0gbmV4dFByb3BzLmlzVG9wO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9ncmVzcygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5zdXJ2ZXkuZ2V0UHJvZ3Jlc3MoKTsgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9ncmVzc1RleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3VydmV5LnByb2dyZXNzVGV4dDsgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9xdWVzdGlvbl9yYXRpbmcudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9yZWFjdC9yZWFjdC5kLnRzXCIgLz5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbnJhdGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uUmF0aW5nTW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgcm9vdENzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gcHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBuZXh0UHJvcHMucm9vdENzcztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaGVhZGVycyA9IFtdO1xyXG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24udmlzaWJsZVJhdGVWYWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGtleUhlYWRlciA9IFwiaGVhZGVyXCIgKyBpO1xyXG4gICAgICAgICAgICB2YXIga2V5VmFsdWUgPSBcInZhbHVlXCIgKyBpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVlc3Rpb24udmlzaWJsZVJhdGVWYWx1ZXNbaV07XHJcbiAgICAgICAgICAgIGhlYWRlcnMucHVzaCg8dGgga2V5PXtrZXlIZWFkZXJ9PntpdGVtLnRleHR9PC90aD4pO1xyXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCg8dGQga2V5PXtrZXlWYWx1ZX0+XHJcbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPXt0aGlzLnF1ZXN0aW9uLm5hbWV9IHZhbHVlPXtpdGVtLnZhbHVlfSBjaGVja2VkPXt0aGlzLnF1ZXN0aW9uLnZhbHVlID09IGl0ZW0udmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSAvPlxyXG4gICAgICAgICAgICAgICAgPC90ZD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29tbWVudCA9IHRoaXMucXVlc3Rpb24uaGFzT3RoZXIgPyB0aGlzLnJlbmRlck90aGVyKCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt0aGlzLnF1ZXN0aW9uLm1pbmludW1SYXRlRGVzY3JpcHRpb259PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2YWx1ZXN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3RoaXMucXVlc3Rpb24ubWF4aW11bVJhdGVEZXNjcmlwdGlvbn08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAge2NvbW1lbnR9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyT3RoZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLm90aGVyfT48UmVhY3RTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtICBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gY3NzPXt0aGlzLnJvb3RDc3N9IC8+PC9kaXY+KTtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi90eXBpbmdzL3JlYWN0L3JlYWN0LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3JlYWN0U3VydmV5UHJvZ3Jlc3MudHN4XCIgLz5cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5UHJvZ3Jlc3MgZXh0ZW5kcyBSZWFjdFN1cnZleVByb2dyZXNzQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmlzVG9wID8ge30gOiB7IG1hcmdpblRvcDogXCIxMHB4XCIsIG1hcmdpbkJvdHRvbTogXCI1cHhcIiB9O1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLnByb2dyZXNzfSBzdHlsZT17IHN0eWxlIH0+e3RoaXMucHJvZ3Jlc3NUZXh0fTwvZGl2Pik7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9yZWFjdC9yZWFjdC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWFjdFN1cnZleVByb2dyZXNzU3RhbmRhcmQudHN4XCIgLz5cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5IGV4dGVuZHMgUmVhY3RTdXJ2ZXlCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvZ3Jlc3MoaXNUb3A6IEJvb2xlYW4pOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxSZWFjdFN1cnZleVByb2dyZXNzIHN1cnZleSA9IHt0aGlzLnN1cnZleX0gY3NzPXt0aGlzLmNzc30gaXNUb3AgPSB7aXNUb3B9IC8+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUNzc09iamVjdCgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJvb3Q6IFwic3ZfbWFpblwiLFxyXG4gICAgICAgICAgICBoZWFkZXI6IFwiXCIsXHJcbiAgICAgICAgICAgIGJvZHk6IFwic3ZfYm9keVwiLFxyXG4gICAgICAgICAgICBmb290ZXI6IFwic3ZfbmF2XCIsXHJcbiAgICAgICAgICAgIG5hdmlnYXRpb25CdXR0b246IFwiXCIsXHJcbiAgICAgICAgICAgIHByb2dyZXNzOiBcInN2X3Byb2dyZXNzXCIsXHJcbiAgICAgICAgICAgIHBhZ2VUaXRsZTogXCJzdl9wX3RpdGxlXCIsXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uOiB7IHJvb3Q6IFwic3ZfcVwiLCB0aXRsZTogXCJzdl9xX3RpdGxlXCIsIGNvbW1lbnQ6IFwiXCIgfSxcclxuICAgICAgICAgICAgZXJyb3I6IHsgcm9vdDogXCJzdl9xX2VyYm94XCIsIGl0ZW06IFwiXCIgfSxcclxuXHJcbiAgICAgICAgICAgIGNoZWNrYm94OiB7IHJvb3Q6IFwic3ZfcWNiY1wiLCBpdGVtOiBcInN2X3FfY2hlY2tib3hcIiwgb3RoZXI6IFwic3ZfcV9vdGhlclwiIH0sXHJcbiAgICAgICAgICAgIGNvbW1lbnQ6IFwiXCIsXHJcbiAgICAgICAgICAgIGRyb3Bkb3duOiBcIlwiLFxyXG4gICAgICAgICAgICBtYXRyaXg6IHsgcm9vdDogXCJzdl9xX21hdHJpeFwiIH0sXHJcbiAgICAgICAgICAgIG1hdHJpeGRyb3Bkb3duOiB7IHJvb3Q6IFwic3ZfcV9tYXRyaXhcIiB9LFxyXG4gICAgICAgICAgICBtdWx0aXBsZXRleHQ6IHsgcm9vdDogXCJcIiwgaXRlbVRpdGxlOiBcIlwiLCBpdGVtVmFsdWU6IFwiXCIgfSxcclxuICAgICAgICAgICAgcmFkaW9ncm91cDogeyByb290OiBcInN2X3FjYmNcIiwgaXRlbTogXCJzdl9xX3JhZGlvZ3JvdXBcIiwgb3RoZXI6IFwic3ZfcV9vdGhlclwiIH0sXHJcbiAgICAgICAgICAgIHJhdGluZzogeyByb290OiBcInN2X3FfcmF0aW5nXCIsIGl0ZW06IFwiXCIgfSxcclxuICAgICAgICAgICAgdGV4dDogXCJcIlxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9yZWFjdC9yZWFjdC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0U3VydmV5U3RhbmRhcmQudHN4XCIgLz5cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5V2luZG93IGV4dGVuZHMgUmVhY3RTdXJ2ZXkge1xyXG4gICAgcHJpdmF0ZSB0aXRsZTogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uRXhwYW5kZWQgPSB0aGlzLmhhbmRsZU9uRXhwYW5kZWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uRXhwYW5kZWQoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmV4cGFuZGVkID0gIXRoaXMuc3RhdGUuZXhwYW5kZWQ7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlkZGVuKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5yZW5kZXJIZWFkZXIoKTtcclxuICAgICAgICB2YXIgYm9keSA9IHRoaXMuc3RhdGUuZXhwYW5kZWQgPyB0aGlzLnJlbmRlckJvZHkoKSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwic3Zfd2luZG93XCI+XHJcbiAgICAgICAgICAgIHtoZWFkZXJ9XHJcbiAgICAgICAgICAgIHtib2R5fVxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySGVhZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGVBID0geyB3aWR0aDogXCIxMDAlXCIgfTtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJzdl93aW5kb3dfdGl0bGVcIj5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZU9uRXhwYW5kZWR9IHN0eWxlPXtzdHlsZUF9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckJvZHkoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzPVwic3Zfd2luZG93X2NvbnRlbnRcIj5cclxuICAgICAgICB7dGhpcy5yZW5kZXJTdXJ2ZXkoKSB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN1cnZleShuZXdQcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlU3VydmV5KG5ld1Byb3BzKTtcclxuICAgICAgICB0aGlzLnRpdGxlID0gbmV3UHJvcHMudGl0bGUgPyBuZXdQcm9wcy50aXRsZSA6IHRoaXMuc3VydmV5LnRpdGxlO1xyXG4gICAgICAgIHZhciBoYXNFeHBhbmRlZCA9IG5ld1Byb3BzW1wiZXhwYW5kZWRcIl0gPyBuZXdQcm9wcy5leHBhbmRlZCA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGV4cGFuZGVkOiBoYXNFeHBhbmRlZCwgaGlkZGVuOiBmYWxzZSB9O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZChmdW5jdGlvbiAoczogU3VydmV5LlN1cnZleU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUuaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290Ijoic3JjIn0=

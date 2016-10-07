/*!
* surveyjs - Survey JavaScript library v0.9.12
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
                    item.text = typeof (value.hasText) !== 'undefined' ? value.itemText : value["text"];
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        function JsonMetadataClass(name, properties, creator, parentName) {
            if (creator === void 0) { creator = null; }
            if (parentName === void 0) { parentName = null; }
            this.name = name;
            this.creator = creator;
            this.parentName = parentName;
            this.properties = null;
            this.requiredProperties = null;
            this.properties = new Array();
            for (var i = 0; i < properties.length; i++) {
                var prop = this.createProperty(properties[i]);
                if (prop) {
                    this.properties.push(prop);
                }
            }
        }
        JsonMetadataClass.prototype.find = function (name) {
            for (var i = 0; i < this.properties.length; i++) {
                if (this.properties[i].name == name)
                    return this.properties[i];
            }
            return null;
        };
        JsonMetadataClass.prototype.createProperty = function (propInfo) {
            var propertyName = typeof propInfo === "string" ? propInfo : propInfo.name;
            if (!propertyName)
                return;
            var propertyType = null;
            var typeIndex = propertyName.indexOf(JsonMetadataClass.typeSymbol);
            if (typeIndex > -1) {
                propertyType = propertyName.substring(typeIndex + 1);
                propertyName = propertyName.substring(0, typeIndex);
            }
            propertyName = this.getPropertyName(propertyName);
            var prop = new JsonObjectProperty(propertyName);
            if (propertyType) {
                prop.type = propertyType;
            }
            if (typeof propInfo === "object") {
                if (propInfo.type) {
                    prop.type = propInfo.type;
                }
                if (propInfo.default) {
                    prop.defaultValue = propInfo.default;
                }
                if (propInfo.isRequired) {
                    this.makePropertyRequired(prop.name);
                }
                if (propInfo.choices) {
                    var choicesFunc = typeof propInfo.choices === "function" ? propInfo.choices : null;
                    var choicesValue = typeof propInfo.choices !== "function" ? propInfo.choices : null;
                    prop.setChoices(choicesValue, choicesFunc);
                }
                if (propInfo.onGetValue) {
                    prop.onGetValue = propInfo.onGetValue;
                }
                if (propInfo.onSetValue) {
                    prop.onSetValue = propInfo.onSetValue;
                }
                if (propInfo.className) {
                    prop.className = propInfo.className;
                }
                if (propInfo.baseClassName) {
                    prop.baseClassName = propInfo.baseClassName;
                }
                if (propInfo.classNamePart) {
                    prop.classNamePart = propInfo.classNamePart;
                }
            }
            return prop;
        };
        JsonMetadataClass.prototype.getPropertyName = function (propertyName) {
            if (propertyName.length == 0 || propertyName[0] != JsonMetadataClass.requiredSymbol)
                return propertyName;
            propertyName = propertyName.slice(1);
            this.makePropertyRequired(propertyName);
            return propertyName;
        };
        JsonMetadataClass.prototype.makePropertyRequired = function (propertyName) {
            if (!this.requiredProperties) {
                this.requiredProperties = new Array();
            }
            this.requiredProperties.push(propertyName);
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
        JsonMetadata.prototype.addClass = function (name, properties, creator, parentName) {
            if (creator === void 0) { creator = null; }
            if (parentName === void 0) { parentName = null; }
            var metaDataClass = new JsonMetadataClass(name, properties, creator, parentName);
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var ChoicesRestfull = (function (_super) {
        __extends(ChoicesRestfull, _super);
        function ChoicesRestfull() {
            _super.call(this);
            this.url = "";
            this.path = "";
            this.valueName = "";
            this.titleName = "";
            this.error = null;
        }
        ChoicesRestfull.prototype.run = function () {
            if (!this.url || !this.getResultCallback)
                return;
            this.error = null;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var self = this;
            xhr.onload = function () {
                if (xhr.status == 200) {
                    self.onLoad(JSON.parse(xhr.response));
                }
                else {
                    self.onError(xhr.statusText, xhr.responseText);
                }
            };
            xhr.send();
        };
        ChoicesRestfull.prototype.getType = function () { return "choicesByUrl"; };
        Object.defineProperty(ChoicesRestfull.prototype, "isEmpty", {
            get: function () {
                return !this.url && !this.path && !this.valueName && !this.titleName;
            },
            enumerable: true,
            configurable: true
        });
        ChoicesRestfull.prototype.setData = function (json) {
            this.clear();
            if (json.url)
                this.url = json.url;
            if (json.path)
                this.path = json.path;
            if (json.valueName)
                this.valueName = json.valueName;
            if (json.titleName)
                this.titleName = json.titleName;
        };
        ChoicesRestfull.prototype.clear = function () {
            this.url = "";
            this.path = "";
            this.valueName = "";
            this.titleName = "";
        };
        ChoicesRestfull.prototype.onLoad = function (result) {
            var items = [];
            result = this.getResultAfterPath(result);
            if (result && result["length"]) {
                for (var i = 0; i < result.length; i++) {
                    var itemValue = result[i];
                    if (!itemValue)
                        continue;
                    var value = this.getValue(itemValue);
                    var title = this.getTitle(itemValue);
                    items.push(new Survey.ItemValue(value, title));
                }
            }
            else {
                this.error = new Survey.CustomError(Survey.surveyLocalization.getString("urlGetChoicesError"));
            }
            this.getResultCallback(items);
        };
        ChoicesRestfull.prototype.onError = function (status, response) {
            this.error = new Survey.CustomError(Survey.surveyLocalization.getString("urlRequestError")["format"](status, response));
            this.getResultCallback([]);
        };
        ChoicesRestfull.prototype.getResultAfterPath = function (result) {
            if (!result)
                return result;
            if (!this.path)
                return result;
            var pathes = this.getPathes();
            for (var i = 0; i < pathes.length; i++) {
                result = result[pathes[i]];
                if (!result)
                    return null;
            }
            return result;
        };
        ChoicesRestfull.prototype.getPathes = function () {
            var pathes = [];
            if (this.path.indexOf(';') > -1) {
                pathes = this.path.split(';');
            }
            else {
                pathes = this.path.split(',');
            }
            if (pathes.length == 0)
                pathes.push(this.path);
            return pathes;
        };
        ChoicesRestfull.prototype.getValue = function (item) {
            if (this.valueName)
                return item[this.valueName];
            var len = Object.keys(item).length;
            if (len < 1)
                return null;
            return item[Object.keys(item)[0]];
        };
        ChoicesRestfull.prototype.getTitle = function (item) {
            if (!this.titleName)
                return null;
            return item[this.titleName];
        };
        return ChoicesRestfull;
    }(Survey.Base));
    Survey.ChoicesRestfull = ChoicesRestfull;
    Survey.JsonObject.metaData.addClass("choicesByUrl", ["url", "path", "valueName", "titleName"], function () { return new ChoicesRestfull(); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
/// <reference path="base.ts" />
/// <reference path="conditions.ts" />
var Survey;
(function (Survey) {
    var ConditionsParser = (function () {
        function ConditionsParser() {
        }
        ConditionsParser.prototype.parse = function (text, root) {
            this.text = text;
            this.root = root;
            this.root.clear();
            this.at = 0;
            this.length = this.text.length;
            var res = this.parseText();
            return res;
        };
        ConditionsParser.prototype.toString = function (root) {
            this.root = root;
            return this.nodeToString(root);
        };
        ConditionsParser.prototype.toStringCore = function (value) {
            if (!value)
                return "";
            if (value["children"])
                return this.nodeToString(value);
            if (value["left"])
                return this.conditionToString(value);
            return "";
        };
        ConditionsParser.prototype.nodeToString = function (node) {
            if (node.isEmpty)
                return "";
            var res = "";
            for (var i = 0; i < node.children.length; i++) {
                var nodeText = this.toStringCore(node.children[i]);
                if (nodeText) {
                    if (res)
                        res += ' ' + node.connective + ' ';
                    res += nodeText;
                }
            }
            if (node != this.root && node.children.length > 1) {
                res = '(' + res + ')';
            }
            return res;
        };
        ConditionsParser.prototype.conditionToString = function (condition) {
            if (!condition.right || !condition.operator)
                return "";
            var left = condition.left;
            if (left && !this.isNumeric(left))
                left = "'" + left + "'";
            var res = left + ' ' + this.operationToString(condition.operator);
            if (this.isNoRightOperation(condition.operator))
                return res;
            var right = condition.right;
            if (right && !this.isNumeric(right))
                right = "'" + right + "'";
            return res + ' ' + right;
        };
        ConditionsParser.prototype.operationToString = function (op) {
            if (op == "equal")
                return "=";
            if (op == "notequal")
                return "!=";
            if (op == "greater")
                return ">";
            if (op == "less")
                return "<";
            if (op == "greaterorequal")
                return ">=";
            if (op == "lessorequal")
                return "<=";
            return op;
        };
        ConditionsParser.prototype.isNumeric = function (value) {
            var val = parseFloat(value);
            if (isNaN(val))
                return false;
            return isFinite(val);
        };
        ConditionsParser.prototype.parseText = function () {
            this.node = this.root;
            this.expressionNodes = [];
            this.expressionNodes.push(this.node);
            var res = this.readConditions();
            return res && this.at >= this.length;
        };
        ConditionsParser.prototype.readConditions = function () {
            var res = this.readCondition();
            if (!res)
                return res;
            var connective = this.readConnective();
            if (connective) {
                this.addConnective(connective);
                return this.readConditions();
            }
            return true;
        };
        ConditionsParser.prototype.readCondition = function () {
            if (!this.readExpression())
                return false;
            var left = this.readString();
            if (!left)
                return false;
            var op = this.readOperator();
            if (!op)
                return false;
            var c = new Survey.Condition();
            c.left = left;
            c.operator = op;
            if (!this.isNoRightOperation(op)) {
                var right = this.readString();
                if (!right)
                    return false;
                c.right = right;
            }
            this.addCondition(c);
            return true;
        };
        ConditionsParser.prototype.readExpression = function () {
            this.skip();
            if (this.at >= this.length || this.ch != '(')
                return true;
            this.at++;
            this.pushExpression();
            var res = this.readConditions();
            if (res) {
                this.skip();
                res = this.ch == ')';
                this.at++;
                this.popExpression();
            }
            return res;
        };
        Object.defineProperty(ConditionsParser.prototype, "ch", {
            get: function () { return this.text.charAt(this.at); },
            enumerable: true,
            configurable: true
        });
        ConditionsParser.prototype.skip = function () {
            while (this.at < this.length && this.isSpace(this.ch))
                this.at++;
        };
        ConditionsParser.prototype.isSpace = function (c) {
            return c == ' ' || c == '\n' || c == '\t' || c == '\r';
        };
        ConditionsParser.prototype.isQuotes = function (c) {
            return c == "'" || c == '"';
        };
        ConditionsParser.prototype.isOperatorChar = function (c) {
            return c == '>' || c == '<' || c == '=' || c == '!';
        };
        ConditionsParser.prototype.isBrackets = function (c) {
            return c == '(' || c == ')';
        };
        ConditionsParser.prototype.readString = function () {
            this.skip();
            if (this.at >= this.length)
                return null;
            var start = this.at;
            var hasQuotes = this.isQuotes(this.ch);
            if (hasQuotes)
                this.at++;
            var isFirstOpCh = this.isOperatorChar(this.ch);
            while (this.at < this.length) {
                if (!hasQuotes && this.isSpace(this.ch))
                    break;
                if (this.isQuotes(this.ch)) {
                    if (hasQuotes)
                        this.at++;
                    break;
                }
                if (!hasQuotes) {
                    if (isFirstOpCh != this.isOperatorChar(this.ch))
                        break;
                    if (this.isBrackets(this.ch))
                        break;
                }
                this.at++;
            }
            if (this.at <= start)
                return null;
            var res = this.text.substr(start, this.at - start);
            if (res) {
                if (res.length > 1 && this.isQuotes(res[0])) {
                    var len = res.length - 1;
                    if (this.isQuotes(res[res.length - 1]))
                        len--;
                    res = res.substr(1, len);
                }
            }
            return res;
        };
        ConditionsParser.prototype.isNoRightOperation = function (op) {
            return op == "empty" || op == "notempty";
        };
        ConditionsParser.prototype.readOperator = function () {
            var op = this.readString();
            if (!op)
                return null;
            op = op.toLowerCase();
            if (op == '>')
                op = "greater";
            if (op == '<')
                op = "less";
            if (op == '>=' || op == '=>')
                op = "greaterorequal";
            if (op == '<=' || op == '=<')
                op = "lessorequal";
            if (op == '=' || op == '==')
                op = "equal";
            if (op == '<>' || op == '!=')
                op = "notequal";
            if (op == 'contain')
                op = "contains";
            if (op == 'notcontain')
                op = "notcontains";
            return op;
        };
        ConditionsParser.prototype.readConnective = function () {
            var con = this.readString();
            if (!con)
                return null;
            con = con.toLowerCase();
            if (con == "&" || con == "&&")
                con = "and";
            if (con == "|" || con == "||")
                con = "or";
            if (con != "and" && con != "or")
                con = null;
            return con;
        };
        ConditionsParser.prototype.pushExpression = function () {
            var node = new Survey.ConditionNode();
            this.expressionNodes.push(node);
            this.node = node;
        };
        ConditionsParser.prototype.popExpression = function () {
            var node = this.expressionNodes.pop();
            this.node = this.expressionNodes[this.expressionNodes.length - 1];
            this.node.children.push(node);
        };
        ConditionsParser.prototype.addCondition = function (c) {
            this.node.children.push(c);
        };
        ConditionsParser.prototype.addConnective = function (con) {
            if (this.node.children.length < 2) {
                this.node.connective = con;
            }
            else {
                if (this.node.connective != con) {
                    var oldCon = this.node.connective;
                    var oldChildren = this.node.children;
                    this.node.clear();
                    this.node.connective = con;
                    var oldNode = new Survey.ConditionNode();
                    oldNode.connective = oldCon;
                    oldNode.children = oldChildren;
                    this.node.children.push(oldNode);
                    var newNode = new Survey.ConditionNode();
                    this.node.children.push(newNode);
                    this.node = newNode;
                }
            }
        };
        return ConditionsParser;
    }());
    Survey.ConditionsParser = ConditionsParser;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
/// <reference path="conditionsParser.ts" />
var Survey;
(function (Survey) {
    var Condition = (function () {
        function Condition() {
            this.opValue = "equal";
        }
        Object.defineProperty(Condition, "operators", {
            get: function () {
                if (Condition.operatorsValue != null)
                    return Condition.operatorsValue;
                Condition.operatorsValue = {
                    empty: function (left, right) { return !left; },
                    notempty: function (left, right) { return !(!left); },
                    equal: function (left, right) { return left == right; },
                    notequal: function (left, right) { return left != right; },
                    contains: function (left, right) { return left && left["indexOf"] && left.indexOf(right) > -1; },
                    notcontains: function (left, right) { return !left || !left["indexOf"] || left.indexOf(right) == -1; },
                    greater: function (left, right) { return left > right; },
                    less: function (left, right) { return left < right; },
                    greaterorequal: function (left, right) { return left >= right; },
                    lessorequal: function (left, right) { return left <= right; }
                };
                return Condition.operatorsValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Condition.prototype, "operator", {
            get: function () { return this.opValue; },
            set: function (value) {
                if (!value)
                    return;
                value = value.toLowerCase();
                if (!Condition.operators[value])
                    return;
                this.opValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Condition.prototype.perform = function (left, right) {
            if (left === void 0) { left = null; }
            if (right === void 0) { right = null; }
            if (!left)
                left = this.left;
            if (!right)
                right = this.right;
            return Condition.operators[this.operator](this.getPureValue(left), this.getPureValue(right));
        };
        Condition.prototype.getPureValue = function (val) {
            if (!val || (typeof val != "string"))
                return val;
            var str = "";
            if (val.length > 0 && (val[0] == "'" || val[0] == '"'))
                val = val.substr(1);
            var len = val.length;
            if (len > 0 && (val[len - 1] == "'" || val[len - 1] == '"'))
                val = val.substr(0, len - 1);
            return val;
        };
        Condition.operatorsValue = null;
        return Condition;
    }());
    Survey.Condition = Condition;
    var ConditionNode = (function () {
        function ConditionNode() {
            this.connectiveValue = "and";
            this.children = [];
        }
        Object.defineProperty(ConditionNode.prototype, "connective", {
            get: function () { return this.connectiveValue; },
            set: function (value) {
                if (!value)
                    return;
                value = value.toLowerCase();
                if (value == "&" || value == "&&")
                    value = "and";
                if (value == "|" || value == "||")
                    value = "or";
                if (value != "and" && value != "or")
                    return;
                this.connectiveValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConditionNode.prototype, "isEmpty", {
            get: function () { return this.children.length == 0; },
            enumerable: true,
            configurable: true
        });
        ConditionNode.prototype.clear = function () {
            this.children = [];
            this.connective = "and";
        };
        return ConditionNode;
    }());
    Survey.ConditionNode = ConditionNode;
    var ConditionRunner = (function () {
        function ConditionRunner(expression) {
            this.root = new ConditionNode();
            this.expression = expression;
        }
        Object.defineProperty(ConditionRunner.prototype, "expression", {
            get: function () { return this.expressionValue; },
            set: function (value) {
                if (this.expression == value)
                    return;
                this.expressionValue = value;
                new Survey.ConditionsParser().parse(this.expressionValue, this.root);
            },
            enumerable: true,
            configurable: true
        });
        ConditionRunner.prototype.run = function (values) {
            this.values = values;
            return this.runNode(this.root);
        };
        ConditionRunner.prototype.runNode = function (node) {
            var onFirstFail = node.connective == "and";
            for (var i = 0; i < node.children.length; i++) {
                var res = this.runNodeCondition(node.children[i]);
                if (!res && onFirstFail)
                    return false;
                if (res && !onFirstFail)
                    return true;
            }
            return onFirstFail;
        };
        ConditionRunner.prototype.runNodeCondition = function (value) {
            if (!value)
                return false;
            if (value["children"])
                return this.runNode(value);
            if (value["left"])
                return this.runCondition(value);
            return false;
        };
        ConditionRunner.prototype.runCondition = function (condition) {
            var left = condition.left;
            var name = this.getValueName(left);
            if (name) {
                if (!(name in this.values))
                    return false;
                left = this.values[name];
            }
            var right = condition.right;
            name = this.getValueName(right);
            if (name) {
                if (!(name in this.values))
                    return false;
                right = this.values[name];
            }
            return condition.perform(left, right);
        };
        ConditionRunner.prototype.getValueName = function (nodeValue) {
            if (!nodeValue)
                return null;
            if (typeof nodeValue !== 'string')
                return null;
            if (nodeValue.length < 3 || nodeValue[0] != '{' || nodeValue[nodeValue.length - 1] != '}')
                return null;
            return nodeValue.substr(1, nodeValue.length - 2);
        };
        return ConditionRunner;
    }());
    Survey.ConditionRunner = ConditionRunner;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            xhr.onload = xhr.onerror = function () {
                if (!onSendResult)
                    return;
                onSendResult(xhr.status == 200, xhr.response);
            };
            xhr.send(dataStringify);
        };
        dxSurveyService.prototype.sendFile = function (postId, file, onSendFile) {
            var xhr = new XMLHttpRequest();
            xhr.onload = xhr.onerror = function () {
                if (!onSendFile)
                    return;
                onSendFile(xhr.status == 200, JSON.parse(xhr.response));
            };
            xhr.open("POST", dxSurveyService.serviceUrl + '/upload/', true);
            var formData = new FormData();
            formData.append("file", file);
            formData.append("postId", postId);
            xhr.send(formData);
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            res.sort();
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
        minRowCountError: "Please fill at least {0} rows.",
        minSelectError: "Please select at least {0} variants.",
        maxSelectError: "Please select not more than {0} variants.",
        numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
        numericMin: "The '{0}' should be equal or more than {1}",
        numericMax: "The '{0}' should be equal or less than {1}",
        invalidEmail: "Please enter a valid e-mail.",
        urlRequestError: "The request return error '{0}'. {1}",
        urlGetChoicesError: "The request returns empty data or the 'path' property is incorrect",
        exceedMaxSize: "The file size should not exceed {0}.",
        otherRequiredError: "Please enter the others value.",
        uploadingFile: "Your file is uploading. Please wait several seconds and try again.",
        addRow: "Add Row",
        removeRow: "Remove"
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
    var ExceedSizeError = (function (_super) {
        __extends(ExceedSizeError, _super);
        function ExceedSizeError(maxSize) {
            _super.call(this);
            this.maxSize = maxSize;
        }
        ExceedSizeError.prototype.getText = function () {
            return Survey.surveyLocalization.getString("exceedMaxSize")["format"](this.getTextSize());
        };
        ExceedSizeError.prototype.getTextSize = function () {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            var fixed = [0, 0, 2, 3, 3];
            if (this.maxSize == 0)
                return '0 Byte';
            var i = Math.floor(Math.log(this.maxSize) / Math.log(1024));
            var value = this.maxSize / Math.pow(1024, i);
            return value.toFixed(fixed[i]) + ' ' + sizes[i];
        };
        return ExceedSizeError;
    }(Survey.SurveyError));
    Survey.ExceedSizeError = ExceedSizeError;
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            this.conditionRunner = null;
            this.visibleIf = "";
            this.visibleValue = true;
            this.startWithNewLine = true;
            this.visibleIndexValue = -1;
            this.width = "";
            this.renderWidthValue = "";
            this.rightIndentValue = 0;
            this.indent = 0;
            this.idValue = QuestionBase.getQuestionId();
            this.onCreating();
        }
        QuestionBase.getQuestionId = function () {
            return "sq_" + QuestionBase.questionCounter++;
        };
        Object.defineProperty(QuestionBase.prototype, "visible", {
            get: function () { return this.visibleValue; },
            set: function (val) {
                if (val == this.visible)
                    return;
                this.visibleValue = val;
                this.fireCallback(this.visibilityChangedCallback);
                this.fireCallback(this.rowVisibilityChangedCallback);
                if (this.survey) {
                    this.survey.questionVisibilityChanged(this, this.visible);
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
        QuestionBase.prototype.hasErrors = function (fireCallback) {
            if (fireCallback === void 0) { fireCallback = true; }
            return false;
        };
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
        Object.defineProperty(QuestionBase.prototype, "id", {
            get: function () { return this.idValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionBase.prototype, "renderWidth", {
            get: function () { return this.renderWidthValue; },
            set: function (val) {
                if (val == this.renderWidth)
                    return;
                this.renderWidthValue = val;
                this.fireCallback(this.renderWidthChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionBase.prototype, "rightIndent", {
            get: function () { return this.rightIndentValue; },
            set: function (val) {
                if (val == this.rightIndent)
                    return;
                this.rightIndentValue = val;
                this.fireCallback(this.renderWidthChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        QuestionBase.prototype.focus = function () {
            var el = document.getElementById(this.id);
            if (!el || !el.scrollIntoView)
                return;
            var elemTop = el.getBoundingClientRect().top;
            if (elemTop < 0) {
                el.scrollIntoView();
                this.fireCallback(this.focusCallback);
            }
        };
        QuestionBase.prototype.setData = function (newValue) {
            this.data = newValue;
            this.survey = (newValue && newValue["questionAdded"]) ? newValue : null;
            this.onSetData();
        };
        QuestionBase.prototype.fireCallback = function (callback) {
            if (callback)
                callback();
        };
        QuestionBase.prototype.onSetData = function () { };
        QuestionBase.prototype.onCreating = function () { };
        QuestionBase.prototype.runCondition = function (values) {
            if (!this.visibleIf)
                return;
            if (!this.conditionRunner)
                this.conditionRunner = new Survey.ConditionRunner(this.visibleIf);
            this.conditionRunner.expression = this.visibleIf;
            this.visible = this.conditionRunner.run(values);
        };
        //IQuestion
        QuestionBase.prototype.onSurveyValueChanged = function (newValue) {
        };
        QuestionBase.prototype.onSurveyLoad = function () {
        };
        QuestionBase.prototype.setVisibleIndex = function (value) {
            if (this.visibleIndexValue == value)
                return;
            this.visibleIndexValue = value;
            this.fireCallback(this.visibleIndexChangedCallback);
        };
        QuestionBase.prototype.supportGoNextPageAutomatic = function () { return false; };
        QuestionBase.questionCounter = 100;
        return QuestionBase;
    }(Survey.Base));
    Survey.QuestionBase = QuestionBase;
    Survey.JsonObject.metaData.addClass("questionbase", ["!name", { name: "visible:boolean", default: true }, "visibleIf:text",
        { name: "width" }, { name: "startWithNewLine:boolean", default: true }, { name: "indent:number", default: 0, choices: [0, 1, 2, 3] }]);
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        QuestionFactory.DefaultChoices = ["one", "two|second value", "three|third value"];
        return QuestionFactory;
    }());
    Survey.QuestionFactory = QuestionFactory;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="questionbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionRowModel = (function () {
        function QuestionRowModel(page, question) {
            this.page = page;
            this.question = question;
            this.visibleValue = false;
            this.questions = [];
            var self = this;
            this.question.rowVisibilityChangedCallback = function () { self.onRowVisibilityChanged(); };
        }
        Object.defineProperty(QuestionRowModel.prototype, "visible", {
            get: function () { return this.visibleValue; },
            set: function (val) {
                if (val == this.visible)
                    return;
                this.visibleValue = val;
                this.onVisibleChanged();
            },
            enumerable: true,
            configurable: true
        });
        QuestionRowModel.prototype.updateVisible = function () {
            this.visible = this.calcVisible();
            this.setWidth();
        };
        QuestionRowModel.prototype.addQuestion = function (q) {
            this.questions.push(q);
            this.updateVisible();
        };
        QuestionRowModel.prototype.onVisibleChanged = function () {
            if (this.visibilityChangedCallback)
                this.visibilityChangedCallback();
        };
        QuestionRowModel.prototype.setWidth = function () {
            var visCount = this.getVisibleCount();
            if (visCount == 0)
                return;
            var counter = 0;
            for (var i = 0; i < this.questions.length; i++)
                if (this.isQuestionVisible(this.questions[i])) {
                    this.questions[i].renderWidth = this.question.width ? this.question.width : Math.floor(100 / visCount) + '%';
                    this.questions[i].rightIndent = counter < visCount - 1 ? 1 : 0;
                    counter++;
                }
        };
        QuestionRowModel.prototype.onRowVisibilityChanged = function () {
            this.page.onRowVisibilityChanged(this);
        };
        QuestionRowModel.prototype.getVisibleCount = function () {
            var res = 0;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.isQuestionVisible(this.questions[i]))
                    res++;
            }
            return res;
        };
        QuestionRowModel.prototype.isQuestionVisible = function (q) { return this.page.isQuestionVisible(q); };
        QuestionRowModel.prototype.calcVisible = function () { return this.getVisibleCount() > 0; };
        return QuestionRowModel;
    }());
    Survey.QuestionRowModel = QuestionRowModel;
    var PageModel = (function (_super) {
        __extends(PageModel, _super);
        function PageModel(name) {
            if (name === void 0) { name = ""; }
            _super.call(this);
            this.name = name;
            this.rowValues = null;
            this.conditionRunner = null;
            this.questions = new Array();
            this.data = null;
            this.visibleIf = "";
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
        Object.defineProperty(PageModel.prototype, "rows", {
            get: function () {
                this.rowValues = this.buildRows();
                return this.rowValues;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageModel.prototype, "isActive", {
            get: function () { return (!this.data) || this.data.currentPage == this; },
            enumerable: true,
            configurable: true
        });
        PageModel.prototype.isQuestionVisible = function (question) { return question.visible || this.isDesignMode; };
        PageModel.prototype.createRow = function (question) { return new QuestionRowModel(this, question); };
        Object.defineProperty(PageModel.prototype, "isDesignMode", {
            get: function () { return this.data && this.data.isDesignMode; },
            enumerable: true,
            configurable: true
        });
        PageModel.prototype.buildRows = function () {
            var result = new Array();
            var lastRowVisibleIndex = -1;
            var self = this;
            for (var i = 0; i < this.questions.length; i++) {
                var q = this.questions[i];
                result.push(this.createRow(q));
                if (q.startWithNewLine) {
                    lastRowVisibleIndex = i;
                    result[i].addQuestion(q);
                }
                else {
                    if (lastRowVisibleIndex < 0)
                        lastRowVisibleIndex = i;
                    result[lastRowVisibleIndex].addQuestion(q);
                }
            }
            for (var i = 0; i < result.length; i++) {
                result[i].setWidth();
            }
            return result;
        };
        PageModel.prototype.onRowVisibilityChanged = function (row) {
            if (!this.isActive || !this.rowValues)
                return;
            var index = this.rowValues.indexOf(row);
            for (var i = index; i >= 0; i--) {
                if (this.rowValues[i].questions.indexOf(row.question) > -1) {
                    this.rowValues[i].updateVisible();
                    break;
                }
            }
        };
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
        PageModel.prototype.scrollToFirstQuestion = function () {
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i].visible) {
                    this.questions[i].focus();
                    break;
                }
            }
        };
        PageModel.prototype.hasErrors = function (fireCallback, focuseOnFirstError) {
            if (fireCallback === void 0) { fireCallback = true; }
            if (focuseOnFirstError === void 0) { focuseOnFirstError = false; }
            var result = false;
            var firstErrorQuestion = null;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i].visible && this.questions[i].hasErrors(fireCallback)) {
                    if (focuseOnFirstError && firstErrorQuestion == null) {
                        firstErrorQuestion = this.questions[i];
                    }
                    result = true;
                }
            }
            if (firstErrorQuestion)
                firstErrorQuestion.focus();
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
        PageModel.prototype.runCondition = function (values) {
            if (!this.visibleIf)
                return;
            if (!this.conditionRunner)
                this.conditionRunner = new Survey.ConditionRunner(this.visibleIf);
            this.conditionRunner.expression = this.visibleIf;
            this.visible = this.conditionRunner.run(values);
        };
        PageModel.prototype.onNumChanged = function (value) {
        };
        return PageModel;
    }(Survey.Base));
    Survey.PageModel = PageModel;
    Survey.JsonObject.metaData.addClass("page", ["name", { name: "questions", baseClassName: "question" }, { name: "visible:boolean", default: true }, "visibleIf", "title"], function () { return new PageModel(); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
/// <reference path="textPreProcessor.ts" />
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
            this.commentTextValue = "";
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
            set: function (newValue) {
                this.titleValue = newValue;
                this.fireCallback(this.titleChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "processedTitle", {
            get: function () { return this.survey != null ? this.survey.processText(this.title) : this.title; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "fullTitle", {
            get: function () {
                if (this.survey && this.survey.questionTitleTemplate) {
                    if (!this.textPreProcessor) {
                        var self = this;
                        this.textPreProcessor = new Survey.TextPreProcessor();
                        this.textPreProcessor.onHasValue = function (name) { return self.canProcessedTextValues(name.toLowerCase()); };
                        this.textPreProcessor.onProcess = function (name) { return self.getProcessedTextValue(name); };
                    }
                    return this.textPreProcessor.process(this.survey.questionTitleTemplate);
                }
                var requireText = this.requiredText;
                if (requireText)
                    requireText += " ";
                var no = this.no;
                if (no)
                    no += ". ";
                return no + requireText + this.processedTitle;
            },
            enumerable: true,
            configurable: true
        });
        Question.prototype.canProcessedTextValues = function (name) {
            return name == "no" || name == "title" || name == "require";
        };
        Question.prototype.getProcessedTextValue = function (name) {
            if (name == "no")
                return this.no;
            if (name == "title")
                return this.processedTitle;
            if (name == "require")
                return this.requiredText;
            return null;
        };
        Question.prototype.supportComment = function () { return false; };
        Question.prototype.supportOther = function () { return false; };
        Object.defineProperty(Question.prototype, "isRequired", {
            get: function () { return this.isRequiredValue; },
            set: function (val) {
                if (this.isRequired == val)
                    return;
                this.isRequiredValue = val;
                this.fireCallback(this.titleChangedCallback);
            },
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
        Object.defineProperty(Question.prototype, "commentText", {
            get: function () { return this.commentTextValue ? this.commentTextValue : Survey.surveyLocalization.getString("otherItemText"); },
            set: function (value) {
                this.commentTextValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "hasOther", {
            get: function () { return this.hasOtherValue; },
            set: function (val) {
                if (!this.supportOther() || this.hasOther == val)
                    return;
                this.hasOtherValue = val;
                if (this.hasOther)
                    this.hasComment = false;
                this.hasOtherChanged();
            },
            enumerable: true,
            configurable: true
        });
        Question.prototype.hasOtherChanged = function () { };
        Object.defineProperty(Question.prototype, "no", {
            get: function () {
                if (this.visibleIndex < 0)
                    return "";
                var startIndex = 1;
                var isNumeric = true;
                var str = "";
                if (this.survey && this.survey.questionStartIndex) {
                    str = this.survey.questionStartIndex;
                    if (parseInt(str))
                        startIndex = parseInt(str);
                    else if (str.length == 1)
                        isNumeric = false;
                }
                if (isNumeric)
                    return (this.visibleIndex + startIndex).toString();
                return String.fromCharCode(str.charCodeAt(0) + this.visibleIndex);
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
                return this.valueFromData(this.getValueCore());
            },
            set: function (newValue) {
                this.setNewValue(newValue);
                this.fireCallback(this.valueChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "comment", {
            get: function () { return this.getComment(); },
            set: function (newValue) {
                if (this.comment == newValue)
                    return;
                this.setComment(newValue);
                this.fireCallback(this.commentChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        Question.prototype.getComment = function () { return this.data != null ? this.data.getComment(this.name) : this.questionComment; };
        Question.prototype.setComment = function (newValue) {
            this.setNewComment(newValue);
        };
        Question.prototype.isEmpty = function () { return this.value == null; };
        Question.prototype.hasErrors = function (fireCallback) {
            if (fireCallback === void 0) { fireCallback = true; }
            this.checkForErrors(fireCallback);
            return this.errors.length > 0;
        };
        Object.defineProperty(Question.prototype, "requiredText", {
            get: function () { return this.survey != null && this.isRequired ? this.survey.requiredText : ""; },
            enumerable: true,
            configurable: true
        });
        Question.prototype.checkForErrors = function (fireCallback) {
            var errorLength = this.errors ? this.errors.length : 0;
            this.errors = [];
            this.onCheckForErrors(this.errors);
            if (this.errors.length == 0 && this.value) {
                var error = this.runValidators();
                if (error) {
                    this.errors.push(error);
                }
            }
            if (this.survey && this.errors.length == 0) {
                var error = this.survey.validateQuestion(this.name);
                if (error) {
                    this.errors.push(error);
                }
            }
            if (fireCallback && (errorLength != this.errors.length || errorLength > 0)) {
                this.fireCallback(this.errorsChangedCallback);
            }
        };
        Question.prototype.onCheckForErrors = function (errors) {
            if (this.hasRequiredError()) {
                this.errors.push(new Survey.AnswerRequiredError());
            }
        };
        Question.prototype.hasRequiredError = function () {
            return this.isRequired && this.isEmpty();
        };
        Question.prototype.runValidators = function () {
            return new Survey.ValidatorRunner().run(this);
        };
        Question.prototype.setNewValue = function (newValue) {
            this.setNewValueInData(newValue);
            this.onValueChanged();
        };
        Question.prototype.setNewValueInData = function (newValue) {
            if (!this.isValueChangedInSurvey) {
                newValue = this.valueToData(newValue);
                this.setValueCore(newValue);
            }
        };
        Question.prototype.getValueCore = function () {
            return this.data != null ? this.data.getValue(this.name) : this.questionValue;
        };
        Question.prototype.setValueCore = function (newValue) {
            if (this.data != null) {
                this.data.setValue(this.name, newValue);
            }
            else {
                this.questionValue = newValue;
            }
        };
        Question.prototype.valueFromData = function (val) { return val; };
        Question.prototype.valueToData = function (val) { return val; };
        Question.prototype.onValueChanged = function () { };
        Question.prototype.setNewComment = function (newValue) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            }
            else
                this.questionComment = newValue;
        };
        //IQuestion
        Question.prototype.onSurveyValueChanged = function (newValue) {
            this.isValueChangedInSurvey = true;
            this.value = this.valueFromData(newValue);
            this.fireCallback(this.commentChangedCallback);
            this.isValueChangedInSurvey = false;
        };
        //IValidatorOwner
        Question.prototype.getValidatorTitle = function () { return null; };
        return Question;
    }(Survey.QuestionBase));
    Survey.Question = Question;
    Survey.JsonObject.metaData.addClass("question", [{ name: "title:text", onGetValue: function (obj) { return obj.titleValue; } },
        { name: "commentText", onGetValue: function (obj) { return obj.commentTextValue; } },
        "isRequired:boolean", { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }], null, "questionbase");
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            this.choicesFromUrl = null;
            this.choicesValues = new Array();
            this.otherErrorText = null;
            this.storeOthersAsComment = true;
            this.choicesOrderValue = "none";
            this.isSettingComment = false;
            this.choicesByUrl = this.createRestfull();
            var self = this;
            this.choicesByUrl.getResultCallback = function (items) { self.onLoadChoicesFromUrl(items); };
        }
        Object.defineProperty(QuestionSelectBase.prototype, "isOtherSelected", {
            get: function () {
                return this.getStoreOthersAsComment() ? this.getHasOther(this.value) : this.getHasOther(this.cachedValue);
            },
            enumerable: true,
            configurable: true
        });
        QuestionSelectBase.prototype.getHasOther = function (val) {
            return val == this.otherItem.value;
        };
        QuestionSelectBase.prototype.createRestfull = function () { return new Survey.ChoicesRestfull(); };
        QuestionSelectBase.prototype.getComment = function () {
            if (this.getStoreOthersAsComment())
                return _super.prototype.getComment.call(this);
            return this.commentValue;
        };
        QuestionSelectBase.prototype.setComment = function (newValue) {
            if (this.getStoreOthersAsComment())
                _super.prototype.setComment.call(this, newValue);
            else {
                if (!this.isSettingComment && newValue != this.commentValue) {
                    this.isSettingComment = true;
                    this.commentValue = newValue;
                    if (this.isOtherSelected) {
                        this.setNewValueInData(this.cachedValue);
                    }
                    this.isSettingComment = false;
                }
            }
        };
        QuestionSelectBase.prototype.valueFromData = function (val) {
            if (this.getStoreOthersAsComment())
                return _super.prototype.valueFromData.call(this, val);
            this.cachedValue = this.valueFromDataCore(val);
            return this.cachedValue;
        };
        QuestionSelectBase.prototype.valueToData = function (val) {
            if (this.getStoreOthersAsComment())
                return _super.prototype.valueToData.call(this, val);
            this.cachedValue = val;
            return this.valueToDataCore(val);
        };
        QuestionSelectBase.prototype.valueFromDataCore = function (val) {
            if (!this.hasUnknownValue(val))
                return val;
            if (val == this.otherItem.value)
                return val;
            this.comment = val;
            return this.otherItem.value;
        };
        QuestionSelectBase.prototype.valueToDataCore = function (val) {
            if (val == this.otherItem.value && this.getComment()) {
                val = this.getComment();
            }
            return val;
        };
        QuestionSelectBase.prototype.hasUnknownValue = function (val) {
            if (!val)
                return false;
            var items = this.activeChoices;
            for (var i = 0; i < items.length; i++) {
                if (items[i].value == val)
                    return false;
            }
            return true;
        };
        Object.defineProperty(QuestionSelectBase.prototype, "choices", {
            get: function () { return this.choicesValues; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.choicesValues, newValue);
                this.fireCallback(this.choicesChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        QuestionSelectBase.prototype.hasOtherChanged = function () {
            this.fireCallback(this.choicesChangedCallback);
        };
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
                    return this.activeChoices;
                var result = this.sortVisibleChoices(this.activeChoices.slice());
                if (this.hasOther) {
                    result.push(this.otherItem);
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionSelectBase.prototype, "activeChoices", {
            get: function () { return this.choicesFromUrl ? this.choicesFromUrl : this.choices; },
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
        QuestionSelectBase.prototype.getStoreOthersAsComment = function () { return this.storeOthersAsComment && (this.survey != null ? this.survey.storeOthersAsComment : true); };
        QuestionSelectBase.prototype.onSurveyLoad = function () {
            if (this.choicesByUrl)
                this.choicesByUrl.run();
        };
        QuestionSelectBase.prototype.onLoadChoicesFromUrl = function (array) {
            var errorCount = this.errors.length;
            this.errors = [];
            if (this.choicesByUrl && this.choicesByUrl.error) {
                this.errors.push(this.choicesByUrl.error);
            }
            if (errorCount > 0 || this.errors.length > 0) {
                this.fireCallback(this.errorsChangedCallback);
            }
            var newChoices = null;
            if (array && array.length > 0) {
                newChoices = new Array();
                Survey.ItemValue.setData(newChoices, array);
            }
            this.choicesFromUrl = newChoices;
            this.fireCallback(this.choicesChangedCallback);
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
    Survey.JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean",
        { name: "choices:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.choices); }, onSetValue: function (obj, value) { Survey.ItemValue.setData(obj.choices, value); } },
        { name: "choicesOrder", default: "none", choices: ["none", "asc", "desc", "random"] },
        { name: "choicesByUrl:restfull", className: "ChoicesRestfull", onGetValue: function (obj) { return obj.choicesByUrl.isEmpty ? null : obj.choicesByUrl; }, onSetValue: function (obj, value) { obj.choicesByUrl.setData(value); } },
        { name: "otherText", default: Survey.surveyLocalization.getString("otherItemText") }, "otherErrorText",
        { name: "storeOthersAsComment:boolean", default: true }], null, "question");
    Survey.JsonObject.metaData.addClass("checkboxbase", [{ name: "colCount:number", default: 1, choices: [0, 1, 2, 3, 4] }], null, "selectbase");
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        QuestionCheckboxModel.prototype.getHasOther = function (val) {
            if (!val)
                return false;
            return val.indexOf(this.otherItem.value) >= 0;
        };
        QuestionCheckboxModel.prototype.valueFromDataCore = function (val) {
            if (!val || !val.length)
                return val;
            for (var i = 0; i < val.length; i++) {
                if (val[i] == this.otherItem.value)
                    return val;
                if (this.hasUnknownValue(val[i])) {
                    this.comment = val[i];
                    var newVal = val.slice();
                    newVal[i] = this.otherItem.value;
                    return newVal;
                }
            }
            return val;
        };
        QuestionCheckboxModel.prototype.valueToDataCore = function (val) {
            if (!val || !val.length)
                return val;
            for (var i = 0; i < val.length; i++) {
                if (val[i] == this.otherItem.value) {
                    if (this.getComment()) {
                        var newVal = val.slice();
                        newVal[i] = this.getComment();
                        return newVal;
                    }
                }
            }
            return val;
        };
        QuestionCheckboxModel.prototype.getType = function () {
            return "checkbox";
        };
        return QuestionCheckboxModel;
    }(Survey.QuestionCheckboxBase));
    Survey.QuestionCheckboxModel = QuestionCheckboxModel;
    Survey.JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckboxModel(""); }, "checkboxbase");
    Survey.QuestionFactory.Instance.registerQuestion("checkbox", function (name) { var q = new QuestionCheckboxModel(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
    Survey.JsonObject.metaData.addClass("comment", [{ name: "cols:number", default: 50 }, { name: "rows:number", default: 4 }], function () { return new QuestionCommentModel(""); }, "question");
    Survey.QuestionFactory.Instance.registerQuestion("comment", function (name) { return new QuestionCommentModel(name); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        QuestionDropdownModel.prototype.supportGoNextPageAutomatic = function () { return true; };
        return QuestionDropdownModel;
    }(Survey.QuestionSelectBase));
    Survey.QuestionDropdownModel = QuestionDropdownModel;
    Survey.JsonObject.metaData.addClass("dropdown", [{ name: "optionsCaption", onGetValue: function (obj) { return obj.optionsCaptionValue; } }], function () { return new QuestionDropdownModel(""); }, "selectbase");
    Survey.QuestionFactory.Instance.registerQuestion("dropdown", function (name) { var q = new QuestionDropdownModel(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
    var QuestionFileModel = (function (_super) {
        __extends(QuestionFileModel, _super);
        function QuestionFileModel(name) {
            _super.call(this, name);
            this.name = name;
            this.showPreviewValue = false;
            this.isUploading = false;
        }
        QuestionFileModel.prototype.getType = function () {
            return "file";
        };
        Object.defineProperty(QuestionFileModel.prototype, "showPreview", {
            get: function () { return this.showPreviewValue; },
            set: function (value) { this.showPreviewValue = value; },
            enumerable: true,
            configurable: true
        });
        QuestionFileModel.prototype.loadFile = function (file) {
            var self = this;
            if (this.survey && !this.survey.uploadFile(this.name, file, this.storeDataAsText, function (status) { self.isUploading = status == "uploading"; }))
                return;
            this.setFileValue(file);
        };
        QuestionFileModel.prototype.setFileValue = function (file) {
            if (!FileReader)
                return;
            if (!this.showPreview && !this.storeDataAsText)
                return;
            if (this.checkFileForErrors(file))
                return;
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function (e) {
                if (self.showPreview) {
                    self.previewValue = self.isFileImage(file) ? fileReader.result : null;
                    self.fireCallback(self.previewValueLoadedCallback);
                }
                if (self.storeDataAsText) {
                    self.value = fileReader.result;
                }
            };
            fileReader.readAsDataURL(file);
        };
        QuestionFileModel.prototype.onCheckForErrors = function (errors) {
            _super.prototype.onCheckForErrors.call(this, errors);
            if (this.isUploading) {
                this.errors.push(new Survey.CustomError(Survey.surveyLocalization.getString("uploadingFile")));
            }
        };
        QuestionFileModel.prototype.checkFileForErrors = function (file) {
            var errorLength = this.errors ? this.errors.length : 0;
            this.errors = [];
            if (this.maxSize > 0 && file.size > this.maxSize) {
                this.errors.push(new Survey.ExceedSizeError(this.maxSize));
            }
            if (errorLength != this.errors.length || this.errors.length > 0) {
                this.fireCallback(this.errorsChangedCallback);
            }
            return this.errors.length > 0;
        };
        QuestionFileModel.prototype.isFileImage = function (file) {
            if (!file || !file.type)
                return;
            var str = file.type.toLowerCase();
            return str.indexOf("image") == 0;
        };
        return QuestionFileModel;
    }(Survey.Question));
    Survey.QuestionFileModel = QuestionFileModel;
    Survey.JsonObject.metaData.addClass("file", ["showPreview:boolean", "imageHeight", "imageWidth", "storeDataAsText:boolean", "maxSize:number"], function () { return new QuestionFileModel(""); }, "question");
    Survey.QuestionFactory.Instance.registerQuestion("file", function (name) { return new QuestionFileModel(name); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            get: function () { return this.survey ? this.survey.processHtml(this.html) : this.html; },
            enumerable: true,
            configurable: true
        });
        return QuestionHtmlModel;
    }(Survey.QuestionBase));
    Survey.QuestionHtmlModel = QuestionHtmlModel;
    Survey.JsonObject.metaData.addClass("html", ["html:html"], function () { return new QuestionHtmlModel(""); }, "questionbase");
    Survey.QuestionFactory.Instance.registerQuestion("html", function (name) { return new QuestionHtmlModel(name); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
    Survey.JsonObject.metaData.addClass("matrix", [{ name: "columns:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.columns); }, onSetValue: function (obj, value) { obj.columns = value; } },
        { name: "rows:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.rows); }, onSetValue: function (obj, value) { obj.rows = value; } }], function () { return new QuestionMatrixModel(""); }, "question");
    Survey.QuestionFactory.Instance.registerQuestion("matrix", function (name) { var q = new QuestionMatrixModel(name); q.rows = ["Row 1", "Row 2"]; q.columns = ["Column 1", "Column 2", "Column 3"]; return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        QuestionRadiogroupModel.prototype.supportGoNextPageAutomatic = function () { return true; };
        return QuestionRadiogroupModel;
    }(Survey.QuestionCheckboxBase));
    Survey.QuestionRadiogroupModel = QuestionRadiogroupModel;
    Survey.JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroupModel(""); }, "checkboxbase");
    Survey.QuestionFactory.Instance.registerQuestion("radiogroup", function (name) { var q = new QuestionRadiogroupModel(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        QuestionTextModel.prototype.isEmpty = function () { return _super.prototype.isEmpty.call(this) || this.value == ""; };
        QuestionTextModel.prototype.supportGoNextPageAutomatic = function () { return true; };
        return QuestionTextModel;
    }(Survey.Question));
    Survey.QuestionTextModel = QuestionTextModel;
    Survey.JsonObject.metaData.addClass("text", [{ name: "size:number", default: 25 }], function () { return new QuestionTextModel(""); }, "question");
    Survey.QuestionFactory.Instance.registerQuestion("text", function (name) { return new QuestionTextModel(name); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="question_dropdown.ts" />
/// <reference path="question_checkbox.ts" />
/// <reference path="question_radiogroup.ts" />
/// <reference path="question_text.ts" />
/// <reference path="question_comment.ts" />
/// <reference path="question_baseselect.ts" />
var Survey;
(function (Survey) {
    var MatrixDropdownColumn = (function (_super) {
        __extends(MatrixDropdownColumn, _super);
        function MatrixDropdownColumn(name, title) {
            if (title === void 0) { title = null; }
            _super.call(this);
            this.name = name;
            this.choicesValue = [];
            this.isRequired = false;
            this.hasOther = false;
            this.minWidth = "";
            this.cellType = "default";
            this.colCountValue = -1;
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
        Object.defineProperty(MatrixDropdownColumn.prototype, "colCount", {
            get: function () { return this.colCountValue; },
            set: function (value) {
                if (value < -1 || value > 4)
                    return;
                this.colCountValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return MatrixDropdownColumn;
    }(Survey.Base));
    Survey.MatrixDropdownColumn = MatrixDropdownColumn;
    var MatrixDropdownCell = (function () {
        function MatrixDropdownCell(column, row, data) {
            this.column = column;
            this.row = row;
            this.questionValue = data.createQuestion(this.row, this.column);
            this.questionValue.setData(row);
        }
        Object.defineProperty(MatrixDropdownCell.prototype, "question", {
            get: function () { return this.questionValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatrixDropdownCell.prototype, "value", {
            get: function () { return this.question.value; },
            set: function (value) {
                this.question.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return MatrixDropdownCell;
    }());
    Survey.MatrixDropdownCell = MatrixDropdownCell;
    var MatrixDropdownRowModelBase = (function () {
        function MatrixDropdownRowModelBase(data, value) {
            this.rowValues = {};
            this.rowComments = {};
            this.isSettingValue = false;
            this.cells = [];
            this.data = data;
            this.value = value;
            this.buildCells();
        }
        Object.defineProperty(MatrixDropdownRowModelBase.prototype, "rowName", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatrixDropdownRowModelBase.prototype, "value", {
            get: function () { return this.rowValues; },
            set: function (value) {
                this.isSettingValue = true;
                this.rowValues = {};
                if (value != null) {
                    for (var key in value) {
                        this.rowValues[key] = value[key];
                    }
                }
                for (var i = 0; i < this.cells.length; i++) {
                    this.cells[i].question.onSurveyValueChanged(this.getValue(this.cells[i].column.name));
                }
                this.isSettingValue = false;
            },
            enumerable: true,
            configurable: true
        });
        MatrixDropdownRowModelBase.prototype.getValue = function (name) {
            return this.rowValues[name];
        };
        MatrixDropdownRowModelBase.prototype.setValue = function (name, newValue) {
            if (this.isSettingValue)
                return;
            if (newValue === "")
                newValue = null;
            if (newValue != null) {
                this.rowValues[name] = newValue;
            }
            else {
                delete this.rowValues[name];
            }
            this.data.onRowChanged(this, this.value);
        };
        MatrixDropdownRowModelBase.prototype.getComment = function (name) {
            return this.rowComments[name];
        };
        MatrixDropdownRowModelBase.prototype.setComment = function (name, newValue) {
            this.rowComments[name] = newValue;
        };
        Object.defineProperty(MatrixDropdownRowModelBase.prototype, "isEmpty", {
            get: function () {
                var val = this.value;
                if (!val)
                    return true;
                for (var key in val)
                    return false;
                return true;
            },
            enumerable: true,
            configurable: true
        });
        MatrixDropdownRowModelBase.prototype.buildCells = function () {
            var columns = this.data.columns;
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                this.cells.push(this.createCell(column));
            }
        };
        MatrixDropdownRowModelBase.prototype.createCell = function (column) {
            return new MatrixDropdownCell(column, this, this.data);
        };
        return MatrixDropdownRowModelBase;
    }());
    Survey.MatrixDropdownRowModelBase = MatrixDropdownRowModelBase;
    var QuestionMatrixDropdownModelBase = (function (_super) {
        __extends(QuestionMatrixDropdownModelBase, _super);
        function QuestionMatrixDropdownModelBase(name) {
            _super.call(this, name);
            this.name = name;
            this.columnsValue = [];
            this.choicesValue = [];
            this.isRowChanging = false;
            this.cellTypeValue = "dropdown";
            this.columnColCountValue = 0;
            this.columnMinWidth = "";
            this.horizontalScroll = false;
        }
        QuestionMatrixDropdownModelBase.prototype.getType = function () {
            return "matrixdropdownbase";
        };
        Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "columns", {
            get: function () { return this.columnsValue; },
            set: function (value) {
                this.columnsValue = value;
                this.fireCallback(this.columnsChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "cellType", {
            get: function () { return this.cellTypeValue; },
            set: function (newValue) {
                if (this.cellType == newValue)
                    return;
                this.cellTypeValue = newValue;
                this.fireCallback(this.updateCellsCallbak);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "columnColCount", {
            get: function () { return this.columnColCountValue; },
            set: function (value) {
                if (value < 0 || value > 4)
                    return;
                this.columnColCountValue = value;
                this.fireCallback(this.updateCellsCallbak);
            },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDropdownModelBase.prototype.getColumnTitle = function (column) {
            var result = column.title;
            if (column.isRequired && this.survey) {
                var requireText = this.survey.requiredText;
                if (requireText)
                    requireText += " ";
                result = requireText + result;
            }
            return result;
        };
        QuestionMatrixDropdownModelBase.prototype.getColumnWidth = function (column) {
            return column.minWidth ? column.minWidth : this.columnMinWidth;
        };
        Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "choices", {
            get: function () { return this.choicesValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.choicesValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "optionsCaption", {
            get: function () { return (this.optionsCaptionValue) ? this.optionsCaptionValue : Survey.surveyLocalization.getString("optionsCaption"); },
            set: function (newValue) { this.optionsCaptionValue = newValue; },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDropdownModelBase.prototype.addColumn = function (name, title) {
            if (title === void 0) { title = null; }
            var column = new MatrixDropdownColumn(name, title);
            this.columnsValue.push(column);
            return column;
        };
        Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "visibleRows", {
            get: function () {
                this.generatedVisibleRows = this.generateRows();
                return this.generatedVisibleRows;
            },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDropdownModelBase.prototype.generateRows = function () { return null; };
        QuestionMatrixDropdownModelBase.prototype.createMatrixRow = function (name, text, value) {
            return null;
        };
        QuestionMatrixDropdownModelBase.prototype.createNewValue = function (curValue) { return !curValue ? {} : curValue; };
        QuestionMatrixDropdownModelBase.prototype.getRowValue = function (row, questionValue, create) {
            if (create === void 0) { create = false; }
            var result = questionValue[row.rowName] ? questionValue[row.rowName] : null;
            if (!result && create) {
                result = {};
                questionValue[row.rowName] = result;
            }
            return result;
        };
        QuestionMatrixDropdownModelBase.prototype.onValueChanged = function () {
            if (this.isRowChanging || !(this.generatedVisibleRows) || this.generatedVisibleRows.length == 0)
                return;
            this.isRowChanging = true;
            var val = this.createNewValue(this.value);
            for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                var row = this.generatedVisibleRows[i];
                this.generatedVisibleRows[i].value = this.getRowValue(row, val);
            }
            this.isRowChanging = false;
        };
        QuestionMatrixDropdownModelBase.prototype.hasErrors = function (fireCallback) {
            if (fireCallback === void 0) { fireCallback = true; }
            var errosInColumns = this.hasErrorInColumns(fireCallback);
            return _super.prototype.hasErrors.call(this, fireCallback) || errosInColumns;
        };
        QuestionMatrixDropdownModelBase.prototype.hasErrorInColumns = function (fireCallback) {
            if (!this.generatedVisibleRows)
                return false;
            var res = false;
            for (var colIndex = 0; colIndex < this.columns.length; colIndex++) {
                for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                    var cells = this.generatedVisibleRows[i].cells;
                    res = cells && cells[colIndex] && cells[colIndex].question && cells[colIndex].question.hasErrors(fireCallback) || res;
                }
            }
            return res;
        };
        //IMatrixDropdownData
        QuestionMatrixDropdownModelBase.prototype.createQuestion = function (row, column) {
            var question = this.createQuestionCore(row, column);
            question.name = column.name;
            question.isRequired = column.isRequired;
            question.hasOther = column.hasOther;
            if (column.hasOther) {
                if (question instanceof Survey.QuestionSelectBase) {
                    question.storeOthersAsComment = false;
                }
            }
            return question;
        };
        QuestionMatrixDropdownModelBase.prototype.createQuestionCore = function (row, column) {
            var cellType = column.cellType == "default" ? this.cellType : column.cellType;
            var name = this.getQuestionName(row, column);
            if (cellType == "checkbox")
                return this.createCheckbox(name, column);
            if (cellType == "radiogroup")
                return this.createRadiogroup(name, column);
            if (cellType == "text")
                return this.createText(name, column);
            if (cellType == "comment")
                return this.createComment(name, column);
            return this.createDropdown(name, column);
        };
        QuestionMatrixDropdownModelBase.prototype.getQuestionName = function (row, column) { return row.rowName + "_" + column.name; };
        QuestionMatrixDropdownModelBase.prototype.getColumnChoices = function (column) {
            return column.choices && column.choices.length > 0 ? column.choices : this.choices;
        };
        QuestionMatrixDropdownModelBase.prototype.getColumnOptionsCaption = function (column) {
            return column.optionsCaption ? column.optionsCaption : this.optionsCaption;
        };
        QuestionMatrixDropdownModelBase.prototype.createDropdown = function (name, column) {
            var q = this.createCellQuestion("dropdown", name);
            q.choices = this.getColumnChoices(column);
            q.optionsCaption = this.getColumnOptionsCaption(column);
            return q;
        };
        QuestionMatrixDropdownModelBase.prototype.createCheckbox = function (name, column) {
            var q = this.createCellQuestion("checkbox", name);
            q.choices = this.getColumnChoices(column);
            q.colCount = column.colCount > -1 ? column.colCount : this.columnColCount;
            return q;
        };
        QuestionMatrixDropdownModelBase.prototype.createRadiogroup = function (name, column) {
            var q = this.createCellQuestion("radiogroup", name);
            q.choices = this.getColumnChoices(column);
            q.colCount = column.colCount > -1 ? column.colCount : this.columnColCount;
            return q;
        };
        QuestionMatrixDropdownModelBase.prototype.createText = function (name, column) {
            return this.createCellQuestion("text", name);
        };
        QuestionMatrixDropdownModelBase.prototype.createComment = function (name, column) {
            return this.createCellQuestion("comment", name);
        };
        QuestionMatrixDropdownModelBase.prototype.createCellQuestion = function (questionType, name) {
            return Survey.QuestionFactory.Instance.createQuestion(questionType, name);
        };
        QuestionMatrixDropdownModelBase.prototype.deleteRowValue = function (newValue, row) {
            delete newValue[row.rowName];
            return Object.keys(newValue).length == 0 ? null : newValue;
        };
        QuestionMatrixDropdownModelBase.prototype.onRowChanged = function (row, newRowValue) {
            var newValue = this.createNewValue(this.value);
            var rowValue = this.getRowValue(row, newValue, true);
            for (var key in rowValue)
                delete rowValue[key];
            if (newRowValue) {
                newRowValue = JSON.parse(JSON.stringify(newRowValue));
                for (var key in newRowValue)
                    rowValue[key] = newRowValue[key];
            }
            if (Object.keys(rowValue).length == 0) {
                newValue = this.deleteRowValue(newValue, row);
            }
            this.isRowChanging = true;
            this.setNewValue(newValue);
            this.isRowChanging = false;
        };
        return QuestionMatrixDropdownModelBase;
    }(Survey.Question));
    Survey.QuestionMatrixDropdownModelBase = QuestionMatrixDropdownModelBase;
    Survey.JsonObject.metaData.addClass("matrixdropdowncolumn", ["name", { name: "title", onGetValue: function (obj) { return obj.titleValue; } },
        { name: "choices:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.choices); }, onSetValue: function (obj, value) { obj.choices = value; } },
        "optionsCaption", { name: "cellType", default: "default", choices: ["default", "dropdown", "checkbox", "radiogroup", "text", "comment"] },
        { name: "colCount", default: -1, choices: [-1, 0, 1, 2, 3, 4] }, "isRequired:boolean", "hasOther:boolean", "minWidth"], function () { return new MatrixDropdownColumn(""); });
    Survey.JsonObject.metaData.addClass("matrixdropdownbase", [{ name: "columns:matrixdropdowncolumns", className: "matrixdropdowncolumn" },
        "horizontalScroll:boolean",
        { name: "choices:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.choices); }, onSetValue: function (obj, value) { obj.choices = value; } },
        { name: "optionsCaption", onGetValue: function (obj) { return obj.optionsCaptionValue; } },
        { name: "cellType", default: "dropdown", choices: ["dropdown", "checkbox", "radiogroup", "text", "comment"] },
        { name: "columnColCount", default: 0, choices: [0, 1, 2, 3, 4] }, "columnMinWidth"], function () { return new QuestionMatrixDropdownModelBase(""); }, "question");
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="question_matrixdropdownbase.ts" />
var Survey;
(function (Survey) {
    var MatrixDropdownRowModel = (function (_super) {
        __extends(MatrixDropdownRowModel, _super);
        function MatrixDropdownRowModel(name, text, data, value) {
            _super.call(this, data, value);
            this.name = name;
            this.text = text;
        }
        Object.defineProperty(MatrixDropdownRowModel.prototype, "rowName", {
            get: function () { return this.name; },
            enumerable: true,
            configurable: true
        });
        return MatrixDropdownRowModel;
    }(Survey.MatrixDropdownRowModelBase));
    Survey.MatrixDropdownRowModel = MatrixDropdownRowModel;
    var QuestionMatrixDropdownModel = (function (_super) {
        __extends(QuestionMatrixDropdownModel, _super);
        function QuestionMatrixDropdownModel(name) {
            _super.call(this, name);
            this.name = name;
            this.rowsValue = [];
        }
        QuestionMatrixDropdownModel.prototype.getType = function () {
            return "matrixdropdown";
        };
        Object.defineProperty(QuestionMatrixDropdownModel.prototype, "rows", {
            get: function () { return this.rowsValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.rowsValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDropdownModel.prototype.generateRows = function () {
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
            return result;
        };
        QuestionMatrixDropdownModel.prototype.createMatrixRow = function (name, text, value) {
            return new MatrixDropdownRowModel(name, text, this, value);
        };
        return QuestionMatrixDropdownModel;
    }(Survey.QuestionMatrixDropdownModelBase));
    Survey.QuestionMatrixDropdownModel = QuestionMatrixDropdownModel;
    Survey.JsonObject.metaData.addClass("matrixdropdown", [{ name: "rows:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.rows); }, onSetValue: function (obj, value) { obj.rows = value; } }], function () { return new QuestionMatrixDropdownModel(""); }, "matrixdropdownbase");
    Survey.QuestionFactory.Instance.registerQuestion("matrixdropdown", function (name) { var q = new QuestionMatrixDropdownModel(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="question_matrixdropdownbase.ts" />
var Survey;
(function (Survey) {
    var MatrixDynamicRowModel = (function (_super) {
        __extends(MatrixDynamicRowModel, _super);
        function MatrixDynamicRowModel(index, data, value) {
            _super.call(this, data, value);
            this.index = index;
        }
        Object.defineProperty(MatrixDynamicRowModel.prototype, "rowName", {
            get: function () { return "row" + this.index; },
            enumerable: true,
            configurable: true
        });
        return MatrixDynamicRowModel;
    }(Survey.MatrixDropdownRowModelBase));
    Survey.MatrixDynamicRowModel = MatrixDynamicRowModel;
    var QuestionMatrixDynamicModel = (function (_super) {
        __extends(QuestionMatrixDynamicModel, _super);
        function QuestionMatrixDynamicModel(name) {
            _super.call(this, name);
            this.name = name;
            this.rowCounter = 0;
            this.rowCountValue = 2;
            this.addRowTextValue = null;
            this.removeRowTextValue = null;
            this.minRowCount = 0;
        }
        QuestionMatrixDynamicModel.prototype.getType = function () {
            return "matrixdynamic";
        };
        Object.defineProperty(QuestionMatrixDynamicModel.prototype, "rowCount", {
            get: function () { return this.rowCountValue; },
            set: function (val) {
                if (val < 0 || val > QuestionMatrixDynamicModel.MaxRowCount)
                    return;
                this.rowCountValue = val;
                if (this.value && this.value.length > val) {
                    var qVal = this.value;
                    qVal.splice(val);
                    this.value = qVal;
                }
                this.fireCallback(this.rowCountChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDynamicModel.prototype.addRow = function () {
            if (this.generatedVisibleRows) {
                this.generatedVisibleRows.push(this.createMatrixRow(null));
            }
            this.rowCount++;
        };
        QuestionMatrixDynamicModel.prototype.removeRow = function (index) {
            if (index < 0 || index >= this.rowCount)
                return;
            if (this.generatedVisibleRows && index < this.generatedVisibleRows.length) {
                this.generatedVisibleRows.splice(index, 1);
            }
            if (this.value) {
                var val = this.createNewValue(this.value);
                val.splice(index, 1);
                val = this.deleteRowValue(val, null);
                this.value = val;
            }
            this.rowCount--;
        };
        Object.defineProperty(QuestionMatrixDynamicModel.prototype, "addRowText", {
            get: function () { return this.addRowTextValue ? this.addRowTextValue : Survey.surveyLocalization.getString("addRow"); },
            set: function (value) {
                this.addRowTextValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDynamicModel.prototype, "removeRowText", {
            get: function () { return this.removeRowTextValue ? this.removeRowTextValue : Survey.surveyLocalization.getString("removeRow"); },
            set: function (value) {
                this.removeRowTextValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDynamicModel.prototype, "cachedVisibleRows", {
            get: function () {
                if (this.generatedVisibleRows && this.generatedVisibleRows.length == this.rowCount)
                    return this.generatedVisibleRows;
                return this.visibleRows;
            },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDynamicModel.prototype.onCheckForErrors = function (errors) {
            _super.prototype.onCheckForErrors.call(this, errors);
            if (this.hasErrorInRows()) {
                errors.push(new Survey.CustomError(Survey.surveyLocalization.getString("minRowCountError")["format"](this.minRowCount)));
            }
        };
        QuestionMatrixDynamicModel.prototype.hasErrorInRows = function () {
            if (this.minRowCount <= 0 || !this.generatedVisibleRows)
                return false;
            var res = false;
            var setRowCount = 0;
            for (var rowIndex = 0; rowIndex < this.generatedVisibleRows.length; rowIndex++) {
                var row = this.generatedVisibleRows[rowIndex];
                if (!row.isEmpty)
                    setRowCount++;
            }
            return setRowCount < this.minRowCount;
        };
        QuestionMatrixDynamicModel.prototype.generateRows = function () {
            var result = new Array();
            if (this.rowCount === 0)
                return result;
            var val = this.createNewValue(this.value);
            for (var i = 0; i < this.rowCount; i++) {
                result.push(this.createMatrixRow(this.getRowValueByIndex(val, i)));
            }
            return result;
        };
        QuestionMatrixDynamicModel.prototype.createMatrixRow = function (value) {
            return new MatrixDynamicRowModel(this.rowCounter++, this, value);
        };
        QuestionMatrixDynamicModel.prototype.createNewValue = function (curValue) {
            var result = curValue;
            if (!result)
                result = [];
            var r = [];
            if (result.length > this.rowCount)
                result.splice(this.rowCount - 1);
            for (var i = result.length; i < this.rowCount; i++) {
                result.push({});
            }
            return result;
        };
        QuestionMatrixDynamicModel.prototype.deleteRowValue = function (newValue, row) {
            var isEmpty = true;
            for (var i = 0; i < newValue.length; i++) {
                if (Object.keys(newValue[i]).length > 0) {
                    isEmpty = false;
                    break;
                }
            }
            return isEmpty ? null : newValue;
        };
        QuestionMatrixDynamicModel.prototype.getRowValueByIndex = function (questionValue, index) {
            return index >= 0 && index < questionValue.length ? questionValue[index] : null;
        };
        QuestionMatrixDynamicModel.prototype.getRowValue = function (row, questionValue, create) {
            if (create === void 0) { create = false; }
            return this.getRowValueByIndex(questionValue, this.generatedVisibleRows.indexOf(row));
        };
        QuestionMatrixDynamicModel.MaxRowCount = 100;
        return QuestionMatrixDynamicModel;
    }(Survey.QuestionMatrixDropdownModelBase));
    Survey.QuestionMatrixDynamicModel = QuestionMatrixDynamicModel;
    Survey.JsonObject.metaData.addClass("matrixdynamic", [{ name: "rowCount:number", default: 2 }, { name: "minRowCount:number", default: 0 },
        { name: "addRowText", onGetValue: function (obj) { return obj.addRowTextValue; } },
        { name: "removeRowText", onGetValue: function (obj) { return obj.removeRowTextValue; } }], function () { return new QuestionMatrixDynamicModel(""); }, "matrixdropdownbase");
    Survey.QuestionFactory.Instance.registerQuestion("matrixdynamic", function (name) { var q = new QuestionMatrixDynamicModel(name); q.choices = [1, 2, 3, 4, 5]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
    Survey.JsonObject.metaData.addClass("multipletextitem", ["name", { name: "title", onGetValue: function (obj) { return obj.titleValue; } },
        { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }], function () { return new MultipleTextItemModel(""); });
    Survey.JsonObject.metaData.addClass("multipletext", [{ name: "!items:textitems", className: "multipletextitem" },
        { name: "itemSize:number", default: 25 }, { name: "colCount:number", default: 1, choices: [1, 2, 3, 4] }], function () { return new QuestionMultipleTextModel(""); }, "question");
    Survey.QuestionFactory.Instance.registerQuestion("multipletext", function (name) { var q = new QuestionMultipleTextModel(name); q.AddItem("text1"); q.AddItem("text2"); return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        QuestionRatingModel.prototype.supportGoNextPageAutomatic = function () { return true; };
        QuestionRatingModel.defaultRateValues = [];
        return QuestionRatingModel;
    }(Survey.Question));
    Survey.QuestionRatingModel = QuestionRatingModel;
    Survey.ItemValue.setData(QuestionRatingModel.defaultRateValues, [1, 2, 3, 4, 5]);
    Survey.JsonObject.metaData.addClass("rating", ["hasComment:boolean", { name: "rateValues:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.rateValues); }, onSetValue: function (obj, value) { obj.rateValues = value; } },
        "mininumRateDescription", "maximumRateDescription"], function () { return new QuestionRatingModel(""); }, "question");
    Survey.QuestionFactory.Instance.registerQuestion("rating", function (name) { return new QuestionRatingModel(name); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
/// <reference path="page.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dxSurveyService.ts" />
/// <reference path="textPreProcessor.ts" />
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
            this.requiredText = "*";
            this.questionStartIndex = "";
            this.questionTitleTemplate = "";
            this.showProgressBar = "off";
            this.storeOthersAsComment = true;
            this.goNextPageAutomatic = false;
            this.pages = new Array();
            this.triggers = new Array();
            this.clearInvisibleValues = false;
            this.currentPageValue = null;
            this.valuesHash = {};
            this.variablesHash = {};
            this.showPageNumbersValue = false;
            this.showQuestionNumbersValue = "on";
            this.questionTitleLocationValue = "top";
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
            this.onUploadFile = new Survey.Event();
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
        Object.defineProperty(SurveyModel.prototype, "questionTitleLocation", {
            get: function () { return this.questionTitleLocationValue; },
            set: function (value) {
                if (value === this.questionTitleLocationValue)
                    return;
                this.questionTitleLocationValue = value;
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
                this.runConditions();
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
                if (this.currentPageValue) {
                    this.currentPageValue.scrollToFirstQuestion();
                }
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
                return this.currentPage.hasErrors(true, true);
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
            if (this.clearInvisibleValues) {
                this.clearInvisibleQuestionValues();
            }
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
        SurveyModel.prototype.uploadFile = function (name, file, storeDataAsText, uploadingCallback) {
            var accept = true;
            this.onUploadFile.fire(this, { name: name, file: file, accept: accept });
            if (!accept)
                return false;
            if (!storeDataAsText && this.surveyPostId) {
                this.uploadFileCore(name, file, uploadingCallback);
            }
            return true;
        };
        SurveyModel.prototype.uploadFileCore = function (name, file, uploadingCallback) {
            var self = this;
            if (uploadingCallback)
                uploadingCallback("uploading");
            new Survey.dxSurveyService().sendFile(this.surveyPostId, file, function (success, response) {
                if (uploadingCallback)
                    uploadingCallback(success ? "success" : "error");
                if (success) {
                    self.setValue(name, response);
                }
            });
        };
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
            var questions = this.getCurrentPageQuestions();
            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                var value = this.getValue(question.name);
                this.checkTriggers(question.name, value, true);
            }
        };
        SurveyModel.prototype.getCurrentPageQuestions = function () {
            var result = [];
            var page = this.currentPage;
            if (!page)
                return result;
            for (var i = 0; i < page.questions.length; i++) {
                var question = page.questions[i];
                if (!question.visible || !question.name)
                    continue;
                result.push(question);
            }
            return result;
        };
        SurveyModel.prototype.checkTriggers = function (name, newValue, isOnNextPage) {
            for (var i = 0; i < this.triggers.length; i++) {
                var trigger = this.triggers[i];
                if (trigger.name == name && trigger.isOnNextPage == isOnNextPage) {
                    trigger.check(newValue);
                }
            }
        };
        SurveyModel.prototype.doQuestionsOnLoad = function () {
            var questions = this.getAllQuestions(false);
            for (var i = 0; i < questions.length; i++) {
                questions[i].onSurveyLoad();
            }
        };
        SurveyModel.prototype.runConditions = function () {
            this.runConditionsForList(this.getAllQuestions(false));
            this.runConditionsForList(this.pages);
        };
        SurveyModel.prototype.runConditionsForList = function (list) {
            for (var i = 0; i < list.length; i++) {
                list[i].runCondition(this.valuesHash);
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
            this.doQuestionsOnLoad();
            this.runConditions();
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
        SurveyModel.prototype.clearInvisibleQuestionValues = function () {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].visible)
                    continue;
                this.setValue(questions[i].name, null);
            }
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
        SurveyModel.prototype.getUnbindValue = function (value) {
            if (value && value instanceof Object) {
                //do not return the same object instance!!!
                return JSON.parse(JSON.stringify(value));
            }
            return value;
        };
        SurveyModel.prototype.getValue = function (name) {
            if (!name || name.length == 0)
                return null;
            var value = this.valuesHash[name];
            return this.getUnbindValue(value);
        };
        SurveyModel.prototype.setValue = function (name, newValue) {
            if (this.isValueEqual(name, newValue))
                return;
            if (newValue == "" || newValue == null) {
                delete this.valuesHash[name];
            }
            else {
                newValue = this.getUnbindValue(newValue);
                this.valuesHash[name] = newValue;
                this.processedTextValues[name.toLowerCase()] = "value";
            }
            this.notifyQuestionOnValueChanged(name, newValue);
            this.checkTriggers(name, newValue, false);
            this.runConditions();
            this.tryGoNextPageAutomatic(name);
        };
        SurveyModel.prototype.isValueEqual = function (name, newValue) {
            if (newValue == "")
                newValue = null;
            var oldValue = this.getValue(name);
            if (newValue === null || oldValue === null)
                return newValue === oldValue;
            return this.isTwoValueEquals(newValue, oldValue);
        };
        SurveyModel.prototype.isTwoValueEquals = function (x, y) {
            if (x === y)
                return true;
            if (!(x instanceof Object) || !(y instanceof Object))
                return false;
            for (var p in x) {
                if (!x.hasOwnProperty(p))
                    continue;
                if (!y.hasOwnProperty(p))
                    return false;
                if (x[p] === y[p])
                    continue;
                if (typeof (x[p]) !== "object")
                    return false;
                if (!this.isTwoValueEquals(x[p], y[p]))
                    return false;
            }
            for (p in y) {
                if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
                    return false;
            }
            return true;
        };
        SurveyModel.prototype.tryGoNextPageAutomatic = function (name) {
            if (!this.goNextPageAutomatic || !this.currentPage)
                return;
            var question = this.getQuestionByName(name);
            if (question && !question.supportGoNextPageAutomatic())
                return;
            var questions = this.getCurrentPageQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (!this.getValue(questions[i].name))
                    return;
            }
            if (!this.currentPage.hasErrors(false, false)) {
                if (!this.isLastPage) {
                    this.nextPage();
                }
                else {
                    this.doComplete();
                }
            }
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
                this.tryGoNextPageAutomatic(name);
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
    Survey.JsonObject.metaData.addClass("survey", [{ name: "locale", choices: function () { return Survey.surveyLocalization.getLocales(); } },
        "title", "completedHtml:html", { name: "pages", className: "page" },
        { name: "questions", baseClassName: "question", onGetValue: function (obj) { return null; }, onSetValue: function (obj, value, jsonConverter) { var page = obj.addNewPage(""); jsonConverter.toObject({ questions: value }, page); } },
        { name: "triggers:triggers", baseClassName: "surveytrigger", classNamePart: "trigger" },
        "surveyId", "surveyPostId", "cookieName", "sendResultOnPageNext:boolean",
        { name: "showNavigationButtons:boolean", default: true }, { name: "showTitle:boolean", default: true }, { name: "showPageTitles:boolean", default: true },
        "showPageNumbers:boolean", { name: "showQuestionNumbers", default: "on", choices: ["on", "onPage", "off"] },
        { name: "questionTitleLocation", default: "top", choices: ["top", "bottom"] },
        { name: "showProgressBar", default: "off", choices: ["off", "top", "bottom"] },
        { name: "storeOthersAsComment:boolean", default: true }, "goNextPageAutomatic:boolean", "clearInvisibleValues:boolean",
        { name: "pagePrevText", onGetValue: function (obj) { return obj.pagePrevTextValue; } },
        { name: "pageNextText", onGetValue: function (obj) { return obj.pageNextTextValue; } },
        { name: "completeText", onGetValue: function (obj) { return obj.completeTextValue; } },
        { name: "requiredText", default: "*" }, "questionStartIndex", "questionTitleTemplate"]);
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
/// <reference path="..//surveyStrings.ts" />
//Created on behalf https://github.com/Frank13
var Survey;
(function (Survey) {
    var frenchSurveyStrings = {
        pagePrevText: "Pr\u00e9c\u00e9dent",
        pageNextText: "Suivant",
        completeText: "Terminer",
        otherItemText: "Autre (pr\u00e9ciser)",
        progressText: "Page {0} sur {1}",
        emptySurvey: "Il n'y a ni page visible ni question visible dansce questionnaire",
        completingSurvey: "Merci d'avoir r\u00e9pondu au questionnaire!",
        loadingSurvey: "Le questionnaire est en cours de chargement...",
        optionsCaption: "Choisissez...",
        requiredError: "La r\u00e9ponse \u00e0 cette question est obligatoire.",
        numericError: "La r\u00e9ponse doit \u00eatre un nombre.",
        textMinLength: "Merci d'entrer au moins {0} symboles.",
        minSelectError: "Merci de s\u00e9lectionner au moins {0}r\u00e9ponses.",
        maxSelectError: "Merci de s\u00e9lectionner au plus {0}r\u00e9ponses.",
        numericMinMax: "Votre r\u00e9ponse '{0}' doit \u00eatresup\u00e9rieure ou \u00e9gale \u00e0 {1} et inf\u00e9rieure ou\u00e9gale \u00e0 {2}",
        numericMin: "Votre r\u00e9ponse '{0}' doit \u00eatresup\u00e9rieure ou \u00e9gale \u00e0 {1}",
        numericMax: "Votre r\u00e9ponse '{0}' doit \u00eatreinf\u00e9rieure ou \u00e9gale \u00e0 {1}",
        invalidEmail: "Merci d'entrer une adresse mail valide.",
        exceedMaxSize: "La taille du fichier ne doit pas exc\u00e9der {0}.",
        otherRequiredError: "Merci de pr\u00e9ciser le champ 'Autre'."
    };
    Survey.surveyLocalization.locales["fr"] = frenchSurveyStrings;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        otherItemText: "Benutzerdefinierte Antwort...",
        optionsCaption: "Wählen...",
        requiredError: "Bitte antworten Sie auf die Frage.",
        numericError: "Der Wert sollte eine Zahl sein.",
        textMinLength: "Bitte geben Sie mindestens {0} Symbole.",
        minSelectError: "Bitte wählen Sie mindestens {0} Varianten.",
        maxSelectError: "Bitte wählen Sie nicht mehr als {0} Varianten.",
        numericMinMax: "'{0}' solte gleich oder größer sein als {1} und gleich oder kleiner als {2}",
        numericMin: "'{0}' solte gleich oder größer sein als {1}",
        numericMax: "'{0}' solte gleich oder kleiner als {1}",
        invalidEmail: "Bitte geben Sie eine gültige Email-Adresse ein.",
        exceedMaxSize: "Die Dateigröße soll nicht mehr als {0}.",
        otherRequiredError: "Bitte geben Sie einen Wert für Ihre benutzerdefinierte Antwort ein."
    };
    Survey.surveyLocalization.locales["de"] = germanSurveyStrings;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
/// <reference path="..//surveyStrings.ts" />
var Survey;
(function (Survey) {
    var turkishSurveyStrings = {
        pagePrevText: "Geri",
        pageNextText: "İleri",
        completeText: "Anketi Tamamla",
        otherItemText: "Diğer (açıklayınız)",
        progressText: "Sayfa {0} / {1}",
        emptySurvey: "Ankette görüntülenecek sayfa ya da soru mevcut değil.",
        completingSurvey: "Anketimizi tamamladığınız için teşekkür ederiz.",
        loadingSurvey: "Anket sunucudan yükleniyor ...",
        optionsCaption: "Seçiniz ...",
        requiredError: "Lütfen soruya cevap veriniz",
        numericError: "Girilen değer numerik olmalıdır",
        textMinLength: "En az {0} sembol giriniz.",
        minRowCountError: "Lütfen en az {0} satırı doldurun.",
        minSelectError: "Lütfen en az {0} seçeneği seçiniz.",
        maxSelectError: "Lütfen {0} adetten fazla seçmeyiniz.",
        numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
        numericMin: "'{0}' değeri {1} değerine eşit veya büyük olmalıdır",
        numericMax: "'{0}' değeri {1} değerine eşit ya da küçük olmalıdır.",
        invalidEmail: "Lütfen geçerli bir eposta adresi giriniz.",
        urlRequestError: "Talebi şu hatayı döndü '{0}'. {1}",
        urlGetChoicesError: "Talep herhangi bir veri dönmedi ya da 'path' özelliği hatalı.",
        exceedMaxSize: "Dosya boyutu {0} değerini geçemez.",
        otherRequiredError: "Lütfen diğer değerleri giriniz.",
        uploadingFile: "Dosyanız yükleniyor. LÜtfen birkaç saniye bekleyin ve tekrar deneyin.",
        addRow: "Satır Ekle",
        removeRow: "Kaldır"
    };
    Survey.surveyLocalization.locales["tr"] = turkishSurveyStrings;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var Survey;
(function (Survey) {
    Survey.defaultStandardCss = {
        root: "sv_main",
        header: "",
        body: "sv_body",
        footer: "sv_nav",
        navigationButton: "", navigation: { complete: "", prev: "", next: "" },
        progress: "sv_progress",
        pageTitle: "sv_p_title",
        row: "sv_row",
        question: { root: "sv_q", title: "sv_q_title", comment: "", indent: 20 },
        error: { root: "sv_q_erbox", icon: "", item: "" },
        checkbox: { root: "sv_qcbc", item: "sv_q_checkbox", other: "sv_q_other" },
        comment: "",
        dropdown: "",
        matrix: { root: "sv_q_matrix" },
        matrixdropdown: { root: "sv_q_matrix" },
        matrixdynamic: { root: "table", button: "" },
        multipletext: { root: "", itemTitle: "", itemValue: "" },
        radiogroup: { root: "sv_qcbc", item: "sv_q_radiogroup", other: "sv_q_other" },
        rating: { root: "sv_q_rating", item: "" },
        text: ""
    };
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../page.ts" />
var Survey;
(function (Survey) {
    var QuestionRow = (function (_super) {
        __extends(QuestionRow, _super);
        function QuestionRow(page, question) {
            _super.call(this, page, question);
            this.page = page;
            this.question = question;
            this.koVisible = ko.observable(this.visible);
        }
        QuestionRow.prototype.onVisibleChanged = function () {
            this.koVisible(this.visible);
        };
        QuestionRow.prototype.koAfterRender = function (el, con) {
            for (var i = 0; i < el.length; i++) {
                var tEl = el[i];
                var nName = tEl.nodeName;
                if (nName == "#text")
                    tEl.data = "";
            }
        };
        return QuestionRow;
    }(Survey.QuestionRowModel));
    Survey.QuestionRow = QuestionRow;
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(name) {
            if (name === void 0) { name = ""; }
            _super.call(this, name);
            this.koNo = ko.observable("");
            this.onCreating();
        }
        Page.prototype.createRow = function (question) { return new QuestionRow(this, question); };
        Page.prototype.onCreating = function () { };
        Page.prototype.onNumChanged = function (value) {
            this.koNo(value > 0 ? value + ". " : "");
        };
        return Page;
    }(Survey.PageModel));
    Survey.Page = Page;
    Survey.JsonObject.metaData.overrideClassCreatore("page", function () { return new Page(); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
/// <reference path="../questionbase.ts" />
var Survey;
(function (Survey) {
    var QuestionImplementorBase = (function () {
        function QuestionImplementorBase(question) {
            this.question = question;
            var self = this;
            question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
            question.renderWidthChangedCallback = function () { self.onRenderWidthChanged(); };
            this.koVisible = ko.observable(this.question.visible);
            this.koRenderWidth = ko.observable(this.question.renderWidth);
            this.koErrors = ko.observableArray();
            this.koMarginLeft = ko.pureComputed(function () { self.koRenderWidth(); return self.getIndentSize(self.question.indent); });
            this.koPaddingRight = ko.observable(self.getIndentSize(self.question.rightIndent));
            this.question["koVisible"] = this.koVisible;
            this.question["koRenderWidth"] = this.koRenderWidth;
            this.question["koErrors"] = this.koErrors;
            this.question["koMarginLeft"] = this.koMarginLeft;
            this.question["koPaddingRight"] = this.koPaddingRight;
        }
        QuestionImplementorBase.prototype.onVisibilityChanged = function () {
            this.koVisible(this.question.visible);
        };
        QuestionImplementorBase.prototype.onRenderWidthChanged = function () {
            this.koRenderWidth(this.question.renderWidth);
            this.koPaddingRight(this.getIndentSize(this.question.rightIndent));
        };
        QuestionImplementorBase.prototype.getIndentSize = function (indent) {
            if (indent < 1)
                return "";
            if (!this.question["data"])
                return "";
            var css = this.question["data"]["css"];
            if (!css)
                return "";
            return indent * css.question.indent + "px";
        };
        return QuestionImplementorBase;
    }());
    Survey.QuestionImplementorBase = QuestionImplementorBase;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            question.titleChangedCallback = function () { self.onVisibleIndexChanged(); };
            question.visibleIndexChangedCallback = function () { self.onVisibleIndexChanged(); };
            this.koDummy = ko.observable(0);
            this.koValue = this.createkoValue();
            this.koComment = ko.observable(this.question.comment);
            this.koTitle = ko.pureComputed(function () { self.koDummy(); return self.question.fullTitle; });
            this.koErrors(this.question.errors);
            this.koValue.subscribe(function (newValue) {
                self.updateValue(newValue);
            });
            this.koComment.subscribe(function (newValue) {
                self.updateComment(newValue);
            });
            this.question["koValue"] = this.koValue;
            this.question["koComment"] = this.koComment;
            this.question["koTitle"] = this.koTitle;
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
            this.koDummy(this.koDummy() + 1);
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            this.koVisibleChoices = ko.observableArray(self.question.visibleChoices);
            question.choicesChangedCallback = function () { self.koVisibleChoices(self.question.visibleChoices); };
            this.question["koOtherVisible"] = this.koOtherVisible;
            this.question["koVisibleChoices"] = this.koVisibleChoices;
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_file.ts" />
/// <reference path="koquestion.ts" />
var Survey;
(function (Survey) {
    var QuestionFileImplementor = (function (_super) {
        __extends(QuestionFileImplementor, _super);
        function QuestionFileImplementor(question) {
            _super.call(this, question);
            var self = this;
            this.koDataUpdater = ko.observable(0);
            this.koData = ko.computed(function () { self.koDataUpdater(); return self.question.previewValue; });
            this.koHasValue = ko.observable(false);
            this.question["koData"] = this.koData;
            this.question["koHasValue"] = this.koHasValue;
            this.question.previewValueLoadedCallback = function () { self.onLoadPreview(); };
            this.question["dochange"] = function (data, event) { var src = event.target || event.srcElement; self.onChange(src); };
        }
        QuestionFileImplementor.prototype.onChange = function (src) {
            if (!window["FileReader"])
                return;
            if (!src || !src.files || src.files.length < 1)
                return;
            this.question.loadFile(src.files[0]);
        };
        QuestionFileImplementor.prototype.onLoadPreview = function () {
            this.koDataUpdater(this.koDataUpdater() + 1);
            this.koHasValue(true);
        };
        return QuestionFileImplementor;
    }(Survey.QuestionImplementor));
    var QuestionFile = (function (_super) {
        __extends(QuestionFile, _super);
        function QuestionFile(name) {
            _super.call(this, name);
            this.name = name;
            new QuestionFileImplementor(this);
        }
        return QuestionFile;
    }(Survey.QuestionFileModel));
    Survey.QuestionFile = QuestionFile;
    Survey.JsonObject.metaData.overrideClassCreatore("file", function () { return new QuestionFile(""); });
    Survey.QuestionFactory.Instance.registerQuestion("file", function (name) { return new QuestionFile(name); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_matrixdropdown.ts" />
/// <reference path="../question_matrixdropdownbase.ts" />
var Survey;
(function (Survey) {
    var QuestionMatrixDropdown = (function (_super) {
        __extends(QuestionMatrixDropdown, _super);
        function QuestionMatrixDropdown(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionImplementor(this);
        }
        return QuestionMatrixDropdown;
    }(Survey.QuestionMatrixDropdownModel));
    Survey.QuestionMatrixDropdown = QuestionMatrixDropdown;
    Survey.JsonObject.metaData.overrideClassCreatore("matrixdropdown", function () { return new QuestionMatrixDropdown(""); });
    Survey.QuestionFactory.Instance.registerQuestion("matrixdropdown", function (name) { var q = new QuestionMatrixDropdown(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_matrixdynamic.ts" />
/// <reference path="../question_matrixdropdownbase.ts" />
var Survey;
(function (Survey) {
    var QuestionMatrixDynamicImplementor = (function (_super) {
        __extends(QuestionMatrixDynamicImplementor, _super);
        function QuestionMatrixDynamicImplementor(question) {
            _super.call(this, question);
            this.koRecalc = ko.observable(0);
            this.koRows = ko.pureComputed(function () {
                this.koRecalc();
                return this.question.cachedVisibleRows;
            }, this);
            this.koOverflowX = ko.pureComputed(function () {
                return this.question.horizontalScroll ? "scroll" : "none";
            }, this);
            this.question["koRows"] = this.koRows;
            var self = this;
            this.koAddRowClick = function () { self.addRow(); };
            this.koRemoveRowClick = function (data) { self.removeRow(data); };
            this.question["koAddRowClick"] = this.koAddRowClick;
            this.question["koRemoveRowClick"] = this.koRemoveRowClick;
            this.question["koOverflowX"] = this.koOverflowX;
            this.question.rowCountChangedCallback = function () { self.onRowCountChanged(); };
            this.question.columnsChangedCallback = function () { self.onColumnChanged(); };
            this.question.updateCellsCallbak = function () { self.onUpdateCells(); };
        }
        QuestionMatrixDynamicImplementor.prototype.onUpdateCells = function () {
            //Genereate rows again.
            var rows = this.question["generatedVisibleRows"];
            var columns = this.question.columns;
            if (rows && rows.length > 0 && columns && columns.length > 0)
                this.onColumnChanged();
        };
        QuestionMatrixDynamicImplementor.prototype.onColumnChanged = function () {
            var rows = this.question.visibleRows;
            this.onRowCountChanged();
        };
        QuestionMatrixDynamicImplementor.prototype.onRowCountChanged = function () {
            this.koRecalc(this.koRecalc() + 1);
        };
        QuestionMatrixDynamicImplementor.prototype.addRow = function () {
            this.question.addRow();
        };
        QuestionMatrixDynamicImplementor.prototype.removeRow = function (row) {
            var rows = this.question.cachedVisibleRows;
            var index = rows.indexOf(row);
            if (index > -1) {
                this.question.removeRow(index);
            }
        };
        return QuestionMatrixDynamicImplementor;
    }(Survey.QuestionImplementor));
    Survey.QuestionMatrixDynamicImplementor = QuestionMatrixDynamicImplementor;
    var QuestionMatrixDynamic = (function (_super) {
        __extends(QuestionMatrixDynamic, _super);
        function QuestionMatrixDynamic(name) {
            _super.call(this, name);
            this.name = name;
            new QuestionMatrixDynamicImplementor(this);
        }
        return QuestionMatrixDynamic;
    }(Survey.QuestionMatrixDynamicModel));
    Survey.QuestionMatrixDynamic = QuestionMatrixDynamic;
    Survey.JsonObject.metaData.overrideClassCreatore("matrixdynamic", function () { return new QuestionMatrixDynamic(""); });
    Survey.QuestionFactory.Instance.registerQuestion("matrixdynamic", function (name) { var q = new QuestionMatrixDynamic(name); q.choices = [1, 2, 3, 4, 5]; q.rowCount = 2; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
    var QuestionMultipleTextImplementor = (function (_super) {
        __extends(QuestionMultipleTextImplementor, _super);
        function QuestionMultipleTextImplementor(question) {
            _super.call(this, question);
            this.koRows = ko.observableArray(this.question.getRows());
            this.question["koRows"] = this.koRows;
            this.onColCountChanged();
            var self = this;
            this.question.colCountChangedCallback = function () { self.onColCountChanged(); };
        }
        QuestionMultipleTextImplementor.prototype.onColCountChanged = function () {
            this.koRows(this.question.getRows());
        };
        return QuestionMultipleTextImplementor;
    }(Survey.QuestionImplementor));
    Survey.QuestionMultipleTextImplementor = QuestionMultipleTextImplementor;
    var QuestionMultipleText = (function (_super) {
        __extends(QuestionMultipleText, _super);
        function QuestionMultipleText(name) {
            _super.call(this, name);
            this.name = name;
            new QuestionMultipleTextImplementor(this);
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
            this.koVisibleRateValues = ko.observableArray(this.getValues());
            this.question["koVisibleRateValues"] = this.koVisibleRateValues;
            var self = this;
            this.koChange = function (val) { self.koValue(val.itemValue); };
            this.question["koChange"] = this.koChange;
            this.question.rateValuesChangedCallback = function () { self.onRateValuesChanged(); };
            this.question["koGetCss"] = function (val) {
                var css = self.question.itemCss;
                return self.question["koValue"]() == val.value ? css + " active" : css;
            };
        }
        QuestionRatingImplementor.prototype.onRateValuesChanged = function () {
            this.koVisibleRateValues(this.getValues());
        };
        QuestionRatingImplementor.prototype.getValues = function () { return this.question.visibleRateValues; };
        return QuestionRatingImplementor;
    }(Survey.QuestionImplementor));
    var QuestionRating = (function (_super) {
        __extends(QuestionRating, _super);
        function QuestionRating(name) {
            _super.call(this, name);
            this.name = name;
            new QuestionRatingImplementor(this);
        }
        QuestionRating.prototype.onSetData = function () {
            this.itemCss = this.data["css"].rating.item;
        };
        return QuestionRating;
    }(Survey.QuestionRatingModel));
    Survey.QuestionRating = QuestionRating;
    Survey.JsonObject.metaData.overrideClassCreatore("rating", function () { return new QuestionRating(""); });
    Survey.QuestionFactory.Instance.registerQuestion("rating", function (name) { return new QuestionRating(name); });
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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
        function SurveyBase(jsonObj, renderedElement, css) {
            if (jsonObj === void 0) { jsonObj = null; }
            if (renderedElement === void 0) { renderedElement = null; }
            if (css === void 0) { css = null; }
            _super.call(this, jsonObj);
            this.onRendered = new Survey.Event();
            if (css) {
                this.css = css;
            }
            if (renderedElement) {
                this.renderedElement = renderedElement;
            }
            if (typeof ko === 'undefined')
                throw new Error('knockoutjs library is not loaded.');
            this.render(renderedElement);
        }
        Object.defineProperty(SurveyBase.prototype, "cssNavigationComplete", {
            get: function () { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.complete); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyBase.prototype, "cssNavigationPrev", {
            get: function () { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.prev); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyBase.prototype, "cssNavigationNext", {
            get: function () { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.next); },
            enumerable: true,
            configurable: true
        });
        SurveyBase.prototype.getNavigationCss = function (main, btn) {
            var res = "";
            if (main)
                res = main;
            if (btn)
                res += ' ' + btn;
            return res;
        };
        Object.defineProperty(SurveyBase.prototype, "css", {
            get: function () { return this.cssValue; },
            set: function (value) {
                this.mergeValues(value, this.cssValue);
            },
            enumerable: true,
            configurable: true
        });
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
            if (!element)
                return;
            element.innerHTML = this.getTemplate();
            self.applyBinding();
            self.onRendered.fire(self, {});
        };
        SurveyBase.prototype.loadSurveyFromService = function (surveyId, renderedElement) {
            if (surveyId === void 0) { surveyId = null; }
            if (renderedElement === void 0) { renderedElement = null; }
            if (renderedElement) {
                this.renderedElement = renderedElement;
            }
            _super.prototype.loadSurveyFromService.call(this, surveyId);
        };
        SurveyBase.prototype.setCompleted = function () {
            _super.prototype.setCompleted.call(this);
            this.updateKoCurrentPage();
        };
        SurveyBase.prototype.createNewPage = function (name) { return new Survey.Page(name); };
        SurveyBase.prototype.createCssObject = function () { return null; };
        SurveyBase.prototype.getTemplate = function () { throw new Error("Please override this method"); };
        SurveyBase.prototype.onBeforeCreating = function () {
            var self = this;
            this.cssValue = this.createCssObject();
            this.dummyObservable = ko.observable(0);
            this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
            this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
            this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
            this.koProgressText = ko.computed(function () { self.dummyObservable(); return self.progressText; });
            this.koProgress = ko.computed(function () { self.dummyObservable(); return self.getProgress(); });
            this.koState = ko.computed(function () { self.dummyObservable(); return self.state; });
        };
        SurveyBase.prototype.currentPageChanged = function (newValue, oldValue) {
            this.updateKoCurrentPage();
            _super.prototype.currentPageChanged.call(this, newValue, oldValue);
        };
        SurveyBase.prototype.onLoadSurveyFromService = function () {
            this.render();
        };
        SurveyBase.prototype.onLoadingSurveyFromService = function () {
            this.render();
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
        return SurveyBase;
    }(Survey.SurveyModel));
    Survey.SurveyBase = SurveyBase;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var template;
(function (template) {
    var ko;
    (function (ko) {
        ko.html = '<script type="text/html" id="survey-comment">  <input data-bind="value:$data.question.koComment, visible:$data.visible, css: $root.css.question.comment" /></script><div data-bind="css: $root.css.root">    <div data-bind="visible: (title.length > 0) && showTitle && koState() != \'completed\', css: $root.css.header">        <h3 data-bind="text:title"></h3>    </div>    <!-- ko if: koState() == "running" -->    <div data-bind="css: $root.css.body">        <div data-bind="visible: showProgressBar ==\'top\', template: { name: \'survey-progress\', data: $data }"></div>        <div data-bind="template: { name: \'survey-page\', data: koCurrentPage }"></div>        <div style="margin-top:10px" data-bind="visible: showProgressBar ==\'bottom\', template: { name: \'survey-progress\', data: $data }"></div>    </div>    <div data-bind="visible: showNavigationButtons && !isDesignMode, css: $root.css.footer">        <input type="button" data-bind="value: pagePrevText, click: prevPage, visible: !koIsFirstPage(), css: $root.cssNavigationPrev" />        <input type="button" data-bind="value: pageNextText, click: nextPage, visible: !koIsLastPage(), css: $root.cssNavigationNext" />        <input type="button" data-bind="value: completeText, click: completeLastPage, visible: koIsLastPage(), css: $root.cssNavigationComplete" />    </div>    <!-- /ko -->    <!-- ko if: koState() == "completed" -->    <div data-bind="html: processedCompletedHtml"></div>    <!-- /ko -->    <!-- ko if: koState() == "loading" -->    <div data-bind="html: processedLoadingHtml"></div>    <!-- /ko -->    <!-- ko if: koState() == "empty" -->    <div data-bind="text:emptySurveyText, css: $root.css.body"></div>    <!-- /ko --></div><script type="text/html" id="survey-page">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + processedTitle, css: $root.css.pageTitle"></h4>    <!-- ko foreach: { data: rows, as: \'row\'} -->    <div data-bind="visible: row.koVisible, css: $root.css.row">        <!-- ko foreach: { data: row.questions, as: \'question\' , afterRender: row.koAfterRender } -->            <!-- ko template: { name: \'survey-question\', data: question } --><!-- /ko -->        <!-- /ko -->    </div>    <!-- /ko --></script><script type="text/html" id="survey-question-checkbox">    <form data-bind="css: $root.css.checkbox.root">        <!-- ko foreach: { data: question.koVisibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}, css: $root.css.checkbox.item">            <label data-bind="css: $root.css.checkbox.item">                <input type="checkbox" data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="visible: question.hasOther && ($index() == question.koVisibleChoices().length-1)">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }, css: $root.css.checkbox.other"></div>            </div>        </div>        <!-- /ko -->    </form></script><script type="text/html" id="survey-question-comment">    <textarea type="text" data-bind="attr: {cols: question.cols, rows: question.rows}, value:question.koValue, css: $root.css.comment" /></script><script type="text/html" id="survey-question-dropdown">    <select data-bind="options: question.koVisibleChoices, optionsText: \'text\', optionsValue: \'value\', value: question.koValue, optionsCaption: question.optionsCaption, css: $root.css.dropdown"></select>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-errors">    <div role="alert" data-bind="visible: koErrors().length > 0, foreach: { data: koErrors, as: \'error\'}, css: $root.css.error.root">        <div>            <span aria-hidden="true" data-bind="css: $root.css.error.icon"></span>            <span data-bind="text:error.getText(), css: $root.css.error.item"></span>        </div>    </div></script><script type="text/html" id="survey-question-file">    <input type="file" data-bind="event: {change: dochange}">    <div>        <img data-bind="attr: { src: question.koData, height: question.imageHeight, width: question.imageWidth }, visible: question.koHasValue">    </div></script><script type="text/html" id="survey-question-html">    <div data-bind="html: question.processedHtml"></div></script><script type="text/html" id="survey-question-matrix">    <table data-bind="css: $root.css.matrix.root">        <thead>            <tr>                <th data-bind="visible: question.hasRows"></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="visible: question.hasRows, text:row.text"></td>                <!-- ko foreach: question.columns -->                <td>                    <input type="radio" data-bind="attr: {name: row.fullName, value: $data.value}, checked: row.koValue"/>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-matrixdropdown">    <div data-bind="style: {overflowX: question.horizontalScroll? \'scroll\': \'\'}">        <table data-bind="css: $root.css.matrixdropdown.root">            <thead>                <tr>                    <th></th>                    <!-- ko foreach: question.columns -->                    <th data-bind="text: question.getColumnTitle($data), style: { minWidth: question.getColumnWidth($data) }"></th>                    <!-- /ko -->                </tr>            </thead>            <tbody>                <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->                <tr>                    <td data-bind="text:row.text"></td>                    <!-- ko foreach: row.cells-->                    <td>                        <!-- ko template: { name: \'survey-question-\' + $data.question.getType(), data: $data.question, as: \'question\' } -->                        <!-- /ko -->                    </td>                    <!-- /ko -->                </tr>                <!-- /ko -->            </tbody>        </table>    </div></script><script type="text/html" id="survey-question-matrixdynamic">    <div data-bind="style: {overflowX: question.horizontalScroll? \'scroll\': \'\'}">        <table data-bind="css: $root.css.matrixdynamic.root">            <thead>                <tr>                    <!-- ko foreach: question.columns -->                    <th data-bind="text: question.getColumnTitle($data), style: { minWidth: question.getColumnWidth($data) }"></th>                    <!-- /ko -->                    <th></th>                </tr>            </thead>            <tbody>                <!-- ko foreach: { data: question.koRows, as: \'row\' } -->                <tr>                    <!-- ko foreach: row.cells-->                    <td>                        <!-- ko template: { name: \'survey-question-errors\', data: $data.question } -->                        <!-- /ko -->                        <!-- ko template: { name: \'survey-question-\' + $data.question.getType(), data: $data.question, as: \'question\' } -->                        <!-- /ko -->                    </td>                    <!-- /ko -->                    <td><input type="button" data-bind="click:question.koRemoveRowClick, css: $root.css.matrixdynamic.button, value: question.removeRowText" /></td>                </tr>                <!-- /ko -->            </tbody>        </table>    </div>    <input type="button" data-bind="click:question.koAddRowClick, css: $root.css.matrixdynamic.button, value: question.addRowText" /></script><script type="text/html" id="survey-question-multipletext">    <table data-bind="css: $root.css.multipletext.root, foreach: { data:  question.koRows, as: \'row\' }">        <tr data-bind="foreach: { data: row, as: \'item\' }">            <td data-bind="text: item.title, css: $root.css.multipletext.itemTitle"></td>            <td><input type="text" style="float:left" data-bind="attr: {size: question.itemSize}, value: item.koValue, css: $root.css.multipletext.itemValue" /></td>        </tr>    </table></script><script type="text/html" id="survey-question-radiogroup">    <form data-bind="css: $root.css.radiogroup.root">        <!-- ko foreach: { data: question.koVisibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div  data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}, css: $root.css.radiogroup.item">            <label data-bind="css: $root.css.radiogroup.item">                <input type="radio" data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="visible: question.hasOther && ($index() == question.koVisibleChoices().length-1)">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible}}, css: $root.css.radiogroup.other"></div>            </div>        </div>        <!-- /ko -->    </form></script><script type="text/html" id="survey-question-text">    <input type="text" data-bind="attr: {size: question.size}, value:question.koValue, css: $root.css.text"/></script><script type="text/html" id="survey-question">    <div style="vertical-align:top" data-bind="css: $root.css.question.root, style: {display: question.koVisible() ? \'inline-block\': \'none\', marginLeft: question.koMarginLeft, paddingRight: question.koPaddingRight, width: question.koRenderWidth }, attr: {id: id}">        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'top\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-errors\', data: question } -->        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            <div data-bind="text:question.commentText"></div>            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'bottom\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->    </div></script><script type="text/html" id="survey-progress">    <div data-bind="text:koProgressText, css: $root.css.progress"></div></script><script type="text/html" id="survey-question-rating">    <table data-bind="css: $root.css.rating.root">        <thead>            <tr>                <th></th>                <!-- ko foreach: question.koVisibleRateValues -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->                <th></th>            </tr>        </thead>        <tbody>            <tr>                <td data-bind="text:question.mininumRateDescription"></td>                <!-- ko foreach: question.koVisibleRateValues -->                <td>                    <input type="radio" data-bind="attr: {name: question.name, value: $data.value}, checked: question.koValue" />                </td>                <!-- /ko -->                <td data-bind="text:question.maximumRateDescription"></td>            </tr>        </tbody>    </table>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question } }"></div>    </div></script>';
    })(ko = template.ko || (template.ko = {}));
})(template || (template = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="template.ko.html.ts" />
/// <reference path="../kosurvey.ts" />
/// <reference path="../../defaultCss/cssstandard.ts" />
var Survey;
(function (Survey_1) {
    var Survey = (function (_super) {
        __extends(Survey, _super);
        function Survey(jsonObj, renderedElement, css) {
            if (jsonObj === void 0) { jsonObj = null; }
            if (renderedElement === void 0) { renderedElement = null; }
            if (css === void 0) { css = null; }
            _super.call(this, jsonObj, renderedElement, css);
        }
        Survey.prototype.getTemplate = function () { return template.ko.html; };
        Survey.prototype.createCssObject = function () { return Survey_1.defaultStandardCss; };
        return Survey;
    }(Survey_1.SurveyBase));
    Survey_1.Survey = Survey;
})(Survey || (Survey = {}));

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../kosurveywindow.ts" />
/// <reference path="kosurveystandard.ts" />
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

/*!
* surveyjs - Survey JavaScript library v0.9.12
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudHMiLCJqc29ub2JqZWN0LnRzIiwiY2hvaWNlc1Jlc3RmdWxsLnRzIiwiY29uZGl0aW9uc1BhcnNlci50cyIsImNvbmRpdGlvbnMudHMiLCJkeFN1cnZleVNlcnZpY2UudHMiLCJzdXJ2ZXlTdHJpbmdzLnRzIiwiZXJyb3IudHMiLCJxdWVzdGlvbmJhc2UudHMiLCJxdWVzdGlvbmZhY3RvcnkudHMiLCJwYWdlLnRzIiwidmFsaWRhdG9yLnRzIiwidGV4dFByZVByb2Nlc3Nvci50cyIsInF1ZXN0aW9uLnRzIiwicXVlc3Rpb25fYmFzZXNlbGVjdC50cyIsInF1ZXN0aW9uX2NoZWNrYm94LnRzIiwicXVlc3Rpb25fY29tbWVudC50cyIsInF1ZXN0aW9uX2Ryb3Bkb3duLnRzIiwicXVlc3Rpb25fZmlsZS50cyIsInF1ZXN0aW9uX2h0bWwudHMiLCJxdWVzdGlvbl9tYXRyaXgudHMiLCJxdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwicXVlc3Rpb25fdGV4dC50cyIsInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50cyIsInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzIiwicXVlc3Rpb25fbWF0cml4ZHluYW1pYy50cyIsInF1ZXN0aW9uX211bHRpcGxldGV4dC50cyIsInF1ZXN0aW9uX3JhdGluZy50cyIsInRyaWdnZXIudHMiLCJzdXJ2ZXkudHMiLCJzdXJ2ZXlXaW5kb3cudHMiLCJsb2NhbGl6YXRpb24vZmlubmlzaC50cyIsImxvY2FsaXphdGlvbi9mcmVuY2gudHMiLCJsb2NhbGl6YXRpb24vZ2VybWFuLnRzIiwibG9jYWxpemF0aW9uL3J1c3NpYW4udHMiLCJsb2NhbGl6YXRpb24vdHVya2lzaC50cyIsImRlZmF1bHRDc3MvY3Nzc3RhbmRhcmQudHMiLCJrbm9ja291dC9rb3BhZ2UudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uYmFzZS50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb24udHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX2NoZWNrYm94LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9jb21tZW50LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9kcm9wZG93bi50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fZmlsZS50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25faHRtbC50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbWF0cml4LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbWF0cml4ZHluYW1pYy50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9yYXRpbmcudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX3RleHQudHMiLCJrbm9ja291dC9rb3N1cnZleS50cyIsImtub2Nrb3V0L2tvU3VydmV5V2luZG93LnRzIiwia25vY2tvdXQvdGVtcGxhdGVUZXh0LnRzIiwia25vY2tvdXQvc3RhbmRhcmQvdGVtcGxhdGUua28uaHRtbC50cyIsImtub2Nrb3V0L3N0YW5kYXJkL2tvU3VydmV5U3RhbmRhcmQudHMiLCJrbm9ja291dC9zdGFuZGFyZC9rb1N1cnZleVdpbmRvd1N0YW5kYXJkLnRzIiwia25vY2tvdXQvc3RhbmRhcmQvdGVtcGxhdGUud2luZG93LmtvLmh0bWwudHMiLCJrbm9ja291dC9zdGFuZGFyZC90ZW1wbGF0ZVRleHRTdGFuZGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztFQUlFO0FBRUUsSUFBTyxNQUFNLENBc0loQjtBQXRJRyxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBMENmO1FBOEJJLG1CQUFZLEtBQVUsRUFBRSxJQUFtQjtZQUFuQixvQkFBbUIsR0FBbkIsV0FBbUI7WUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxD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SSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxRQUFRLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELEtBQUssRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxRQUFRLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsUUFBUSxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEcsV0FBVyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RHLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckQsY0FBYyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLFdBQVcsRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUks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USxRQUE0VDs7QUNOM1U7Ozs7RUFJRTs7Ozs7O0FBRUYsNENBQTRDO0FBQzVDLDJDQUEyQztBQUMzQyxJQUFPLE1BQU0sQ0FLWjtBQUxELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUF3QyxzQ0FBc0I7UUFBOUQ7WUFBd0MsOEJBQXNCO1FBRzlELENBQUM7UUFGRyxzQkFBYyxvQ0FBSTtpQkFBbEIsY0FBK0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDekQsVUFBbUIsS0FBYSxJQUFJLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUROO1FBRTdELHlCQUFDO0lBQUQsQ0FIQSxBQUdDLENBSHVDLDZCQUFzQixHQUc3RDtJQUhZLHlCQUFrQixxQkFHOUIsQ0FBQTtBQUNMLENBQUMsRUFMTSxNQUFNLEtBQU4sTUFBTSxRQUtaIiwiZmlsZSI6InN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4gICAgbW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEhhc2hUYWJsZTxUPiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogVDtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleURhdGEge1xyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueTtcclxuICAgICAgICBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleSBleHRlbmRzIElTdXJ2ZXlEYXRhIHtcclxuICAgICAgICBjdXJyZW50UGFnZTogSVBhZ2U7XHJcbiAgICAgICAgcGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2U6IElQYWdlLCBuZXdWYWx1ZTogYm9vbGVhbik7XHJcbiAgICAgICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbik7XHJcbiAgICAgICAgcXVlc3Rpb25BZGRlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBpbmRleDogbnVtYmVyKTtcclxuICAgICAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbik7XHJcbiAgICAgICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvcjtcclxuICAgICAgICBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICAgICAgcHJvY2Vzc1RleHQodGV4dDogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgICAgIGlzRGVzaWduTW9kZTogYm9vbGVhbjtcclxuICAgICAgICByZXF1aXJlZFRleHQ6IHN0cmluZztcclxuICAgICAgICBxdWVzdGlvblN0YXJ0SW5kZXg6IHN0cmluZztcclxuICAgICAgICBxdWVzdGlvblRpdGxlVGVtcGxhdGU6IHN0cmluZztcclxuICAgICAgICBzdG9yZU90aGVyc0FzQ29tbWVudDogYm9vbGVhbjtcclxuICAgICAgICB1cGxvYWRGaWxlKG5hbWU6IHN0cmluZywgZmlsZTogRmlsZSwgc3RvcmVEYXRhQXNUZXh0OiBib29sZWFuLCB1cGxvYWRpbmdDYWxsYmFjazogKHN0YXR1czogc3RyaW5nKSA9PiBhbnkpOiBib29sZWFuO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgICAgICBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pik7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElRdWVzdGlvbiBleHRlbmRzIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgICAgIGhhc1RpdGxlOiBib29sZWFuO1xyXG4gICAgICAgIHNldFZpc2libGVJbmRleCh2YWx1ZTogbnVtYmVyKTtcclxuICAgICAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KTtcclxuICAgICAgICBvblN1cnZleUxvYWQoKTtcclxuICAgICAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpOiBib29sZWFuO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUGFnZSBleHRlbmRzIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEl0ZW1WYWx1ZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTZXBhcmF0b3IgPSAnfCc7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWx1ZXM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgaXRlbXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IEl0ZW1WYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlLnZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB0eXBlb2YgKHZhbHVlLmhhc1RleHQpICE9PSAndW5kZWZpbmVkJyA/IHZhbHVlLml0ZW1UZXh0IDogdmFsdWVbXCJ0ZXh0XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZVtcInZhbHVlXCJdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0RGF0YShpdGVtczogQXJyYXk8SXRlbVZhbHVlPik6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmhhc1RleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IHZhbHVlOiBpdGVtLnZhbHVlLCB0ZXh0OiBpdGVtLnRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXRlbVZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtVGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIHRleHQ6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJpdGVtdmFsdWVcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuaXRlbVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pdGVtVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0cjogc3RyaW5nID0gdGhpcy5pdGVtVmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gc3RyLmluZGV4T2YoSXRlbVZhbHVlLlNlcGFyYXRvcik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZSA9IHN0ci5zbGljZSgwLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSBzdHIuc2xpY2UoaW5kZXggKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RleHQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLml0ZW1UZXh0ID8gdHJ1ZSA6IGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1RleHQpIHJldHVybiB0aGlzLml0ZW1UZXh0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSkgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGV4dChuZXdUZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVGV4dCA9IG5ld1RleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlIHtcclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgbWV0aG9kIGlzIGFic3RyYWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgbWV0aG9kIGlzIGFic3RyYWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmVudDxUIGV4dGVuZHMgRnVuY3Rpb24sIE9wdGlvbnM+ICB7XHJcbiAgICAgICAgcHJpdmF0ZSBjYWxsYmFja3M6IEFycmF5PFQ+O1xyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuY2FsbGJhY2tzID09IG51bGwgfHwgdGhpcy5jYWxsYmFja3MubGVuZ3RoID09IDA7IH1cclxuICAgICAgICBwdWJsaWMgZmlyZShzZW5kZXI6IGFueSwgb3B0aW9uczogT3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxSZXN1bHQgPSB0aGlzLmNhbGxiYWNrc1tpXShzZW5kZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkKGZ1bmM6IFQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzID0gbmV3IEFycmF5PFQ+KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChmdW5jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbW92ZShmdW5jOiBUKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2FsbGJhY2tzLmluZGV4T2YoZnVuYywgMCk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBwcml2YXRlIHR5cGVWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogQXJyYXk8YW55PiA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBjaG9pY2VzZnVuYzogKCkgPT4gQXJyYXk8YW55PiA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lUGFydDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBvbkdldFZhbHVlOiAob2JqOiBhbnkpID0+IGFueSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG9uU2V0VmFsdWU6IChvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpID0+IGFueVxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50eXBlVmFsdWUgPyB0aGlzLnR5cGVWYWx1ZSA6IFwic3RyaW5nXCI7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHR5cGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnR5cGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUb1VzZUdldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vbkdldFZhbHVlOyB9IFxyXG4gICAgICAgIHB1YmxpYyBpc0RlZmF1bHRWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5kZWZhdWx0VmFsdWUpID8gKHRoaXMuZGVmYXVsdFZhbHVlID09IHZhbHVlKSA6ICEodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWUob2JqOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vbkdldFZhbHVlKSByZXR1cm4gdGhpcy5vbkdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlU2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uU2V0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0VmFsdWUob2JqOiBhbnksIHZhbHVlOiBhbnksIGpzb25Db252OiBKc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TZXRWYWx1ZShvYmosIHZhbHVlLCBqc29uQ29udik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldE9ialR5cGUob2JqVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbGFzc05hbWVQYXJ0KSByZXR1cm4gb2JqVHlwZTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ialR5cGUucmVwbGFjZSh0aGlzLmNsYXNzTmFtZVBhcnQsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q2xhc3NOYW1lKGNsYXNzTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmNsYXNzTmFtZVBhcnQgJiYgY2xhc3NOYW1lLmluZGV4T2YodGhpcy5jbGFzc05hbWVQYXJ0KSA8IDApID8gY2xhc3NOYW1lICsgdGhpcy5jbGFzc05hbWVQYXJ0IDogY2xhc3NOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZXNWYWx1ZSAhPSBudWxsKSByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZXNmdW5jICE9IG51bGwpIHJldHVybiB0aGlzLmNob2ljZXNmdW5jKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0Q2hvaWNlcyh2YWx1ZTogQXJyYXk8YW55PiwgdmFsdWVGdW5jOiAoKSA9PiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc2Z1bmMgPSB2YWx1ZUZ1bmM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICBzdGF0aWMgcmVxdWlyZWRTeW1ib2wgPSAnISc7XHJcbiAgICAgICAgc3RhdGljIHR5cGVTeW1ib2wgPSAnOic7XHJcbiAgICAgICAgcHJvcGVydGllczogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiA9IG51bGw7XHJcbiAgICAgICAgcmVxdWlyZWRQcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmc+ID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwcm9wZXJ0aWVzOiBBcnJheTxhbnk+LCBwdWJsaWMgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcHVibGljIHBhcmVudE5hbWU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuY3JlYXRlUHJvcGVydHkocHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmaW5kKG5hbWU6IHN0cmluZyk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRoaXMucHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0eShwcm9wSW5mbzogYW55KTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHR5cGVvZiBwcm9wSW5mbyA9PT0gXCJzdHJpbmdcIiA/IHByb3BJbmZvIDogcHJvcEluZm8ubmFtZTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eU5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciB0eXBlSW5kZXggPSBwcm9wZXJ0eU5hbWUuaW5kZXhPZihKc29uTWV0YWRhdGFDbGFzcy50eXBlU3ltYm9sKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKHR5cGVJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCB0eXBlSW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHRoaXMuZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gbmV3IEpzb25PYmplY3RQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLnR5cGUgPSBwcm9wZXJ0eVR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wSW5mbyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLnR5cGUgPSBwcm9wSW5mby50eXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLmRlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLmRlZmF1bHRWYWx1ZSA9IHByb3BJbmZvLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8uaXNSZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFrZVByb3BlcnR5UmVxdWlyZWQocHJvcC5uYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5jaG9pY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNob2ljZXNGdW5jID0gdHlwZW9mIHByb3BJbmZvLmNob2ljZXMgPT09IFwiZnVuY3Rpb25cIiA/IHByb3BJbmZvLmNob2ljZXMgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaG9pY2VzVmFsdWUgPSB0eXBlb2YgcHJvcEluZm8uY2hvaWNlcyAhPT0gXCJmdW5jdGlvblwiID8gcHJvcEluZm8uY2hvaWNlcyA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5zZXRDaG9pY2VzKGNob2ljZXNWYWx1ZSwgY2hvaWNlc0Z1bmMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLm9uR2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLm9uR2V0VmFsdWUgPSBwcm9wSW5mby5vbkdldFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLm9uU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLm9uU2V0VmFsdWUgPSBwcm9wSW5mby5vblNldFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AuY2xhc3NOYW1lID0gcHJvcEluZm8uY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLmJhc2VDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLmJhc2VDbGFzc05hbWUgPSBwcm9wSW5mby5iYXNlQ2xhc3NOYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLmNsYXNzTmFtZVBhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLmNsYXNzTmFtZVBhcnQgPSBwcm9wSW5mby5jbGFzc05hbWVQYXJ0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUubGVuZ3RoID09IDAgfHwgcHJvcGVydHlOYW1lWzBdICE9IEpzb25NZXRhZGF0YUNsYXNzLnJlcXVpcmVkU3ltYm9sKSByZXR1cm4gcHJvcGVydHlOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIHRoaXMubWFrZVByb3BlcnR5UmVxdWlyZWQocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5TmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBtYWtlUHJvcGVydHlSZXF1aXJlZChwcm9wZXJ0eU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NlczogSGFzaFRhYmxlPEpzb25NZXRhZGF0YUNsYXNzPiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2hpbGRyZW5DbGFzc2VzOiBIYXNoVGFibGU8QXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NQcm9wZXJ0aWVzOiBIYXNoVGFibGU8QXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pj4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzOiBIYXNoVGFibGU8QXJyYXk8c3RyaW5nPj4gPSB7fTtcclxuICAgICAgICBwdWJsaWMgYWRkQ2xhc3MobmFtZTogc3RyaW5nLCBwcm9wZXJ0aWVzOiBBcnJheTxhbnk+LCBjcmVhdG9yOiAoKSA9PiBhbnkgPSBudWxsLCBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKTogSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IG5ldyBKc29uTWV0YWRhdGFDbGFzcyhuYW1lLCBwcm9wZXJ0aWVzLCBjcmVhdG9yLCBwYXJlbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGVDbGFzc0NyZWF0b3JlKG5hbWU6IHN0cmluZywgY3JlYXRvcjogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhRGF0YUNsYXNzLmNyZWF0b3IgPSBjcmVhdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZyk6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4ge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NQcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUHJvcGVydGllcyhuYW1lLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NQcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydGllcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNyZWF0ZUNsYXNzKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzLmNyZWF0b3IoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxDaGlsZHJlbkNsYXNzZXMobmFtZSwgY2FuQmVDcmVhdGVkLCByZXN1bHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZyk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydGllcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWU6IHN0cmluZywgY2FuQmVDcmVhdGVkOiBib29sZWFuLCByZXN1bHQ6IEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPikge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNhbkJlQ3JlYXRlZCB8fCBjaGlsZHJlbltpXS5jcmVhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKGNoaWxkcmVuW2ldLm5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRDbGFzcyhuYW1lOiBzdHJpbmcpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXNzZXNbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUHJvcGVydHkobWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzW2ldLCBsaXN0LCBsaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eShwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBlbmRJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuZEluZGV4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0W2ldLm5hbWUgPT0gcHJvcGVydHkubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHByb3BlcnR5KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpbmRleF0gPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxzdHJpbmc+KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGxpc3QsIG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgYXQ6IE51bWJlciA9IC0xO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEZ1bGxEZXNjcmlwdGlvbigpIDogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZSArICh0aGlzLmRlc2NyaXB0aW9uID8gXCJcXG5cIiArIHRoaXMuZGVzY3JpcHRpb24gOiBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcInVua25vd25wcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInIGlzIHVua25vd24uXCIpO1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGxpc3Qgb2YgYXZhaWxhYmxlIHByb3BlcnRpZXMgYXJlOiBcIjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID4gMCkgdGhpcy5kZXNjcmlwdGlvbiArPSBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBwcm9wZXJ0aWVzW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9ICcuJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2UgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIodHlwZSwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBmb2xsb3dpbmcgdHlwZXMgYXJlIGF2YWlsYWJsZTogXCI7XHJcbiAgICAgICAgICAgIHZhciB0eXBlcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKGJhc2VDbGFzc05hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIidcIiArIHR5cGVzW2ldLm5hbWUgKyBcIidcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwibWlzc2luZ3R5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIG1pc3NpbmcgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uSW5jb3JyZWN0VHlwZUVycm9yIGV4dGVuZHMgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoYmFzZUNsYXNzTmFtZSwgXCJpbmNvcnJlY3R0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBpbmNvcnJlY3QgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcInJlcXVpcmVkcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGlzIHJlcXVpcmVkIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uT2JqZWN0IHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB0eXBlUHJvcGVydHlOYW1lID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcG9zaXRpb25Qcm9wZXJ0eU5hbWUgPSBcInBvc1wiO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1ldGFEYXRhVmFsdWUgPSBuZXcgSnNvbk1ldGFkYXRhKCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXQgbWV0YURhdGEoKSB7IHJldHVybiBKc29uT2JqZWN0Lm1ldGFEYXRhVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZXJyb3JzID0gbmV3IEFycmF5PEpzb25FcnJvcj4oKTtcclxuICAgICAgICBwdWJsaWMgdG9Kc29uT2JqZWN0KG9iajogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9Kc29uT2JqZWN0Q29yZShvYmosIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdG9PYmplY3QoanNvbk9iajogYW55LCBvYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAob2JqLmdldFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGpzb25PYmpba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KHByb3BlcnRpZXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihuZXcgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yKGtleS50b1N0cmluZygpLCBvYmouZ2V0VHlwZSgpKSwganNvbk9iaik7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvT2JqKGpzb25PYmpba2V5XSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdG9Kc29uT2JqZWN0Q29yZShvYmo6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghb2JqLmdldFR5cGUpIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgKCFwcm9wZXJ0eS5jbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXSA9IHByb3BlcnR5LmdldE9ialR5cGUob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9Kc29uKG9iaiwgcmVzdWx0LCBwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0pzb24ob2JqOiBhbnksIHJlc3VsdDogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHByb3BlcnR5LmdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG9ialtwcm9wZXJ0eS5uYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaXNEZWZhdWx0VmFsdWUodmFsdWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnJWYWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyclZhbHVlLnB1c2godGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlW2ldLCBwcm9wZXJ0eSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBhcnJWYWx1ZS5sZW5ndGggPiAwID8gYXJyVmFsdWUgOiBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnRvSnNvbk9iamVjdENvcmUodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BlcnR5Lm5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9PYmoodmFsdWU6IGFueSwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5Lmhhc1RvVXNlU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5LnNldFZhbHVlKG9iaiwgdmFsdWUsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb0FycmF5KHZhbHVlLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB2YXIgbmV3T2JqID0gdGhpcy5jcmVhdGVOZXdPYmoodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgaWYgKG5ld09iai5uZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWUsIG5ld09iai5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBuZXdPYmoubmV3T2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbmV3T2JqLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZUFycmF5KHZhbHVlOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkuaW5kZXhPZihcIkFycmF5XCIpID4gLTE7IH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZU5ld09iaih2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgbmV3T2JqOiBudWxsLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gdmFsdWVbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjbGFzc05hbWUgJiYgcHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5nZXRDbGFzc05hbWUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgcmVzdWx0Lm5ld09iaiA9IChjbGFzc05hbWUpID8gSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyhjbGFzc05hbWUpIDogbnVsbDtcclxuICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gdGhpcy5jaGVja05ld09iamVjdE9uRXJyb3JzKHJlc3VsdC5uZXdPYmosIHZhbHVlLCBwcm9wZXJ0eSwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja05ld09iamVjdE9uRXJyb3JzKG5ld09iajogYW55LCB2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBjbGFzc05hbWU6IHN0cmluZyk6IEpzb25FcnJvciB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChuZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlZFByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFJlcXVpcmVkUHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVxdWlyZWRQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVbcmVxdWlyZWRQcm9wZXJ0aWVzW2ldXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvcihyZXF1aXJlZFByb3BlcnRpZXNbaV0sIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbk1pc3NpbmdUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbkluY29ycmVjdFR5cGVFcnJvcihwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZE5ld0Vycm9yKGVycm9yLCB2YWx1ZSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGROZXdFcnJvcihlcnJvcjogSnNvbkVycm9yLCBqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKGpzb25PYmogJiYganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuYXQgPSBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdLnN0YXJ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZhbHVlVG9BcnJheSh2YWx1ZTogQXJyYXk8YW55Piwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ZhbHVlQXJyYXkob2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlW2ldLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaChuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWVbaV0sIG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaCh2YWx1ZVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmluZFByb3BlcnR5KHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGtleTogYW55KTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IGtleSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBDaG9pY2VzUmVzdGZ1bGwgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBwdWJsaWMgdXJsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBwYXRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyB2YWx1ZU5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHRpdGxlTmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgZ2V0UmVzdWx0Q2FsbGJhY2s6IChpdGVtczogQXJyYXk8SXRlbVZhbHVlPikgPT4gdm9pZDtcclxuICAgICAgICBwdWJsaWMgZXJyb3I6IFN1cnZleUVycm9yID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJ1bigpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnVybCB8fCAhdGhpcy5nZXRSZXN1bHRDYWxsYmFjaykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgdGhpcy51cmwpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZChKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uRXJyb3IoeGhyLnN0YXR1c1RleHQsIHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJjaG9pY2VzQnlVcmxcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICF0aGlzLnVybCAmJiAhdGhpcy5wYXRoICYmICF0aGlzLnZhbHVlTmFtZSAmJiAhdGhpcy50aXRsZU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXREYXRhKGpzb246IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChqc29uLnVybCkgdGhpcy51cmwgPSBqc29uLnVybDtcclxuICAgICAgICAgICAgaWYgKGpzb24ucGF0aCkgdGhpcy5wYXRoID0ganNvbi5wYXRoO1xyXG4gICAgICAgICAgICBpZiAoanNvbi52YWx1ZU5hbWUpIHRoaXMudmFsdWVOYW1lID0ganNvbi52YWx1ZU5hbWU7XHJcbiAgICAgICAgICAgIGlmIChqc29uLnRpdGxlTmFtZSkgdGhpcy50aXRsZU5hbWUgPSBqc29uLnRpdGxlTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVybCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMucGF0aCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVOYW1lID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy50aXRsZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Mb2FkKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmdldFJlc3VsdEFmdGVyUGF0aChyZXN1bHQpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdFtcImxlbmd0aFwiXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbVZhbHVlID0gcmVzdWx0W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXRlbVZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRUaXRsZShpdGVtVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2gobmV3IEl0ZW1WYWx1ZSh2YWx1ZSwgdGl0bGUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInVybEdldENob2ljZXNFcnJvclwiKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5nZXRSZXN1bHRDYWxsYmFjayhpdGVtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25FcnJvcihzdGF0dXM6IHN0cmluZywgcmVzcG9uc2U6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ1cmxSZXF1ZXN0RXJyb3JcIilbXCJmb3JtYXRcIl0oc3RhdHVzLCByZXNwb25zZSkpO1xyXG4gICAgICAgICAgICB0aGlzLmdldFJlc3VsdENhbGxiYWNrKFtdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRSZXN1bHRBZnRlclBhdGgocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wYXRoKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgcGF0aGVzID0gdGhpcy5nZXRQYXRoZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtwYXRoZXNbaV1dO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UGF0aGVzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgcGF0aGVzID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhdGguaW5kZXhPZignOycpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHBhdGhlcyA9IHRoaXMucGF0aC5zcGxpdCgnOycpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGF0aGVzID0gdGhpcy5wYXRoLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHBhdGhlcy5sZW5ndGggPT0gMCkgcGF0aGVzLnB1c2godGhpcy5wYXRoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGhlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWYWx1ZShpdGVtOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZU5hbWUpIHJldHVybiBpdGVtW3RoaXMudmFsdWVOYW1lXTtcclxuICAgICAgICAgICAgdmFyIGxlbiA9IE9iamVjdC5rZXlzKGl0ZW0pLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGxlbiA8IDEpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVtPYmplY3Qua2V5cyhpdGVtKVswXV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGl0bGUoaXRlbTogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRpdGxlTmFtZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW3RoaXMudGl0bGVOYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hvaWNlc0J5VXJsXCIsIFtcInVybFwiLCBcInBhdGhcIiwgXCJ2YWx1ZU5hbWVcIiwgXCJ0aXRsZU5hbWVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBDaG9pY2VzUmVzdGZ1bGwoKTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29uZGl0aW9ucy50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIENvbmRpdGlvbnNQYXJzZXIge1xyXG4gICAgICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgcm9vdDogQ29uZGl0aW9uTm9kZTtcclxuICAgICAgICBwcml2YXRlIGV4cHJlc3Npb25Ob2RlczogQXJyYXk8Q29uZGl0aW9uTm9kZT47XHJcbiAgICAgICAgcHJpdmF0ZSBub2RlOiBDb25kaXRpb25Ob2RlO1xyXG4gICAgICAgIHByaXZhdGUgYXQ6IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBwYXJzZSh0ZXh0OiBzdHJpbmcsIHJvb3Q6IENvbmRpdGlvbk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcclxuICAgICAgICAgICAgdGhpcy5yb290LmNsZWFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMudGV4dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnBhcnNlVGV4dCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdG9TdHJpbmcocm9vdDogQ29uZGl0aW9uTm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVUb1N0cmluZyhyb290KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB0b1N0cmluZ0NvcmUodmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVbXCJjaGlsZHJlblwiXSkgcmV0dXJuIHRoaXMubm9kZVRvU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlW1wibGVmdFwiXSkgcmV0dXJuIHRoaXMuY29uZGl0aW9uVG9TdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBub2RlVG9TdHJpbmcobm9kZTogQ29uZGl0aW9uTm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmlzRW1wdHkpIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm9kZVRleHQgPSB0aGlzLnRvU3RyaW5nQ29yZShub2RlLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChub2RlVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMpIHJlcyArPSAnICcgKyBub2RlLmNvbm5lY3RpdmUgKyAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzICs9IG5vZGVUZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChub2RlICE9IHRoaXMucm9vdCAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHJlcyA9ICcoJyArIHJlcyArICcpJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNvbmRpdGlvblRvU3RyaW5nKGNvbmRpdGlvbjogQ29uZGl0aW9uKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFjb25kaXRpb24ucmlnaHQgfHwgIWNvbmRpdGlvbi5vcGVyYXRvcikgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gY29uZGl0aW9uLmxlZnQ7XHJcbiAgICAgICAgICAgIGlmIChsZWZ0ICYmICF0aGlzLmlzTnVtZXJpYyhsZWZ0KSkgbGVmdCA9IFwiJ1wiICsgbGVmdCArIFwiJ1wiO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gbGVmdCArICcgJyArIHRoaXMub3BlcmF0aW9uVG9TdHJpbmcoY29uZGl0aW9uLm9wZXJhdG9yKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNOb1JpZ2h0T3BlcmF0aW9uKGNvbmRpdGlvbi5vcGVyYXRvcikpIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IGNvbmRpdGlvbi5yaWdodDtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0ICYmICF0aGlzLmlzTnVtZXJpYyhyaWdodCkpIHJpZ2h0ID0gXCInXCIgKyByaWdodCArIFwiJ1wiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzICsgJyAnICsgcmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb3BlcmF0aW9uVG9TdHJpbmcob3A6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSBcImVxdWFsXCIpIHJldHVybiBcIj1cIjtcclxuICAgICAgICAgICAgaWYgKG9wID09IFwibm90ZXF1YWxcIikgcmV0dXJuIFwiIT1cIjtcclxuICAgICAgICAgICAgaWYgKG9wID09IFwiZ3JlYXRlclwiKSByZXR1cm4gXCI+XCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSBcImxlc3NcIikgcmV0dXJuIFwiPFwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gXCJncmVhdGVyb3JlcXVhbFwiKSByZXR1cm4gXCI+PVwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gXCJsZXNzb3JlcXVhbFwiKSByZXR1cm4gXCI8PVwiO1xyXG4gICAgICAgICAgICByZXR1cm4gb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNOdW1lcmljKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4odmFsKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwYXJzZVRleHQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZSA9IHRoaXMucm9vdDtcclxuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uTm9kZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uTm9kZXMucHVzaCh0aGlzLm5vZGUpO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5yZWFkQ29uZGl0aW9ucygpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzICYmIHRoaXMuYXQgPj0gdGhpcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVhZENvbmRpdGlvbnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnJlYWRDb25kaXRpb24oKTtcclxuICAgICAgICAgICAgaWYgKCFyZXMpIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0aXZlID0gdGhpcy5yZWFkQ29ubmVjdGl2ZSgpO1xyXG4gICAgICAgICAgICBpZiAoY29ubmVjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb25uZWN0aXZlKGNvbm5lY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZENvbmRpdGlvbnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkQ29uZGl0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVhZEV4cHJlc3Npb24oKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoIWxlZnQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIG9wID0gdGhpcy5yZWFkT3BlcmF0b3IoKTtcclxuICAgICAgICAgICAgaWYgKCFvcCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgYyA9IG5ldyBDb25kaXRpb24oKTtcclxuICAgICAgICAgICAgYy5sZWZ0ID0gbGVmdDsgYy5vcGVyYXRvciA9IG9wOyBcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTm9SaWdodE9wZXJhdGlvbihvcCkpIHtcclxuICAgICAgICAgICAgICAgIHZhciByaWdodCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyaWdodCkgcmV0dXJuIGZhbHNlOyBcclxuICAgICAgICAgICAgICAgIGMucmlnaHQgPSByaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFkZENvbmRpdGlvbihjKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVhZEV4cHJlc3Npb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hdCA+PSB0aGlzLmxlbmd0aCB8fCB0aGlzLmNoICE9ICcoJykgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuYXQrKztcclxuICAgICAgICAgICAgdGhpcy5wdXNoRXhwcmVzc2lvbigpO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5yZWFkQ29uZGl0aW9ucygpO1xyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgICAgIHJlcyA9IHRoaXMuY2ggPT0gJyknO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wb3BFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXQgY2goKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGV4dC5jaGFyQXQodGhpcy5hdCk7IH1cclxuICAgICAgICBwcml2YXRlIHNraXAoKSB7XHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmF0IDwgdGhpcy5sZW5ndGggJiYgdGhpcy5pc1NwYWNlKHRoaXMuY2gpKSB0aGlzLmF0Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNTcGFjZShjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGMgPT0gJyAnIHx8IGMgPT0gJ1xcbicgfHwgYyA9PSAnXFx0JyB8fCBjID09ICdcXHInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzUXVvdGVzKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYyA9PSBcIidcIiB8fCBjID09ICdcIidcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc09wZXJhdG9yQ2hhcihjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGMgPT0gJz4nIHx8IGMgPT0gJzwnIHx8IGMgPT0gJz0nIHx8IGMgPT0gJyEnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzQnJhY2tldHMoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjID09ICcoJyB8fCBjID09ICcpJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hdCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciBzdGFydCA9IHRoaXMuYXQ7XHJcbiAgICAgICAgICAgIHZhciBoYXNRdW90ZXMgPSB0aGlzLmlzUXVvdGVzKHRoaXMuY2gpO1xyXG4gICAgICAgICAgICBpZiAoaGFzUXVvdGVzKSB0aGlzLmF0Kys7XHJcbiAgICAgICAgICAgIHZhciBpc0ZpcnN0T3BDaCA9IHRoaXMuaXNPcGVyYXRvckNoYXIodGhpcy5jaCk7XHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmF0IDwgdGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaGFzUXVvdGVzICYmIHRoaXMuaXNTcGFjZSh0aGlzLmNoKSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1F1b3Rlcyh0aGlzLmNoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNRdW90ZXMpIHRoaXMuYXQrKztcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghaGFzUXVvdGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRmlyc3RPcENoICE9IHRoaXMuaXNPcGVyYXRvckNoYXIodGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQnJhY2tldHModGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmF0IDw9IHN0YXJ0KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMudGV4dC5zdWJzdHIoc3RhcnQsIHRoaXMuYXQgLSBzdGFydCk7XHJcbiAgICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMSAmJiB0aGlzLmlzUXVvdGVzKHJlc1swXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gcmVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNRdW90ZXMocmVzW3Jlcy5sZW5ndGggLSAxXSkpIGxlbi0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5zdWJzdHIoMSwgbGVuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzTm9SaWdodE9wZXJhdGlvbihvcDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvcCA9PSBcImVtcHR5XCIgfHwgb3AgPT0gXCJub3RlbXB0eVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJlYWRPcGVyYXRvcigpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgb3AgPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKCFvcCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIG9wID0gb3AudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKG9wID09ICc+Jykgb3AgPSBcImdyZWF0ZXJcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09ICc8Jykgb3AgPSBcImxlc3NcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09ICc+PScgfHwgb3AgPT0gJz0+Jykgb3AgPSBcImdyZWF0ZXJvcmVxdWFsXCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnPD0nIHx8IG9wID09ICc9PCcpIG9wID0gXCJsZXNzb3JlcXVhbFwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJz0nIHx8IG9wID09ICc9PScpIG9wID0gXCJlcXVhbFwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJzw+JyB8fCBvcCA9PSAnIT0nKSBvcCA9IFwibm90ZXF1YWxcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09ICdjb250YWluJykgb3AgPSBcImNvbnRhaW5zXCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnbm90Y29udGFpbicpIG9wID0gXCJub3Rjb250YWluc1wiO1xyXG4gICAgICAgICAgICByZXR1cm4gb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVhZENvbm5lY3RpdmUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGNvbiA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoIWNvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGNvbiA9IGNvbi50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAoY29uID09IFwiJlwiIHx8IGNvbiA9PSBcIiYmXCIpIGNvbiA9IFwiYW5kXCI7XHJcbiAgICAgICAgICAgIGlmIChjb24gPT0gXCJ8XCIgfHwgY29uID09IFwifHxcIikgY29uID0gXCJvclwiO1xyXG4gICAgICAgICAgICBpZiAoY29uICE9IFwiYW5kXCIgJiYgY29uICE9IFwib3JcIikgY29uID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwdXNoRXhwcmVzc2lvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25Ob2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHBvcEV4cHJlc3Npb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5leHByZXNzaW9uTm9kZXMucG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZSA9IHRoaXMuZXhwcmVzc2lvbk5vZGVzW3RoaXMuZXhwcmVzc2lvbk5vZGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRDb25kaXRpb24oYzogQ29uZGl0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKGMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZENvbm5lY3RpdmUoY29uOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5jaGlsZHJlbi5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY29ubmVjdGl2ZSA9IGNvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuY29ubmVjdGl2ZSAhPSBjb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkQ29uID0gdGhpcy5ub2RlLmNvbm5lY3RpdmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZENoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0aXZlID0gY29uO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGROb2RlID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBvbGROb2RlLmNvbm5lY3RpdmUgPSBvbGRDb247XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkTm9kZS5jaGlsZHJlbiA9IG9sZENoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG9sZE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChuZXdOb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUgPSBuZXdOb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb25kaXRpb25zUGFyc2VyLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDb25kaXRpb24ge1xyXG4gICAgICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICAgICAgc3RhdGljIGdldCBvcGVyYXRvcnMoKSB7XHJcbiAgICAgICAgICAgIGlmIChDb25kaXRpb24ub3BlcmF0b3JzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICAgICAgQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gIWxlZnQ7IH0sXHJcbiAgICAgICAgICAgICAgICBub3RlbXB0eTogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAhKCFsZWZ0KTsgfSxcclxuICAgICAgICAgICAgICAgIGVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPT0gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgICAgICBub3RlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ICE9IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCAmJiBsZWZ0W1wiaW5kZXhPZlwiXSAmJiBsZWZ0LmluZGV4T2YocmlnaHQpID4gLTE7IH0sXHJcbiAgICAgICAgICAgICAgICBub3Rjb250YWluczogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAhbGVmdCB8fCAhbGVmdFtcImluZGV4T2ZcIl0gfHwgbGVmdC5pbmRleE9mKHJpZ2h0KSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA+IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0IDwgcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ID49IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA8PSByaWdodDsgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9wVmFsdWU6IHN0cmluZyA9IFwiZXF1YWxcIjtcclxuICAgICAgICBwdWJsaWMgbGVmdDogYW55O1xyXG4gICAgICAgIHB1YmxpYyByaWdodDogYW55O1xyXG4gICAgICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFDb25kaXRpb24ub3BlcmF0b3JzW3ZhbHVlXSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm9wVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHBlcmZvcm0obGVmdDogYW55ID0gbnVsbCwgcmlnaHQ6IGFueSA9IG51bGwpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFsZWZ0KSBsZWZ0ID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgICAgICBpZiAoIXJpZ2h0KSByaWdodCA9IHRoaXMucmlnaHQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gQ29uZGl0aW9uLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh0aGlzLmdldFB1cmVWYWx1ZShsZWZ0KSwgdGhpcy5nZXRQdXJlVmFsdWUocmlnaHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRQdXJlVmFsdWUodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIXZhbCB8fCAodHlwZW9mIHZhbCAhPSBcInN0cmluZ1wiKSkgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCAmJiAodmFsWzBdID09IFwiJ1wiIHx8IHZhbFswXSA9PSAnXCInKSkgIHZhbCA9IHZhbC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgIHZhciBsZW4gPSB2YWwubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAobGVuID4gMCAmJiAodmFsW2xlbiAtIDFdID09IFwiJ1wiIHx8IHZhbFtsZW4gLSAxXSA9PSAnXCInKSkgIHZhbCA9IHZhbC5zdWJzdHIoMCwgbGVuIC0gMSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIENvbmRpdGlvbk5vZGUge1xyXG4gICAgICAgIHByaXZhdGUgY29ubmVjdGl2ZVZhbHVlOiBzdHJpbmcgPSBcImFuZFwiO1xyXG4gICAgICAgIHB1YmxpYyBjaGlsZHJlbjogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29ubmVjdGl2ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jb25uZWN0aXZlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbm5lY3RpdmUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwiJlwiIHx8IHZhbHVlID09IFwiJiZcIikgdmFsdWUgPSBcImFuZFwiO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCJ8XCIgfHwgdmFsdWUgPT0gXCJ8fFwiKSB2YWx1ZSA9IFwib3JcIjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IFwiYW5kXCIgJiYgdmFsdWUgIT0gXCJvclwiKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGl2ZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpIHsgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDA7IH1cclxuICAgICAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aXZlID0gXCJhbmRcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgQ29uZGl0aW9uUnVubmVyIHtcclxuICAgICAgICBwcml2YXRlIGV4cHJlc3Npb25WYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgcm9vdDogQ29uZGl0aW9uTm9kZTtcclxuICAgICAgICBwcml2YXRlIHZhbHVlczogSGFzaFRhYmxlPGFueT47XHJcbiAgICAgICAgcHVibGljIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGV4cHJlc3Npb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZXhwcmVzc2lvblZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBleHByZXNzaW9uKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZXhwcmVzc2lvbiA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBuZXcgQ29uZGl0aW9uc1BhcnNlcigpLnBhcnNlKHRoaXMuZXhwcmVzc2lvblZhbHVlLCB0aGlzLnJvb3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcnVuKHZhbHVlczogSGFzaFRhYmxlPGFueT4pOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJ1bk5vZGUodGhpcy5yb290KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBydW5Ob2RlKG5vZGU6IENvbmRpdGlvbk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIG9uRmlyc3RGYWlsID0gbm9kZS5jb25uZWN0aXZlID09IFwiYW5kXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMucnVuTm9kZUNvbmRpdGlvbihub2RlLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzICYmIG9uRmlyc3RGYWlsKSByZXR1cm4gZmFsc2U7IFxyXG4gICAgICAgICAgICAgICAgaWYgKHJlcyAmJiAhb25GaXJzdEZhaWwpIHJldHVybiB0cnVlOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb25GaXJzdEZhaWw7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJ1bk5vZGVDb25kaXRpb24odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZVtcImNoaWxkcmVuXCJdKSByZXR1cm4gdGhpcy5ydW5Ob2RlKHZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlW1wibGVmdFwiXSkgcmV0dXJuIHRoaXMucnVuQ29uZGl0aW9uKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJ1bkNvbmRpdGlvbihjb25kaXRpb246IENvbmRpdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IGNvbmRpdGlvbi5sZWZ0O1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0VmFsdWVOYW1lKGxlZnQpO1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEobmFtZSBpbiB0aGlzLnZhbHVlcykpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSB0aGlzLnZhbHVlc1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcmlnaHQgPSBjb25kaXRpb24ucmlnaHQ7XHJcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLmdldFZhbHVlTmFtZShyaWdodCk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShuYW1lIGluIHRoaXMudmFsdWVzKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSB0aGlzLnZhbHVlc1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZGl0aW9uLnBlcmZvcm0obGVmdCwgcmlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFZhbHVlTmFtZShub2RlVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIW5vZGVWYWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZVZhbHVlICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmIChub2RlVmFsdWUubGVuZ3RoIDwgMyB8fCBub2RlVmFsdWVbMF0gIT0gJ3snIHx8IG5vZGVWYWx1ZVtub2RlVmFsdWUubGVuZ3RoIC0gMV0gIT0gJ30nKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG5vZGVWYWx1ZS5zdWJzdHIoMSwgbm9kZVZhbHVlLmxlbmd0aCAtIDIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBkeFN1cnZleVNlcnZpY2Uge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwczovL2R4c3VydmV5YXBpLmF6dXJld2Vic2l0ZXMubmV0L2FwaS9TdXJ2ZXlcIjtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwOi8vbG9jYWxob3N0OjUwNDg4L2FwaS9TdXJ2ZXlcIjtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXkoc3VydmV5SWQ6IHN0cmluZywgb25Mb2FkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFN1cnZleT9zdXJ2ZXlJZD0nICsgc3VydmV5SWQpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIG9uTG9hZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZywgcmVzdWx0OiBKU09OLCBvblNlbmRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KT0+IHZvaWQsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL3Bvc3QvJyk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHsgcG9zdElkOiBwb3N0SWQsIHN1cnZleVJlc3VsdDogSlNPTi5zdHJpbmdpZnkocmVzdWx0KSB9O1xyXG4gICAgICAgICAgICBpZiAoY2xpZW50SWQpIGRhdGFbJ2NsaWVudElkJ10gPSBjbGllbnRJZDtcclxuICAgICAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCkgZGF0YVsnaXNQYXJ0aWFsQ29tcGxldGVkJ10gPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgZGF0YVN0cmluZ2lmeTogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvblNlbmRSZXN1bHQpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIG9uU2VuZFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoZGF0YVN0cmluZ2lmeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kRmlsZShwb3N0SWQ6IHN0cmluZywgZmlsZTogRmlsZSwgb25TZW5kRmlsZTogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9uU2VuZEZpbGUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIG9uU2VuZEZpbGUoeGhyLnN0YXR1cyA9PSAyMDAsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvdXBsb2FkLycsIHRydWUpO1xyXG4gICAgICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZmlsZVwiLCBmaWxlKTtcclxuICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwicG9zdElkXCIsIHBvc3RJZCk7XHJcbiAgICAgICAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIG9uR2V0UmVzdWx0OiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogQXJyYXk8YW55PiwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gJ3Jlc3VsdElkPScgKyByZXN1bHRJZCArICcmbmFtZT0nICsgbmFtZTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9nZXRSZXN1bHQ/JyArIGRhdGEpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBsaXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlc3VsdC5RdWVzdGlvblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSB7IG5hbWU6IGtleSwgdmFsdWU6IHJlc3VsdC5RdWVzdGlvblJlc3VsdFtrZXldIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb25HZXRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgbGlzdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGlzQ29tcGxldGVkKHJlc3VsdElkOiBzdHJpbmcsIGNsaWVudElkOiBzdHJpbmcsIG9uSXNDb21wbGV0ZWQ6IChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gJ3Jlc3VsdElkPScgKyByZXN1bHRJZCArICcmY2xpZW50SWQ9JyArIGNsaWVudElkO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2lzQ29tcGxldGVkPycgKyBkYXRhKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvbklzQ29tcGxldGVkKHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IHZhciBzdXJ2ZXlMb2NhbGl6YXRpb24gPSB7XHJcbiAgICAgICAgY3VycmVudExvY2FsZTogXCJcIixcclxuICAgICAgICBsb2NhbGVzOiB7fSxcclxuICAgICAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9IHRoaXMuY3VycmVudExvY2FsZSA/IHRoaXMubG9jYWxlc1t0aGlzLmN1cnJlbnRMb2NhbGVdIDogc3VydmV5U3RyaW5ncztcclxuICAgICAgICAgICAgaWYgKCFsb2MgfHwgIWxvY1tzdHJOYW1lXSkgbG9jID0gc3VydmV5U3RyaW5ncztcclxuICAgICAgICAgICAgcmV0dXJuIGxvY1tzdHJOYW1lXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldExvY2FsZXM6IGZ1bmN0aW9uICgpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgICAgICByZXMucHVzaChcIlwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMubG9jYWxlcykge1xyXG4gICAgICAgICAgICAgICAgcmVzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXMuc29ydCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBleHBvcnQgdmFyIHN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgcGFnZVByZXZUZXh0OiBcIlByZXZpb3VzXCIsXHJcbiAgICAgICAgcGFnZU5leHRUZXh0OiBcIk5leHRcIixcclxuICAgICAgICBjb21wbGV0ZVRleHQ6IFwiQ29tcGxldGVcIixcclxuICAgICAgICBvdGhlckl0ZW1UZXh0OiBcIk90aGVyIChkZXNjcmliZSlcIixcclxuICAgICAgICBwcm9ncmVzc1RleHQ6IFwiUGFnZSB7MH0gb2YgezF9XCIsXHJcbiAgICAgICAgZW1wdHlTdXJ2ZXk6IFwiVGhlcmUgaXMgbm8gYW55IHZpc2libGUgcGFnZSBvciB2aXNpYmxlIHF1ZXN0aW9uIGluIHRoZSBzdXJ2ZXkuXCIsXHJcbiAgICAgICAgY29tcGxldGluZ1N1cnZleTogXCJUaGFuayBZb3UgZm9yIENvbXBsZXRpbmcgdGhlIFN1cnZleSFcIixcclxuICAgICAgICBsb2FkaW5nU3VydmV5OiBcIlN1cnZleSBpcyBsb2FkaW5nIGZyb20gdGhlIHNlcnZlci4uLlwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIkNob29zZS4uLlwiLFxyXG4gICAgICAgIHJlcXVpcmVkRXJyb3I6IFwiUGxlYXNlIGFuc3dlciB0aGUgcXVlc3Rpb24uXCIsXHJcbiAgICAgICAgbnVtZXJpY0Vycm9yOiBcIlRoZSB2YWx1ZSBzaG91bGQgYmUgYSBudW1lcmljLlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwiUGxlYXNlIGVudGVyIGF0IGxlYXN0IHswfSBzeW1ib2xzLlwiLFxyXG4gICAgICAgIG1pblJvd0NvdW50RXJyb3I6IFwiUGxlYXNlIGZpbGwgYXQgbGVhc3QgezB9IHJvd3MuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwiUGxlYXNlIHNlbGVjdCBhdCBsZWFzdCB7MH0gdmFyaWFudHMuXCIsXHJcbiAgICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiUGxlYXNlIHNlbGVjdCBub3QgbW9yZSB0aGFuIHswfSB2YXJpYW50cy5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfSBhbmQgZXF1YWwgb3IgbGVzcyB0aGFuIHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIGxlc3MgdGhhbiB7MX1cIixcclxuICAgICAgICBpbnZhbGlkRW1haWw6IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgZS1tYWlsLlwiLFxyXG4gICAgICAgIHVybFJlcXVlc3RFcnJvcjogXCJUaGUgcmVxdWVzdCByZXR1cm4gZXJyb3IgJ3swfScuIHsxfVwiLFxyXG4gICAgICAgIHVybEdldENob2ljZXNFcnJvcjogXCJUaGUgcmVxdWVzdCByZXR1cm5zIGVtcHR5IGRhdGEgb3IgdGhlICdwYXRoJyBwcm9wZXJ0eSBpcyBpbmNvcnJlY3RcIixcclxuICAgICAgICBleGNlZWRNYXhTaXplOiBcIlRoZSBmaWxlIHNpemUgc2hvdWxkIG5vdCBleGNlZWQgezB9LlwiLFxyXG4gICAgICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJQbGVhc2UgZW50ZXIgdGhlIG90aGVycyB2YWx1ZS5cIixcclxuICAgICAgICB1cGxvYWRpbmdGaWxlOiBcIllvdXIgZmlsZSBpcyB1cGxvYWRpbmcuIFBsZWFzZSB3YWl0IHNldmVyYWwgc2Vjb25kcyBhbmQgdHJ5IGFnYWluLlwiLFxyXG4gICAgICAgIGFkZFJvdzogXCJBZGQgUm93XCIsXHJcbiAgICAgICAgcmVtb3ZlUm93OiBcIlJlbW92ZVwiXHJcbiAgICB9XHJcbiAgICBzdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImVuXCJdID0gc3VydmV5U3RyaW5ncztcclxuXHJcbiAgICBpZiAoIVN0cmluZy5wcm90b3R5cGVbXCJmb3JtYXRcIl0pIHtcclxuICAgICAgICBTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICAgICAgPyBhcmdzW251bWJlcl1cclxuICAgICAgICAgICAgICAgICAgICA6IG1hdGNoXHJcbiAgICAgICAgICAgICAgICAgICAgO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBBbnN3ZXJSZXF1aXJlZEVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJyZXF1aXJlZEVycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBSZXF1cmVOdW1lcmljRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY0Vycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBFeGNlZWRTaXplRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgcHJpdmF0ZSBtYXhTaXplOiBudW1iZXI7XHJcbiAgICAgICAgY29uc3RydWN0b3IobWF4U2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMubWF4U2l6ZSA9IG1heFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiZXhjZWVkTWF4U2l6ZVwiKVtcImZvcm1hdFwiXSh0aGlzLmdldFRleHRTaXplKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFRleHRTaXplKCkge1xyXG4gICAgICAgICAgICB2YXIgc2l6ZXMgPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJ107XHJcbiAgICAgICAgICAgIHZhciBmaXhlZCA9IFswLCAwLCAyLCAzLCAzXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4U2l6ZSA9PSAwKSByZXR1cm4gJzAgQnl0ZSc7XHJcbiAgICAgICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLmxvZyh0aGlzLm1heFNpemUpIC8gTWF0aC5sb2coMTAyNCkpO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLm1heFNpemUgLyBNYXRoLnBvdygxMDI0LCBpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvRml4ZWQoZml4ZWRbaV0pICsgJyAnICsgc2l6ZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBDdXN0b21FcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQmFzZSBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJUXVlc3Rpb24sIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHF1ZXN0aW9uQ291bnRlciA9IDEwMDtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRRdWVzdGlvbklkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInNxX1wiICsgUXVlc3Rpb25CYXNlLnF1ZXN0aW9uQ291bnRlcisrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZGF0YTogSVN1cnZleURhdGE7XHJcbiAgICAgICAgcHJvdGVjdGVkIHN1cnZleTogSVN1cnZleTtcclxuICAgICAgICBwcml2YXRlIGNvbmRpdGlvblJ1bm5lcjogQ29uZGl0aW9uUnVubmVyID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgdmlzaWJsZUlmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHByaXZhdGUgaWRWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgc3RhcnRXaXRoTmV3TGluZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlSW5kZXhWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHVibGljIHdpZHRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyV2lkdGhWYWx1ZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwcml2YXRlIHJpZ2h0SW5kZW50VmFsdWU6IG51bWJlciA9IDA7XHJcbiAgICAgICAgcHVibGljIGluZGVudDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb2N1c0NhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHJvd1Zpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgdmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICB2aXNpYmxlSW5kZXhDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5pZFZhbHVlID0gUXVlc3Rpb25CYXNlLmdldFF1ZXN0aW9uSWQoKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmlzaWJsZVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2aXNpYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5xdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKDxJUXVlc3Rpb24+dGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy52aXNpYmxlSW5kZXhWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaWRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcmVuZGVyV2lkdGgoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucmVuZGVyV2lkdGhWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgcmVuZGVyV2lkdGgodmFsOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnJlbmRlcldpZHRoKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyV2lkdGhWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcmlnaHRJbmRlbnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMucmlnaHRJbmRlbnRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgcmlnaHRJbmRlbnQodmFsOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnJpZ2h0SW5kZW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucmlnaHRJbmRlbnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmb2N1cygpIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XHJcbiAgICAgICAgICAgIGlmICghZWwgfHwgIWVsLnNjcm9sbEludG9WaWV3KSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBlbGVtVG9wID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgICAgICBpZiAoZWxlbVRvcCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGVsLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmZvY3VzQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXlEYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleSA9IChuZXdWYWx1ZSAmJiBuZXdWYWx1ZVtcInF1ZXN0aW9uQWRkZWRcIl0pID8gPElTdXJ2ZXk+bmV3VmFsdWUgOiBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLm9uU2V0RGF0YSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZmlyZUNhbGxiYWNrKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU2V0RGF0YSgpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgcHVibGljIHJ1bkNvbmRpdGlvbih2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlSWYpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmRpdGlvblJ1bm5lcikgdGhpcy5jb25kaXRpb25SdW5uZXIgPSBuZXcgQ29uZGl0aW9uUnVubmVyKHRoaXMudmlzaWJsZUlmKTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb25SdW5uZXIuZXhwcmVzc2lvbiA9IHRoaXMudmlzaWJsZUlmO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSB0aGlzLmNvbmRpdGlvblJ1bm5lci5ydW4odmFsdWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAvL0lRdWVzdGlvblxyXG4gICAgICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgb25TdXJ2ZXlMb2FkKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVJbmRleFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudmlzaWJsZUluZGV4Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uYmFzZVwiLCBbXCIhbmFtZVwiLCB7IG5hbWU6IFwidmlzaWJsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJ2aXNpYmxlSWY6dGV4dFwiLCBcclxuICAgICAgICB7IG5hbWU6IFwid2lkdGhcIiB9LCB7IG5hbWU6IFwic3RhcnRXaXRoTmV3TGluZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWV9LCB7bmFtZTogXCJpbmRlbnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDAsIGNob2ljZXM6IFswLCAxLCAyLCAzXX1dKTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkZhY3Rvcnkge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSW5zdGFuY2U6IFF1ZXN0aW9uRmFjdG9yeSA9IG5ldyBRdWVzdGlvbkZhY3RvcnkoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIERlZmF1bHRDaG9pY2VzID0gW1wib25lXCIsIFwidHdvfHNlY29uZCB2YWx1ZVwiLCBcInRocmVlfHRoaXJkIHZhbHVlXCJdO1xyXG4gICAgICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2U+ID0ge307XHJcblxyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlclF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbkNyZWF0b3I6IChuYW1lOiBzdHJpbmcpID0+IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0b3JIYXNoW3F1ZXN0aW9uVHlwZV0gPSBxdWVzdGlvbkNyZWF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRBbGxUeXBlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIHRoaXMuY3JlYXRvckhhc2gpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICAgICAgdmFyIGNyZWF0b3IgPSB0aGlzLmNyZWF0b3JIYXNoW3F1ZXN0aW9uVHlwZV07XHJcbiAgICAgICAgICAgIGlmIChjcmVhdG9yID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRvcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJvd01vZGVsIHtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHBhZ2U6IFBhZ2VNb2RlbCwgcHVibGljIHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uLnJvd1Zpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Sb3dWaXNpYmlsaXR5Q2hhbmdlZCgpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvbnM6IEFycmF5PFF1ZXN0aW9uQmFzZT4gPSBbXTtcclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdXBkYXRlVmlzaWJsZSgpIHtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jYWxjVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFdpZHRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaChxKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZpc2libGVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKSB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFdpZHRoKCkge1xyXG4gICAgICAgICAgICB2YXIgdmlzQ291bnQgPSB0aGlzLmdldFZpc2libGVDb3VudCgpO1xyXG4gICAgICAgICAgICBpZiAodmlzQ291bnQgPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1F1ZXN0aW9uVmlzaWJsZSh0aGlzLnF1ZXN0aW9uc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1tpXS5yZW5kZXJXaWR0aCA9IHRoaXMucXVlc3Rpb24ud2lkdGggPyB0aGlzLnF1ZXN0aW9uLndpZHRoIDogTWF0aC5mbG9vcigxMDAgLyB2aXNDb3VudCkgKyAnJSc7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0ucmlnaHRJbmRlbnQgPSBjb3VudGVyIDwgdmlzQ291bnQgLSAxID8gMSA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uUm93VmlzaWJpbGl0eUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZS5vblJvd1Zpc2liaWxpdHlDaGFuZ2VkKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFZpc2libGVDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNRdWVzdGlvblZpc2libGUodGhpcy5xdWVzdGlvbnNbaV0pKSByZXMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzUXVlc3Rpb25WaXNpYmxlKHE6IFF1ZXN0aW9uQmFzZSk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wYWdlLmlzUXVlc3Rpb25WaXNpYmxlKHEpOyB9IFxyXG4gICAgICAgIHByaXZhdGUgY2FsY1Zpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldFZpc2libGVDb3VudCgpID4gMDsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlTW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVBhZ2UsIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgICAgIHByaXZhdGUgcm93VmFsdWVzOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25kaXRpb25SdW5uZXI6IENvbmRpdGlvblJ1bm5lciA9IG51bGw7XHJcbiAgICAgICAgcXVlc3Rpb25zOiBBcnJheTxRdWVzdGlvbkJhc2U+ID0gbmV3IEFycmF5PFF1ZXN0aW9uQmFzZT4oKTtcclxuICAgICAgICBwdWJsaWMgZGF0YTogSVN1cnZleSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHZpc2libGVJZjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyB2aXNpYmxlSW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgICAgIHByaXZhdGUgbnVtVmFsdWU6IG51bWJlciA9IC0xO1xyXG4gICAgICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJcIikge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnNldERhdGEoc2VsZi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByb3dzKCk6IEFycmF5PFF1ZXN0aW9uUm93TW9kZWw+IHtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXMgPSB0aGlzLmJ1aWxkUm93cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNBY3RpdmUoKSB7IHJldHVybiAoIXRoaXMuZGF0YSkgfHwgdGhpcy5kYXRhLmN1cnJlbnRQYWdlID09IHRoaXM7IH1cclxuICAgICAgICBwdWJsaWMgaXNRdWVzdGlvblZpc2libGUocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IGJvb2xlYW4geyByZXR1cm4gcXVlc3Rpb24udmlzaWJsZSB8fCB0aGlzLmlzRGVzaWduTW9kZTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVSb3cocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IFF1ZXN0aW9uUm93TW9kZWwgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUm93TW9kZWwodGhpcywgcXVlc3Rpb24pOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXQgaXNEZXNpZ25Nb2RlKCkgeyByZXR1cm4gdGhpcy5kYXRhICYmIHRoaXMuZGF0YS5pc0Rlc2lnbk1vZGU7IH1cclxuICAgICAgICBwcml2YXRlIGJ1aWxkUm93cygpOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4oKTtcclxuICAgICAgICAgICAgdmFyIGxhc3RSb3dWaXNpYmxlSW5kZXggPSAtMTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcSA9IHRoaXMucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVSb3cocSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHEuc3RhcnRXaXRoTmV3TGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RSb3dWaXNpYmxlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtpXS5hZGRRdWVzdGlvbihxKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RSb3dWaXNpYmxlSW5kZXggPCAwKSBsYXN0Um93VmlzaWJsZUluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbbGFzdFJvd1Zpc2libGVJbmRleF0uYWRkUXVlc3Rpb24ocSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtpXS5zZXRXaWR0aCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9uUm93VmlzaWJpbGl0eUNoYW5nZWQocm93OiBRdWVzdGlvblJvd01vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCAhdGhpcy5yb3dWYWx1ZXMpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5yb3dWYWx1ZXMuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gaW5kZXg7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yb3dWYWx1ZXNbaV0ucXVlc3Rpb25zLmluZGV4T2Yocm93LnF1ZXN0aW9uKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXNbaV0udXBkYXRlVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkVGl0bGUoKSB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5wcm9jZXNzVGV4dCh0aGlzLnRpdGxlKSA6IHRoaXMudGl0bGU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG51bSgpIHsgcmV0dXJuIHRoaXMubnVtVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG51bSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm51bVZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMubnVtVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5vbk51bUNoYW5nZWQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYWdlVmlzaWJpbGl0eUNoYW5nZWQodGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJwYWdlXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb25CYXNlLCBpbmRleDogbnVtYmVyID0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnF1ZXN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAwLCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5zZXREYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucXVlc3Rpb25BZGRlZChxdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGROZXdRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlc3Rpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucXVlc3Rpb25zLmluZGV4T2YocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkgdGhpcy5kYXRhLnF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzY3JvbGxUb0ZpcnN0UXVlc3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUsIGZvY3VzZU9uRmlyc3RFcnJvcjogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGZpcnN0RXJyb3JRdWVzdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlICYmIHRoaXMucXVlc3Rpb25zW2ldLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvY3VzZU9uRmlyc3RFcnJvciAmJiBmaXJzdEVycm9yUXVlc3Rpb24gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yUXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmlyc3RFcnJvclF1ZXN0aW9uKSBmaXJzdEVycm9yUXVlc3Rpb24uZm9jdXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFF1ZXN0aW9uc1RvTGlzdChsaXN0OiBBcnJheTxJUXVlc3Rpb24+LCB2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICh2aXNpYmxlT25seSAmJiAhdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICF0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLnF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJ1bkNvbmRpdGlvbih2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlSWYpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmRpdGlvblJ1bm5lcikgdGhpcy5jb25kaXRpb25SdW5uZXIgPSBuZXcgQ29uZGl0aW9uUnVubmVyKHRoaXMudmlzaWJsZUlmKTtcclxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb25SdW5uZXIuZXhwcmVzc2lvbiA9IHRoaXMudmlzaWJsZUlmO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSB0aGlzLmNvbmRpdGlvblJ1bm5lci5ydW4odmFsdWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uTnVtQ2hhbmdlZCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInBhZ2VcIiwgW1wibmFtZVwiLCB7IG5hbWU6IFwicXVlc3Rpb25zXCIsIGJhc2VDbGFzc05hbWU6IFwicXVlc3Rpb25cIiB9LCB7IG5hbWU6IFwidmlzaWJsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJ2aXNpYmxlSWZcIiwgXCJ0aXRsZVwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFBhZ2VNb2RlbCgpOyB9KTtcclxuIH0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXJyb3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBhbnksIHB1YmxpYyBlcnJvcjogU3VydmV5RXJyb3IgPSBudWxsKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmFsaWRhdG9yIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRFcnJvclRleHQobmFtZTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHQpIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRFcnJvclRleHQobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+O1xyXG4gICAgICAgIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJ1bm5lciB7XHJcbiAgICAgICAgcHVibGljIHJ1bihvd25lcjogSVZhbGlkYXRvck93bmVyKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG93bmVyLnZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3JSZXN1bHQgPSBvd25lci52YWxpZGF0b3JzW2ldLnZhbGlkYXRlKG93bmVyLnZhbHVlLCBvd25lci5nZXRWYWxpZGF0b3JUaXRsZSgpKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQuZXJyb3IpIHJldHVybiB2YWxpZGF0b3JSZXN1bHQuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lci52YWx1ZSA9IHZhbGlkYXRvclJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBOdW1lcmljVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluVmFsdWU6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1lcmljdmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgIXRoaXMuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgUmVxdXJlTnVtZXJpY0Vycm9yKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgVmFsaWRhdG9yUmVzdWx0KHBhcnNlRmxvYXQodmFsdWUpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5taW5WYWx1ZSA+IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4VmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSA8IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSA/IG51bGwgOiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgdk5hbWUgPSBuYW1lID8gbmFtZSA6IFwidmFsdWVcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljTWluTWF4XCIpW1wiZm9ybWF0XCJdKHZOYW1lLCB0aGlzLm1pblZhbHVlLCB0aGlzLm1heFZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljTWluXCIpW1wiZm9ybWF0XCJdKHZOYW1lLCB0aGlzLm1pblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNYXhcIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWF4VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNOdW1iZXIodmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSkgJiYgaXNGaW5pdGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pbkxlbmd0aDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0ZXh0dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbkxlbmd0aCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInRleHRNaW5MZW5ndGhcIilbXCJmb3JtYXRcIl0odGhpcy5taW5MZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQW5zd2VyQ291bnRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5Db3VudDogbnVtYmVyID0gbnVsbCwgcHVibGljIG1heENvdW50OiBudW1iZXIgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImFuc3dlcmNvdW50dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlLmNvbnN0cnVjdG9yICE9IEFycmF5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGNvdW50ID0gdmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5Db3VudCAmJiBjb3VudCA8IHRoaXMubWluQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWluU2VsZWN0RXJyb3JcIilbXCJmb3JtYXRcIl0odGhpcy5taW5Db3VudCkpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4Q291bnQgJiYgY291bnQgPiB0aGlzLm1heENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQoc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1heFNlbGVjdEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWF4Q291bnQpKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBSZWdleFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHJlZ2V4OiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInJlZ2V4dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZWdleCB8fCAhdmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKHRoaXMucmVnZXgpO1xyXG4gICAgICAgICAgICBpZiAocmUudGVzdCh2YWx1ZSkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdCh2YWx1ZSwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEVtYWlsVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBwcml2YXRlIHJlID0gL14oKFtePD4oKVxcW1xcXVxcLiw7Olxcc0BcXFwiXSsoXFwuW148PigpXFxbXFxdXFwuLDs6XFxzQFxcXCJdKykqKXwoXFxcIi4rXFxcIikpQCgoW148PigpW1xcXVxcLiw7Olxcc0BcXFwiXStcXC4pK1tePD4oKVtcXF1cXC4sOzpcXHNAXFxcIl17Mix9KSQvaTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiZW1haWx2YWxpZGF0b3JcIjsgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlLnRlc3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQodmFsdWUsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiaW52YWxpZEVtYWlsXCIpO1xyXG4gICAgICAgIH1cclxuICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgW1widGV4dFwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibnVtZXJpY3ZhbGlkYXRvclwiLCBbXCJtaW5WYWx1ZTpudW1iZXJcIiwgXCJtYXhWYWx1ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBOdW1lcmljVmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHR2YWxpZGF0b3JcIiwgW1wibWluTGVuZ3RoOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFRleHRWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIiwgW1wibWluQ291bnQ6bnVtYmVyXCIsIFwibWF4Q291bnQ6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQW5zd2VyQ291bnRWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmVnZXh2YWxpZGF0b3JcIiwgW1wicmVnZXhcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBSZWdleFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJlbWFpbHZhbGlkYXRvclwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEVtYWlsVmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gXHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBjbGFzcyBUZXh0UHJlUHJvY2Vzc29ySXRlbSB7XHJcbiAgICAgICAgcHVibGljIHN0YXJ0OiBudW1iZXI7XHJcbiAgICAgICAgcHVibGljIGVuZDogbnVtYmVyO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRQcmVQcm9jZXNzb3Ige1xyXG4gICAgICAgIHB1YmxpYyBvblByb2Nlc3M6IChuYW1lOiBzdHJpbmcpID0+IGFueTtcclxuICAgICAgICBwdWJsaWMgb25IYXNWYWx1ZTogKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbjtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBwcm9jZXNzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghdGV4dCkgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vblByb2Nlc3MpIHJldHVybiB0ZXh0O1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmdldEl0ZW1zKHRleHQpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0TmFtZSh0ZXh0LnN1YnN0cmluZyhpdGVtLnN0YXJ0ICsgMSwgaXRlbS5lbmQpKTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYW5Qcm9jZXNzTmFtZShuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbkhhc1ZhbHVlICYmICF0aGlzLm9uSGFzVmFsdWUobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5vblByb2Nlc3MobmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKDAsIGl0ZW0uc3RhcnQpICsgdmFsdWUgKyB0ZXh0LnN1YnN0cihpdGVtLmVuZCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEl0ZW1zKHRleHQ6IHN0cmluZyk6IEFycmF5PFRleHRQcmVQcm9jZXNzb3JJdGVtPiB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBzdGFydCA9IC0xO1xyXG4gICAgICAgICAgICB2YXIgY2ggPSAnJztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY2ggPSB0ZXh0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoID09ICd7Jykgc3RhcnQgPSBpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoID09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IFRleHRQcmVQcm9jZXNzb3JJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhcnQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXROYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2FuUHJvY2Vzc05hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaCA9IG5hbWVbaV07XHJcbiAgICAgICAgICAgICAgICAvL1RPRE9cclxuICAgICAgICAgICAgICAgIGlmIChjaCA9PSAnICcgfHwgY2ggPT0gJy0nIHx8IGNoID09ICcmJykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImVycm9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInZhbGlkYXRvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZXh0UHJlUHJvY2Vzc29yLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb24gZXh0ZW5kcyBRdWVzdGlvbkJhc2UgaW1wbGVtZW50cyBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHF1ZXN0aW9uVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIHF1ZXN0aW9uQ29tbWVudDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgaXNSZXF1aXJlZFZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBoYXNDb21tZW50VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc090aGVyVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGNvbW1lbnRUZXh0VmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0UHJlUHJvY2Vzc29yOiBUZXh0UHJlUHJvY2Vzc29yO1xyXG4gICAgICAgIGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+ID0gW107XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcbiAgICAgICAgdmFsdWVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgY29tbWVudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBlcnJvcnNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgdGl0bGVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVGl0bGUoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gKHRoaXMudGl0bGVWYWx1ZSkgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLm5hbWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy50aXRsZVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudGl0bGVDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5zdXJ2ZXkgIT0gbnVsbCA/IHRoaXMuc3VydmV5LnByb2Nlc3NUZXh0KHRoaXMudGl0bGUpIDogdGhpcy50aXRsZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgZnVsbFRpdGxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSAmJiB0aGlzLnN1cnZleS5xdWVzdGlvblRpdGxlVGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy50ZXh0UHJlUHJvY2Vzc29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3NvciA9IG5ldyBUZXh0UHJlUHJvY2Vzc29yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uSGFzVmFsdWUgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmNhblByb2Nlc3NlZFRleHRWYWx1ZXMobmFtZS50b0xvd2VyQ2FzZSgpKTsgfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25Qcm9jZXNzID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5nZXRQcm9jZXNzZWRUZXh0VmFsdWUobmFtZSk7IH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0UHJlUHJvY2Vzc29yLnByb2Nlc3ModGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZVRlbXBsYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcmVxdWlyZVRleHQgPSB0aGlzLnJlcXVpcmVkVGV4dDtcclxuICAgICAgICAgICAgaWYgKHJlcXVpcmVUZXh0KSByZXF1aXJlVGV4dCArPSBcIiBcIjtcclxuICAgICAgICAgICAgdmFyIG5vID0gdGhpcy5ubztcclxuICAgICAgICAgICAgaWYgKG5vKSBubyArPSBcIi4gXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBubyArIHJlcXVpcmVUZXh0ICsgdGhpcy5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNhblByb2Nlc3NlZFRleHRWYWx1ZXMobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lID09IFwibm9cIiB8fCBuYW1lID09IFwidGl0bGVcIiB8fCBuYW1lID09IFwicmVxdWlyZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwibm9cIikgcmV0dXJuIHRoaXMubm87XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwidGl0bGVcIikgcmV0dXJuIHRoaXMucHJvY2Vzc2VkVGl0bGU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwicmVxdWlyZVwiKSByZXR1cm4gdGhpcy5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNSZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBpc1JlcXVpcmVkKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1JlcXVpcmVkID09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUmVxdWlyZWRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy50aXRsZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzQ29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzQ29tbWVudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBoYXNDb21tZW50KHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydENvbW1lbnQoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NvbW1lbnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29tbWVudCkgdGhpcy5oYXNPdGhlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbW1lbnRUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbW1lbnRUZXh0VmFsdWUgPyB0aGlzLmNvbW1lbnRUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29tbWVudFRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRUZXh0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzT3RoZXJWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgaGFzT3RoZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0T3RoZXIoKSB8fCB0aGlzLmhhc090aGVyID09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc090aGVyVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB0aGlzLmhhc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5oYXNPdGhlckNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGhhc090aGVyQ2hhbmdlZCgpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgbm8oKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZUluZGV4IDwgMCkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBzdGFydEluZGV4ID0gMTtcclxuICAgICAgICAgICAgdmFyIGlzTnVtZXJpYyA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5zdXJ2ZXkucXVlc3Rpb25TdGFydEluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgPSB0aGlzLnN1cnZleS5xdWVzdGlvblN0YXJ0SW5kZXg7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoc3RyKSkgc3RhcnRJbmRleCA9IHBhcnNlSW50KHN0cik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzdHIubGVuZ3RoID09IDEpIGlzTnVtZXJpYyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc051bWVyaWMpIHJldHVybiAodGhpcy52aXNpYmxlSW5kZXggKyBzdGFydEluZGV4KS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdHIuY2hhckNvZGVBdCgwKSArIHRoaXMudmlzaWJsZUluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU2V0RGF0YSgpIHtcclxuICAgICAgICAgICAgc3VwZXIub25TZXREYXRhKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVGcm9tRGF0YSh0aGlzLmdldFZhbHVlQ29yZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZhbHVlQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb21tZW50KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldENvbW1lbnQoKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29tbWVudChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbW1lbnQgPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb21tZW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldENvbW1lbnQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLmdldENvbW1lbnQodGhpcy5uYW1lKSA6IHRoaXMucXVlc3Rpb25Db21tZW50OyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldENvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmFsdWUgPT0gbnVsbDsgfVxyXG4gICAgICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yRXJyb3JzKGZpcmVDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJlcXVpcmVkVGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdXJ2ZXkgIT0gbnVsbCAmJiB0aGlzLmlzUmVxdWlyZWQgPyB0aGlzLnN1cnZleS5yZXF1aXJlZFRleHQgOiBcIlwiOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZvckVycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yTGVuZ3RoID0gdGhpcy5lcnJvcnMgPyB0aGlzLmVycm9ycy5sZW5ndGggOiAwO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hlY2tGb3JFcnJvcnModGhpcy5lcnJvcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDAgJiYgdGhpcy52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5lcnJvcnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuc3VydmV5LnZhbGlkYXRlUXVlc3Rpb24odGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaXJlQ2FsbGJhY2sgJiYgKGVycm9yTGVuZ3RoICE9IHRoaXMuZXJyb3JzLmxlbmd0aCB8fCBlcnJvckxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmVycm9yc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzUmVxdWlyZWRFcnJvcigpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBBbnN3ZXJSZXF1aXJlZEVycm9yKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBoYXNSZXF1aXJlZEVycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc1JlcXVpcmVkICYmIHRoaXMuaXNFbXB0eSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgcnVuVmFsaWRhdG9ycygpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgc2V0TmV3VmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlSW5EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0TmV3VmFsdWVJbkRhdGEobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlVG9EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVDb3JlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFZhbHVlQ29yZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLmdldFZhbHVlKHRoaXMubmFtZSkgOiB0aGlzLnF1ZXN0aW9uVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0VmFsdWVDb3JlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0VmFsdWUodGhpcy5uYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVGcm9tRGF0YSh2YWw6IGFueSk6IGFueSB7IHJldHVybiB2YWw7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGEodmFsOiBhbnkpOiBhbnkgeyByZXR1cm4gdmFsOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldE5ld0NvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRDb21tZW50KHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgdGhpcy5xdWVzdGlvbkNvbW1lbnQgPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JUXVlc3Rpb25cclxuICAgICAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlRnJvbURhdGEobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JVmFsaWRhdG9yT3duZXJcclxuICAgICAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gbnVsbDsgfVxyXG4gICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicXVlc3Rpb25cIiwgW3sgbmFtZTogXCJ0aXRsZTp0ZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY29tbWVudFRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tbWVudFRleHRWYWx1ZTsgfSB9LFxyXG4gICAgICAgIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIHsgbmFtZTogXCJ2YWxpZGF0b3JzOnZhbGlkYXRvcnNcIiwgYmFzZUNsYXNzTmFtZTogXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgY2xhc3NOYW1lUGFydDogXCJ2YWxpZGF0b3JcIn1dLCBudWxsLCBcInF1ZXN0aW9uYmFzZVwiKTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cnZleXN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblNlbGVjdEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb21tZW50VmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcm90ZWN0ZWQgY2FjaGVkVmFsdWU6IGFueTtcclxuICAgICAgICBvdGhlckl0ZW06IEl0ZW1WYWx1ZSA9IG5ldyBJdGVtVmFsdWUoXCJvdGhlclwiLCBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKSk7XHJcbiAgICAgICAgcHJpdmF0ZSBjaG9pY2VzRnJvbVVybDogQXJyYXk8SXRlbVZhbHVlPiA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBjaG9pY2VzVmFsdWVzOiBBcnJheTxJdGVtVmFsdWU+ID0gbmV3IEFycmF5PEl0ZW1WYWx1ZT4oKTtcclxuICAgICAgICBwdWJsaWMgY2hvaWNlc0J5VXJsOiBDaG9pY2VzUmVzdGZ1bGw7XHJcbiAgICAgICAgcHVibGljIG90aGVyRXJyb3JUZXh0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBzdG9yZU90aGVyc0FzQ29tbWVudDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgY2hvaWNlc09yZGVyVmFsdWU6IHN0cmluZyA9IFwibm9uZVwiO1xyXG4gICAgICAgIGNob2ljZXNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXNCeVVybCA9IHRoaXMuY3JlYXRlUmVzdGZ1bGwoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXNCeVVybC5nZXRSZXN1bHRDYWxsYmFjayA9IGZ1bmN0aW9uIChpdGVtczogQXJyYXk8SXRlbVZhbHVlPikgeyBzZWxmLm9uTG9hZENob2ljZXNGcm9tVXJsKGl0ZW1zKSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSA/IHRoaXMuZ2V0SGFzT3RoZXIodGhpcy52YWx1ZSkgOiB0aGlzLmdldEhhc090aGVyKHRoaXMuY2FjaGVkVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0SGFzT3RoZXIodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVJlc3RmdWxsKCk6IENob2ljZXNSZXN0ZnVsbCB7IHJldHVybiBuZXcgQ2hvaWNlc1Jlc3RmdWxsKCk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0Q29tbWVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpKSByZXR1cm4gc3VwZXIuZ2V0Q29tbWVudCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21tZW50VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNTZXR0aW5nQ29tbWVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSlcclxuICAgICAgICAgICAgICAgIHN1cGVyLnNldENvbW1lbnQobmV3VmFsdWUpXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2V0dGluZ0NvbW1lbnQgJiYgbmV3VmFsdWUgIT0gdGhpcy5jb21tZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2V0dGluZ0NvbW1lbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudFZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPdGhlclNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWVJbkRhdGEodGhpcy5jYWNoZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTZXR0aW5nQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZUZyb21EYXRhKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLnZhbHVlRnJvbURhdGEodmFsKTtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZWRWYWx1ZSA9IHRoaXMudmFsdWVGcm9tRGF0YUNvcmUodmFsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkpIHJldHVybiBzdXBlci52YWx1ZVRvRGF0YSh2YWwpO1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlZFZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvRGF0YUNvcmUodmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1Vua25vd25WYWx1ZSh2YWwpKSByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnQgPSB2YWw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm90aGVySXRlbS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWUgJiYgdGhpcy5nZXRDb21tZW50KCkpIHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuZ2V0Q29tbWVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBoYXNVbmtub3duVmFsdWUodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5hY3RpdmVDaG9pY2VzO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbXNbaV0udmFsdWUgPT0gdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWVzOyB9XHJcbiAgICAgICAgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY2hvaWNlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBoYXNPdGhlckNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY2hvaWNlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjaG9pY2VzT3JkZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY2hvaWNlc09yZGVyVmFsdWU7IH1cclxuICAgICAgICBzZXQgY2hvaWNlc09yZGVyKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IHRoaXMuY2hvaWNlc09yZGVyVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgb3RoZXJUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm90aGVySXRlbS50ZXh0OyB9XHJcbiAgICAgICAgc2V0IG90aGVyVGV4dCh2YWx1ZTogc3RyaW5nKSB7IHRoaXMub3RoZXJJdGVtLnRleHQgPSB2YWx1ZTsgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlQ2hvaWNlcygpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc090aGVyICYmIHRoaXMuY2hvaWNlc09yZGVyID09IFwibm9uZVwiKSByZXR1cm4gdGhpcy5hY3RpdmVDaG9pY2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5zb3J0VmlzaWJsZUNob2ljZXModGhpcy5hY3RpdmVDaG9pY2VzLnNsaWNlKCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5vdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0IGFjdGl2ZUNob2ljZXMoKTogQXJyYXk8SXRlbVZhbHVlPiB7IHJldHVybiB0aGlzLmNob2ljZXNGcm9tVXJsID8gdGhpcy5jaG9pY2VzRnJvbVVybCA6IHRoaXMuY2hvaWNlczsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3RoZXJTZWxlY3RlZCB8fCB0aGlzLmNvbW1lbnQpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLm90aGVyRXJyb3JUZXh0O1xyXG4gICAgICAgICAgICBpZiAoIXRleHQpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgPSBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJSZXF1aXJlZEVycm9yXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKG5ldyBDdXN0b21FcnJvcih0ZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpIHsgcmV0dXJuIHRoaXMuc3RvcmVPdGhlcnNBc0NvbW1lbnQgJiYgKHRoaXMuc3VydmV5ICE9IG51bGwgPyB0aGlzLnN1cnZleS5zdG9yZU90aGVyc0FzQ29tbWVudCA6IHRydWUpOyB9XHJcbiAgICAgICAgb25TdXJ2ZXlMb2FkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzQnlVcmwpIHRoaXMuY2hvaWNlc0J5VXJsLnJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uTG9hZENob2ljZXNGcm9tVXJsKGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvckNvdW50ID0gdGhpcy5lcnJvcnMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzQnlVcmwgJiYgdGhpcy5jaG9pY2VzQnlVcmwuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2godGhpcy5jaG9pY2VzQnlVcmwuZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvckNvdW50ID4gMCB8fCB0aGlzLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmVycm9yc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG5ld0Nob2ljZXMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3Q2hvaWNlcyA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICAgICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YShuZXdDaG9pY2VzLCBhcnJheSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzRnJvbVVybCA9IG5ld0Nob2ljZXM7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY2hvaWNlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc29ydFZpc2libGVDaG9pY2VzKGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIHZhciBvcmRlciA9IHRoaXMuY2hvaWNlc09yZGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmIChvcmRlciA9PSBcImFzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIDEpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJkZXNjXCIpIHJldHVybiB0aGlzLnNvcnRBcnJheShhcnJheSwgLTEpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJyYW5kb21cIikgcmV0dXJuIHRoaXMucmFuZG9taXplQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc29ydEFycmF5KGFycmF5OiBBcnJheTxJdGVtVmFsdWU+LCBtdWx0OiBudW1iZXIpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhLnRleHQgPCBiLnRleHQpIHJldHVybiAtMSAqIG11bHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS50ZXh0ID4gYi50ZXh0KSByZXR1cm4gMSAqIG11bHQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmFuZG9taXplQXJyYXkoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICAgICAgICAgICAgICAgIGFycmF5W2pdID0gdGVtcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94QmFzZSBleHRlbmRzIFF1ZXN0aW9uU2VsZWN0QmFzZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgICAgIGNvbENvdW50Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sQ291bnRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNvbENvdW50VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNlbGVjdGJhc2VcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLFxyXG4gICAgICAgIHsgbmFtZTogXCJjaG9pY2VzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBJdGVtVmFsdWUuc2V0RGF0YShvYmouY2hvaWNlcywgdmFsdWUpOyB9fSxcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlc09yZGVyXCIsIGRlZmF1bHQ6IFwibm9uZVwiLCBjaG9pY2VzOiBbXCJub25lXCIsIFwiYXNjXCIsIFwiZGVzY1wiLCBcInJhbmRvbVwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjaG9pY2VzQnlVcmw6cmVzdGZ1bGxcIiwgY2xhc3NOYW1lOiBcIkNob2ljZXNSZXN0ZnVsbFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5jaG9pY2VzQnlVcmwuaXNFbXB0eSA/IG51bGwgOiBvYmouY2hvaWNlc0J5VXJsOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXNCeVVybC5zZXREYXRhKHZhbHVlKTsgfSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJvdGhlclRleHRcIiwgZGVmYXVsdDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVySXRlbVRleHRcIikgfSwgXCJvdGhlckVycm9yVGV4dFwiLFxyXG4gICAgICAgIHsgbmFtZTogXCJzdG9yZU90aGVyc0FzQ29tbWVudDpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWV9XSwgbnVsbCwgXCJxdWVzdGlvblwiKTtcclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hiYXNlXCIsIFt7IG5hbWU6IFwiY29sQ291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDEsIGNob2ljZXM6IFswLCAxLCAyLCAzLCA0XSB9XSwgbnVsbCwgXCJzZWxlY3RiYXNlXCIpO1xyXG59XHJcbiIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldEhhc090aGVyKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWwuaW5kZXhPZih0aGlzLm90aGVySXRlbS52YWx1ZSkgPj0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF2YWwgfHwgIXZhbC5sZW5ndGgpIHJldHVybiB2YWw7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbFtpXSA9PSB0aGlzLm90aGVySXRlbS52YWx1ZSkgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc1Vua25vd25WYWx1ZSh2YWxbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tZW50ID0gdmFsW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWwgPSB2YWwuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWxbaV0gPSB0aGlzLm90aGVySXRlbS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YUNvcmUodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIXZhbCB8fCAhdmFsLmxlbmd0aCkgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxbaV0gPT0gdGhpcy5vdGhlckl0ZW0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRDb21tZW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHZhbC5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWxbaV0gPSB0aGlzLmdldENvbW1lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2hlY2tib3hcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNoZWNrYm94TW9kZWwoXCJcIik7IH0sIFwiY2hlY2tib3hiYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjaGVja2JveFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkNoZWNrYm94TW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHVibGljIHJvd3M6IG51bWJlciA9IDQ7XHJcbiAgICAgICAgcHVibGljIGNvbHM6IG51bWJlciA9IDUwO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNvbW1lbnRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNvbW1lbnRcIiwgW3sgbmFtZTogXCJjb2xzOm51bWJlclwiLCBkZWZhdWx0OiA1MCB9LCB7IG5hbWU6IFwicm93czpudW1iZXJcIiwgZGVmYXVsdDogNCB9XSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjb21tZW50XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50TW9kZWwobmFtZSk7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX3NlbGVjdGJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgb3B0aW9uc0NhcHRpb25WYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3B0aW9uc0NhcHRpb24oKSB7IHJldHVybiAodGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlKSA/IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvcHRpb25zQ2FwdGlvblwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3B0aW9uc0NhcHRpb24obmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImRyb3Bkb3duXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImRyb3Bkb3duXCIsIFt7IG5hbWU6IFwib3B0aW9uc0NhcHRpb25cIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoub3B0aW9uc0NhcHRpb25WYWx1ZTsgfX1dLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwoXCJcIik7IH0sIFwic2VsZWN0YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25Ecm9wZG93bk1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkZpbGVNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBwcml2YXRlIHNob3dQcmV2aWV3VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGlzVXBsb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJldmlld1ZhbHVlTG9hZGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHVibGljIGltYWdlSGVpZ2h0OiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGltYWdlV2lkdGg6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgc3RvcmVEYXRhQXNUZXh0OiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBtYXhTaXplOiBudW1iZXI7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZmlsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNob3dQcmV2aWV3KCkgeyByZXR1cm4gdGhpcy5zaG93UHJldmlld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBzaG93UHJldmlldyh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLnNob3dQcmV2aWV3VmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBsb2FkRmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmICF0aGlzLnN1cnZleS51cGxvYWRGaWxlKHRoaXMubmFtZSwgZmlsZSwgdGhpcy5zdG9yZURhdGFBc1RleHQsIGZ1bmN0aW9uIChzdGF0dXM6IHN0cmluZykgeyBzZWxmLmlzVXBsb2FkaW5nID0gc3RhdHVzID09IFwidXBsb2FkaW5nXCI7ICB9KSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNldEZpbGVWYWx1ZShmaWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHByZXZpZXdWYWx1ZTogYW55O1xyXG4gICAgICAgIHByb3RlY3RlZCBzZXRGaWxlVmFsdWUoZmlsZTogRmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoIUZpbGVSZWFkZXIpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNob3dQcmV2aWV3ICYmICF0aGlzLnN0b3JlRGF0YUFzVGV4dCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0ZpbGVGb3JFcnJvcnMoZmlsZSkpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnNob3dQcmV2aWV3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmV2aWV3VmFsdWUgPSBzZWxmLmlzRmlsZUltYWdlKGZpbGUpID8gZmlsZVJlYWRlci5yZXN1bHQgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZmlyZUNhbGxiYWNrKHNlbGYucHJldmlld1ZhbHVlTG9hZGVkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuc3RvcmVEYXRhQXNUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi52YWx1ZSA9IGZpbGVSZWFkZXIucmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1VwbG9hZGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInVwbG9hZGluZ0ZpbGVcIikpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrRmlsZUZvckVycm9ycyhmaWxlOiBGaWxlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvckxlbmd0aCA9IHRoaXMuZXJyb3JzID8gdGhpcy5lcnJvcnMubGVuZ3RoIDogMDtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4U2l6ZSA+IDAgJiYgZmlsZS5zaXplID4gdGhpcy5tYXhTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBFeGNlZWRTaXplRXJyb3IodGhpcy5tYXhTaXplKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yTGVuZ3RoICE9IHRoaXMuZXJyb3JzLmxlbmd0aCB8fCB0aGlzLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmVycm9yc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNGaWxlSW1hZ2UoZmlsZTogRmlsZSkge1xyXG4gICAgICAgICAgICBpZiAoIWZpbGUgfHwgIWZpbGUudHlwZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gZmlsZS50eXBlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHIuaW5kZXhPZihcImltYWdlXCIpID09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImZpbGVcIiwgW1wic2hvd1ByZXZpZXc6Ym9vbGVhblwiLCBcImltYWdlSGVpZ2h0XCIsIFwiaW1hZ2VXaWR0aFwiLCBcInN0b3JlRGF0YUFzVGV4dDpib29sZWFuXCIsIFwibWF4U2l6ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkZpbGVNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZmlsZVwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uRmlsZU1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkh0bWxNb2RlbCBleHRlbmRzIFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBodG1sVmFsdWU6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJodG1sXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaHRtbCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5odG1sVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGh0bWwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmh0bWxWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZEh0bWwoKSB7IHJldHVybiB0aGlzLnN1cnZleSA/IHRoaXMuc3VydmV5LnByb2Nlc3NIdG1sKHRoaXMuaHRtbCkgOiB0aGlzLmh0bWw7IH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJodG1sXCIsIFtcImh0bWw6aHRtbFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uYmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiaHRtbFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTWF0cml4RGF0YSB7XHJcbiAgICAgICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93TW9kZWwpO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeFJvd01vZGVsIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBkYXRhOiBJTWF0cml4RGF0YTtcclxuICAgICAgICBwcm90ZWN0ZWQgcm93VmFsdWU6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgcHVibGljIGZ1bGxOYW1lOiBzdHJpbmcsIGRhdGE6IElNYXRyaXhEYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpIHsgcmV0dXJuIHRoaXMucm93VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB0aGlzLmRhdGEub25NYXRyaXhSb3dDaGFuZ2VkKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU1hdHJpeERhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY29sdW1uc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgcm93c1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgZ2VuZXJhdGVkVmlzaWJsZVJvd3M6IEFycmF5PE1hdHJpeFJvd01vZGVsPjtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtYXRyaXhcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNSb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dzVmFsdWUubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGNvbHVtbnMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNvbHVtbnNWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBjb2x1bW5zKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY29sdW1uc1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCByb3dzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5yb3dzVmFsdWU7IH1cclxuICAgICAgICBzZXQgcm93cyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJvd3NWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhSb3dNb2RlbD4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PE1hdHJpeFJvd01vZGVsPigpO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3NbaV0udmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5yb3dzW2ldLnZhbHVlLCB0aGlzLnJvd3NbaV0udGV4dCwgdGhpcy5uYW1lICsgJ18nICsgdGhpcy5yb3dzW2ldLnZhbHVlLnRvU3RyaW5nKCksIHZhbFt0aGlzLnJvd3NbaV0udmFsdWVdKSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KG51bGwsIFwiXCIsIHRoaXMubmFtZSwgdmFsKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyA9IHJlc3VsdDtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgZnVsbE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhSb3dNb2RlbChuYW1lLCB0ZXh0LCBmdWxsTmFtZSwgdGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUm93Q2hhbmdpbmcgfHwgISh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB8fCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJvd3MubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbMF0udmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcm93VmFsID0gdmFsW3Jvdy5uYW1lXSA/IHZhbFtyb3cubmFtZV0gOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV0udmFsdWUgPSByb3dWYWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSU1hdHJpeERhdGFcclxuICAgICAgICBvbk1hdHJpeFJvd0NoYW5nZWQocm93OiBNYXRyaXhSb3dNb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNSb3dzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKHJvdy52YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZVtyb3cubmFtZV0gPSByb3cudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhcIiwgW3sgbmFtZTogXCJjb2x1bW5zOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY29sdW1ucyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmouY29sdW1ucyA9IHZhbHVlOyB9fSxcclxuICAgICAgICB7IG5hbWU6IFwicm93czppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLnJvd3MgPSB2YWx1ZTsgfSB9XSxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4TW9kZWwobmFtZSk7IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuY29sdW1ucyA9IFtcIkNvbHVtbiAxXCIsIFwiQ29sdW1uIDJcIiwgXCJDb2x1bW4gM1wiXTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fYmFzZXNlbGVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJhZGlvZ3JvdXBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0cnVlOyB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmFkaW9ncm91cFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsKFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTt9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uVGV4dE1vZGVsIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHB1YmxpYyBzaXplOiBudW1iZXIgPSAyNTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0ZXh0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7ICByZXR1cm4gc3VwZXIuaXNFbXB0eSgpIHx8IHRoaXMudmFsdWUgPT0gXCJcIjsgfVxyXG4gICAgICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHRcIiwgW3sgbmFtZTogXCJzaXplOm51bWJlclwiLCBkZWZhdWx0OiAyNSB9XSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJ0ZXh0XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0TW9kZWwobmFtZSk7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9kcm9wZG93bi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9jaGVja2JveC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9yYWRpb2dyb3VwLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX3RleHQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fY29tbWVudC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgICAgIG9uUm93Q2hhbmdlZChjZWxsOiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgbmV3Um93VmFsdWU6IGFueSk7XHJcbiAgICAgICAgY29sdW1uczogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+O1xyXG4gICAgICAgIGNyZWF0ZVF1ZXN0aW9uKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbjtcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93bkNvbHVtbiBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBvcHRpb25zQ2FwdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBpc1JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGhhc090aGVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIG1pbldpZHRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBjZWxsVHlwZTogc3RyaW5nID0gXCJkZWZhdWx0XCI7XHJcbiAgICAgICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpIHsgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIiB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IC0xIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNvbENvdW50VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY2hvaWNlc1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duQ2VsbCB7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBRdWVzdGlvbjtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbiwgcHVibGljIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlID0gZGF0YS5jcmVhdGVRdWVzdGlvbih0aGlzLnJvdywgdGhpcy5jb2x1bW4pO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVmFsdWUuc2V0RGF0YShyb3cpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25WYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMucXVlc3Rpb24udmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSBpbXBsZW1lbnRzIElTdXJ2ZXlEYXRhIHtcclxuICAgICAgICBwcm90ZWN0ZWQgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YTtcclxuICAgICAgICBwcml2YXRlIHJvd1ZhbHVlczogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHJvd0NvbW1lbnRzOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgaXNTZXR0aW5nVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIGNlbGxzOiBBcnJheTxNYXRyaXhEcm9wZG93bkNlbGw+ID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkQ2VsbHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLnJvd1ZhbHVlczsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2V0dGluZ1ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXMgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93VmFsdWVzW2tleV0gPSB2YWx1ZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXS5xdWVzdGlvbi5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLmdldFZhbHVlKHRoaXMuY2VsbHNbaV0uY29sdW1uLm5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzU2V0dGluZ1ZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dWYWx1ZXNbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNTZXR0aW5nVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBcIlwiKSBuZXdWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvd1ZhbHVlc1tuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMucm93VmFsdWVzW25hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5vblJvd0NoYW5nZWQodGhpcywgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvd0NvbW1lbnRzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dDb21tZW50c1tuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYnVpbGRDZWxscygpIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbnMgPSB0aGlzLmRhdGEuY29sdW1ucztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29sdW1uID0gY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHMucHVzaCh0aGlzLmNyZWF0ZUNlbGwoY29sdW1uKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZUNlbGwoY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IE1hdHJpeERyb3Bkb3duQ2VsbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25DZWxsKGNvbHVtbiwgdGhpcywgdGhpcy5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZSBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU1hdHJpeERyb3Bkb3duRGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb2x1bW5zVmFsdWU6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPiA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgb3B0aW9uc0NhcHRpb25WYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHByb3RlY3RlZCBnZW5lcmF0ZWRWaXNpYmxlUm93czogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2U+O1xyXG4gICAgICAgIHByaXZhdGUgY2VsbFR5cGVWYWx1ZTogc3RyaW5nID0gXCJkcm9wZG93blwiO1xyXG4gICAgICAgIHByaXZhdGUgY29sdW1uQ29sQ291bnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgICAgICBwdWJsaWMgY29sdW1uTWluV2lkdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIGhvcml6b250YWxTY3JvbGw6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgY29sdW1uc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBwdWJsaWMgdXBkYXRlQ2VsbHNDYWxsYmFrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2x1bW5zKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPiB7IHJldHVybiB0aGlzLmNvbHVtbnNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29sdW1ucyh2YWx1ZTogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29sdW1uc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sdW1uc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY2VsbFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY2VsbFR5cGVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY2VsbFR5cGUobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jZWxsVHlwZSA9PSBuZXdWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxUeXBlVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy51cGRhdGVDZWxsc0NhbGxiYWspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbHVtbkNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbHVtbkNvbENvdW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbHVtbkNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW5Db2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudXBkYXRlQ2VsbHNDYWxsYmFrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENvbHVtblRpdGxlKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY29sdW1uLnRpdGxlO1xyXG4gICAgICAgICAgICBpZiAoY29sdW1uLmlzUmVxdWlyZWQgJiYgdGhpcy5zdXJ2ZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlVGV4dCA9IHRoaXMuc3VydmV5LnJlcXVpcmVkVGV4dDtcclxuICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlVGV4dCkgcmVxdWlyZVRleHQgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXF1aXJlVGV4dCArIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q29sdW1uV2lkdGgoY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW4ubWluV2lkdGggPyBjb2x1bW4ubWluV2lkdGggOiB0aGlzLmNvbHVtbk1pbldpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY2hvaWNlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCkgeyByZXR1cm4gKHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSkgPyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3B0aW9uc0NhcHRpb25cIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9wdGlvbnNDYXB0aW9uKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgYWRkQ29sdW1uKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpOiBNYXRyaXhEcm9wZG93bkNvbHVtbiB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSBuZXcgTWF0cml4RHJvcGRvd25Db2x1bW4obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbnNWYWx1ZS5wdXNoKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgPSB0aGlzLmdlbmVyYXRlUm93cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdlbmVyYXRlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT4geyByZXR1cm4gbnVsbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3cobmFtZTogYW55LCB0ZXh0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3VmFsdWUoY3VyVmFsdWU6IGFueSk6IGFueSB7IHJldHVybiAhY3VyVmFsdWUgPyB7fSA6IGN1clZhbHVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFJvd1ZhbHVlKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIHF1ZXN0aW9uVmFsdWU6IGFueSwgY3JlYXRlOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gcXVlc3Rpb25WYWx1ZVtyb3cucm93TmFtZV0gPyBxdWVzdGlvblZhbHVlW3Jvdy5yb3dOYW1lXSA6IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0ICYmIGNyZWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvblZhbHVlW3Jvdy5yb3dOYW1lXSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUm93Q2hhbmdpbmcgfHwgISh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB8fCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS52YWx1ZSA9IHRoaXMuZ2V0Um93VmFsdWUocm93LCB2YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIGVycm9zSW5Db2x1bW5zID0gdGhpcy5oYXNFcnJvckluQ29sdW1ucyhmaXJlQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaGFzRXJyb3JzKGZpcmVDYWxsYmFjaykgfHwgZXJyb3NJbkNvbHVtbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaGFzRXJyb3JJbkNvbHVtbnMoZmlyZUNhbGxiYWNrOiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCB0aGlzLmNvbHVtbnMubGVuZ3RoOyBjb2xJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLmNlbGxzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IGNlbGxzICYmIGNlbGxzW2NvbEluZGV4XSAmJiBjZWxsc1tjb2xJbmRleF0ucXVlc3Rpb24gJiYgY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spIHx8IHJlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lNYXRyaXhEcm9wZG93bkRhdGFcclxuICAgICAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb24ocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5jcmVhdGVRdWVzdGlvbkNvcmUocm93LCBjb2x1bW4pO1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5uYW1lID0gY29sdW1uLm5hbWU7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLmlzUmVxdWlyZWQgPSBjb2x1bW4uaXNSZXF1aXJlZDtcclxuICAgICAgICAgICAgcXVlc3Rpb24uaGFzT3RoZXIgPSBjb2x1bW4uaGFzT3RoZXI7XHJcbiAgICAgICAgICAgIGlmIChjb2x1bW4uaGFzT3RoZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbiBpbnN0YW5jZW9mIFF1ZXN0aW9uU2VsZWN0QmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICg8UXVlc3Rpb25TZWxlY3RCYXNlPnF1ZXN0aW9uKS5zdG9yZU90aGVyc0FzQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVzdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVF1ZXN0aW9uQ29yZShyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgY2VsbFR5cGUgPSBjb2x1bW4uY2VsbFR5cGUgPT0gXCJkZWZhdWx0XCIgPyB0aGlzLmNlbGxUeXBlIDogY29sdW1uLmNlbGxUeXBlO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0UXVlc3Rpb25OYW1lKHJvdywgY29sdW1uKTtcclxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09IFwiY2hlY2tib3hcIikgcmV0dXJuIHRoaXMuY3JlYXRlQ2hlY2tib3gobmFtZSwgY29sdW1uKTtcclxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09IFwicmFkaW9ncm91cFwiKSByZXR1cm4gdGhpcy5jcmVhdGVSYWRpb2dyb3VwKG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSBcInRleHRcIikgcmV0dXJuIHRoaXMuY3JlYXRlVGV4dChuYW1lLCBjb2x1bW4pO1xyXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT0gXCJjb21tZW50XCIpIHJldHVybiB0aGlzLmNyZWF0ZUNvbW1lbnQobmFtZSwgY29sdW1uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRHJvcGRvd24obmFtZSwgY29sdW1uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFF1ZXN0aW9uTmFtZShyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHsgcmV0dXJuIHJvdy5yb3dOYW1lICsgXCJfXCIgKyBjb2x1bW4ubmFtZTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRDb2x1bW5DaG9pY2VzKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi5jaG9pY2VzICYmIGNvbHVtbi5jaG9pY2VzLmxlbmd0aCA+IDAgPyBjb2x1bW4uY2hvaWNlcyA6IHRoaXMuY2hvaWNlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldENvbHVtbk9wdGlvbnNDYXB0aW9uKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uLm9wdGlvbnNDYXB0aW9uID8gY29sdW1uLm9wdGlvbnNDYXB0aW9uIDogdGhpcy5vcHRpb25zQ2FwdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZURyb3Bkb3duKG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbCB7XHJcbiAgICAgICAgICAgIHZhciBxID0gPFF1ZXN0aW9uRHJvcGRvd25Nb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcImRyb3Bkb3duXCIsIG5hbWUpO1xyXG4gICAgICAgICAgICBxLmNob2ljZXMgPSB0aGlzLmdldENvbHVtbkNob2ljZXMoY29sdW1uKTtcclxuICAgICAgICAgICAgcS5vcHRpb25zQ2FwdGlvbiA9IHRoaXMuZ2V0Q29sdW1uT3B0aW9uc0NhcHRpb24oY29sdW1uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDaGVja2JveChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkNoZWNrYm94TW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgcSA9IDxRdWVzdGlvbkNoZWNrYm94TW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJjaGVja2JveFwiLCBuYW1lKTtcclxuICAgICAgICAgICAgcS5jaG9pY2VzID0gdGhpcy5nZXRDb2x1bW5DaG9pY2VzKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHEuY29sQ291bnQgPSBjb2x1bW4uY29sQ291bnQgPiAtIDEgPyBjb2x1bW4uY29sQ291bnQgOiB0aGlzLmNvbHVtbkNvbENvdW50O1xyXG4gICAgICAgICAgICByZXR1cm4gcTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVJhZGlvZ3JvdXAobmFtZTogc3RyaW5nLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgcSA9IDxRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgbmFtZSk7XHJcbiAgICAgICAgICAgIHEuY2hvaWNlcyA9IHRoaXMuZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW4pO1xyXG4gICAgICAgICAgICBxLmNvbENvdW50ID0gY29sdW1uLmNvbENvdW50ID4gLSAxID8gY29sdW1uLmNvbENvdW50IDogdGhpcy5jb2x1bW5Db2xDb3VudDtcclxuICAgICAgICAgICAgcmV0dXJuIHE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0KG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uVGV4dE1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxRdWVzdGlvblRleHRNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcInRleHRcIiwgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDb21tZW50KG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uQ29tbWVudE1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxRdWVzdGlvbkNvbW1lbnRNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcImNvbW1lbnRcIiwgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uIHtcclxuICAgICAgICAgICAgcmV0dXJuIDxRdWVzdGlvbj5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGRlbGV0ZVJvd1ZhbHVlKG5ld1ZhbHVlOiBhbnksIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UpOiBhbnkge1xyXG4gICAgICAgICAgICBkZWxldGUgbmV3VmFsdWVbcm93LnJvd05hbWVdO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMobmV3VmFsdWUpLmxlbmd0aCA9PSAwID8gbnVsbCA6IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvblJvd0NoYW5nZWQocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgbmV3Um93VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgcm93VmFsdWUgPSB0aGlzLmdldFJvd1ZhbHVlKHJvdywgbmV3VmFsdWUsIHRydWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcm93VmFsdWUpIGRlbGV0ZSByb3dWYWx1ZVtrZXldO1xyXG4gICAgICAgICAgICBpZiAobmV3Um93VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIG5ld1Jvd1ZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShuZXdSb3dWYWx1ZSkpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG5ld1Jvd1ZhbHVlKSByb3dWYWx1ZVtrZXldID0gbmV3Um93VmFsdWVba2V5XTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJvd1ZhbHVlKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmRlbGV0ZVJvd1ZhbHVlKG5ld1ZhbHVlLCByb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIiwgW1wibmFtZVwiLCB7IG5hbWU6IFwidGl0bGVcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjaG9pY2VzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmouY2hvaWNlcyA9IHZhbHVlOyB9fSxcclxuICAgICAgICBcIm9wdGlvbnNDYXB0aW9uXCIsIHsgbmFtZTogXCJjZWxsVHlwZVwiLCBkZWZhdWx0OiBcImRlZmF1bHRcIiwgY2hvaWNlczogW1wiZGVmYXVsdFwiLCBcImRyb3Bkb3duXCIsIFwiY2hlY2tib3hcIiwgXCJyYWRpb2dyb3VwXCIsIFwidGV4dFwiLCBcImNvbW1lbnRcIl0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY29sQ291bnRcIiwgZGVmYXVsdDogLTEsIGNob2ljZXM6IFstMSwgMCwgMSwgMiwgMywgNF0gfSwgXCJpc1JlcXVpcmVkOmJvb2xlYW5cIiwgXCJoYXNPdGhlcjpib29sZWFuXCIsIFwibWluV2lkdGhcIl0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKFwiXCIpOyB9KTtcclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHJvcGRvd25iYXNlXCIsIFt7IG5hbWU6IFwiY29sdW1uczptYXRyaXhkcm9wZG93bmNvbHVtbnNcIiwgY2xhc3NOYW1lOiBcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIgfSxcclxuICAgICAgICBcImhvcml6b250YWxTY3JvbGw6Ym9vbGVhblwiLCBcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgeyBuYW1lOiBcIm9wdGlvbnNDYXB0aW9uXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLm9wdGlvbnNDYXB0aW9uVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY2VsbFR5cGVcIiwgZGVmYXVsdDogXCJkcm9wZG93blwiLCBjaG9pY2VzOiBbXCJkcm9wZG93blwiLCBcImNoZWNrYm94XCIsIFwicmFkaW9ncm91cFwiLCBcInRleHRcIiwgXCJjb21tZW50XCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNvbHVtbkNvbENvdW50XCIsIGRlZmF1bHQ6IDAsIGNob2ljZXM6IFswLCAxLCAyLCAzLCA0XSB9LCBcImNvbHVtbk1pbldpZHRoXCJdLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWxCYXNlKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25Sb3dNb2RlbCBleHRlbmRzIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGRhdGEsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lOyB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsIGV4dGVuZHMgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZSBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgICAgIHByaXZhdGUgcm93c1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtYXRyaXhkcm9wZG93blwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJvd3MoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJvd3NWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgcm93cyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJvd3NWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWw+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPigpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm93cyB8fCB0aGlzLnJvd3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3NbaV0udmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5yb3dzW2ldLnZhbHVlLCB0aGlzLnJvd3NbaV0udGV4dCwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25Sb3dNb2RlbChuYW1lLCB0ZXh0LCB0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHJvcGRvd25cIiwgW3sgbmFtZTogXCJyb3dzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucm93cyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucm93cyA9IHZhbHVlOyB9fV0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbChcIlwiKTsgfSwgXCJtYXRyaXhkcm9wZG93bmJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeGRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gWzEsIDIsIDMsIDQsIDVdOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmFkZENvbHVtbihcIkNvbHVtbiAxXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAyXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAzXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEeW5hbWljUm93TW9kZWwgZXh0ZW5kcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIsIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoZGF0YSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJvd05hbWUoKSB7IHJldHVybiBcInJvd1wiICsgdGhpcy5pbmRleDsgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsIGV4dGVuZHMgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZSBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgICAgIHN0YXRpYyBNYXhSb3dDb3VudCA9IDEwMDtcclxuICAgICAgICBwcml2YXRlIHJvd0NvdW50ZXIgPSAwO1xyXG4gICAgICAgIHByaXZhdGUgcm93Q291bnRWYWx1ZTogbnVtYmVyID0gMjtcclxuICAgICAgICBwcml2YXRlIGFkZFJvd1RleHRWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHJlbW92ZVJvd1RleHRWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgbWluUm93Q291bnQgPSAwO1xyXG4gICAgICAgIHB1YmxpYyByb3dDb3VudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtYXRyaXhkeW5hbWljXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcm93Q291bnQoKSB7IHJldHVybiB0aGlzLnJvd0NvdW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHJvd0NvdW50KHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPCAwIHx8IHZhbCA+IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsLk1heFJvd0NvdW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucm93Q291bnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS5sZW5ndGggPiB2YWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxVmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHFWYWwuc3BsaWNlKHZhbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gcVZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJvd0NvdW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFJvdygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyhudWxsKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yb3dDb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUm93KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnJvd0NvdW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzICYmIGluZGV4IDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMuY3JlYXRlTmV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YWwuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuZGVsZXRlUm93VmFsdWUodmFsLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yb3dDb3VudC0tO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGFkZFJvd1RleHQoKSB7IHJldHVybiB0aGlzLmFkZFJvd1RleHRWYWx1ZSA/IHRoaXMuYWRkUm93VGV4dFZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImFkZFJvd1wiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgYWRkUm93VGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUm93VGV4dFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcmVtb3ZlUm93VGV4dCgpIHsgcmV0dXJuIHRoaXMucmVtb3ZlUm93VGV4dFZhbHVlID8gdGhpcy5yZW1vdmVSb3dUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicmVtb3ZlUm93XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCByZW1vdmVSb3dUZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVSb3dUZXh0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjYWNoZWRWaXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSB0aGlzLnJvd0NvdW50KSByZXR1cm4gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVJvd3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRXJyb3JJblJvd3MoKSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtaW5Sb3dDb3VudEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluUm93Q291bnQpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBoYXNFcnJvckluUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluUm93Q291bnQgPD0gMCB8fCAhdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBzZXRSb3dDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgcm93SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3Nbcm93SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyb3cuaXNFbXB0eSkgc2V0Um93Q291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2V0Um93Q291bnQgPCB0aGlzLm1pblJvd0NvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVSb3dzKCk6IEFycmF5PE1hdHJpeER5bmFtaWNSb3dNb2RlbD4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PE1hdHJpeER5bmFtaWNSb3dNb2RlbD4oKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucm93Q291bnQgPT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5nZXRSb3dWYWx1ZUJ5SW5kZXgodmFsLCBpKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3codmFsdWU6IGFueSk6IE1hdHJpeER5bmFtaWNSb3dNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHluYW1pY1Jvd01vZGVsKHRoaXMucm93Q291bnRlciArKywgdGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3VmFsdWUoY3VyVmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBjdXJWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgciA9IFtdO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IHRoaXMucm93Q291bnQpIHJlc3VsdC5zcGxpY2UodGhpcy5yb3dDb3VudCAtIDEpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gcmVzdWx0Lmxlbmd0aDsgaSA8IHRoaXMucm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe30pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkZWxldGVSb3dWYWx1ZShuZXdWYWx1ZTogYW55LCByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGlzRW1wdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld1ZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobmV3VmFsdWVbaV0pLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGlzRW1wdHkgPyBudWxsIDogbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldFJvd1ZhbHVlQnlJbmRleChxdWVzdGlvblZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHF1ZXN0aW9uVmFsdWUubGVuZ3RoID8gcXVlc3Rpb25WYWx1ZVtpbmRleF0gOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0Um93VmFsdWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgcXVlc3Rpb25WYWx1ZTogYW55LCBjcmVhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJvd1ZhbHVlQnlJbmRleChxdWVzdGlvblZhbHVlLCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmluZGV4T2Yocm93KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkeW5hbWljXCIsIFt7IG5hbWU6IFwicm93Q291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDIgfSwgeyBuYW1lOiBcIm1pblJvd0NvdW50Om51bWJlclwiLCBkZWZhdWx0OiAwIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImFkZFJvd1RleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouYWRkUm93VGV4dFZhbHVlOyB9IH0sIFxyXG4gICAgICAgIHsgbmFtZTogXCJyZW1vdmVSb3dUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnJlbW92ZVJvd1RleHRWYWx1ZTsgfSB9XSxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWwoXCJcIik7IH0sIFwibWF0cml4ZHJvcGRvd25iYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkeW5hbWljXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU11bHRpcGxlVGV4dERhdGE7XHJcbiAgICAgICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnkgPSBudWxsLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dGl0ZW1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZShuZXdUZXh0OiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gbmV3VGV4dDsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEgPyB0aGlzLmRhdGEuZ2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRNdWx0aXBsZVRleHRWYWx1ZSh0aGlzLm5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBvblZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGU7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gMTtcclxuICAgICAgICBjb2xDb3VudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBwdWJsaWMgaXRlbVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIHByaXZhdGUgaXRlbXNWYWx1ZXM6IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4gPSBuZXcgQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPigpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5maXJlQ2FsbGJhY2soc2VsZi5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtdWx0aXBsZXRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpdGVtcygpOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+IHsgcmV0dXJuIHRoaXMuaXRlbXNWYWx1ZXM7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGl0ZW1zKHZhbHVlOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXNWYWx1ZXMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBBZGRJdGVtKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlVGV4dEl0ZW0obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMSB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Um93cygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgdmFyIGNvbENvdW50ID0gdGhpcy5jb2xDb3VudDtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5pdGVtcztcclxuICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goW10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcm93c1tyb3dzLmxlbmd0aCAtIDFdLnB1c2goaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBjb2xDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcm93cztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25JdGVtVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0SXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbChuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZykgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgKHRoaXMuaXRlbXNbaV0ubmFtZSBpbiB0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1WYWx1ZSA9IHRoaXMudmFsdWVbdGhpcy5pdGVtc1tpXS5uYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNbaV0ub25WYWx1ZUNoYW5nZWQoaXRlbVZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgcnVuVmFsaWRhdG9ycygpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHN1cGVyLnJ1blZhbGlkYXRvcnMoKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBWYWxpZGF0b3JSdW5uZXIoKS5ydW4odGhpcy5pdGVtc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lNdWx0aXBsZVRleHREYXRhXHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRpdGVtXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInRpdGxlXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dmFsaWRhdG9yXCIsIGNsYXNzTmFtZVBhcnQ6IFwidmFsaWRhdG9yXCIgfV0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtTW9kZWwoXCJcIik7IH0pO1xyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRcIiwgW3sgbmFtZTogXCIhaXRlbXM6dGV4dGl0ZW1zXCIsIGNsYXNzTmFtZTogXCJtdWx0aXBsZXRleHRpdGVtXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwiaXRlbVNpemU6bnVtYmVyXCIsIGRlZmF1bHQ6IDI1IH0sIHsgbmFtZTogXCJjb2xDb3VudDpudW1iZXJcIiwgZGVmYXVsdDogMSwgY2hvaWNlczogWzEsIDIsIDMsIDRdIH1dLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtdWx0aXBsZXRleHRcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChuYW1lKTsgcS5BZGRJdGVtKFwidGV4dDFcIik7IHEuQWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhdGluZ01vZGVsIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHN0YXRpYyBkZWZhdWx0UmF0ZVZhbHVlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHJhdGVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBtaW5pbnVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBtYXhpbXVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICByYXRlVmFsdWVzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgcmF0ZVZhbHVlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucmF0ZXM7IH1cclxuICAgICAgICBzZXQgcmF0ZVZhbHVlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJhdGVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmF0ZVZhbHVlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUmF0ZVZhbHVlcygpOiBJdGVtVmFsdWVbXSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJhdGVWYWx1ZXMubGVuZ3RoID4gMCkgcmV0dXJuIHRoaXMucmF0ZVZhbHVlcztcclxuICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uUmF0aW5nTW9kZWwuZGVmYXVsdFJhdGVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJhdGluZ1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9IFxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0cnVlOyB9XHJcbiAgICB9XHJcbiAgICBJdGVtVmFsdWUuc2V0RGF0YShRdWVzdGlvblJhdGluZ01vZGVsLmRlZmF1bHRSYXRlVmFsdWVzLCBbMSwgMiwgMywgNCwgNV0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhdGluZ1wiLCBbXCJoYXNDb21tZW50OmJvb2xlYW5cIiwgeyBuYW1lOiBcInJhdGVWYWx1ZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yYXRlVmFsdWVzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yYXRlVmFsdWVzID0gdmFsdWU7IH19LFxyXG4gICAgICAgIFwibWluaW51bVJhdGVEZXNjcmlwdGlvblwiLCBcIm1heGltdW1SYXRlRGVzY3JpcHRpb25cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZ01vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZ01vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgVHJpZ2dlciBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICAgICAgc3RhdGljIGdldCBvcGVyYXRvcnMoKSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlICE9IG51bGwpIHJldHVybiBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgICAgICBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gISghdmFsdWUpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlICE9IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBjb250YWluczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtcImluZGV4T2ZcIl0gJiYgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA+IC0xOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlIHx8ICF2YWx1ZVtcImluZGV4T2ZcIl0gfHwgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPiBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPD0gZXhwZWN0ZWRWYWx1ZTsgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFUcmlnZ2VyLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGVjayh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25GYWlsdXJlKCkgeyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtdO1xyXG4gICAgICAgIGRvQ29tcGxldGUoKTtcclxuICAgICAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlciBleHRlbmRzIFRyaWdnZXIge1xyXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHJvdGVjdGVkIG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldE93bmVyKG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc09uTmV4dFBhZ2UoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSBleHRlbmRzIFN1cnZleVRyaWdnZXIge1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ2aXNpYmxldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1TdWNjZXNzKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgICAgICBwcml2YXRlIG9uVHJpZ2dlcihmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3duZXIpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm93bmVyLmdldE9iamVjdHModGhpcy5wYWdlcywgdGhpcy5xdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMob2JqZWN0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbVN1Y2Nlc3MoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtRmFpbHVyZShpdGVtOiBhbnkpIHsgaXRlbS52aXNpYmxlID0gZmFsc2U7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiY29tcGxldGV0cmlnZ2VyXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzT25OZXh0UGFnZSgpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TdWNjZXNzKCkgeyBpZiAodGhpcy5vd25lcikgdGhpcy5vd25lci5kb0NvbXBsZXRlKCk7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBwdWJsaWMgc2V0VG9OYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHNldFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGlzVmFyaWFibGU6IGJvb2xlYW47XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInNldHZhbHVldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNldFRvTmFtZSB8fCAhdGhpcy5vd25lcikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLnNldFRyaWdnZXJWYWx1ZSh0aGlzLnNldFRvTmFtZSwgdGhpcy5zZXRWYWx1ZSwgdGhpcy5pc1ZhcmlhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRyaWdnZXJcIiwgW1wib3BlcmF0b3JcIiwgXCIhdmFsdWVcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIl0sIG51bGwsIFwidHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ2aXNpYmxldHJpZ2dlclwiLCBbXCJwYWdlc1wiLCBcInF1ZXN0aW9uc1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFN1cnZleVRyaWdnZXJWaXNpYmxlKCk7IH0sIFwic3VydmV5dHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21wbGV0ZXRyaWdnZXJcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNldHZhbHVldHJpZ2dlclwiLCBbXCIhc2V0VG9OYW1lXCIsIFwic2V0VmFsdWVcIiwgXCJpc1ZhcmlhYmxlOmJvb2xlYW5cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInBhZ2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidHJpZ2dlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImR4U3VydmV5U2VydmljZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZXh0UHJlUHJvY2Vzc29yLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElTdXJ2ZXksIElTdXJ2ZXlUcmlnZ2VyT3duZXIge1xyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY29va2llTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdE9uUGFnZU5leHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIGNvbW1lbnRQcmVmaXg6IHN0cmluZyA9IFwiLUNvbW1lbnRcIjtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dOYXZpZ2F0aW9uQnV0dG9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dUaXRsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dQYWdlVGl0bGVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgY29tcGxldGVkSHRtbDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgcmVxdWlyZWRUZXh0OiBzdHJpbmcgPSBcIipcIjtcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25TdGFydEluZGV4OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvblRpdGxlVGVtcGxhdGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dQcm9ncmVzc0Jhcjogc3RyaW5nID0gXCJvZmZcIjtcclxuICAgICAgICBwdWJsaWMgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBnb05leHRQYWdlQXV0b21hdGljOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHBhZ2VzOiBBcnJheTxQYWdlTW9kZWw+ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgICAgICBwdWJsaWMgdHJpZ2dlcnM6IEFycmF5PFN1cnZleVRyaWdnZXI+ID0gbmV3IEFycmF5PFN1cnZleVRyaWdnZXI+KCk7XHJcbiAgICAgICAgcHVibGljIGNsZWFySW52aXNpYmxlVmFsdWVzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50UGFnZVZhbHVlOiBQYWdlTW9kZWwgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHZhcmlhYmxlc0hhc2g6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBwYWdlUHJldlRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgcGFnZU5leHRUZXh0VmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGNvbXBsZXRlVGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93UGFnZU51bWJlcnNWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOiBzdHJpbmcgPSBcIm9uXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZTogc3RyaW5nID0gXCJ0b3BcIjtcclxuICAgICAgICBwcml2YXRlIGxvY2FsZVZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHByaXZhdGUgaXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgcHJvY2Vzc2VkVGV4dFZhbHVlczogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNvbXBsZXRlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25DdXJyZW50UGFnZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblBhZ2VWaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblF1ZXN0aW9uQWRkZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25RdWVzdGlvblJlbW92ZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWxpZGF0ZVF1ZXN0aW9uOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUHJvY2Vzc0h0bWw6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25TZW5kUmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uR2V0UmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uVXBsb2FkRmlsZTogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBqc29uRXJyb3JzOiBBcnJheTxKc29uRXJyb3I+ID0gbnVsbDtcclxuXHJcbiAgICAgICAgcHVibGljIG1vZGU6IHN0cmluZyA9IFwibm9ybWFsXCI7XHJcblxyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yID0gbmV3IFRleHRQcmVQcm9jZXNzb3IoKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uSGFzVmFsdWUgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLnByb2Nlc3NlZFRleHRWYWx1ZXNbbmFtZS50b0xvd2VyQ2FzZSgpXTsgfTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uUHJvY2VzcyA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYuZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWUpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLmRhdGEgPSBzZWxmO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLnNldE93bmVyKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZUNyZWF0aW5nKCk7XHJcbiAgICAgICAgICAgIGlmIChqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEpzb25PYmplY3QoanNvbk9iaik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFN1cnZleUZyb21TZXJ2aWNlKHRoaXMuc3VydmV5SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzdXJ2ZXlcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgbG9jYWxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmxvY2FsZVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBsb2NhbGUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2FsZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHN1cnZleUxvY2FsaXphdGlvbi5jdXJyZW50TG9jYWxlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRMb2NTdHJpbmcoc3RyOiBzdHJpbmcpIHsgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoc3RyKTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgZW1wdHlTdXJ2ZXlUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldExvY1N0cmluZyhcImVtcHR5U3VydmV5XCIpOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBwYWdlUHJldlRleHQoKSB7IHJldHVybiAodGhpcy5wYWdlUHJldlRleHRWYWx1ZSkgPyB0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlIDogdGhpcy5nZXRMb2NTdHJpbmcoXCJwYWdlUHJldlRleHRcIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHBhZ2VQcmV2VGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMucGFnZVByZXZUZXh0VmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcGFnZU5leHRUZXh0KCkgeyByZXR1cm4gKHRoaXMucGFnZU5leHRUZXh0VmFsdWUpID8gdGhpcy5wYWdlTmV4dFRleHRWYWx1ZSA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwicGFnZU5leHRUZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBwYWdlTmV4dFRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlVGV4dCgpIHsgcmV0dXJuICh0aGlzLmNvbXBsZXRlVGV4dFZhbHVlKSA/IHRoaXMuY29tcGxldGVUZXh0VmFsdWUgOiB0aGlzLmdldExvY1N0cmluZyhcImNvbXBsZXRlVGV4dFwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29tcGxldGVUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5jb21wbGV0ZVRleHRWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBzaG93UGFnZU51bWJlcnMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnNob3dQYWdlTnVtYmVyc1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBzaG93UGFnZU51bWJlcnModmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnNob3dQYWdlTnVtYmVycykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQYWdlTnVtYmVyc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzaG93UXVlc3Rpb25OdW1iZXJzKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZTsgfTtcclxuICAgICAgICBwdWJsaWMgc2V0IHNob3dRdWVzdGlvbk51bWJlcnModmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwdWJsaWMgZ2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZTsgfTtcclxuICAgICAgICBwdWJsaWMgc2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgZGF0YShkYXRhOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoID0ge307XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtrZXldID0gZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhrZXksIGRhdGFba2V5XSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tbWVudHMoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5jb21tZW50UHJlZml4KSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZU1vZGVsPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGVzaWduTW9kZSkgcmV0dXJuIHRoaXMucGFnZXM7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8UGFnZU1vZGVsPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VzW2ldLmlzVmlzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMucGFnZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZXMubGVuZ3RoID09IDA7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IFBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGN1cnJlbnRQYWdlKCk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZVZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IG51bGwgJiYgdlBhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCBjdXJyZW50UGFnZSh2YWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdlBhZ2VzLmluZGV4T2YodmFsdWUpIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gdGhpcy5jdXJyZW50UGFnZVZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZS5zY3JvbGxUb0ZpcnN0UXVlc3Rpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN0YXRlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGluZykgcmV0dXJuIFwibG9hZGluZ1wiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlZCkgcmV0dXJuIFwiY29tcGxldGVkXCI7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50UGFnZSkgPyBcInJ1bm5pbmdcIiA6IFwiZW1wdHlcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzSGFzaCA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVQYWdlQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy52aXNpYmxlUGFnZXNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG1lcmdlVmFsdWVzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFkZXN0IHx8ICFzcmMpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gc3JjW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVzdFtrZXldKSBkZXN0W2tleV0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHZhbHVlLCBkZXN0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlOiBQYWdlTW9kZWwsIG9sZFZhbHVlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ29sZEN1cnJlbnRQYWdlJzogb2xkVmFsdWUsICduZXdDdXJyZW50UGFnZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvZ3Jlc3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChpbmRleCAqIDEwMCAvIHRoaXMudmlzaWJsZVBhZ2VDb3VudCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRGVzaWduTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImRlc2lnbmVyXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc0Nvb2tpZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVzICYmIGNvb2tpZXMuaW5kZXhPZih0aGlzLmNvb2tpZU5hbWUgKyBcIj10cnVlXCIpID4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRDb29raWUoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPXRydWU7IGV4cGlyZXM9RnJpLCAzMSBEZWMgOTk5OSAwOjA6MCBHTVRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRlbGV0ZUNvb2tpZSgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gdGhpcy5jb29raWVOYW1lICsgXCI9O1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbmV4dFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGFzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrT25QYWdlVHJpZ2dlcnMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VuZFJlc3VsdE9uUGFnZU5leHQgJiYgdGhpcy5jbGllbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KHRoaXMuc3VydmV5UG9zdElkLCB0aGlzLmNsaWVudElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4ICsgMV07XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaXNDdXJyZW50UGFnZUhhc0Vycm9ycygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyh0cnVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHByZXZQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0ZpcnN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjb21wbGV0ZUxhc3RQYWdlKCkgOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzTGFzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHJldHVybiB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSB2UGFnZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRvQ29tcGxldGUoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsZWFySW52aXNpYmxlVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFySW52aXNpYmxlUXVlc3Rpb25WYWx1ZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldENvb2tpZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGUuZmlyZSh0aGlzLCBudWxsKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5UG9zdElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRSZXN1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0Q29tcGxldGVkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRDb21wbGV0ZWRIdG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBsZXRlZEh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NIdG1sKHRoaXMuY29tcGxldGVkSHRtbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFwiPGgzPlwiICsgdGhpcy5nZXRMb2NTdHJpbmcoXCJjb21wbGV0aW5nU3VydmV5XCIpICsgXCI8L2gzPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZExvYWRpbmdIdG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxoMz5cIiArIHRoaXMuZ2V0TG9jU3RyaW5nKFwibG9hZGluZ1N1cnZleVwiKSArIFwiPC9oMz5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9ncmVzc1RleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMb2NTdHJpbmcoXCJwcm9ncmVzc1RleHRcIilbXCJmb3JtYXRcIl0oaW5kZXgsIHZQYWdlcy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdXBsb2FkRmlsZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbiwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZyk9PmFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgYWNjZXB0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5vblVwbG9hZEZpbGUuZmlyZSh0aGlzLCB7IG5hbWU6IG5hbWUsIGZpbGU6IGZpbGUsIGFjY2VwdDogYWNjZXB0IH0pO1xyXG4gICAgICAgICAgICBpZiAoIWFjY2VwdCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIXN0b3JlRGF0YUFzVGV4dCAmJiB0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlQ29yZShuYW1lLCBmaWxlLCB1cGxvYWRpbmdDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBsb2FkRmlsZUNvcmUobmFtZTogc3RyaW5nLCBmaWxlOiBGaWxlLCB1cGxvYWRpbmdDYWxsYmFjazogKHN0YXR1czogc3RyaW5nKSA9PiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAodXBsb2FkaW5nQ2FsbGJhY2spIHVwbG9hZGluZ0NhbGxiYWNrKFwidXBsb2FkaW5nXCIpO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuc2VuZEZpbGUodGhpcy5zdXJ2ZXlQb3N0SWQsIGZpbGUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXBsb2FkaW5nQ2FsbGJhY2spIHVwbG9hZGluZ0NhbGxiYWNrKHN1Y2Nlc3MgPyBcInN1Y2Nlc3NcIiA6IFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0VmFsdWUobmFtZSwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0UGFnZShpbmRleDogbnVtYmVyKTogUGFnZU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFnZXNbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGRQYWdlKHBhZ2U6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAocGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMucHVzaChwYWdlKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGROZXdQYWdlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3JlYXRlTmV3UGFnZShuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVtb3ZlUGFnZShwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5wYWdlcy5pbmRleE9mKHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9PSBwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5wYWdlcy5sZW5ndGggPiAwID8gdGhpcy5wYWdlc1swXSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UXVlc3Rpb25CeU5hbWUobmFtZTogc3RyaW5nLCBjYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IElRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb25OYW1lID0gcXVlc3Rpb25zW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBxdWVzdGlvbk5hbWUgPSBxdWVzdGlvbk5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmKHF1ZXN0aW9uTmFtZSA9PSBuYW1lKSByZXR1cm4gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UXVlc3Rpb25zQnlOYW1lcyhuYW1lczogc3RyaW5nW10sIGNhc2VJbnNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogSVF1ZXN0aW9uW10ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWVzW2ldLCBjYXNlSW5zZW5zaXRpdmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uKSByZXN1bHQucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uOiBJUXVlc3Rpb24pOiBQYWdlTW9kZWwge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UucXVlc3Rpb25zLmluZGV4T2YoPFF1ZXN0aW9uQmFzZT5xdWVzdGlvbikgPiAtMSkgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlQnlOYW1lKG5hbWU6IHN0cmluZyk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZXNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSk6IFBhZ2VNb2RlbFtde1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZ2V0UGFnZUJ5TmFtZShuYW1lc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZSkgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEFsbFF1ZXN0aW9ucyh2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SVF1ZXN0aW9uPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8SVF1ZXN0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5hZGRRdWVzdGlvbnNUb0xpc3QocmVzdWx0LCB2aXNpYmxlT25seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1BhZ2UobmFtZTogc3RyaW5nKSB7IHJldHVybiBuZXcgUGFnZU1vZGVsKG5hbWUpOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5uYW1lICE9IG5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24gPSBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvU3VydmV5VmFsdWVDaGFuZ2VkKHF1ZXN0aW9uLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ25hbWUnOiBuYW1lLCAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ3ZhbHVlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvU3VydmV5VmFsdWVDaGFuZ2VkKHF1ZXN0aW9uc1tpXSwgdGhpcy5nZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja09uUGFnZVRyaWdnZXJzKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhxdWVzdGlvbi5uYW1lLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpOiBBcnJheTxRdWVzdGlvbkJhc2U+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgICAgIGlmICghcGFnZSkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcGFnZS5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUgfHwgIXF1ZXN0aW9uLm5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tUcmlnZ2VycyhuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIGlzT25OZXh0UGFnZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy50cmlnZ2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSB0aGlzLnRyaWdnZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyaWdnZXIubmFtZSA9PSBuYW1lICYmIHRyaWdnZXIuaXNPbk5leHRQYWdlID09IGlzT25OZXh0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXIuY2hlY2sobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZG9RdWVzdGlvbnNPbkxvYWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbnNbaV0ub25TdXJ2ZXlMb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBydW5Db25kaXRpb25zKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnNGb3JMaXN0KHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuQ29uZGl0aW9uc0Zvckxpc3QodGhpcy5wYWdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcnVuQ29uZGl0aW9uc0Zvckxpc3QobGlzdDogQXJyYXk8SUNvbmRpdGlvblJ1bm5lcj4pIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W2ldLnJ1bkNvbmRpdGlvbih0aGlzLnZhbHVlc0hhc2gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nID0gbnVsbCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICghcG9zdElkICYmIHRoaXMuc3VydmV5UG9zdElkKSB7XHJcbiAgICAgICAgICAgICAgICBwb3N0SWQgPSB0aGlzLnN1cnZleVBvc3RJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXBvc3RJZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5zZW5kUmVzdWx0KHBvc3RJZCwgdGhpcy5kYXRhLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblNlbmRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIHJlc3BvbnNlOiByZXNwb25zZX0pO1xyXG4gICAgICAgICAgICB9LCB0aGlzLmNsaWVudElkLCBpc1BhcnRpYWxDb21wbGV0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVzdWx0KHJlc3VsdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5nZXRSZXN1bHQocmVzdWx0SWQsIG5hbWUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBhbnlbXSwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkdldFJlc3VsdC5maXJlKHNlbGYsIHsgc3VjY2Vzczogc3VjY2VzcywgZGF0YTogZGF0YSwgZGF0YUxpc3Q6IGRhdGFMaXN0LCByZXNwb25zZTogcmVzcG9uc2UgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbG9hZFN1cnZleUZyb21TZXJ2aWNlKHN1cnZleUlkOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChzdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlJZCA9IHN1cnZleUlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5sb2FkU3VydmV5KHRoaXMuc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICYmIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0SnNvbk9iamVjdChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZFN1cnZleUZyb21TZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkxvYWRTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVWaXNpYmxlSW5kZXhlcygpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXModGhpcy5zaG93UGFnZU51bWJlcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25QYWdlXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2aXNQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNQYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh2aXNQYWdlc1tpXS5xdWVzdGlvbnMsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSwgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXMoc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggPSB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyAoaW5kZXgrKykgOiAtMTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0ubnVtID0gc2hvd0luZGV4ICYmIHRoaXMucGFnZXNbaV0udmlzaWJsZSA/IHRoaXMucGFnZXNbaV0udmlzaWJsZUluZGV4ICsgMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyhxdWVzdGlvbnM6IElRdWVzdGlvbltdLCBzaG93SW5kZXg6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5zZXRWaXNpYmxlSW5kZXgoc2hvd0luZGV4ICYmIHF1ZXN0aW9uc1tpXS52aXNpYmxlICYmIHF1ZXN0aW9uc1tpXS5oYXNUaXRsZSA/IChpbmRleCsrKSA6IC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEpzb25PYmplY3QoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIganNvbkNvbnZlcnRlciA9IG5ldyBKc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoanNvbk9iaiwgdGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChqc29uQ29udmVydGVyLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBqc29uQ29udmVydGVyLmVycm9ycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29va2llKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRvUXVlc3Rpb25zT25Mb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZUNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlcyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tcInBhZ2Vub1wiXSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBzZWxmLmN1cnJlbnRQYWdlICE9IG51bGwgPyBzZWxmLnZpc2libGVQYWdlcy5pbmRleE9mKHNlbGYuY3VycmVudFBhZ2UpICsgMSA6IDA7IH1cclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW1wicGFnZWNvdW50XCJdID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHNlbGYudmlzaWJsZVBhZ2VDb3VudDsgfVxyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUXVlc3Rpb25Ub1Byb2Nlc3NlZFRleHRWYWx1ZXMocXVlc3Rpb25zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uOiBJUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW3F1ZXN0aW9uLm5hbWUudG9Mb3dlckNhc2UoKV0gPSBcInF1ZXN0aW9uXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gXCJxdWVzdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uICE9IG51bGwgPyB0aGlzLmdldFZhbHVlKHF1ZXN0aW9uLm5hbWUpIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsID09IFwidmFsdWVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbCA9PSBcInZhcmlhYmxlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhcmlhYmxlKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWwobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2xlYXJJbnZpc2libGVRdWVzdGlvblZhbHVlcygpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0udmlzaWJsZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VmFyaWFibGUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFZhcmlhYmxlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YXJpYWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lTdXJ2ZXkgZGF0YVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VW5iaW5kVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgLy9kbyBub3QgcmV0dXJuIHRoZSBzYW1lIG9iamVjdCBpbnN0YW5jZSEhIVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVbmJpbmRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlRXF1YWwobmFtZSwgbmV3VmFsdWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuZ2V0VW5iaW5kVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IFwidmFsdWVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMobmFtZSwgbmV3VmFsdWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5R29OZXh0UGFnZUF1dG9tYXRpYyhuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlRXF1YWwobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiKSBuZXdWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gbnVsbCB8fCBvbGRWYWx1ZSA9PT0gbnVsbCkgcmV0dXJuIG5ld1ZhbHVlID09PSBvbGRWYWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNUd29WYWx1ZUVxdWFscyhuZXdWYWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzVHdvVmFsdWVFcXVhbHMoeDogYW55LCB5OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHggPT09IHkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSB8fCAhKHkgaW5zdGFuY2VvZiBPYmplY3QpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4geCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF4Lmhhc093blByb3BlcnR5KHApKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICgheS5oYXNPd25Qcm9wZXJ0eShwKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhbcF0gPT09IHlbcF0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoeFtwXSkgIT09IFwib2JqZWN0XCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1R3b1ZhbHVlRXF1YWxzKHhbcF0sIHlbcF0pKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChwIGluIHkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh5Lmhhc093blByb3BlcnR5KHApICYmICF4Lmhhc093blByb3BlcnR5KHApKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdHJ5R29OZXh0UGFnZUF1dG9tYXRpYyhuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdvTmV4dFBhZ2VBdXRvbWF0aWMgfHwgIXRoaXMuY3VycmVudFBhZ2UpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uICYmICFxdWVzdGlvbi5zdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyhmYWxzZSwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNMYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5kYXRhW25hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXhdO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lICsgdGhpcy5jb21tZW50UHJlZml4O1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gXCJcIiB8fCBuZXdWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSwgJ3Zpc2libGUnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2U6IElQYWdlLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25QYWdlVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdwYWdlJzogcGFnZSwgJ3Zpc2libGUnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcXVlc3Rpb25BZGRlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMub25RdWVzdGlvbkFkZGVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAnaW5kZXgnOiBpbmRleCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlc3Rpb25SZW1vdmVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5pc0VtcHR5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7IG5hbWU6IG5hbWUsIHZhbHVlOiB0aGlzLmdldFZhbHVlKG5hbWUpLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgICAgICB0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5lcnJvciA/IG5ldyBDdXN0b21FcnJvcihvcHRpb25zLmVycm9yKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2Nlc3NIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBodG1sOiBodG1sIH07XHJcbiAgICAgICAgICAgIHRoaXMub25Qcm9jZXNzSHRtbC5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVGV4dChvcHRpb25zLmh0bWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9jZXNzVGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0UHJlUHJvY2Vzc29yLnByb2Nlc3ModGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVN1cnZleVRyaWdnZXJPd25lclxyXG4gICAgICAgIGdldE9iamVjdHMocGFnZXM6IHN0cmluZ1tdLCBxdWVzdGlvbnM6IHN0cmluZ1tdKTogYW55W117XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFBhZ2VzQnlOYW1lcyhwYWdlcykpO1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UXVlc3Rpb25zQnlOYW1lcyhxdWVzdGlvbnMpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VHJpZ2dlclZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgaXNWYXJpYWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGlzVmFyaWFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFyaWFibGUobmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleVwiLCBbeyBuYW1lOiBcImxvY2FsZVwiLCBjaG9pY2VzOiAoKSA9PiB7IHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0TG9jYWxlcygpIH0gfSxcclxuICAgICAgICBcInRpdGxlXCIsIFwiY29tcGxldGVkSHRtbDpodG1sXCIsIHsgbmFtZTogXCJwYWdlc1wiLCBjbGFzc05hbWU6IFwicGFnZVwiIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInF1ZXN0aW9uc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInF1ZXN0aW9uXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG51bGw7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmosIHZhbHVlLCBqc29uQ29udmVydGVyKSB7IHZhciBwYWdlID0gb2JqLmFkZE5ld1BhZ2UoXCJcIik7IGpzb25Db252ZXJ0ZXIudG9PYmplY3QoeyBxdWVzdGlvbnM6IHZhbHVlIH0sIHBhZ2UpOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInRyaWdnZXJzOnRyaWdnZXJzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dHJpZ2dlclwiLCBjbGFzc05hbWVQYXJ0OiBcInRyaWdnZXJcIiB9LFxyXG4gICAgICAgIFwic3VydmV5SWRcIiwgXCJzdXJ2ZXlQb3N0SWRcIiwgXCJjb29raWVOYW1lXCIsIFwic2VuZFJlc3VsdE9uUGFnZU5leHQ6Ym9vbGVhblwiLFxyXG4gICAgICAgIHsgbmFtZTogXCJzaG93TmF2aWdhdGlvbkJ1dHRvbnM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIHsgbmFtZTogXCJzaG93VGl0bGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIHsgbmFtZTogXCJzaG93UGFnZVRpdGxlczpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSxcclxuICAgICAgICBcInNob3dQYWdlTnVtYmVyczpib29sZWFuXCIsIHsgbmFtZTogXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIGRlZmF1bHQ6IFwib25cIiwgY2hvaWNlczogW1wib25cIiwgXCJvblBhZ2VcIiwgXCJvZmZcIl0gfSxcclxuICAgICAgICB7IG5hbWU6IFwicXVlc3Rpb25UaXRsZUxvY2F0aW9uXCIsIGRlZmF1bHQ6IFwidG9wXCIsIGNob2ljZXM6IFtcInRvcFwiLCBcImJvdHRvbVwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJzaG93UHJvZ3Jlc3NCYXJcIiwgZGVmYXVsdDogXCJvZmZcIiwgY2hvaWNlczogW1wib2ZmXCIsIFwidG9wXCIsIFwiYm90dG9tXCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInN0b3JlT3RoZXJzQXNDb21tZW50OmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCBcImdvTmV4dFBhZ2VBdXRvbWF0aWM6Ym9vbGVhblwiLCBcImNsZWFySW52aXNpYmxlVmFsdWVzOmJvb2xlYW5cIixcclxuICAgICAgICB7IG5hbWU6IFwicGFnZVByZXZUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnBhZ2VQcmV2VGV4dFZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInBhZ2VOZXh0VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5wYWdlTmV4dFRleHRWYWx1ZTsgfSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjb21wbGV0ZVRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tcGxldGVUZXh0VmFsdWU7IH0gfSwgXHJcbiAgICAgICAgeyBuYW1lOiBcInJlcXVpcmVkVGV4dFwiLCBkZWZhdWx0OiBcIipcIiB9LCBcInF1ZXN0aW9uU3RhcnRJbmRleFwiLCBcInF1ZXN0aW9uVGl0bGVUZW1wbGF0ZVwiXSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5V2luZG93TW9kZWwgZXh0ZW5kcyBCYXNlICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdXJ2ZXlFbGVtZW50TmFtZSA9IFwid2luZG93U3VydmV5SlNcIjtcclxuICAgICAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5TW9kZWw7XHJcbiAgICAgICAgd2luZG93RWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgaXNTaG93aW5nVmFsdWU6IGJvb2xlYW47XHJcbiAgICAgICAgaXNFeHBhbmRlZFZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgICAgICB0ZW1wbGF0ZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB0aGlzLmNyZWF0ZVN1cnZleShqc29uT2JqKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5zaG93VGl0bGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dFbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCkgOiBzdHJpbmcgeyByZXR1cm4gXCJ3aW5kb3dcIiB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5TW9kZWwgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNTaG93aW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1Nob3dpbmdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNFeHBhbmRlZFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5zdXJ2ZXkudGl0bGU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZXhwYW5kKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY29sbGFwc2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlU3VydmV5KGpzb25PYmo6IGFueSk6IFN1cnZleU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlNb2RlbChqc29uT2JqKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZXhwYW5kY29sbGFwc2UodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc0V4cGFuZGVkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICB2YXIgZmlubmlzaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgIHBhZ2VQcmV2VGV4dDogXCJFZGVsbGluZW5cIixcclxuICAgICAgcGFnZU5leHRUZXh0OiBcIlNldXJhYXZhXCIsXHJcbiAgICAgIGNvbXBsZXRlVGV4dDogXCJWYWxtaXNcIixcclxuICAgICAgb3RoZXJJdGVtVGV4dDogXCJNdXUgKGt1dmFpbGUpXCIsXHJcbiAgICAgIHByb2dyZXNzVGV4dDogXCJTaXZ1IHswfS97MX1cIixcclxuICAgICAgZW1wdHlTdXJ2ZXk6IFwiVMOkc3PDpCBreXNlbHlzc8OkIGVpIG9sZSB5aHTDpGvDpMOkbiBuw6RreXZpbGzDpCBvbGV2YWEgc2l2dWEgdGFpIGt5c3lteXN0w6QuXCIsXHJcbiAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiS2lpdG9zIGt5c2VseXluIHZhc3RhYW1pc2VzdGEhXCIsXHJcbiAgICAgIGxvYWRpbmdTdXJ2ZXk6IFwiS3lzZWx5w6QgbGFkYXRhYW4gcGFsdmVsaW1lbHRhLi4uXCIsXHJcbiAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIlZhbGl0c2UuLi5cIixcclxuICAgICAgcmVxdWlyZWRFcnJvcjogXCJWYXN0YWEga3lzeW15a3NlZW4sIGtpaXRvcy5cIixcclxuICAgICAgbnVtZXJpY0Vycm9yOiBcIkFydm9uIHR1bGVlIG9sbGEgbnVtZWVyaW5lbi5cIixcclxuICAgICAgdGV4dE1pbkxlbmd0aDogXCJPbGUgaHl2w6QgamEgc3nDtnTDpCB2w6RoaW50w6TDpG4gezB9IG1lcmtracOkLlwiLFxyXG4gICAgICBtaW5TZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSB2w6RoaW50w6TDpG4gezB9IHZhaWh0b2VodG9hLlwiLFxyXG4gICAgICBtYXhTZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSBlbmludMOkw6RuIHswfSB2YWlodG9laHRvYS5cIixcclxuICAgICAgbnVtZXJpY01pbk1heDogXCInezB9JyB0w6R5dHl5IG9sbGEgZW5lbW3DpG4gdGFpIHlodMOkIHN1dXJpIGt1aW4gezF9IGphIHbDpGhlbW3DpG4gdGFpIHlodMOkIHN1dXJpIGt1aW4gezJ9XCIsXHJcbiAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgdMOkeXR5eSBvbGxhIGVuZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgICBudW1lcmljTWF4OiBcIid7MH0nIHTDpHl0eXkgb2xsYSB2w6RoZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgICBpbnZhbGlkRW1haWw6IFwiU3nDtnTDpCB2YWxpZGkgc8OkaGvDtnBvc3Rpb3NvaXRlLlwiLFxyXG4gICAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiT2xlIGh5dsOkIGphIHN5w7Z0w6QgXFxcIk11dSAoa3V2YWlsZSlcXFwiXCJcclxuICB9XHJcblxyXG4gIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZmlcIl0gPSBmaW5uaXNoU3VydmV5U3RyaW5ncztcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG4vL0NyZWF0ZWQgb24gYmVoYWxmIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmFuazEzXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgdmFyIGZyZW5jaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgcGFnZVByZXZUZXh0OiBcIlByXFx1MDBlOWNcXHUwMGU5ZGVudFwiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCJTdWl2YW50XCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcIlRlcm1pbmVyXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJBdXRyZSAocHJcXHUwMGU5Y2lzZXIpXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2UgezB9IHN1ciB7MX1cIixcclxuICAgICAgICBlbXB0eVN1cnZleTogXCJJbCBuJ3kgYSBuaSBwYWdlIHZpc2libGUgbmkgcXVlc3Rpb24gdmlzaWJsZSBkYW5zY2UgcXVlc3Rpb25uYWlyZVwiLFxyXG4gICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiTWVyY2kgZCdhdm9pciByXFx1MDBlOXBvbmR1IGF1IHF1ZXN0aW9ubmFpcmUhXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCJMZSBxdWVzdGlvbm5haXJlIGVzdCBlbiBjb3VycyBkZSBjaGFyZ2VtZW50Li4uXCIsXHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiQ2hvaXNpc3Nlei4uLlwiLFxyXG4gICAgICAgIHJlcXVpcmVkRXJyb3I6IFwiTGEgclxcdTAwZTlwb25zZSBcXHUwMGUwIGNldHRlIHF1ZXN0aW9uIGVzdCBvYmxpZ2F0b2lyZS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiTGEgclxcdTAwZTlwb25zZSBkb2l0IFxcdTAwZWF0cmUgdW4gbm9tYnJlLlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwiTWVyY2kgZCdlbnRyZXIgYXUgbW9pbnMgezB9IHN5bWJvbGVzLlwiLFxyXG4gICAgICAgIG1pblNlbGVjdEVycm9yOiBcIk1lcmNpIGRlIHNcXHUwMGU5bGVjdGlvbm5lciBhdSBtb2lucyB7MH1yXFx1MDBlOXBvbnNlcy5cIixcclxuICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCJNZXJjaSBkZSBzXFx1MDBlOWxlY3Rpb25uZXIgYXUgcGx1cyB7MH1yXFx1MDBlOXBvbnNlcy5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIlZvdHJlIHJcXHUwMGU5cG9uc2UgJ3swfScgZG9pdCBcXHUwMGVhdHJlc3VwXFx1MDBlOXJpZXVyZSBvdSBcXHUwMGU5Z2FsZSBcXHUwMGUwIHsxfSBldCBpbmZcXHUwMGU5cmlldXJlIG91XFx1MDBlOWdhbGUgXFx1MDBlMCB7Mn1cIixcclxuICAgICAgICBudW1lcmljTWluOiBcIlZvdHJlIHJcXHUwMGU5cG9uc2UgJ3swfScgZG9pdCBcXHUwMGVhdHJlc3VwXFx1MDBlOXJpZXVyZSBvdSBcXHUwMGU5Z2FsZSBcXHUwMGUwIHsxfVwiLFxyXG4gICAgICAgIG51bWVyaWNNYXg6IFwiVm90cmUgclxcdTAwZTlwb25zZSAnezB9JyBkb2l0IFxcdTAwZWF0cmVpbmZcXHUwMGU5cmlldXJlIG91IFxcdTAwZTlnYWxlIFxcdTAwZTAgezF9XCIsXHJcbiAgICAgICAgaW52YWxpZEVtYWlsOiBcIk1lcmNpIGQnZW50cmVyIHVuZSBhZHJlc3NlIG1haWwgdmFsaWRlLlwiLFxyXG4gICAgICAgIGV4Y2VlZE1heFNpemU6IFwiTGEgdGFpbGxlIGR1IGZpY2hpZXIgbmUgZG9pdCBwYXMgZXhjXFx1MDBlOWRlciB7MH0uXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIk1lcmNpIGRlIHByXFx1MDBlOWNpc2VyIGxlIGNoYW1wICdBdXRyZScuXCJcclxuICAgIH1cclxuICAgIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZnJcIl0gPSBmcmVuY2hTdXJ2ZXlTdHJpbmdzO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy9zdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICB2YXIgZ2VybWFuU3VydmV5U3RyaW5ncyA9IHtcclxuICAgICAgICBwYWdlUHJldlRleHQ6IFwiWnVyw7xja1wiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCJXZWl0ZXJcIixcclxuICAgICAgICBjb21wbGV0ZVRleHQ6IFwiRmVydGlnXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlNlaXRlIHswfSB2b24gezF9XCIsXHJcbiAgICAgICAgZW1wdHlTdXJ2ZXk6IFwiRXMgZ2lidCBrZWluZSBzaWNodGJhcmUgRnJhZ2UuXCIsXHJcbiAgICAgICAgY29tcGxldGluZ1N1cnZleTogXCJWaWVsZW4gRGFuayBmw7xyIGRhcyBBdXNmw7xsbGVuIGRlcyBGcmFnZWJvZ2VucyFcIixcclxuICAgICAgICBsb2FkaW5nU3VydmV5OiBcIkRlciBGcmFnZWJvZ2VuIHdpcmQgdm9tIFNlcnZlciBnZWxhZGVuLi4uXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJCZW51dHplcmRlZmluaWVydGUgQW50d29ydC4uLlwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIlfDpGhsZW4uLi5cIixcclxuICAgICAgICByZXF1aXJlZEVycm9yOiBcIkJpdHRlIGFudHdvcnRlbiBTaWUgYXVmIGRpZSBGcmFnZS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiRGVyIFdlcnQgc29sbHRlIGVpbmUgWmFobCBzZWluLlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwiQml0dGUgZ2ViZW4gU2llIG1pbmRlc3RlbnMgezB9IFN5bWJvbGUuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwiQml0dGUgd8OkaGxlbiBTaWUgbWluZGVzdGVucyB7MH0gVmFyaWFudGVuLlwiLFxyXG4gICAgICAgIG1heFNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG5pY2h0IG1laHIgYWxzIHswfSBWYXJpYW50ZW4uXCIsXHJcbiAgICAgICAgbnVtZXJpY01pbk1heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBncsO2w59lciBzZWluIGFscyB7MX0gdW5kIGdsZWljaCBvZGVyIGtsZWluZXIgYWxzIHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgc29sdGUgZ2xlaWNoIG9kZXIgZ3LDtsOfZXIgc2VpbiBhbHMgezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBrbGVpbmVyIGFscyB7MX1cIixcclxuICAgICAgICBpbnZhbGlkRW1haWw6IFwiQml0dGUgZ2ViZW4gU2llIGVpbmUgZ8O8bHRpZ2UgRW1haWwtQWRyZXNzZSBlaW4uXCIsXHJcbiAgICAgICAgZXhjZWVkTWF4U2l6ZTogXCJEaWUgRGF0ZWlncsO2w59lIHNvbGwgbmljaHQgbWVociBhbHMgezB9LlwiLFxyXG4gICAgICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJCaXR0ZSBnZWJlbiBTaWUgZWluZW4gV2VydCBmw7xyIElocmUgYmVudXR6ZXJkZWZpbmllcnRlIEFudHdvcnQgZWluLlwiXHJcbiAgICB9XHJcbiAgICBzdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImRlXCJdID0gZ2VybWFuU3VydmV5U3RyaW5ncztcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIHZhciBydXNzaWFuU3VydmV5U3RyaW5ncyA9IHtcclxuICAgICAgICBwYWdlUHJldlRleHQ6IFwi0J3QsNC30LDQtFwiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCLQlNCw0LvQtdC1XCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcItCT0L7RgtC+0LLQvlwiLFxyXG4gICAgICAgIHByb2dyZXNzVGV4dDogXCLQodGC0YDQsNC90LjRhtCwIHswfSDQuNC3IHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcItCd0LXRgiDQvdC4INC+0LTQvdC+0LPQviDQstC+0L/RgNC+0YHQsC5cIixcclxuICAgICAgICBjb21wbGV0aW5nU3VydmV5OiBcItCR0LvQsNCz0L7QtNCw0YDQuNC8INCS0LDRgSDQt9CwINC30LDQv9C+0LvQvdC10L3QuNC1INCw0L3QutC10YLRiyFcIixcclxuICAgICAgICBsb2FkaW5nU3VydmV5OiBcItCX0LDQs9GA0YPQt9C60LAg0YEg0YHQtdGA0LLQtdGA0LAuLi5cIixcclxuICAgICAgICBvdGhlckl0ZW1UZXh0OiBcItCU0YDRg9Cz0L7QtSAo0L/QvtC20LDQu9GD0LnRgdGC0LAsINC+0L/QuNGI0LjRgtC1KVwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcItCS0YvQsdGA0LDRgtGMLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7RgtCy0LXRgtGM0YLQtSDQvdCwINCy0L7Qv9GA0L7RgS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwi0J7RgtCy0LXRgiDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0YfQuNGB0LvQvtC8LlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INGF0L7RgtGPINCx0YsgezB9INGB0LjQvNCy0L7Qu9C+0LIuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0YvQsdC10YDQuNGC0LUg0YXQvtGC0Y8g0LHRiyB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgICAgIG1heFNlbGVjdEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstGL0LHQtdGA0LjRgtC1INC90LUg0LHQvtC70LXQtSB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9LCDQuCDRgNCw0LLQvdGL0Lwg0LjQu9C4INC80LXQvdGM0YjQtSwg0YfQtdC8IHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCInezB9JyDQtNC+0LvQttC90L4g0LHRi9GC0Ywg0YDQsNCy0L3Ri9C8INC40LvQuCDQvNC10L3RjNGI0LUsINGH0LXQvCB7MX1cIixcclxuICAgICAgICBpbnZhbGlkRW1haWw6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC00LXQudGB0YLQstC40YLQtdC70YzQvdGL0Lkg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YsuXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNCw0L3QvdGL0LUg0LIg0L/QvtC70LUgXFxcItCU0YDRg9Cz0L7QtVxcXCJcIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJydVwiXSA9IHJ1c3NpYW5TdXJ2ZXlTdHJpbmdzO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy9zdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICB2YXIgdHVya2lzaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgICAgIHBhZ2VQcmV2VGV4dDogXCJHZXJpXCIsXHJcbiAgICAgICAgICAgIHBhZ2VOZXh0VGV4dDogXCLEsGxlcmlcIixcclxuICAgICAgICAgICAgY29tcGxldGVUZXh0OiBcIkFua2V0aSBUYW1hbWxhXCIsXHJcbiAgICAgICAgICAgIG90aGVySXRlbVRleHQ6IFwiRGnEn2VyIChhw6fEsWtsYXnEsW7EsXopXCIsXHJcbiAgICAgICAgICAgIHByb2dyZXNzVGV4dDogXCJTYXlmYSB7MH0gLyB7MX1cIixcclxuICAgICAgICAgICAgZW1wdHlTdXJ2ZXk6IFwiQW5rZXR0ZSBnw7Zyw7xudMO8bGVuZWNlayBzYXlmYSB5YSBkYSBzb3J1IG1ldmN1dCBkZcSfaWwuXCIsXHJcbiAgICAgICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiQW5rZXRpbWl6aSB0YW1hbWxhZMSxxJ/EsW7EsXogacOnaW4gdGXFn2Vra8O8ciBlZGVyaXouXCIsXHJcbiAgICAgICAgICAgIGxvYWRpbmdTdXJ2ZXk6IFwiQW5rZXQgc3VudWN1ZGFuIHnDvGtsZW5peW9yIC4uLlwiLFxyXG4gICAgICAgICAgICBvcHRpb25zQ2FwdGlvbjogXCJTZcOnaW5peiAuLi5cIixcclxuICAgICAgICAgICAgcmVxdWlyZWRFcnJvcjogXCJMw7x0ZmVuIHNvcnV5YSBjZXZhcCB2ZXJpbml6XCIsXHJcbiAgICAgICAgICAgIG51bWVyaWNFcnJvcjogXCJHaXJpbGVuIGRlxJ9lciBudW1lcmlrIG9sbWFsxLFkxLFyXCIsXHJcbiAgICAgICAgICAgIHRleHRNaW5MZW5ndGg6IFwiRW4gYXogezB9IHNlbWJvbCBnaXJpbml6LlwiLFxyXG4gICAgICAgICAgICBtaW5Sb3dDb3VudEVycm9yOiBcIkzDvHRmZW4gZW4gYXogezB9IHNhdMSxcsSxIGRvbGR1cnVuLlwiLFxyXG4gICAgICAgICAgICBtaW5TZWxlY3RFcnJvcjogXCJMw7x0ZmVuIGVuIGF6IHswfSBzZcOnZW5lxJ9pIHNlw6dpbml6LlwiLFxyXG4gICAgICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCJMw7x0ZmVuIHswfSBhZGV0dGVuIGZhemxhIHNlw6dtZXlpbml6LlwiLFxyXG4gICAgICAgICAgICBudW1lcmljTWluTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfSBhbmQgZXF1YWwgb3IgbGVzcyB0aGFuIHsyfVwiLFxyXG4gICAgICAgICAgICBudW1lcmljTWluOiBcIid7MH0nIGRlxJ9lcmkgezF9IGRlxJ9lcmluZSBlxZ9pdCB2ZXlhIGLDvHnDvGsgb2xtYWzEsWTEsXJcIixcclxuICAgICAgICAgICAgbnVtZXJpY01heDogXCInezB9JyBkZcSfZXJpIHsxfSBkZcSfZXJpbmUgZcWfaXQgeWEgZGEga8O8w6fDvGsgb2xtYWzEsWTEsXIuXCIsXHJcbiAgICAgICAgICAgIGludmFsaWRFbWFpbDogXCJMw7x0ZmVuIGdlw6dlcmxpIGJpciBlcG9zdGEgYWRyZXNpIGdpcmluaXouXCIsXHJcbiAgICAgICAgICAgIHVybFJlcXVlc3RFcnJvcjogXCJUYWxlYmkgxZ91IGhhdGF5xLEgZMO2bmTDvCAnezB9Jy4gezF9XCIsXHJcbiAgICAgICAgICAgIHVybEdldENob2ljZXNFcnJvcjogXCJUYWxlcCBoZXJoYW5naSBiaXIgdmVyaSBkw7ZubWVkaSB5YSBkYSAncGF0aCcgw7Z6ZWxsacSfaSBoYXRhbMSxLlwiLFxyXG4gICAgICAgICAgICBleGNlZWRNYXhTaXplOiBcIkRvc3lhIGJveXV0dSB7MH0gZGXEn2VyaW5pIGdlw6dlbWV6LlwiLFxyXG4gICAgICAgICAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiTMO8dGZlbiBkacSfZXIgZGXEn2VybGVyaSBnaXJpbml6LlwiLFxyXG4gICAgICAgICAgICB1cGxvYWRpbmdGaWxlOiBcIkRvc3lhbsSxeiB5w7xrbGVuaXlvci4gTMOcdGZlbiBiaXJrYcOnIHNhbml5ZSBiZWtsZXlpbiB2ZSB0ZWtyYXIgZGVuZXlpbi5cIixcclxuICAgICAgICAgICAgYWRkUm93OiBcIlNhdMSxciBFa2xlXCIsXHJcbiAgICAgICAgICAgIHJlbW92ZVJvdzogXCJLYWxkxLFyXCJcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJ0clwiXSA9IHR1cmtpc2hTdXJ2ZXlTdHJpbmdzO1xyXG59XHJcbiIsIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IHZhciBkZWZhdWx0U3RhbmRhcmRDc3MgPSB7XHJcbiAgICAgICAgcm9vdDogXCJzdl9tYWluXCIsXHJcbiAgICAgICAgaGVhZGVyOiBcIlwiLFxyXG4gICAgICAgIGJvZHk6IFwic3ZfYm9keVwiLFxyXG4gICAgICAgIGZvb3RlcjogXCJzdl9uYXZcIixcclxuICAgICAgICBuYXZpZ2F0aW9uQnV0dG9uOiBcIlwiLCBuYXZpZ2F0aW9uOiB7IGNvbXBsZXRlOiBcIlwiLCBwcmV2OlwiXCIsIG5leHQ6IFwiXCJ9LFxyXG4gICAgICAgIHByb2dyZXNzOiBcInN2X3Byb2dyZXNzXCIsXHJcbiAgICAgICAgcGFnZVRpdGxlOiBcInN2X3BfdGl0bGVcIixcclxuICAgICAgICByb3c6IFwic3Zfcm93XCIsXHJcbiAgICAgICAgcXVlc3Rpb246IHsgcm9vdDogXCJzdl9xXCIsIHRpdGxlOiBcInN2X3FfdGl0bGVcIiwgY29tbWVudDogXCJcIiwgaW5kZW50OiAyMCB9LFxyXG4gICAgICAgIGVycm9yOiB7IHJvb3Q6IFwic3ZfcV9lcmJveFwiLCBpY29uOiBcIlwiLCBpdGVtOiBcIlwiIH0sXHJcblxyXG4gICAgICAgIGNoZWNrYm94OiB7IHJvb3Q6IFwic3ZfcWNiY1wiLCBpdGVtOiBcInN2X3FfY2hlY2tib3hcIiwgb3RoZXI6IFwic3ZfcV9vdGhlclwiIH0sXHJcbiAgICAgICAgY29tbWVudDogXCJcIixcclxuICAgICAgICBkcm9wZG93bjogXCJcIixcclxuICAgICAgICBtYXRyaXg6IHsgcm9vdDogXCJzdl9xX21hdHJpeFwiIH0sXHJcbiAgICAgICAgbWF0cml4ZHJvcGRvd246IHsgcm9vdDogXCJzdl9xX21hdHJpeFwiIH0sXHJcbiAgICAgICAgbWF0cml4ZHluYW1pYzogeyByb290OiBcInRhYmxlXCIsIGJ1dHRvbjogXCJcIiB9LFxyXG4gICAgICAgIG11bHRpcGxldGV4dDogeyByb290OiBcIlwiLCBpdGVtVGl0bGU6IFwiXCIsIGl0ZW1WYWx1ZTogXCJcIiB9LFxyXG4gICAgICAgIHJhZGlvZ3JvdXA6IHsgcm9vdDogXCJzdl9xY2JjXCIsIGl0ZW06IFwic3ZfcV9yYWRpb2dyb3VwXCIsIG90aGVyOiBcInN2X3Ffb3RoZXJcIiB9LFxyXG4gICAgICAgIHJhdGluZzogeyByb290OiBcInN2X3FfcmF0aW5nXCIsIGl0ZW06IFwiXCIgfSxcclxuICAgICAgICB0ZXh0OiBcIlwiXHJcbiAgICB9O1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3BhZ2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Sb3cgZXh0ZW5kcyBRdWVzdGlvblJvd01vZGVsIHtcclxuICAgICAgICBrb1Zpc2libGU6IGFueTsgXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHBhZ2U6IFBhZ2VNb2RlbCwgcHVibGljIHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgc3VwZXIocGFnZSwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmlzaWJsZSA9IGtvLm9ic2VydmFibGUodGhpcy52aXNpYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmlzaWJsZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WaXNpYmxlKHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBrb0FmdGVyUmVuZGVyKGVsLCBjb24pIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRFbCA9IGVsW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5OYW1lID0gdEVsLm5vZGVOYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5OYW1lID09IFwiI3RleHRcIikgdEVsLmRhdGEgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlIGV4dGVuZHMgUGFnZU1vZGVsIHtcclxuICAgICAgICBrb05vOiBhbnk7IFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZyA9IFwiXCIpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29ObyA9IGtvLm9ic2VydmFibGUoXCJcIik7XHJcbiAgICAgICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVSb3cocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IFF1ZXN0aW9uUm93TW9kZWwgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUm93KHRoaXMsIHF1ZXN0aW9uKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uTnVtQ2hhbmdlZCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29Obyh2YWx1ZSA+IDAgPyB2YWx1ZSArIFwiLiBcIiA6IFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwicGFnZVwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUGFnZSgpOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbmJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkltcGxlbWVudG9yQmFzZSB7XHJcbiAgICAgICAga29WaXNpYmxlOiBhbnk7IGtvRXJyb3JzOiBhbnk7IGtvTWFyZ2luTGVmdDogYW55OyBrb1BhZGRpbmdSaWdodDogYW55OyBrb1JlbmRlcldpZHRoOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBxdWVzdGlvbi52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uVmlzaWJpbGl0eUNoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgcXVlc3Rpb24ucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25SZW5kZXJXaWR0aENoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGUgPSBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb24udmlzaWJsZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29SZW5kZXJXaWR0aCA9IGtvLm9ic2VydmFibGUodGhpcy5xdWVzdGlvbi5yZW5kZXJXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb01hcmdpbkxlZnQgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvUmVuZGVyV2lkdGgoKTsgcmV0dXJuIHNlbGYuZ2V0SW5kZW50U2l6ZShzZWxmLnF1ZXN0aW9uLmluZGVudCk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFkZGluZ1JpZ2h0ID0ga28ub2JzZXJ2YWJsZShzZWxmLmdldEluZGVudFNpemUoc2VsZi5xdWVzdGlvbi5yaWdodEluZGVudCkpOyBcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmlzaWJsZVwiXSA9IHRoaXMua29WaXNpYmxlO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29SZW5kZXJXaWR0aFwiXSA9IHRoaXMua29SZW5kZXJXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvRXJyb3JzXCJdID0gdGhpcy5rb0Vycm9ycztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvTWFyZ2luTGVmdFwiXSA9IHRoaXMua29NYXJnaW5MZWZ0O1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29QYWRkaW5nUmlnaHRcIl0gPSB0aGlzLmtvUGFkZGluZ1JpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WaXNpYmlsaXR5Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGUodGhpcy5xdWVzdGlvbi52aXNpYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uUmVuZGVyV2lkdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUmVuZGVyV2lkdGgodGhpcy5xdWVzdGlvbi5yZW5kZXJXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMua29QYWRkaW5nUmlnaHQodGhpcy5nZXRJbmRlbnRTaXplKHRoaXMucXVlc3Rpb24ucmlnaHRJbmRlbnQpKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0SW5kZW50U2l6ZShpbmRlbnQ6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChpbmRlbnQgPCAxKSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uW1wiZGF0YVwiXSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBjc3MgPSB0aGlzLnF1ZXN0aW9uW1wiZGF0YVwiXVtcImNzc1wiXTtcclxuICAgICAgICAgICAgaWYgKCFjc3MpIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kZW50ICogY3NzLnF1ZXN0aW9uLmluZGVudCArIFwicHhcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwia29xdWVzdGlvbmJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25JbXBsZW1lbnRvckJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgaXNVcGRhdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUga29EdW1teTogYW55O1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTsga29Db21tZW50OiBhbnk7IGtvVGl0bGU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBxdWVzdGlvbi52YWx1ZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZhbHVlQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5jb21tZW50Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uQ29tbWVudENoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgcXVlc3Rpb24uZXJyb3JzQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uRXJyb3JzQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgICAgICBxdWVzdGlvbi50aXRsZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZpc2libGVJbmRleENoYW5nZWQoKTsgfVxyXG4gICAgICAgICAgICBxdWVzdGlvbi52aXNpYmxlSW5kZXhDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25WaXNpYmxlSW5kZXhDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMua29EdW1teSA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IHRoaXMuY3JlYXRla29WYWx1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvQ29tbWVudCA9IGtvLm9ic2VydmFibGUodGhpcy5xdWVzdGlvbi5jb21tZW50KTtcclxuICAgICAgICAgICAgdGhpcy5rb1RpdGxlID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5rb0R1bW15KCk7IHJldHVybiBzZWxmLnF1ZXN0aW9uLmZ1bGxUaXRsZTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy5xdWVzdGlvbi5lcnJvcnMpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvQ29tbWVudC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmFsdWVcIl0gPSB0aGlzLmtvVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0NvbW1lbnRcIl0gPSB0aGlzLmtvQ29tbWVudDtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVGl0bGVcIl0gPSB0aGlzLmtvVGl0bGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGRhdGluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNldGtvVmFsdWUodGhpcy5xdWVzdGlvbi52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNvbW1lbnRDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1VwZGF0aW5nKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMua29Db21tZW50KHRoaXMucXVlc3Rpb24uY29tbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZpc2liaWxpdHlDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvVmlzaWJsZSh0aGlzLnF1ZXN0aW9uLnZpc2libGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WaXNpYmxlSW5kZXhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvRHVtbXkodGhpcy5rb0R1bW15KCkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uRXJyb3JzQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0Vycm9ycyh0aGlzLnF1ZXN0aW9uLmVycm9ycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVrb1ZhbHVlKCk6IGFueSB7IHJldHVybiBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb24udmFsdWUpOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldGtvVmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlQ29tbWVudChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24uY29tbWVudCA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmlzVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldE5vKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9uLnZpc2libGVJbmRleCA+IC0xID8gdGhpcy5xdWVzdGlvbi52aXNpYmxlSW5kZXggKyAxICsgXCIuIFwiIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwia29xdWVzdGlvbi50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uU2VsZWN0QmFzZUltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25JbXBsZW1lbnRvcntcclxuICAgICAgICBrb090aGVyVmlzaWJsZTogYW55OyBrb1Zpc2libGVDaG9pY2VzOiBhbnk7IFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMua29PdGhlclZpc2libGUgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYua29WYWx1ZSgpOyByZXR1cm4gc2VsZi5pc090aGVyU2VsZWN0ZWQ7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmlzaWJsZUNob2ljZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKDxRdWVzdGlvbkNoZWNrYm94QmFzZT5zZWxmLnF1ZXN0aW9uKS52aXNpYmxlQ2hvaWNlcyk7XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25DaGVja2JveEJhc2U+cXVlc3Rpb24pLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29WaXNpYmxlQ2hvaWNlcygoPFF1ZXN0aW9uQ2hlY2tib3hCYXNlPnNlbGYucXVlc3Rpb24pLnZpc2libGVDaG9pY2VzKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvT3RoZXJWaXNpYmxlXCJdID0gdGhpcy5rb090aGVyVmlzaWJsZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmlzaWJsZUNob2ljZXNcIl0gPSB0aGlzLmtvVmlzaWJsZUNob2ljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgaXNPdGhlclNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxRdWVzdGlvblNlbGVjdEJhc2U+dGhpcy5xdWVzdGlvbikuaXNPdGhlclNlbGVjdGVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94QmFzZUltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlSW1wbGVtZW50b3Ige1xyXG4gICAgICAgIGtvV2lkdGg6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmtvV2lkdGggPSBrby5vYnNlcnZhYmxlKHRoaXMuY29sV2lkdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29XaWR0aFwiXSA9IHRoaXMua29XaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvQWZ0ZXJSZW5kZXJcIl0gPSB0aGlzLmtvQWZ0ZXJSZW5kZXI7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgKDxRdWVzdGlvbkNoZWNrYm94QmFzZT50aGlzLnF1ZXN0aW9uKS5jb2xDb3VudENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvbENvdW50Q2hhbmdlZCgpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Db2xDb3VudENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1dpZHRoXCJdID0ga28ub2JzZXJ2YWJsZSh0aGlzLmNvbFdpZHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCBjb2xXaWR0aCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgY29sQ291bnQgPSAoPFF1ZXN0aW9uQ2hlY2tib3hCYXNlPnRoaXMucXVlc3Rpb24pLmNvbENvdW50O1xyXG4gICAgICAgICAgICByZXR1cm4gY29sQ291bnQgPiAwID8gKDEwMCAvIGNvbENvdW50KSArICclJyA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUga29BZnRlclJlbmRlcihlbCwgY29uKSB7XHJcbiAgICAgICAgICAgIHZhciB0RWwgPSBlbFswXTtcclxuICAgICAgICAgICAgaWYgKHRFbC5ub2RlTmFtZSA9PSBcIiN0ZXh0XCIpIHRFbC5kYXRhID0gXCJcIjtcclxuICAgICAgICAgICAgdEVsID0gZWxbZWwubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGlmICh0RWwubm9kZU5hbWUgPT0gXCIjdGV4dFwiKSB0RWwuZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2NoZWNrYm94LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvcXVlc3Rpb25fYmFzZXNlbGVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgY2xhc3MgUXVlc3Rpb25DaGVja2JveEltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2VJbXBsZW1lbnRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHF1ZXN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZWtvVmFsdWUoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb24udmFsdWUgPyBrby5vYnNlcnZhYmxlQXJyYXkodGhpcy5xdWVzdGlvbi52YWx1ZSkgOiBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldGtvVmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZShbXS5jb25jYXQobmV3VmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZShbXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uQ2hlY2tib3hJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJjaGVja2JveFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25DaGVja2JveChcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImNoZWNrYm94XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uQ2hlY2tib3gobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2NvbW1lbnQudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNvbW1lbnQgZXh0ZW5kcyBRdWVzdGlvbkNvbW1lbnRNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwiY29tbWVudFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50KFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChuYW1lKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fZHJvcGRvd24udHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkRyb3Bkb3duIGV4dGVuZHMgUXVlc3Rpb25Ecm9wZG93bk1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25TZWxlY3RCYXNlSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwiZHJvcGRvd25cIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uRHJvcGRvd24oXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkRyb3Bkb3duKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9maWxlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvcXVlc3Rpb24udHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGNsYXNzIFF1ZXN0aW9uRmlsZUltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25JbXBsZW1lbnRvciB7XHJcbiAgICAgICAga29EYXRhVXBkYXRlcjogYW55OyBrb0RhdGE6IGFueTsga29IYXNWYWx1ZTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb0RhdGFVcGRhdGVyID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICAgICAgdGhpcy5rb0RhdGEgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYua29EYXRhVXBkYXRlcigpOyByZXR1cm4gKDxRdWVzdGlvbkZpbGVNb2RlbD5zZWxmLnF1ZXN0aW9uKS5wcmV2aWV3VmFsdWU7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzVmFsdWUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvRGF0YVwiXSA9IHRoaXMua29EYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29IYXNWYWx1ZVwiXSA9IHRoaXMua29IYXNWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25GaWxlTW9kZWw+dGhpcy5xdWVzdGlvbikucHJldmlld1ZhbHVlTG9hZGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Mb2FkUHJldmlldygpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wiZG9jaGFuZ2VcIl0gPSBmdW5jdGlvbiAoZGF0YSwgZXZlbnQpIHsgdmFyIHNyYyA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50OyBzZWxmLm9uQ2hhbmdlKHNyYyk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25DaGFuZ2Uoc3JjOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCF3aW5kb3dbXCJGaWxlUmVhZGVyXCJdKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICghc3JjIHx8ICFzcmMuZmlsZXMgfHwgc3JjLmZpbGVzLmxlbmd0aCA8IDEpIHJldHVybjtcclxuICAgICAgICAgICAgKDxRdWVzdGlvbkZpbGVNb2RlbD50aGlzLnF1ZXN0aW9uKS5sb2FkRmlsZShzcmMuZmlsZXNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uTG9hZFByZXZpZXcoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29EYXRhVXBkYXRlcih0aGlzLmtvRGF0YVVwZGF0ZXIoKSArIDEpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzVmFsdWUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRmlsZSBleHRlbmRzIFF1ZXN0aW9uRmlsZU1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25GaWxlSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwiZmlsZVwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25GaWxlKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZmlsZVwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uRmlsZShuYW1lKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25faHRtbC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJrb3F1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uSHRtbCBleHRlbmRzIFF1ZXN0aW9uSHRtbE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25JbXBsZW1lbnRvckJhc2UodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwiaHRtbFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25IdG1sKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiaHRtbFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbChuYW1lKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbWF0cml4LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4Um93IGV4dGVuZHMgTWF0cml4Um93TW9kZWwge1xyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAga29WYWx1ZTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnksIHB1YmxpYyB0ZXh0OiBzdHJpbmcsIHB1YmxpYyBmdWxsTmFtZTogc3RyaW5nLCBkYXRhOiBJTWF0cml4RGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lLCB0ZXh0LCBmdWxsTmFtZSwgZGF0YSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc1ZhbHVlVXBkYXRpbmcpIHRydWU7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvbkltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCBmdWxsTmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4Um93TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeFJvdyhuYW1lLCB0ZXh0LCBmdWxsTmFtZSwgdGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcIm1hdHJpeFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXgoXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NYXRyaXgobmFtZSk7IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuY29sdW1ucyA9IFtcIkNvbHVtbiAxXCIsIFwiQ29sdW1uIDJcIiwgXCJDb2x1bW4gM1wiXTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duIGV4dGVuZHMgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25JbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJtYXRyaXhkcm9wZG93blwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bihcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeGRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd24obmFtZSk7IHEuY2hvaWNlcyA9IFsxLCAyLCAzLCA0LCA1XTsgcS5yb3dzID0gW1wiUm93IDFcIiwgXCJSb3cgMlwiXTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMVwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMlwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gM1wiKTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX21hdHJpeGR5bmFtaWMudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbWF0cml4ZHJvcGRvd25iYXNlLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3Ige1xyXG4gICAgICAgIGtvUm93czogYW55OyBrb1JlY2FsYzogYW55O1xyXG4gICAgICAgIGtvQWRkUm93Q2xpY2s6IGFueTsga29SZW1vdmVSb3dDbGljazogYW55OyBrb092ZXJmbG93WDogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMua29SZWNhbGMgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgICAgICB0aGlzLmtvUm93cyA9IGtvLnB1cmVDb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUmVjYWxjKCk7IHJldHVybiAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5jYWNoZWRWaXNpYmxlUm93cztcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29PdmVyZmxvd1ggPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICg8UXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZT50aGlzLnF1ZXN0aW9uKS5ob3Jpem9udGFsU2Nyb2xsID8gXCJzY3JvbGxcIjogXCJub25lXCI7XHJcbiAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29Sb3dzXCJdID0gdGhpcy5rb1Jvd3M7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb0FkZFJvd0NsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmFkZFJvdygpOyB9XHJcbiAgICAgICAgICAgIHRoaXMua29SZW1vdmVSb3dDbGljayA9IGZ1bmN0aW9uIChkYXRhKSB7IHNlbGYucmVtb3ZlUm93KGRhdGEpOyB9XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0FkZFJvd0NsaWNrXCJdID0gdGhpcy5rb0FkZFJvd0NsaWNrO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29SZW1vdmVSb3dDbGlja1wiXSA9IHRoaXMua29SZW1vdmVSb3dDbGljaztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvT3ZlcmZsb3dYXCJdID0gdGhpcy5rb092ZXJmbG93WDtcclxuICAgICAgICAgICAgKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikucm93Q291bnRDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Sb3dDb3VudENoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikuY29sdW1uc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvbHVtbkNoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikudXBkYXRlQ2VsbHNDYWxsYmFrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uVXBkYXRlQ2VsbHMoKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVXBkYXRlQ2VsbHMoKSB7XHJcbiAgICAgICAgICAgIC8vR2VuZXJlYXRlIHJvd3MgYWdhaW4uXHJcbiAgICAgICAgICAgIHZhciByb3dzID0gKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbilbXCJnZW5lcmF0ZWRWaXNpYmxlUm93c1wiXTtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbnMgPSAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5jb2x1bW5zO1xyXG4gICAgICAgICAgICBpZiAocm93cyAmJiByb3dzLmxlbmd0aCA+IDAgJiYgY29sdW1ucyAmJiBjb2x1bW5zLmxlbmd0aCA+IDApIHRoaXMub25Db2x1bW5DaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNvbHVtbkNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHZhciByb3dzID0gKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikudmlzaWJsZVJvd3M7XHJcbiAgICAgICAgICAgIHRoaXMub25Sb3dDb3VudENoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uUm93Q291bnRDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUmVjYWxjKHRoaXMua29SZWNhbGMoKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgYWRkUm93KCkge1xyXG4gICAgICAgICAgICAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5hZGRSb3coKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHJlbW92ZVJvdyhyb3c6IE1hdHJpeER5bmFtaWNSb3dNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgcm93cyA9ICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLmNhY2hlZFZpc2libGVSb3dzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSByb3dzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLnJlbW92ZVJvdyhpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHluYW1pYyBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25NYXRyaXhEeW5hbWljSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwibWF0cml4ZHluYW1pY1wiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEeW5hbWljKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4ZHluYW1pY1wiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeER5bmFtaWMobmFtZSk7IHEuY2hvaWNlcyA9IFsxLCAyLCAzLCA0LCA1XTsgcS5yb3dDb3VudCA9IDI7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9tdWx0aXBsZXRleHQudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBNdWx0aXBsZVRleHRJdGVtIGV4dGVuZHMgTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICBwcml2YXRlIGlzS09WYWx1ZVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAga29WYWx1ZTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnkgPSBudWxsLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc0tPVmFsdWVVcGRhdGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9uVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0tPVmFsdWVVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNLT1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0SW1wbGVtZW50b3IgZXh0ZW5kcyBRdWVzdGlvbkltcGxlbWVudG9yIHtcclxuICAgICAgICBrb1Jvd3M6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmtvUm93cyA9IGtvLm9ic2VydmFibGVBcnJheSgoPFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWw+dGhpcy5xdWVzdGlvbikuZ2V0Um93cygpKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvUm93c1wiXSA9IHRoaXMua29Sb3dzO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29sQ291bnRDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgKDxRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsPnRoaXMucXVlc3Rpb24pLmNvbENvdW50Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uQ29sQ291bnRDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNvbENvdW50Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Jvd3MoKDxRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsPnRoaXMucXVlc3Rpb24pLmdldFJvd3MoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk11bHRpcGxlVGV4dCBleHRlbmRzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dEltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJtdWx0aXBsZXRleHRpdGVtXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtKFwiXCIpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwibXVsdGlwbGV0ZXh0XCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm11bHRpcGxldGV4dFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChuYW1lKTsgcS5BZGRJdGVtKFwidGV4dDFcIik7IHEuQWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fcmFkaW9ncm91cC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmFkaW9ncm91cCBleHRlbmRzIFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25DaGVja2JveEJhc2VJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJyYWRpb2dyb3VwXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXAoXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYWRpb2dyb3VwXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fcmF0aW5nLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBjbGFzcyBRdWVzdGlvblJhdGluZ0ltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25JbXBsZW1lbnRvciB7XHJcbiAgICAgICAga29WaXNpYmxlUmF0ZVZhbHVlczogYW55OyBrb0NoYW5nZTogYW55OyBrb0NzczogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMua29WaXNpYmxlUmF0ZVZhbHVlcyA9IGtvLm9ic2VydmFibGVBcnJheSh0aGlzLmdldFZhbHVlcygpKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmlzaWJsZVJhdGVWYWx1ZXNcIl0gPSB0aGlzLmtvVmlzaWJsZVJhdGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb0NoYW5nZSA9IGZ1bmN0aW9uICh2YWwpIHsgc2VsZi5rb1ZhbHVlKHZhbC5pdGVtVmFsdWUpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29DaGFuZ2VcIl0gPSB0aGlzLmtvQ2hhbmdlO1xyXG4gICAgICAgICAgICAoPFF1ZXN0aW9uUmF0aW5nPnRoaXMucXVlc3Rpb24pLnJhdGVWYWx1ZXNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25SYXRlVmFsdWVzQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29HZXRDc3NcIl0gPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3NzID0gKDxRdWVzdGlvblJhdGluZz5zZWxmLnF1ZXN0aW9uKS5pdGVtQ3NzO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYucXVlc3Rpb25bXCJrb1ZhbHVlXCJdKCkgPT0gdmFsLnZhbHVlID8gY3NzICsgXCIgYWN0aXZlXCIgOiBjc3M7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblJhdGVWYWx1ZXNDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvVmlzaWJsZVJhdGVWYWx1ZXModGhpcy5nZXRWYWx1ZXMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VmFsdWVzKCk6IEFycmF5PGFueT4geyByZXR1cm4gKDxRdWVzdGlvblJhdGluZz50aGlzLnF1ZXN0aW9uKS52aXNpYmxlUmF0ZVZhbHVlczsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhdGluZyBleHRlbmRzIFF1ZXN0aW9uUmF0aW5nTW9kZWwge1xyXG4gICAgICAgIHB1YmxpYyBpdGVtQ3NzOiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uUmF0aW5nSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbUNzcyA9IHRoaXMuZGF0YVtcImNzc1wiXS5yYXRpbmcuaXRlbTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJyYXRpbmdcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmF0aW5nXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmcobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX3RleHQudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHQgZXh0ZW5kcyBRdWVzdGlvblRleHRNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwidGV4dFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0KFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dChuYW1lKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5QmFzZSBleHRlbmRzIFN1cnZleU1vZGVsIHtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBjc3NWYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvblJlbmRlcmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4oKTtcclxuXHJcbiAgICAgICAga29DdXJyZW50UGFnZTogYW55OyBrb0lzRmlyc3RQYWdlOiBhbnk7IGtvSXNMYXN0UGFnZTogYW55OyBkdW1teU9ic2VydmFibGU6IGFueTsga29TdGF0ZTogYW55O1xyXG4gICAgICAgIGtvUHJvZ3Jlc3M6IGFueTsga29Qcm9ncmVzc1RleHQ6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCwgcmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsLCBjc3M6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoanNvbk9iaik7XHJcbiAgICAgICAgICAgIGlmIChjc3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3NzID0gY3NzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJlZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gcmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Yga28gPT09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgRXJyb3IoJ2tub2Nrb3V0anMgbGlicmFyeSBpcyBub3QgbG9hZGVkLicpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNzc05hdmlnYXRpb25Db21wbGV0ZSgpIHsgcmV0dXJuIHRoaXMuZ2V0TmF2aWdhdGlvbkNzcyh0aGlzLmNzcy5uYXZpZ2F0aW9uQnV0dG9uLCB0aGlzLmNzcy5uYXZpZ2F0aW9uLmNvbXBsZXRlKTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY3NzTmF2aWdhdGlvblByZXYoKSB7IHJldHVybiB0aGlzLmdldE5hdmlnYXRpb25Dc3ModGhpcy5jc3MubmF2aWdhdGlvbkJ1dHRvbiwgdGhpcy5jc3MubmF2aWdhdGlvbi5wcmV2KTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY3NzTmF2aWdhdGlvbk5leHQoKSB7IHJldHVybiB0aGlzLmdldE5hdmlnYXRpb25Dc3ModGhpcy5jc3MubmF2aWdhdGlvbkJ1dHRvbiwgdGhpcy5jc3MubmF2aWdhdGlvbi5uZXh0KTsgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0TmF2aWdhdGlvbkNzcyhtYWluOiBzdHJpbmcsIGJ0bjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAobWFpbikgcmVzID0gbWFpbjtcclxuICAgICAgICAgICAgaWYgKGJ0bikgcmVzICs9ICcgJyArIGJ0bjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjc3MoKTogYW55IHsgcmV0dXJuIHRoaXMuY3NzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNzcyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMubWVyZ2VWYWx1ZXModmFsdWUsIHRoaXMuY3NzVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlZEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcclxuICAgICAgICAgICAgc2VsZi5hcHBseUJpbmRpbmcoKTtcclxuICAgICAgICAgICAgc2VsZi5vblJlbmRlcmVkLmZpcmUoc2VsZiwge30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbG9hZFN1cnZleUZyb21TZXJ2aWNlKHN1cnZleUlkOiBzdHJpbmcgPSBudWxsLCByZW5kZXJlZEVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHJlbmRlcmVkRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPSByZW5kZXJlZEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3VwZXIubG9hZFN1cnZleUZyb21TZXJ2aWNlKHN1cnZleUlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldENvbXBsZXRlZCgpIHtcclxuICAgICAgICAgICAgc3VwZXIuc2V0Q29tcGxldGVkKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlS29DdXJyZW50UGFnZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3UGFnZShuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBQYWdlKG5hbWUpOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZUNzc09iamVjdCgpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcgeyB0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2Ugb3ZlcnJpZGUgdGhpcyBtZXRob2RcIik7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25CZWZvcmVDcmVhdGluZygpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmNzc1ZhbHVlID0gdGhpcy5jcmVhdGVDc3NPYmplY3QoKTtcclxuICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgICAgICB0aGlzLmtvQ3VycmVudFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmN1cnJlbnRQYWdlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzRmlyc3RQYWdlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5pc0ZpcnN0UGFnZTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc0xhc3RQYWdlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5pc0xhc3RQYWdlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1Byb2dyZXNzVGV4dCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYucHJvZ3Jlc3NUZXh0OyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1Byb2dyZXNzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5nZXRQcm9ncmVzcygpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1N0YXRlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5zdGF0ZTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjdXJyZW50UGFnZUNoYW5nZWQobmV3VmFsdWU6IFBhZ2VNb2RlbCwgb2xkVmFsdWU6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICAgICAgc3VwZXIuY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkxvYWRTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFwcGx5QmluZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlbmRlcmVkRWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlS29DdXJyZW50UGFnZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXl3aW5kb3cudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwia29zdXJ2ZXkudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlXaW5kb3dCYXNlIGV4dGVuZHMgU3VydmV5V2luZG93TW9kZWwge1xyXG4gICAgICAgIGtvRXhwYW5kZWQ6IGFueTtcclxuICAgICAgICBkb0V4cGFuZDogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihqc29uT2JqKTtcclxuICAgICAgICAgICAgdGhpcy5rb0V4cGFuZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5kb0V4cGFuZCA9IGZ1bmN0aW9uICgpIHsgc2VsZi5jaGFuZ2VFeHBhbmRlZCgpOyB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiB7IHNlbGYub25Db21wbGV0ZSgpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVN1cnZleShqc29uT2JqOiBhbnkpOiBTdXJ2ZXlNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3VydmV5QmFzZShqc29uT2JqKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZXhwYW5kY29sbGFwc2UodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgc3VwZXIuZXhwYW5kY29sbGFwc2UodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvRXhwYW5kZWQodGhpcy5pc0V4cGFuZGVkVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHRlbXBsYXRlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRlbXBsYXRlVmFsdWUgPyB0aGlzLnRlbXBsYXRlVmFsdWUgOiB0aGlzLmdldERlZmF1bHRUZW1wbGF0ZSgpOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldCB0ZW1wbGF0ZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGVtcGxhdGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlO1xyXG4gICAgICAgICAgICBrby5jbGVhbk5vZGUodGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLndpbmRvd0VsZW1lbnQpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgICg8U3VydmV5PnRoaXMuc3VydmV5KS5yZW5kZXIoU3VydmV5V2luZG93LnN1cnZleUVsZW1lbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3dpbmdWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0VGVtcGxhdGUoKTogc3RyaW5nIHsgdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIG92ZXJyaWRlIHRoaXMgbWV0aG9kXCIpOyB9XHJcbiAgICAgICAgcHVibGljIGhpZGUoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93aW5nVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGFuZ2VFeHBhbmRlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZSghdGhpcy5pc0V4cGFuZGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvbkNvbXBsZXRlKCkge1xyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRlbXBsYXRlVGV4dEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVwbGFjZVRleHQocmVwbGFjZVRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgcXVlc3Rpb25UeXBlOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5nZXRJZChpZCwgcXVlc3Rpb25UeXBlKTtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKGlkKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgcG9zID0gdGhpcy50ZXh0LmluZGV4T2YoJz4nLCBwb3MpO1xyXG4gICAgICAgICAgICBpZiAocG9zIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRQb3MgPSBwb3MgKyAxO1xyXG4gICAgICAgICAgICB2YXIgZW5kU3RyaW5nID0gXCI8L3NjcmlwdD5cIjtcclxuICAgICAgICAgICAgcG9zID0gdGhpcy50ZXh0LmluZGV4T2YoZW5kU3RyaW5nLCBzdGFydFBvcyk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgc3RhcnRQb3MpICsgcmVwbGFjZVRleHQgKyB0aGlzLnRleHQuc3Vic3RyKHBvcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRJZChpZDogc3RyaW5nLCBxdWVzdGlvblR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gJ2lkPVwic3VydmV5LScgKyBpZDtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiLVwiICsgcXVlc3Rpb25UeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgKyAnXCInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHRleHQodmFsdWU6IHN0cmluZykgeyAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm1vZHVsZSB0ZW1wbGF0ZS5rbyB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1jb21tZW50XCI+ICA8aW5wdXQgZGF0YS1iaW5kPVwidmFsdWU6JGRhdGEucXVlc3Rpb24ua29Db21tZW50LCB2aXNpYmxlOiRkYXRhLnZpc2libGUsIGNzczogJHJvb3QuY3NzLnF1ZXN0aW9uLmNvbW1lbnRcIiAvPjwvc2NyaXB0PjxkaXYgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3Mucm9vdFwiPiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICh0aXRsZS5sZW5ndGggPiAwKSAmJiBzaG93VGl0bGUgJiYga29TdGF0ZSgpICE9IFxcJ2NvbXBsZXRlZFxcJywgY3NzOiAkcm9vdC5jc3MuaGVhZGVyXCI+ICAgICAgICA8aDMgZGF0YS1iaW5kPVwidGV4dDp0aXRsZVwiPjwvaDM+ICAgIDwvZGl2PiAgICA8IS0tIGtvIGlmOiBrb1N0YXRlKCkgPT0gXCJydW5uaW5nXCIgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MuYm9keVwiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBzaG93UHJvZ3Jlc3NCYXIgPT1cXCd0b3BcXCcsIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1wcm9ncmVzc1xcJywgZGF0YTogJGRhdGEgfVwiPjwvZGl2PiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcGFnZVxcJywgZGF0YToga29DdXJyZW50UGFnZSB9XCI+PC9kaXY+ICAgICAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCIgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd1Byb2dyZXNzQmFyID09XFwnYm90dG9tXFwnLCB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcHJvZ3Jlc3NcXCcsIGRhdGE6ICRkYXRhIH1cIj48L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd05hdmlnYXRpb25CdXR0b25zICYmICFpc0Rlc2lnbk1vZGUsIGNzczogJHJvb3QuY3NzLmZvb3RlclwiPiAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogcGFnZVByZXZUZXh0LCBjbGljazogcHJldlBhZ2UsIHZpc2libGU6ICFrb0lzRmlyc3RQYWdlKCksIGNzczogJHJvb3QuY3NzTmF2aWdhdGlvblByZXZcIiAvPiAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogcGFnZU5leHRUZXh0LCBjbGljazogbmV4dFBhZ2UsIHZpc2libGU6ICFrb0lzTGFzdFBhZ2UoKSwgY3NzOiAkcm9vdC5jc3NOYXZpZ2F0aW9uTmV4dFwiIC8+ICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cInZhbHVlOiBjb21wbGV0ZVRleHQsIGNsaWNrOiBjb21wbGV0ZUxhc3RQYWdlLCB2aXNpYmxlOiBrb0lzTGFzdFBhZ2UoKSwgY3NzOiAkcm9vdC5jc3NOYXZpZ2F0aW9uQ29tcGxldGVcIiAvPiAgICA8L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDwhLS0ga28gaWY6IGtvU3RhdGUoKSA9PSBcImNvbXBsZXRlZFwiIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cImh0bWw6IHByb2Nlc3NlZENvbXBsZXRlZEh0bWxcIj48L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDwhLS0ga28gaWY6IGtvU3RhdGUoKSA9PSBcImxvYWRpbmdcIiAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJodG1sOiBwcm9jZXNzZWRMb2FkaW5nSHRtbFwiPjwvZGl2PiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSBrbyBpZjoga29TdGF0ZSgpID09IFwiZW1wdHlcIiAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OmVtcHR5U3VydmV5VGV4dCwgY3NzOiAkcm9vdC5jc3MuYm9keVwiPjwvZGl2PiAgICA8IS0tIC9rbyAtLT48L2Rpdj48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1wYWdlXCI+ICAgIDxoNCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAodGl0bGUubGVuZ3RoID4gMCkgJiYgZGF0YS5zaG93UGFnZVRpdGxlcywgdGV4dDoga29ObygpICsgcHJvY2Vzc2VkVGl0bGUsIGNzczogJHJvb3QuY3NzLnBhZ2VUaXRsZVwiPjwvaDQ+ICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiByb3dzLCBhczogXFwncm93XFwnfSAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiByb3cua29WaXNpYmxlLCBjc3M6ICRyb290LmNzcy5yb3dcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiByb3cucXVlc3Rpb25zLCBhczogXFwncXVlc3Rpb25cXCcgLCBhZnRlclJlbmRlcjogcm93LmtvQWZ0ZXJSZW5kZXIgfSAtLT4gICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvblxcJywgZGF0YTogcXVlc3Rpb24gfSAtLT48IS0tIC9rbyAtLT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICA8L2Rpdj4gICAgPCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tY2hlY2tib3hcIj4gICAgPGZvcm0gZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MuY2hlY2tib3gucm9vdFwiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMsIGFzOiBcXCdpdGVtXFwnLCBhZnRlclJlbmRlcjogcXVlc3Rpb24ua29BZnRlclJlbmRlcn0gIC0tPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJzdHlsZTp7d2lkdGg6IHF1ZXN0aW9uLmtvV2lkdGgsIFxcJ21hcmdpbi1yaWdodFxcJzogcXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFxcJzVweFxcJzogXFwnMHB4XFwnfSwgY3NzOiAkcm9vdC5jc3MuY2hlY2tib3guaXRlbVwiPiAgICAgICAgICAgIDxsYWJlbCBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5jaGVja2JveC5pdGVtXCI+ICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7bmFtZTogcXVlc3Rpb24ubmFtZSwgdmFsdWU6IGl0ZW0udmFsdWV9LCBjaGVja2VkOiBxdWVzdGlvbi5rb1ZhbHVlXCIgLz4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogaXRlbS50ZXh0XCI+PC9zcGFuPiAgICAgICAgICAgIDwvbGFiZWw+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNPdGhlciAmJiAoJGluZGV4KCkgPT0gcXVlc3Rpb24ua29WaXNpYmxlQ2hvaWNlcygpLmxlbmd0aC0xKVwiPiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uLCBcXCd2aXNpYmxlXFwnOiBxdWVzdGlvbi5rb090aGVyVmlzaWJsZSB9IH0sIGNzczogJHJvb3QuY3NzLmNoZWNrYm94Lm90aGVyXCI+PC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0gL2tvIC0tPiAgICA8L2Zvcm0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tY29tbWVudFwiPiAgICA8dGV4dGFyZWEgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7Y29sczogcXVlc3Rpb24uY29scywgcm93czogcXVlc3Rpb24ucm93c30sIHZhbHVlOnF1ZXN0aW9uLmtvVmFsdWUsIGNzczogJHJvb3QuY3NzLmNvbW1lbnRcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWRyb3Bkb3duXCI+ICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwib3B0aW9uczogcXVlc3Rpb24ua29WaXNpYmxlQ2hvaWNlcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIG9wdGlvbnNWYWx1ZTogXFwndmFsdWVcXCcsIHZhbHVlOiBxdWVzdGlvbi5rb1ZhbHVlLCBvcHRpb25zQ2FwdGlvbjogcXVlc3Rpb24ub3B0aW9uc0NhcHRpb24sIGNzczogJHJvb3QuY3NzLmRyb3Bkb3duXCI+PC9zZWxlY3Q+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1lcnJvcnNcIj4gICAgPGRpdiByb2xlPVwiYWxlcnRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb0Vycm9ycygpLmxlbmd0aCA+IDAsIGZvcmVhY2g6IHsgZGF0YToga29FcnJvcnMsIGFzOiBcXCdlcnJvclxcJ30sIGNzczogJHJvb3QuY3NzLmVycm9yLnJvb3RcIj4gICAgICAgIDxkaXY+ICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MuZXJyb3IuaWNvblwiPjwvc3Bhbj4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OmVycm9yLmdldFRleHQoKSwgY3NzOiAkcm9vdC5jc3MuZXJyb3IuaXRlbVwiPjwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1maWxlXCI+ICAgIDxpbnB1dCB0eXBlPVwiZmlsZVwiIGRhdGEtYmluZD1cImV2ZW50OiB7Y2hhbmdlOiBkb2NoYW5nZX1cIj4gICAgPGRpdj4gICAgICAgIDxpbWcgZGF0YS1iaW5kPVwiYXR0cjogeyBzcmM6IHF1ZXN0aW9uLmtvRGF0YSwgaGVpZ2h0OiBxdWVzdGlvbi5pbWFnZUhlaWdodCwgd2lkdGg6IHF1ZXN0aW9uLmltYWdlV2lkdGggfSwgdmlzaWJsZTogcXVlc3Rpb24ua29IYXNWYWx1ZVwiPiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1odG1sXCI+ICAgIDxkaXYgZGF0YS1iaW5kPVwiaHRtbDogcXVlc3Rpb24ucHJvY2Vzc2VkSHRtbFwiPjwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLW1hdHJpeFwiPiAgICA8dGFibGUgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MubWF0cml4LnJvb3RcIj4gICAgICAgIDx0aGVhZD4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNSb3dzXCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDokZGF0YS50ZXh0XCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGhlYWQ+ICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVSb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzUm93cywgdGV4dDpyb3cudGV4dFwiPjwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiByb3cuZnVsbE5hbWUsIHZhbHVlOiAkZGF0YS52YWx1ZX0sIGNoZWNrZWQ6IHJvdy5rb1ZhbHVlXCIvPiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tYXRyaXhkcm9wZG93blwiPiAgICA8ZGl2IGRhdGEtYmluZD1cInN0eWxlOiB7b3ZlcmZsb3dYOiBxdWVzdGlvbi5ob3Jpem9udGFsU2Nyb2xsPyBcXCdzY3JvbGxcXCc6IFxcJ1xcJ31cIj4gICAgICAgIDx0YWJsZSBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5tYXRyaXhkcm9wZG93bi5yb290XCI+ICAgICAgICAgICAgPHRoZWFkPiAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiBxdWVzdGlvbi5nZXRDb2x1bW5UaXRsZSgkZGF0YSksIHN0eWxlOiB7IG1pbldpZHRoOiBxdWVzdGlvbi5nZXRDb2x1bW5XaWR0aCgkZGF0YSkgfVwiPjwvdGg+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8L3RoZWFkPiAgICAgICAgICAgIDx0Ym9keT4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVSb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OnJvdy50ZXh0XCI+PC90ZD4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcm93LmNlbGxzLS0+ICAgICAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgJGRhdGEucXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiAkZGF0YS5xdWVzdGlvbiwgYXM6IFxcJ3F1ZXN0aW9uXFwnIH0gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvdGJvZHk+ICAgICAgICA8L3RhYmxlPiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tYXRyaXhkeW5hbWljXCI+ICAgIDxkaXYgZGF0YS1iaW5kPVwic3R5bGU6IHtvdmVyZmxvd1g6IHF1ZXN0aW9uLmhvcml6b250YWxTY3JvbGw/IFxcJ3Njcm9sbFxcJzogXFwnXFwnfVwiPiAgICAgICAgPHRhYmxlIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLm1hdHJpeGR5bmFtaWMucm9vdFwiPiAgICAgICAgICAgIDx0aGVhZD4gICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6IHF1ZXN0aW9uLmdldENvbHVtblRpdGxlKCRkYXRhKSwgc3R5bGU6IHsgbWluV2lkdGg6IHF1ZXN0aW9uLmdldENvbHVtbldpZHRoKCRkYXRhKSB9XCI+PC90aD4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgPC90aGVhZD4gICAgICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi5rb1Jvd3MsIGFzOiBcXCdyb3dcXCcgfSAtLT4gICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiByb3cuY2VsbHMtLT4gICAgICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvbi1lcnJvcnNcXCcsIGRhdGE6ICRkYXRhLnF1ZXN0aW9uIH0gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgJGRhdGEucXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiAkZGF0YS5xdWVzdGlvbiwgYXM6IFxcJ3F1ZXN0aW9uXFwnIH0gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJjbGljazpxdWVzdGlvbi5rb1JlbW92ZVJvd0NsaWNrLCBjc3M6ICRyb290LmNzcy5tYXRyaXhkeW5hbWljLmJ1dHRvbiwgdmFsdWU6IHF1ZXN0aW9uLnJlbW92ZVJvd1RleHRcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvdGJvZHk+ICAgICAgICA8L3RhYmxlPiAgICA8L2Rpdj4gICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJjbGljazpxdWVzdGlvbi5rb0FkZFJvd0NsaWNrLCBjc3M6ICRyb290LmNzcy5tYXRyaXhkeW5hbWljLmJ1dHRvbiwgdmFsdWU6IHF1ZXN0aW9uLmFkZFJvd1RleHRcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLW11bHRpcGxldGV4dFwiPiAgICA8dGFibGUgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MubXVsdGlwbGV0ZXh0LnJvb3QsIGZvcmVhY2g6IHsgZGF0YTogIHF1ZXN0aW9uLmtvUm93cywgYXM6IFxcJ3Jvd1xcJyB9XCI+ICAgICAgICA8dHIgZGF0YS1iaW5kPVwiZm9yZWFjaDogeyBkYXRhOiByb3csIGFzOiBcXCdpdGVtXFwnIH1cIj4gICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidGV4dDogaXRlbS50aXRsZSwgY3NzOiAkcm9vdC5jc3MubXVsdGlwbGV0ZXh0Lml0ZW1UaXRsZVwiPjwvdGQ+ICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIHN0eWxlPVwiZmxvYXQ6bGVmdFwiIGRhdGEtYmluZD1cImF0dHI6IHtzaXplOiBxdWVzdGlvbi5pdGVtU2l6ZX0sIHZhbHVlOiBpdGVtLmtvVmFsdWUsIGNzczogJHJvb3QuY3NzLm11bHRpcGxldGV4dC5pdGVtVmFsdWVcIiAvPjwvdGQ+ICAgICAgICA8L3RyPiAgICA8L3RhYmxlPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXJhZGlvZ3JvdXBcIj4gICAgPGZvcm0gZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MucmFkaW9ncm91cC5yb290XCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb24ua29WaXNpYmxlQ2hvaWNlcywgYXM6IFxcJ2l0ZW1cXCcsIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb0FmdGVyUmVuZGVyfSAgLS0+ICAgICAgICA8ZGl2ICBkYXRhLWJpbmQ9XCJzdHlsZTp7d2lkdGg6IHF1ZXN0aW9uLmtvV2lkdGgsIFxcJ21hcmdpbi1yaWdodFxcJzogcXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFxcJzVweFxcJzogXFwnMHB4XFwnfSwgY3NzOiAkcm9vdC5jc3MucmFkaW9ncm91cC5pdGVtXCI+ICAgICAgICAgICAgPGxhYmVsIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnJhZGlvZ3JvdXAuaXRlbVwiPiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHF1ZXN0aW9uLm5hbWUsIHZhbHVlOiBpdGVtLnZhbHVlfSwgY2hlY2tlZDogcXVlc3Rpb24ua29WYWx1ZVwiIC8+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGV4dFwiPjwvc3Bhbj4gICAgICAgICAgICA8L2xhYmVsPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXIgJiYgKCRpbmRleCgpID09IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMoKS5sZW5ndGgtMSlcIj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogcXVlc3Rpb24ua29PdGhlclZpc2libGV9fSwgY3NzOiAkcm9vdC5jc3MucmFkaW9ncm91cC5vdGhlclwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9mb3JtPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXRleHRcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwiYXR0cjoge3NpemU6IHF1ZXN0aW9uLnNpemV9LCB2YWx1ZTpxdWVzdGlvbi5rb1ZhbHVlLCBjc3M6ICRyb290LmNzcy50ZXh0XCIvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uXCI+ICAgIDxkaXYgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIiBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5xdWVzdGlvbi5yb290LCBzdHlsZToge2Rpc3BsYXk6IHF1ZXN0aW9uLmtvVmlzaWJsZSgpID8gXFwnaW5saW5lLWJsb2NrXFwnOiBcXCdub25lXFwnLCBtYXJnaW5MZWZ0OiBxdWVzdGlvbi5rb01hcmdpbkxlZnQsIHBhZGRpbmdSaWdodDogcXVlc3Rpb24ua29QYWRkaW5nUmlnaHQsIHdpZHRoOiBxdWVzdGlvbi5rb1JlbmRlcldpZHRoIH0sIGF0dHI6IHtpZDogaWR9XCI+ICAgICAgICA8IS0tIGtvIGlmOiBxdWVzdGlvbi5oYXNUaXRsZSAtLT4gICAgICAgIDxoNSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcm9vdC5xdWVzdGlvblRpdGxlTG9jYXRpb24gPT0gXFwndG9wXFwnLCB0ZXh0OiBxdWVzdGlvbi5rb1RpdGxlKCksIGNzczogJHJvb3QuY3NzLnF1ZXN0aW9uLnRpdGxlXCI+PC9oNT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tZXJyb3JzXFwnLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvbi1cXCcgKyBxdWVzdGlvbi5nZXRUeXBlKCksIGRhdGE6IHF1ZXN0aW9uIH0gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzQ29tbWVudFwiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDpxdWVzdGlvbi5jb21tZW50VGV4dFwiPjwvZGl2PiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHRydWUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0ga28gaWY6IHF1ZXN0aW9uLmhhc1RpdGxlIC0tPiAgICAgICAgPGg1IGRhdGEtYmluZD1cInZpc2libGU6ICRyb290LnF1ZXN0aW9uVGl0bGVMb2NhdGlvbiA9PSBcXCdib3R0b21cXCcsIHRleHQ6IHF1ZXN0aW9uLmtvVGl0bGUoKSwgY3NzOiAkcm9vdC5jc3MucXVlc3Rpb24udGl0bGVcIj48L2g1PiAgICAgICAgPCEtLSAva28gLS0+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXByb2dyZXNzXCI+ICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDprb1Byb2dyZXNzVGV4dCwgY3NzOiAkcm9vdC5jc3MucHJvZ3Jlc3NcIj48L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYXRpbmdcIj4gICAgPHRhYmxlIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnJhdGluZy5yb290XCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5rb1Zpc2libGVSYXRlVmFsdWVzIC0tPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDokZGF0YS50ZXh0XCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3RoZWFkPiAgICAgICAgPHRib2R5PiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6cXVlc3Rpb24ubWluaW51bVJhdGVEZXNjcmlwdGlvblwiPjwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24ua29WaXNpYmxlUmF0ZVZhbHVlcyAtLT4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiBxdWVzdGlvbi5uYW1lLCB2YWx1ZTogJGRhdGEudmFsdWV9LCBjaGVja2VkOiBxdWVzdGlvbi5rb1ZhbHVlXCIgLz4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OnF1ZXN0aW9uLm1heGltdW1SYXRlRGVzY3JpcHRpb25cIj48L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3Rib2R5PiAgICA8L3RhYmxlPiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD4nO30iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidGVtcGxhdGUua28uaHRtbC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9rb3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZhdWx0Q3NzL2Nzc3N0YW5kYXJkLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5IGV4dGVuZHMgU3VydmV5QmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCwgcmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsLCBjc3M6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoanNvbk9iaiwgcmVuZGVyZWRFbGVtZW50LCBjc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHsgcmV0dXJuIHRlbXBsYXRlLmtvLmh0bWw7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlQ3NzT2JqZWN0KCk6IGFueSB7ICByZXR1cm4gZGVmYXVsdFN0YW5kYXJkQ3NzOyB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2tvc3VydmV5d2luZG93LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvc3VydmV5c3RhbmRhcmQudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlXaW5kb3cgZXh0ZW5kcyBTdXJ2ZXlXaW5kb3dCYXNlIHtcclxuICAgICAgICBrb0V4cGFuZGVkOiBhbnk7XHJcbiAgICAgICAgZG9FeHBhbmQ6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoanNvbk9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVTdXJ2ZXkoanNvbk9iajogYW55KTogU3VydmV5TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1cnZleShqc29uT2JqKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdFRlbXBsYXRlKCk6IHN0cmluZyB7IHJldHVybiB0ZW1wbGF0ZS53aW5kb3cua28uaHRtbCB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgdGVtcGxhdGUud2luZG93LmtvIHsgZXhwb3J0IHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJzdl93aW5kb3dcIj4gICAgPGRpdiBjbGFzcz1cInN2X3dpbmRvd190aXRsZVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6ZG9FeHBhbmRcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OnRpdGxlXCI+PC9zcGFuPjwvYT48L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvRXhwYW5kZWRcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJzdl93aW5kb3dfY29udGVudFwiIGlkPVwid2luZG93U3VydmV5SlNcIj48L2Rpdj4gICAgPC9kaXY+PC9kaXY+Jzt9IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRlbXBsYXRlLmtvLmh0bWwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdGVtcGxhdGVUZXh0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VGVtcGxhdGVUZXh0IGV4dGVuZHMgU3VydmV5VGVtcGxhdGVUZXh0QmFzZSB7XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiB0ZW1wbGF0ZS5rby5odG1sOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHsgdGVtcGxhdGUua28uaHRtbCA9IHZhbHVlOyB9XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

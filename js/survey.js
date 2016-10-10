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
        { name: "choices:itemvalues", onGetValue: function (obj) { return Survey.ItemValue.getData(obj.choices); }, onSetValue: function (obj, value) { obj.choices = value; } },
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
        ko.html = '<script type="text/html" id="survey-comment">  <input data-bind="value:$data.question.koComment, visible:$data.visible, css: $root.css.question.comment" /></script><div data-bind="css: $root.css.root">    <div data-bind="visible: (title.length > 0) && showTitle && koState() != \'completed\', css: $root.css.header">        <h3 data-bind="text:title"></h3>    </div>    <!-- ko if: koState() == "running" -->    <div data-bind="css: $root.css.body">        <div data-bind="visible: showProgressBar ==\'top\', template: { name: \'survey-progress\', data: $data }"></div>        <div data-bind="template: { name: \'survey-page\', data: koCurrentPage }"></div>        <div style="margin-top:10px" data-bind="visible: showProgressBar ==\'bottom\', template: { name: \'survey-progress\', data: $data }"></div>    </div>    <div data-bind="visible: showNavigationButtons && !isDesignMode, css: $root.css.footer">        <input type="button" data-bind="value: pagePrevText, click: prevPage, visible: !koIsFirstPage(), css: $root.cssNavigationPrev" />        <input type="button" data-bind="value: pageNextText, click: nextPage, visible: !koIsLastPage(), css: $root.cssNavigationNext" />        <input type="button" data-bind="value: completeText, click: completeLastPage, visible: koIsLastPage(), css: $root.cssNavigationComplete" />    </div>    <!-- /ko -->    <!-- ko if: koState() == "completed" -->    <div data-bind="html: processedCompletedHtml"></div>    <!-- /ko -->    <!-- ko if: koState() == "loading" -->    <div data-bind="html: processedLoadingHtml"></div>    <!-- /ko -->    <!-- ko if: koState() == "empty" -->    <div data-bind="text:emptySurveyText, css: $root.css.body"></div>    <!-- /ko --></div><script type="text/html" id="survey-page">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + processedTitle, css: $root.css.pageTitle"></h4>    <!-- ko foreach: { data: rows, as: \'row\'} -->    <div data-bind="visible: row.koVisible, css: $root.css.row">        <!-- ko foreach: { data: row.questions, as: \'question\' , afterRender: row.koAfterRender } -->            <!-- ko template: { name: \'survey-question\', data: question } --><!-- /ko -->        <!-- /ko -->    </div>    <!-- /ko --></script><script type="text/html" id="survey-progress">    <div style="width:60%;" data-bind="css: $root.css.progress">        <div data-bind="css: $root.css.progressBar, style:{width: koProgress() + \'%\'}"             role="progressbar" aria-valuemin="0"             aria-valuemax="100">            <span data-bind="text:koProgressText"></span>        </div>    </div></script><script type="text/html" id="survey-question-checkbox">    <form data-bind="css: $root.css.checkbox.root">        <!-- ko foreach: { data: question.koVisibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}, css: $root.css.checkbox.item">            <label data-bind="css: $root.css.checkbox.item">                <input type="checkbox" data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="visible: question.hasOther && ($index() == question.koVisibleChoices().length-1)">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }, css: $root.css.checkbox.other"></div>            </div>        </div>        <!-- /ko -->    </form></script><script type="text/html" id="survey-question-comment">    <textarea type="text" data-bind="attr: {cols: question.cols, rows: question.rows}, value:question.koValue, css: $root.css.comment" /></script><script type="text/html" id="survey-question-dropdown">    <select data-bind="options: question.koVisibleChoices, optionsText: \'text\', optionsValue: \'value\', value: question.koValue, optionsCaption: question.optionsCaption, css: $root.css.dropdown"></select>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-errors">    <div role="alert" data-bind="visible: koErrors().length > 0, foreach: { data: koErrors, as: \'error\'}, css: $root.css.error.root">        <div>            <span aria-hidden="true" data-bind="css: $root.css.error.icon"></span>            <span data-bind="text:error.getText(), css: $root.css.error.item"></span>        </div>    </div></script><script type="text/html" id="survey-question-file">    <input type="file" data-bind="event: {change: dochange}">    <div>        <img data-bind="attr: { src: question.koData, height: question.imageHeight, width: question.imageWidth }, visible: question.koHasValue">    </div></script><script type="text/html" id="survey-question-html">    <div data-bind="html: question.processedHtml"></div></script><script type="text/html" id="survey-question-matrix">    <table data-bind="css: $root.css.matrix.root">        <thead>            <tr>                <th data-bind="visible: question.hasRows"></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="visible: question.hasRows, text:row.text"></td>                <!-- ko foreach: question.columns -->                <td>                    <input type="radio" data-bind="attr: {name: row.fullName, value: $data.value}, checked: row.koValue"/>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-matrixdropdown">    <div data-bind="style: {overflowX: question.horizontalScroll? \'scroll\': \'\'}">        <table data-bind="css: $root.css.matrixdropdown.root">            <thead>                <tr>                    <th></th>                    <!-- ko foreach: question.columns -->                    <th data-bind="text: question.getColumnTitle($data), style: { minWidth: question.getColumnWidth($data) }"></th>                    <!-- /ko -->                </tr>            </thead>            <tbody>                <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->                <tr>                    <td data-bind="text:row.text"></td>                    <!-- ko foreach: row.cells-->                    <td>                        <!-- ko template: { name: \'survey-question-\' + $data.question.getType(), data: $data.question, as: \'question\' } -->                        <!-- /ko -->                    </td>                    <!-- /ko -->                </tr>                <!-- /ko -->            </tbody>        </table>    </div></script><script type="text/html" id="survey-question-matrixdynamic">    <div data-bind="style: {overflowX: question.horizontalScroll? \'scroll\': \'\'}">        <table data-bind="css: $root.css.matrixdynamic.root">            <thead>                <tr>                    <!-- ko foreach: question.columns -->                    <th data-bind="text: question.getColumnTitle($data), style: { minWidth: question.getColumnWidth($data) }"></th>                    <!-- /ko -->                    <th></th>                </tr>            </thead>            <tbody>                <!-- ko foreach: { data: question.koRows, as: \'row\' } -->                <tr>                    <!-- ko foreach: row.cells-->                    <td>                        <!-- ko template: { name: \'survey-question-errors\', data: $data.question } -->                        <!-- /ko -->                        <!-- ko template: { name: \'survey-question-\' + $data.question.getType(), data: $data.question, as: \'question\' } -->                        <!-- /ko -->                    </td>                    <!-- /ko -->                    <td><input type="button" data-bind="click:question.koRemoveRowClick, css: $root.css.matrixdynamic.button, value: question.removeRowText" /></td>                </tr>                <!-- /ko -->            </tbody>        </table>    </div>    <input type="button" data-bind="click:question.koAddRowClick, css: $root.css.matrixdynamic.button, value: question.addRowText" /></script><script type="text/html" id="survey-question-multipletext">    <table data-bind="css: $root.css.multipletext.root, foreach: { data:  question.koRows, as: \'row\' }">        <tr data-bind="foreach: { data: row, as: \'item\' }">            <td data-bind="text: item.title, css: $root.css.multipletext.itemTitle"></td>            <td><input type="text" style="float:left" data-bind="attr: {size: question.itemSize}, value: item.koValue, css: $root.css.multipletext.itemValue" /></td>        </tr>    </table></script><script type="text/html" id="survey-question-radiogroup">    <form data-bind="css: $root.css.radiogroup.root">        <!-- ko foreach: { data: question.koVisibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div  data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}, css: $root.css.radiogroup.item">            <label data-bind="css: $root.css.radiogroup.item">                <input type="radio" data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="visible: question.hasOther && ($index() == question.koVisibleChoices().length-1)">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible}}, css: $root.css.radiogroup.other"></div>            </div>        </div>        <!-- /ko -->    </form></script><script type="text/html" id="survey-question-text">    <input type="text" data-bind="attr: {size: question.size}, value:question.koValue, css: $root.css.text"/></script><script type="text/html" id="survey-question">    <div style="vertical-align:top" data-bind="css: $root.css.question.root, style: {display: question.koVisible() ? \'inline-block\': \'none\', marginLeft: question.koMarginLeft, paddingRight: question.koPaddingRight, width: question.koRenderWidth }, attr: {id: id}">        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'top\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-errors\', data: question } -->        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            <div data-bind="text:question.commentText"></div>            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'bottom\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->    </div></script><script type="text/html" id="survey-question-rating">    <div data-toggle="buttons" data-bind="css: $root.css.rating.root">        <!-- ko foreach: question.koVisibleRateValues -->        <label data-bind="css: question.koGetCss($data)">            <input type="radio"                   data-bind="attr: {name: question.name, id: question.name + $index(), value: $data.value}, event: { change: question.koChange}" />            <span data-bind="visible: $index() == 0, text: question.mininumRateDescription"></span>            <span data-bind="text: $data.text"></span>            <span data-bind="visible: $index() == (question.koVisibleRateValues().length-1), text: question.maximumRateDescription"></span>        </label>        <!-- /ko -->    </div>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question } }"></div>    </div>    <table data-bind="css: $root.css.rating.root">        <thead>            <tr>                <th></th>                <!-- ko foreach: question.koVisibleRateValues -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->                <th></th>            </tr>        </thead>        <tbody>            <tr>                <td data-bind="text:question.mininumRateDescription"></td>                <!-- ko foreach: question.koVisibleRateValues -->                <td>                    <input type="radio" data-bind="attr: {name: question.name, value: $data.value}, checked: question.koValue" />                </td>                <!-- /ko -->                <td data-bind="text:question.maximumRateDescription"></td>            </tr>        </tbody>    </table>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question } }"></div>    </div></script>';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudHMiLCJqc29ub2JqZWN0LnRzIiwiY2hvaWNlc1Jlc3RmdWxsLnRzIiwiY29uZGl0aW9uc1BhcnNlci50cyIsImNvbmRpdGlvbnMudHMiLCJkeFN1cnZleVNlcnZpY2UudHMiLCJzdXJ2ZXlTdHJpbmdzLnRzIiwiZXJyb3IudHMiLCJxdWVzdGlvbmJhc2UudHMiLCJxdWVzdGlvbmZhY3RvcnkudHMiLCJwYWdlLnRzIiwidmFsaWRhdG9yLnRzIiwidGV4dFByZVByb2Nlc3Nvci50cyIsInF1ZXN0aW9uLnRzIiwicXVlc3Rpb25fYmFzZXNlbGVjdC50cyIsInF1ZXN0aW9uX2NoZWNrYm94LnRzIiwicXVlc3Rpb25fY29tbWVudC50cyIsInF1ZXN0aW9uX2Ryb3Bkb3duLnRzIiwicXVlc3Rpb25fZmlsZS50cyIsInF1ZXN0aW9uX2h0bWwudHMiLCJxdWVzdGlvbl9tYXRyaXgudHMiLCJxdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwicXVlc3Rpb25fdGV4dC50cyIsInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50cyIsInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzIiwicXVlc3Rpb25fbWF0cml4ZHluYW1pYy50cyIsInF1ZXN0aW9uX211bHRpcGxldGV4dC50cyIsInF1ZXN0aW9uX3JhdGluZy50cyIsInRyaWdnZXIudHMiLCJzdXJ2ZXkudHMiLCJzdXJ2ZXlXaW5kb3cudHMiLCJsb2NhbGl6YXRpb24vZmlubmlzaC50cyIsImxvY2FsaXphdGlvbi9mcmVuY2gudHMiLCJsb2NhbGl6YXRpb24vZ2VybWFuLnRzIiwibG9jYWxpemF0aW9uL3J1c3NpYW4udHMiLCJsb2NhbGl6YXRpb24vdHVya2lzaC50cyIsImRlZmF1bHRDc3MvY3Nzc3RhbmRhcmQudHMiLCJrbm9ja291dC9rb3BhZ2UudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uYmFzZS50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb24udHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX2NoZWNrYm94LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9jb21tZW50LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9kcm9wZG93bi50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fZmlsZS50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25faHRtbC50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbWF0cml4LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbWF0cml4ZHluYW1pYy50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9yYXRpbmcudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX3RleHQudHMiLCJrbm9ja291dC9rb3N1cnZleS50cyIsImtub2Nrb3V0L2tvU3VydmV5V2luZG93LnRzIiwia25vY2tvdXQvdGVtcGxhdGVUZXh0LnRzIiwia25vY2tvdXQvc3RhbmRhcmQvdGVtcGxhdGUua28uaHRtbC50cyIsImtub2Nrb3V0L3N0YW5kYXJkL2tvU3VydmV5U3RhbmRhcmQudHMiLCJrbm9ja291dC9zdGFuZGFyZC9rb1N1cnZleVdpbmRvd1N0YW5kYXJkLnRzIiwia25vY2tvdXQvc3RhbmRhcmQvdGVtcGxhdGUud2luZG93LmtvLmh0bWwudHMiLCJrbm9ja291dC9zdGFuZGFyZC90ZW1wbGF0ZVRleHRTdGFuZGFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztFQUlFO0FBRUUsSUFBTyxNQUFNLENBc0loQjtBQXRJRyxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBMENmO1FBOEJJLG1CQUFZLEtBQVUsRUFBRSxJQUFtQjtZQUFuQixvQkFBbUIsR0FBbkIsV0FBbUI7WUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQztRQS9CYSxpQkFBTyxHQUFyQixVQUFzQixLQUF1QixFQUFFLE1BQWtCO1lBQzdELEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFXLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3BGLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNoQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixDQUFDO2dCQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUM7UUFDYSxpQkFBTyxHQUFyQixVQUFzQixLQUF1QjtZQUN6QyxJQUFJLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3hELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBT00sMkJBQU8sR0FBZCxjQUEyQixNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoRCxzQkFBVyw0QkFBSztpQkFBaEIsY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2lCQUNsRCxVQUFpQixRQUFhO2dCQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztnQkFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDNUIsSUFBSSxHQUFHLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDckMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDckMsQ0FBQztZQUNMLENBQUM7OztXQVZpRDtRQVdsRCxzQkFBVyw4QkFBTztpQkFBbEIsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ3RFLHNCQUFXLDJCQUFJO2lCQUFmO2dCQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztpQkFDRCxVQUFnQixPQUFlO2dCQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM1QixDQUFDOzs7V0FIQTtRQWxEYSxtQkFBUyxHQUFHLEdBQUcsQ0FBQztRQXNEbEMsZ0JBQUM7SUFBRCxDQXZEQSxBQXVEQyxJQUFBO0lBdkRZLGdCQUFTLFlBdURyQixDQUFBO0lBRUQ7UUFBQTtRQUlBLENBQUM7UUFIVSxzQkFBTyxHQUFkO1lBQ0ksTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFDTCxXQUFDO0lBQUQsQ0FKQSxBQUlDLElBQUE7SUFKWSxXQUFJLE9BSWhCLENBQUE7SUFDRDtRQUFBO1FBSUEsQ0FBQztRQUhVLDZCQUFPLEdBQWQ7WUFDSSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUNMLGtCQUFDO0lBQUQsQ0FKQSxBQUlDLElBQUE7SUFKWSxrQkFBVyxjQUl2QixDQUFBO0lBRUQ7UUFBQTtRQXVCQSxDQUFDO1FBckJHLHNCQUFXLDBCQUFPO2lCQUFsQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDdkYsb0JBQUksR0FBWCxVQUFZLE1BQVcsRUFBRSxPQUFnQjtZQUNyQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDbkMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUcsRUFBRSxDQUFDO2dCQUM5QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUV4RCxDQUFDO1FBQ0wsQ0FBQztRQUNNLG1CQUFHLEdBQVYsVUFBVyxJQUFPO1lBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxFQUFLLENBQUM7WUFDcEMsQ0FBQztZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFDTSxzQkFBTSxHQUFiLFVBQWMsSUFBTztZQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDbkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUM7UUFDTCxZQUFDO0lBQUQsQ0F2QkEsQUF1QkMsSUFBQTtJQXZCWSxZQUFLLFFBdUJqQixDQUFBO0FBQ0wsQ0FBQyxFQXRJVSxNQUFNLEtBQU4sTUFBTSxRQXNJaEI7O0FDNUlEOzs7O0VBSUU7Ozs7OztBQUVGLGdDQUFnQztBQUNoQyxJQUFPLE1BQU0sQ0E0YVo7QUE1YUQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUVYO1FBV0ksNEJBQW1CLElBQVk7WUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1lBVnZCLGNBQVMsR0FBVyxJQUFJLENBQUM7WUFDekIsaUJBQVksR0FBZSxJQUFJLENBQUM7WUFDaEMsZ0JBQVcsR0FBcUIsSUFBSSxDQUFDO1lBQ3RDLGNBQVMsR0FBVyxJQUFJLENBQUM7WUFDekIsa0JBQWEsR0FBVyxJQUFJLENBQUM7WUFDN0Isa0JBQWEsR0FBVyxJQUFJLENBQUM7WUFDN0IsaUJBQVksR0FBUSxJQUFJLENBQUM7WUFDekIsZUFBVSxHQUFzQixJQUFJLENBQUM7UUFJNUMsQ0FBQztRQUNELHNCQUFXLG9DQUFJO2lCQUFmLGNBQTRCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztpQkFDaEYsVUFBZ0IsS0FBYSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O1dBRHNCO1FBRWhGLHNCQUFXLGdEQUFnQjtpQkFBM0IsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNsRCwyQ0FBYyxHQUFyQixVQUFzQixLQUFVO1lBQzVCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pFLENBQUM7UUFDTSxxQ0FBUSxHQUFmLFVBQWdCLEdBQVE7WUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxzQkFBVyxnREFBZ0I7aUJBQTNCLGNBQWdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDbEQscUNBQVEsR0FBZixVQUFnQixHQUFRLEVBQUUsS0FBVSxFQUFFLFFBQW9CO1lBQ3RELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNMLENBQUM7UUFDTSx1Q0FBVSxHQUFqQixVQUFrQixPQUFlO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztnQkFBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNNLHlDQUFZLEdBQW5CLFVBQW9CLFNBQWlCO1lBQ2pDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO1FBQzFILENBQUM7UUFDRCxzQkFBVyx1Q0FBTztpQkFBbEI7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3hELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQzs7O1dBQUE7UUFDTSx1Q0FBVSxHQUFqQixVQUFrQixLQUFpQixFQUFFLFNBQTJCO1lBQzVELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBQ2pDLENBQUM7UUFDTCx5QkFBQztJQUFELENBN0NBLEFBNkNDLElBQUE7SUE3Q1kseUJBQWtCLHFCQTZDOUIsQ0FBQTtJQUNEO1FBS0ksMkJBQW1CLElBQVksRUFBRSxVQUFzQixFQUFTLE9BQXlCLEVBQVMsVUFBeUI7WUFBbEUsdUJBQWdDLEdBQWhDLGNBQWdDO1lBQUUsMEJBQWdDLEdBQWhDLGlCQUFnQztZQUF4RyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBQWlDLFlBQU8sR0FBUCxPQUFPLENBQWtCO1lBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBZTtZQUYzSCxlQUFVLEdBQThCLElBQUksQ0FBQztZQUM3Qyx1QkFBa0IsR0FBa0IsSUFBSSxDQUFDO1lBRXJDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQXNCLENBQUM7WUFDbEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNNLGdDQUFJLEdBQVgsVUFBWSxJQUFZO1lBQ3BCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTywwQ0FBYyxHQUF0QixVQUF1QixRQUFhO1lBQ2hDLElBQUksWUFBWSxHQUFHLE9BQU8sUUFBUSxLQUFLLFFBQVEsR0FBRyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztZQUMzRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDMUIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkUsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsWUFBWSxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxZQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUNELFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xELElBQUksSUFBSSxHQUFHLElBQUksa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztZQUM3QixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDOUIsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN6QyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixJQUFJLFdBQVcsR0FBRyxPQUFPLFFBQVEsQ0FBQyxPQUFPLEtBQUssVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUNuRixJQUFJLFlBQVksR0FBRyxPQUFPLFFBQVEsQ0FBQyxPQUFPLEtBQUssVUFBVSxHQUFHLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO29CQUNwRixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDL0MsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO2dCQUMxQyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQzFDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztnQkFDeEMsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO2dCQUNoRCxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7Z0JBQ2hELENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ08sMkNBQWUsR0FBdkIsVUFBd0IsWUFBb0I7WUFDeEMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLGlCQUFpQixDQUFDLGNBQWMsQ0FBQztnQkFBQyxNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3pHLFlBQVksR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3hCLENBQUM7UUFDTyxnREFBb0IsR0FBNUIsVUFBNkIsWUFBb0I7WUFDN0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztZQUNsRCxDQUFDO1lBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBN0VNLGdDQUFjLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLDRCQUFVLEdBQUcsR0FBRyxDQUFDO1FBNkU1Qix3QkFBQztJQUFELENBL0VBLEFBK0VDLElBQUE7SUEvRVksd0JBQWlCLG9CQStFN0IsQ0FBQTtJQUNEO1FBQUE7WUFDWSxZQUFPLEdBQWlDLEVBQUUsQ0FBQztZQUMzQyxvQkFBZSxHQUF3QyxFQUFFLENBQUM7WUFDMUQsb0JBQWUsR0FBeUMsRUFBRSxDQUFDO1lBQzNELDRCQUF1QixHQUE2QixFQUFFLENBQUM7UUE4Rm5FLENBQUM7UUE3RlUsK0JBQVEsR0FBZixVQUFnQixJQUFZLEVBQUUsVUFBc0IsRUFBRSxPQUF5QixFQUFFLFVBQXlCO1lBQXBELHVCQUF5QixHQUF6QixjQUF5QjtZQUFFLDBCQUF5QixHQUF6QixpQkFBeUI7WUFDdEcsSUFBSSxhQUFhLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNqRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2hELEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDMUMsQ0FBQztnQkFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUN6QixDQUFDO1FBQ00sNENBQXFCLEdBQTVCLFVBQTZCLElBQVksRUFBRSxPQUFrQjtZQUN6RCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLGFBQWEsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3BDLENBQUM7UUFDTCxDQUFDO1FBQ00sb0NBQWEsR0FBcEIsVUFBcUIsSUFBWTtZQUM3QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDZCxVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQXNCLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQztZQUM1QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBQ00sa0NBQVcsR0FBbEIsVUFBbUIsSUFBWTtZQUMzQixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxDQUFDO1FBQ00seUNBQWtCLEdBQXpCLFVBQTBCLElBQVksRUFBRSxZQUE2QjtZQUE3Qiw0QkFBNkIsR0FBN0Isb0JBQTZCO1lBQ2pFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDTSw0Q0FBcUIsR0FBNUIsVUFBNkIsSUFBWTtZQUNyQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNkLFVBQVUsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO2dCQUNqQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDO1lBQ3BELENBQUM7WUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RCLENBQUM7UUFDTywwQ0FBbUIsR0FBM0IsVUFBNEIsSUFBWSxFQUFFLFlBQXFCLEVBQUUsTUFBZ0M7WUFDN0YsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDdEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO2dCQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNyRSxDQUFDO1FBQ0wsQ0FBQztRQUNPLGdDQUFTLEdBQWpCLFVBQWtCLElBQVk7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNPLHFDQUFjLEdBQXRCLFVBQXVCLElBQVksRUFBRSxJQUErQjtZQUNoRSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JFLENBQUM7UUFDTCxDQUFDO1FBQ08sa0NBQVcsR0FBbkIsVUFBb0IsUUFBNEIsRUFBRSxJQUErQixFQUFFLFFBQWdCO1lBQy9GLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFDVixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztZQUNMLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQzNCLENBQUM7UUFDTCxDQUFDO1FBQ08sNkNBQXNCLEdBQTlCLFVBQStCLElBQVksRUFBRSxJQUFtQjtZQUM1RCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3ZFLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEUsQ0FBQztRQUNMLENBQUM7UUFDTCxtQkFBQztJQUFELENBbEdBLEFBa0dDLElBQUE7SUFsR1ksbUJBQVksZUFrR3hCLENBQUE7SUFDRDtRQUdJLG1CQUFtQixJQUFZLEVBQVMsT0FBZTtZQUFwQyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQUZoRCxnQkFBVyxHQUFXLEVBQUUsQ0FBQztZQUN6QixPQUFFLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFFdkIsQ0FBQztRQUNNLHNDQUFrQixHQUF6QjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQVJBLEFBUUMsSUFBQTtJQVJZLGdCQUFTLFlBUXJCLENBQUE7SUFDRDtRQUE4Qyw0Q0FBUztRQUNuRCxrQ0FBbUIsWUFBb0IsRUFBUyxTQUFpQjtZQUM3RCxrQkFBTSxpQkFBaUIsRUFBRSxnQkFBZ0IsR0FBRyxZQUFZLEdBQUcsY0FBYyxHQUFHLFNBQVMsR0FBRyxlQUFlLENBQUMsQ0FBQztZQUQxRixpQkFBWSxHQUFaLFlBQVksQ0FBUTtZQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7WUFFN0QsSUFBSSxVQUFVLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDOUQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixJQUFJLENBQUMsV0FBVyxHQUFHLHdDQUF3QyxDQUFDO2dCQUM1RCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztvQkFDcEMsSUFBSSxDQUFDLFdBQVcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMzQyxDQUFDO2dCQUNELElBQUksQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDO1FBQ0wsK0JBQUM7SUFBRCxDQWJBLEFBYUMsQ0FiNkMsU0FBUyxHQWF0RDtJQWJZLCtCQUF3QiwyQkFhcEMsQ0FBQTtJQUNEO1FBQThDLDRDQUFTO1FBQ25ELGtDQUFtQixhQUFxQixFQUFTLElBQVksRUFBUyxPQUFlO1lBQ2pGLGtCQUFNLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUROLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1lBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtZQUFTLFlBQU8sR0FBUCxPQUFPLENBQVE7WUFFakYsSUFBSSxDQUFDLFdBQVcsR0FBRyxxQ0FBcUMsQ0FBQztZQUN6RCxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4RSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDbEQsQ0FBQztZQUNELElBQUksQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDO1FBQzVCLENBQUM7UUFDTCwrQkFBQztJQUFELENBWEEsQUFXQyxDQVg2QyxTQUFTLEdBV3REO0lBWFksK0JBQXdCLDJCQVdwQyxDQUFBO0lBQ0Q7UUFBMEMsd0NBQXdCO1FBQzlELDhCQUFtQixZQUFvQixFQUFTLGFBQXFCO1lBQ2pFLGtCQUFNLGFBQWEsRUFBRSxxQkFBcUIsRUFBRSwrRUFBK0UsR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFEcEksaUJBQVksR0FBWixZQUFZLENBQVE7WUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBUTtRQUVyRSxDQUFDO1FBQ0wsMkJBQUM7SUFBRCxDQUpBLEFBSUMsQ0FKeUMsd0JBQXdCLEdBSWpFO0lBSlksMkJBQW9CLHVCQUloQyxDQUFBO0lBQ0Q7UUFBNEMsMENBQXdCO1FBQ2hFLGdDQUFtQixZQUFvQixFQUFTLGFBQXFCO1lBQ2pFLGtCQUFNLGFBQWEsRUFBRSx1QkFBdUIsRUFBRSxpRkFBaUYsR0FBRyxZQUFZLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFEeEksaUJBQVksR0FBWixZQUFZLENBQVE7WUFBUyxrQkFBYSxHQUFiLGFBQWEsQ0FBUTtRQUVyRSxDQUFDO1FBQ0wsNkJBQUM7SUFBRCxDQUpBLEFBSUMsQ0FKMkMsd0JBQXdCLEdBSW5FO0lBSlksNkJBQXNCLHlCQUlsQyxDQUFBO0lBQ0Q7UUFBK0MsNkNBQVM7UUFDcEQsbUNBQW1CLFlBQW9CLEVBQVMsU0FBaUI7WUFDN0Qsa0JBQU0sa0JBQWtCLEVBQUUsZ0JBQWdCLEdBQUcsWUFBWSxHQUFHLDBCQUEwQixHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUQ1RixpQkFBWSxHQUFaLFlBQVksQ0FBUTtZQUFTLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFFakUsQ0FBQztRQUNMLGdDQUFDO0lBQUQsQ0FKQSxBQUlDLENBSjhDLFNBQVMsR0FJdkQ7SUFKWSxnQ0FBeUIsNEJBSXJDLENBQUE7SUFFRDtRQUFBO1lBS1csV0FBTSxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7UUFnSjNDLENBQUM7UUFqSkcsc0JBQWtCLHNCQUFRO2lCQUExQixjQUErQixNQUFNLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBRTFELGlDQUFZLEdBQW5CLFVBQW9CLEdBQVE7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUNNLDZCQUFRLEdBQWYsVUFBZ0IsT0FBWSxFQUFFLEdBQVE7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ3JCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDZCxVQUFVLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbEUsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUN4QixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksVUFBVSxDQUFDLGdCQUFnQixDQUFDO29CQUFDLFFBQVEsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3pDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3hCLFFBQVEsQ0FBQztnQkFDYixDQUFDO2dCQUNELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDdkYsUUFBUSxDQUFDO2dCQUNiLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RCxDQUFDO1FBQ0wsQ0FBQztRQUNTLHFDQUFnQixHQUExQixVQUEyQixHQUFRLEVBQUUsUUFBNEI7WUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDN0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQzdFLENBQUM7WUFDRCxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNsRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDUyxnQ0FBVyxHQUFyQixVQUFzQixHQUFRLEVBQUUsTUFBVyxFQUFFLFFBQTRCO1lBQ3JFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNwQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDN0QsQ0FBQztnQkFDRCxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNsRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbkQsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDO1FBQ1MsK0JBQVUsR0FBcEIsVUFBcUIsS0FBVSxFQUFFLEdBQVEsRUFBRSxHQUFRLEVBQUUsUUFBNEI7WUFDN0UsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDN0MsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BDLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzFCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLENBQUM7UUFDTCxDQUFDO1FBQ08saUNBQVksR0FBcEIsVUFBcUIsS0FBVSxJQUFhLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEcsaUNBQVksR0FBcEIsVUFBcUIsS0FBVSxFQUFFLFFBQTRCO1lBQ3pELElBQUksTUFBTSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDM0MsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFFBQVEsSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ25DLENBQUM7WUFDRCxTQUFTLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ2hGLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN0RixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDTywyQ0FBc0IsR0FBOUIsVUFBK0IsTUFBVyxFQUFFLEtBQVUsRUFBRSxRQUE0QixFQUFFLFNBQWlCO1lBQ25HLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULElBQUksa0JBQWtCLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDOUUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO29CQUNyQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUNqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDaEMsS0FBSyxHQUFHLElBQUkseUJBQXlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7NEJBQ3hFLEtBQUssQ0FBQzt3QkFDVixDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDekIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNiLEtBQUssR0FBRyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM1RSxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLEtBQUssR0FBRyxJQUFJLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM5RSxDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ08sZ0NBQVcsR0FBbkIsVUFBb0IsS0FBZ0IsRUFBRSxPQUFZO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxLQUFLLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDOUQsQ0FBQztZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFDTyxpQ0FBWSxHQUFwQixVQUFxQixLQUFpQixFQUFFLEdBQVEsRUFBRSxHQUFRLEVBQUUsUUFBNEI7WUFDcEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNsQixDQUFDO1lBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3BDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0MsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUNsQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QixDQUFDO2dCQUNMLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNPLGlDQUFZLEdBQXBCLFVBQXFCLFVBQXFDLEVBQUUsR0FBUTtZQUNoRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN6QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQztvQkFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFuSmMsMkJBQWdCLEdBQUcsTUFBTSxDQUFDO1FBQzFCLCtCQUFvQixHQUFHLEtBQUssQ0FBQztRQUM3Qix3QkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFrSnRELGlCQUFDO0lBQUQsQ0FySkEsQUFxSkMsSUFBQTtJQXJKWSxpQkFBVSxhQXFKdEIsQ0FBQTtBQUNMLENBQUMsRUE1YU0sTUFBTSxLQUFOLE1BQU0sUUE0YVo7O0FDbmJEOzs7O0VBSUU7Ozs7OztBQUVGLGdDQUFnQztBQUNoQyxzQ0FBc0M7QUFDdEMsSUFBTyxNQUFNLENBZ0daO0FBaEdELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUFxQyxtQ0FBSTtRQU9yQztZQUNJLGlCQUFPLENBQUM7WUFQTCxRQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ2pCLFNBQUksR0FBVyxFQUFFLENBQUM7WUFDbEIsY0FBUyxHQUFXLEVBQUUsQ0FBQztZQUN2QixjQUFTLEdBQVcsRUFBRSxDQUFDO1lBRXZCLFVBQUssR0FBZ0IsSUFBSSxDQUFDO1FBR2pDLENBQUM7UUFDTSw2QkFBRyxHQUFWO1lBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7WUFDMUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7Z0JBQ1QsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFDTSxpQ0FBTyxHQUFkLGNBQTJCLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ25ELHNCQUFXLG9DQUFPO2lCQUFsQjtnQkFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3pFLENBQUM7OztXQUFBO1FBQ00saUNBQU8sR0FBZCxVQUFlLElBQVM7WUFDcEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEQsQ0FBQztRQUNNLCtCQUFLLEdBQVo7WUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDeEIsQ0FBQztRQUNTLGdDQUFNLEdBQWhCLFVBQWlCLE1BQVc7WUFDeEIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN6QyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3JDLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7d0JBQUMsUUFBUSxDQUFDO29CQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksa0JBQVcsQ0FBQyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQ3JGLENBQUM7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNPLGlDQUFPLEdBQWYsVUFBZ0IsTUFBYyxFQUFFLFFBQWdCO1lBQzVDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxrQkFBVyxDQUFDLHlCQUFrQixDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBQ08sNENBQWtCLEdBQTFCLFVBQTJCLE1BQVc7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDOUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3JDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDN0IsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNPLG1DQUFTLEdBQWpCO1lBQ0ksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNPLGtDQUFRLEdBQWhCLFVBQWlCLElBQVM7WUFDdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNPLGtDQUFRLEdBQWhCLFVBQWlCLElBQVM7WUFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUNMLHNCQUFDO0lBQUQsQ0E3RkEsQUE2RkMsQ0E3Rm9DLFdBQUksR0E2RnhDO0lBN0ZZLHNCQUFlLGtCQTZGM0IsQ0FBQTtJQUNELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBRSxjQUFjLE1BQU0sQ0FBQyxJQUFJLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0ksQ0FBQyxFQWhHTSxNQUFNLEtBQU4sTUFBTSxRQWdHWjs7QUN4R0Q7Ozs7RUFJRTtBQUVGLGdDQUFnQztBQUNoQyxzQ0FBc0M7QUFDdEMsSUFBTyxNQUFNLENBME5aO0FBMU5ELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUFBO1FBd05BLENBQUM7UUFqTlUsZ0NBQUssR0FBWixVQUFhLElBQVksRUFBRSxJQUFtQjtZQUMxQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1osSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMvQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFDTSxtQ0FBUSxHQUFmLFVBQWdCLElBQW1CO1lBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDTyx1Q0FBWSxHQUFwQixVQUFxQixLQUFVO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQ08sdUNBQVksR0FBcEIsVUFBcUIsSUFBbUI7WUFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1lBQzVCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7b0JBQzVDLEdBQUcsSUFBSSxRQUFRLENBQUM7Z0JBQ3BCLENBQUM7WUFDTCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQzFCLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNPLDRDQUFpQixHQUF6QixVQUEwQixTQUFvQjtZQUMxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDdkQsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztZQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUMzRCxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQzVELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDL0QsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQzdCLENBQUM7UUFDTyw0Q0FBaUIsR0FBekIsVUFBMEIsRUFBVTtZQUNoQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksT0FBTyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxTQUFTLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLGdCQUFnQixDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLGFBQWEsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQ08sb0NBQVMsR0FBakIsVUFBa0IsS0FBYTtZQUMzQixJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ08sb0NBQVMsR0FBakI7WUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNoQyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QyxDQUFDO1FBQ08seUNBQWMsR0FBdEI7WUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNyQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ2pDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTyx3Q0FBYSxHQUFyQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDeEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxnQkFBUyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDekIsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDcEIsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ08seUNBQWMsR0FBdEI7WUFDSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUMxRCxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDVixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNaLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNWLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN6QixDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFDRCxzQkFBWSxnQ0FBRTtpQkFBZCxjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDdEQsK0JBQUksR0FBWjtZQUNJLE9BQU8sSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDckUsQ0FBQztRQUNPLGtDQUFPLEdBQWYsVUFBZ0IsQ0FBUztZQUNyQixNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUMzRCxDQUFDO1FBQ08sbUNBQVEsR0FBaEIsVUFBaUIsQ0FBUztZQUN0QixNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFBO1FBQy9CLENBQUM7UUFDTyx5Q0FBYyxHQUF0QixVQUF1QixDQUFTO1lBQzVCLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO1FBQ3hELENBQUM7UUFDTyxxQ0FBVSxHQUFsQixVQUFtQixDQUFTO1lBQ3hCLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7UUFDaEMsQ0FBQztRQUNPLHFDQUFVLEdBQWxCO1lBQ0ksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDeEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNwQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLE9BQU8sSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUFDLEtBQUssQ0FBQztnQkFDL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7d0JBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN6QixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2IsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUFDLEtBQUssQ0FBQztvQkFDdkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQUMsS0FBSyxDQUFDO2dCQUN4QyxDQUFDO2dCQUNELElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNkLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEtBQUssQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2xDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ04sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUMsR0FBRyxFQUFFLENBQUM7b0JBQzlDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNPLDZDQUFrQixHQUExQixVQUEyQixFQUFVO1lBQ2pDLE1BQU0sQ0FBQyxFQUFFLElBQUksT0FBTyxJQUFJLEVBQUUsSUFBSSxVQUFVLENBQUM7UUFDN0MsQ0FBQztRQUNPLHVDQUFZLEdBQXBCO1lBQ0ksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDckIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQztnQkFBQyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQztnQkFBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDO2dCQUFDLEVBQUUsR0FBRyxhQUFhLENBQUM7WUFDakQsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDO2dCQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDO2dCQUFDLEVBQUUsR0FBRyxVQUFVLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLFNBQVMsQ0FBQztnQkFBQyxFQUFFLEdBQUcsVUFBVSxDQUFDO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUM7Z0JBQUMsRUFBRSxHQUFHLGFBQWEsQ0FBQztZQUMzQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUNPLHlDQUFjLEdBQXRCO1lBQ0ksSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUM7Z0JBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUM7Z0JBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUM7Z0JBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztZQUM1QyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNPLHlDQUFjLEdBQXRCO1lBQ0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxvQkFBYSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUNPLHdDQUFhLEdBQXJCO1lBQ0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDTyx1Q0FBWSxHQUFwQixVQUFxQixDQUFZO1lBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBQ08sd0NBQWEsR0FBckIsVUFBc0IsR0FBVztZQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1lBQy9CLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDbEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztvQkFDM0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxvQkFBYSxFQUFFLENBQUM7b0JBQ2xDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO29CQUM1QixPQUFPLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQyxJQUFJLE9BQU8sR0FBRyxJQUFJLG9CQUFhLEVBQUUsQ0FBQztvQkFDbEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNqQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFDeEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0wsdUJBQUM7SUFBRCxDQXhOQSxBQXdOQyxJQUFBO0lBeE5ZLHVCQUFnQixtQkF3TjVCLENBQUE7QUFDTCxDQUFDLEVBMU5NLE1BQU0sS0FBTixNQUFNLFFBME5aOztBQ2xPRDs7OztFQUlFO0FBRUYsNENBQTRDO0FBRTVDLElBQU8sTUFBTSxDQXVIWjtBQXZIRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBRVg7UUFBQTtZQWtCWSxZQUFPLEdBQVcsT0FBTyxDQUFDO1FBd0J0QyxDQUFDO1FBeENHLHNCQUFXLHNCQUFTO2lCQUFwQjtnQkFDSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQztvQkFBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztnQkFDdEUsU0FBUyxDQUFDLGNBQWMsR0FBRztvQkFDdkIsS0FBSyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxRQUFRLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELEtBQUssRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxRQUFRLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsUUFBUSxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDaEcsV0FBVyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RHLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN4RCxJQUFJLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDckQsY0FBYyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLFdBQVcsRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUks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OztBQUVGLDRDQUE0QztBQUM1QywyQ0FBMkM7QUFDM0MsSUFBTyxNQUFNLENBS1o7QUFMRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFBd0Msc0NBQXNCO1FBQTlEO1lBQXdDLDhCQUFzQjtRQUc5RCxDQUFDO1FBRkcsc0JBQWMsb0NBQUk7aUJBQWxCLGNBQStCLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQ3pELFVBQW1CLEtBQWEsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7V0FETjtRQUU3RCx5QkFBQztJQUFELENBSEEsQUFHQyxDQUh1Qyw2QkFBc0IsR0FHN0Q7SUFIWSx5QkFBa0IscUJBRzlCLENBQUE7QUFDTCxDQUFDLEVBTE0sTUFBTSxLQUFOLE1BQU0sUUFLWiIsImZpbGUiOiJzdXJ2ZXkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuICAgIG1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBIYXNoVGFibGU8VD4ge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IFQ7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdXJ2ZXlEYXRhIHtcclxuICAgICAgICBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbiAgICAgICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTtcclxuICAgICAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZztcclxuICAgICAgICBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZyk7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdXJ2ZXkgZXh0ZW5kcyBJU3VydmV5RGF0YSB7XHJcbiAgICAgICAgY3VycmVudFBhZ2U6IElQYWdlO1xyXG4gICAgICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IElRdWVzdGlvbiwgaW5kZXg6IG51bWJlcik7XHJcbiAgICAgICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pO1xyXG4gICAgICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3I7XHJcbiAgICAgICAgcHJvY2Vzc0h0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgICAgIHByb2Nlc3NUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZztcclxuICAgICAgICBpc0Rlc2lnbk1vZGU6IGJvb2xlYW47XHJcbiAgICAgICAgcmVxdWlyZWRUZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcXVlc3Rpb25TdGFydEluZGV4OiBzdHJpbmc7XHJcbiAgICAgICAgcXVlc3Rpb25UaXRsZVRlbXBsYXRlOiBzdHJpbmc7XHJcbiAgICAgICAgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW47XHJcbiAgICAgICAgdXBsb2FkRmlsZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbiwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZykgPT4gYW55KTogYm9vbGVhbjtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICAgICAgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUXVlc3Rpb24gZXh0ZW5kcyBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgICAgICBoYXNUaXRsZTogYm9vbGVhbjtcclxuICAgICAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcik7XHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSk7XHJcbiAgICAgICAgb25TdXJ2ZXlMb2FkKCk7XHJcbiAgICAgICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKTogYm9vbGVhbjtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVBhZ2UgZXh0ZW5kcyBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBJdGVtVmFsdWUge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU2VwYXJhdG9yID0gJ3wnO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0RGF0YShpdGVtczogQXJyYXk8SXRlbVZhbHVlPiwgdmFsdWVzOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBJdGVtVmFsdWUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZS52YWx1ZSkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50ZXh0ID0gdHlwZW9mICh2YWx1ZS5oYXNUZXh0KSAhPT0gJ3VuZGVmaW5lZCcgPyB2YWx1ZS5pdGVtVGV4dCA6IHZhbHVlW1widGV4dFwiXTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWVbXCJ2YWx1ZVwiXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldERhdGEoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4pOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5oYXNUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyB2YWx1ZTogaXRlbS52YWx1ZSwgdGV4dDogaXRlbS50ZXh0IH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGl0ZW1WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgaXRlbVRleHQ6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCB0ZXh0OiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiaXRlbXZhbHVlXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLml0ZW1WYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXRlbVZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBzdHI6IHN0cmluZyA9IHRoaXMuaXRlbVZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHN0ci5pbmRleE9mKEl0ZW1WYWx1ZS5TZXBhcmF0b3IpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWUgPSBzdHIuc2xpY2UoMCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gc3RyLnNsaWNlKGluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUZXh0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pdGVtVGV4dCA/IHRydWUgOiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNUZXh0KSByZXR1cm4gdGhpcy5pdGVtVGV4dDtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUpIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRleHQobmV3VGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVRleHQgPSBuZXdUZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQmFzZSB7XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgRXZlbnQ8VCBleHRlbmRzIEZ1bmN0aW9uLCBPcHRpb25zPiAge1xyXG4gICAgICAgIHByaXZhdGUgY2FsbGJhY2tzOiBBcnJheTxUPjtcclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmNhbGxiYWNrcyA9PSBudWxsIHx8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICAgICAgcHVibGljIGZpcmUoc2VuZGVyOiBhbnksIG9wdGlvbnM6IE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYWxsUmVzdWx0ID0gdGhpcy5jYWxsYmFja3NbaV0oc2VuZGVyLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZChmdW5jOiBUKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IG5ldyBBcnJheTxUPigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goZnVuYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW1vdmUoZnVuYzogVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNhbGxiYWNrcy5pbmRleE9mKGZ1bmMsIDApO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgcHJpdmF0ZSB0eXBlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBjaG9pY2VzVmFsdWU6IEFycmF5PGFueT4gPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc2Z1bmM6ICgpID0+IEFycmF5PGFueT4gPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGNsYXNzTmFtZVBhcnQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGRlZmF1bHRWYWx1ZTogYW55ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgb25HZXRWYWx1ZTogKG9iajogYW55KSA9PiBhbnkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBvblNldFZhbHVlOiAob2JqOiBhbnksIHZhbHVlOiBhbnksIGpzb25Db252OiBKc29uT2JqZWN0KSA9PiBhbnlcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudHlwZVZhbHVlID8gdGhpcy50eXBlVmFsdWUgOiBcInN0cmluZ1wiOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50eXBlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVG9Vc2VHZXRWYWx1ZSgpIHsgcmV0dXJuIHRoaXMub25HZXRWYWx1ZTsgfSBcclxuICAgICAgICBwdWJsaWMgaXNEZWZhdWx0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuZGVmYXVsdFZhbHVlKSA/ICh0aGlzLmRlZmF1bHRWYWx1ZSA9PSB2YWx1ZSkgOiAhKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFZhbHVlKG9iajogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25HZXRWYWx1ZSkgcmV0dXJuIHRoaXMub25HZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUb1VzZVNldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vblNldFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldFZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2V0VmFsdWUob2JqLCB2YWx1ZSwganNvbkNvbnYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRPYmpUeXBlKG9ialR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2xhc3NOYW1lUGFydCkgcmV0dXJuIG9ialR5cGU7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmpUeXBlLnJlcGxhY2UodGhpcy5jbGFzc05hbWVQYXJ0LCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5jbGFzc05hbWVQYXJ0ICYmIGNsYXNzTmFtZS5pbmRleE9mKHRoaXMuY2xhc3NOYW1lUGFydCkgPCAwKSA/IGNsYXNzTmFtZSArIHRoaXMuY2xhc3NOYW1lUGFydCA6IGNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzZnVuYyAhPSBudWxsKSByZXR1cm4gdGhpcy5jaG9pY2VzZnVuYygpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldENob2ljZXModmFsdWU6IEFycmF5PGFueT4sIHZhbHVlRnVuYzogKCkgPT4gQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXNmdW5jID0gdmFsdWVGdW5jO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgc3RhdGljIHJlcXVpcmVkU3ltYm9sID0gJyEnO1xyXG4gICAgICAgIHN0YXRpYyB0eXBlU3ltYm9sID0gJzonO1xyXG4gICAgICAgIHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4gPSBudWxsO1xyXG4gICAgICAgIHJlcXVpcmVkUHJvcGVydGllczogQXJyYXk8c3RyaW5nPiA9IG51bGw7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHJvcGVydGllczogQXJyYXk8YW55PiwgcHVibGljIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmNyZWF0ZVByb3BlcnR5KHByb3BlcnRpZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMucHVzaChwcm9wKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmluZChuYW1lOiBzdHJpbmcpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcGVydGllc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUHJvcGVydHkocHJvcEluZm86IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSB0eXBlb2YgcHJvcEluZm8gPT09IFwic3RyaW5nXCIgPyBwcm9wSW5mbyA6IHByb3BJbmZvLm5hbWU7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHlOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgdHlwZUluZGV4ID0gcHJvcGVydHlOYW1lLmluZGV4T2YoSnNvbk1ldGFkYXRhQ2xhc3MudHlwZVN5bWJvbCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlUeXBlID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZyh0eXBlSW5kZXggKyAxKTtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHJpbmcoMCwgdHlwZUluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgcHJvcCA9IG5ldyBKc29uT2JqZWN0UHJvcGVydHkocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcEluZm8gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcEluZm8udHlwZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5kZWZhdWx0VmFsdWUgPSBwcm9wSW5mby5kZWZhdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLmlzUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3AubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8uY2hvaWNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaG9pY2VzRnVuYyA9IHR5cGVvZiBwcm9wSW5mby5jaG9pY2VzID09PSBcImZ1bmN0aW9uXCIgPyBwcm9wSW5mby5jaG9pY2VzIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hvaWNlc1ZhbHVlID0gdHlwZW9mIHByb3BJbmZvLmNob2ljZXMgIT09IFwiZnVuY3Rpb25cIiA/IHByb3BJbmZvLmNob2ljZXMgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3Auc2V0Q2hvaWNlcyhjaG9pY2VzVmFsdWUsIGNob2ljZXNGdW5jKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5vbkdldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5vbkdldFZhbHVlID0gcHJvcEluZm8ub25HZXRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5vblNldFZhbHVlID0gcHJvcEluZm8ub25TZXRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLmNsYXNzTmFtZSA9IHByb3BJbmZvLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5iYXNlQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5iYXNlQ2xhc3NOYW1lID0gcHJvcEluZm8uYmFzZUNsYXNzTmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5jbGFzc05hbWVQYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5jbGFzc05hbWVQYXJ0ID0gcHJvcEluZm8uY2xhc3NOYW1lUGFydDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHlOYW1lLmxlbmd0aCA9PSAwIHx8IHByb3BlcnR5TmFtZVswXSAhPSBKc29uTWV0YWRhdGFDbGFzcy5yZXF1aXJlZFN5bWJvbCkgcmV0dXJuIHByb3BlcnR5TmFtZTtcclxuICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB0aGlzLm1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbWFrZVByb3BlcnR5UmVxdWlyZWQocHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhIHtcclxuICAgICAgICBwcml2YXRlIGNsYXNzZXM6IEhhc2hUYWJsZTxKc29uTWV0YWRhdGFDbGFzcz4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGNoaWxkcmVuQ2xhc3NlczogSGFzaFRhYmxlPEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPj4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGNsYXNzUHJvcGVydGllczogSGFzaFRhYmxlPEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc1JlcXVpcmVkUHJvcGVydGllczogSGFzaFRhYmxlPEFycmF5PHN0cmluZz4+ID0ge307XHJcbiAgICAgICAgcHVibGljIGFkZENsYXNzKG5hbWU6IHN0cmluZywgcHJvcGVydGllczogQXJyYXk8YW55PiwgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllcywgY3JlYXRvciwgcGFyZW50TmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3Nlc1tuYW1lXSA9IG1ldGFEYXRhQ2xhc3M7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXTtcclxuICAgICAgICAgICAgICAgIGlmICghY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV0ucHVzaChtZXRhRGF0YUNsYXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG92ZXJyaWRlQ2xhc3NDcmVhdG9yZShuYW1lOiBzdHJpbmcsIGNyZWF0b3I6ICgpID0+IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcykge1xyXG4gICAgICAgICAgICAgICAgbWV0YURhdGFDbGFzcy5jcmVhdG9yID0gY3JlYXRvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjcmVhdGVDbGFzcyhuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcy5jcmVhdG9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiwgcmVzdWx0OiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4pIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbkNsYXNzZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjYW5CZUNyZWF0ZWQgfHwgY2hpbGRyZW5baV0uY3JlYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhjaGlsZHJlbltpXS5uYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaW5kQ2xhc3MobmFtZTogc3RyaW5nKTogSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2VzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pikge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUHJvcGVydGllcyhtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUsIGxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFByb3BlcnR5KG1ldGFEYXRhQ2xhc3MucHJvcGVydGllc1tpXSwgbGlzdCwgbGlzdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkUHJvcGVydHkocHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiwgZW5kSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmRJbmRleDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdFtpXS5uYW1lID09IHByb3BlcnR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChwcm9wZXJ0eSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpc3RbaW5kZXhdID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShsaXN0LCBtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbkVycm9yIHtcclxuICAgICAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIGF0OiBOdW1iZXIgPSAtMTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRGdWxsRGVzY3JpcHRpb24oKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UgKyAodGhpcy5kZXNjcmlwdGlvbiA/IFwiXFxuXCIgKyB0aGlzLmRlc2NyaXB0aW9uIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25Vbmtub3duUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJ1bmtub3ducHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJyBpcyB1bmtub3duLlwiKTtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBsaXN0IG9mIGF2YWlsYWJsZSBwcm9wZXJ0aWVzIGFyZTogXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gcHJvcGVydGllc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSAnLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHR5cGUsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJUaGUgZm9sbG93aW5nIHR5cGVzIGFyZSBhdmFpbGFibGU6IFwiO1xyXG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhiYXNlQ2xhc3NOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLCBcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gXCInXCIgKyB0eXBlc1tpXS5uYW1lICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIi5cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3IgZXh0ZW5kcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcIm1pc3Npbmd0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBtaXNzaW5nIGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbkluY29ycmVjdFR5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwiaW5jb3JyZWN0dHlwZXByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5IHR5cGUgaXMgaW5jb3JyZWN0IGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJyZXF1aXJlZHByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBpcyByZXF1aXJlZCBpbiBjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk9iamVjdCB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdHlwZVByb3BlcnR5TmFtZSA9IFwidHlwZVwiO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHBvc2l0aW9uUHJvcGVydHlOYW1lID0gXCJwb3NcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtZXRhRGF0YVZhbHVlID0gbmV3IEpzb25NZXRhZGF0YSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IG1ldGFEYXRhKCkgeyByZXR1cm4gSnNvbk9iamVjdC5tZXRhRGF0YVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGVycm9ycyA9IG5ldyBBcnJheTxKc29uRXJyb3I+KCk7XHJcbiAgICAgICAgcHVibGljIHRvSnNvbk9iamVjdChvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvSnNvbk9iamVjdENvcmUob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHRvT2JqZWN0KGpzb25PYmo6IGFueSwgb2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFqc29uT2JqKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG9iai5nZXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBqc29uT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IobmV3IEpzb25Vbmtub3duUHJvcGVydHlFcnJvcihrZXkudG9TdHJpbmcoKSwgb2JqLmdldFR5cGUoKSksIGpzb25PYmopOyBcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb09iaihqc29uT2JqW2tleV0sIG9iaiwga2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHRvSnNvbk9iamVjdENvcmUob2JqOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW9iai5nZXRUeXBlKSByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmICghcHJvcGVydHkuY2xhc3NOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eS5nZXRPYmpUeXBlKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvSnNvbihvYmosIHJlc3VsdCwgcHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9Kc29uKG9iajogYW55LCByZXN1bHQ6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaGFzVG9Vc2VHZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwcm9wZXJ0eS5nZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyVmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJWYWx1ZS5wdXNoKHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZVtpXSwgcHJvcGVydHkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyVmFsdWUubGVuZ3RoID4gMCA/IGFyclZhbHVlIDogbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wZXJ0eS5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvT2JqKHZhbHVlOiBhbnksIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5oYXNUb1VzZVNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eS5zZXRWYWx1ZShvYmosIHZhbHVlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9BcnJheSh2YWx1ZSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdPYmoubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlLCBuZXdPYmoubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbmV3T2JqLm5ld09iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIW5ld09iai5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVBcnJheSh2YWx1ZTogYW55KTogYm9vbGVhbiB7IHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLmluZGV4T2YoXCJBcnJheVwiKSA+IC0xOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVOZXdPYmoodmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7IG5ld09iajogbnVsbCwgZXJyb3I6IG51bGwgfTtcclxuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHZhbHVlW0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgIGlmICghY2xhc3NOYW1lICYmIHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gcHJvcGVydHkuZ2V0Q2xhc3NOYW1lKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5uZXdPYmogPSAoY2xhc3NOYW1lKSA/IEpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoY2xhc3NOYW1lKSA6IG51bGw7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IHRoaXMuY2hlY2tOZXdPYmplY3RPbkVycm9ycyhyZXN1bHQubmV3T2JqLCB2YWx1ZSwgcHJvcGVydHksIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tOZXdPYmplY3RPbkVycm9ycyhuZXdPYmo6IGFueSwgdmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBKc29uRXJyb3Ige1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAobmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZWRQcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRSZXF1aXJlZFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcXVpcmVkUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlW3JlcXVpcmVkUHJvcGVydGllc1tpXV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IocmVxdWlyZWRQcm9wZXJ0aWVzW2ldLCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuYmFzZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25NaXNzaW5nVHlwZUVycm9yKHByb3BlcnR5Lm5hbWUsIHByb3BlcnR5LmJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25JbmNvcnJlY3RUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihlcnJvciwgdmFsdWUpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkTmV3RXJyb3IoZXJyb3I6IEpzb25FcnJvciwganNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uT2JqICYmIGpzb25PYmpbSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmF0ID0ganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXS5zdGFydDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZVRvQXJyYXkodmFsdWU6IEFycmF5PGFueT4sIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUFycmF5KG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZVtpXSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLm5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2gobmV3VmFsdWUubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlW2ldLCBuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2godmFsdWVbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBrZXk6IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBrZXkpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ2hvaWNlc1Jlc3RmdWxsIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgcHVibGljIHVybDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgcGF0aDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgdmFsdWVOYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyB0aXRsZU5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIGdldFJlc3VsdENhbGxiYWNrOiAoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4pID0+IHZvaWQ7XHJcbiAgICAgICAgcHVibGljIGVycm9yOiBTdXJ2ZXlFcnJvciA9IG51bGw7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBydW4oKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy51cmwgfHwgIXRoaXMuZ2V0UmVzdWx0Q2FsbGJhY2spIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHRoaXMudXJsKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkxvYWQoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkVycm9yKHhoci5zdGF0dXNUZXh0LCB4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiY2hvaWNlc0J5VXJsXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy51cmwgJiYgIXRoaXMucGF0aCAmJiAhdGhpcy52YWx1ZU5hbWUgJiYgIXRoaXMudGl0bGVOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0RGF0YShqc29uOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgICAgICBpZiAoanNvbi51cmwpIHRoaXMudXJsID0ganNvbi51cmw7XHJcbiAgICAgICAgICAgIGlmIChqc29uLnBhdGgpIHRoaXMucGF0aCA9IGpzb24ucGF0aDtcclxuICAgICAgICAgICAgaWYgKGpzb24udmFsdWVOYW1lKSB0aGlzLnZhbHVlTmFtZSA9IGpzb24udmFsdWVOYW1lO1xyXG4gICAgICAgICAgICBpZiAoanNvbi50aXRsZU5hbWUpIHRoaXMudGl0bGVOYW1lID0ganNvbi50aXRsZU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjbGVhcigpIHtcclxuICAgICAgICAgICAgdGhpcy51cmwgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLnBhdGggPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGVOYW1lID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uTG9hZChyZXN1bHQ6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy5nZXRSZXN1bHRBZnRlclBhdGgocmVzdWx0KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHRbXCJsZW5ndGhcIl0pIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1WYWx1ZSA9IHJlc3VsdFtpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0ZW1WYWx1ZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUoaXRlbVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKG5ldyBJdGVtVmFsdWUodmFsdWUsIHRpdGxlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ1cmxHZXRDaG9pY2VzRXJyb3JcIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzdWx0Q2FsbGJhY2soaXRlbXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uRXJyb3Ioc3RhdHVzOiBzdHJpbmcsIHJlc3BvbnNlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IG5ldyBDdXN0b21FcnJvcihzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwidXJsUmVxdWVzdEVycm9yXCIpW1wiZm9ybWF0XCJdKHN0YXR1cywgcmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRSZXN1bHRDYWxsYmFjayhbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UmVzdWx0QWZ0ZXJQYXRoKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucGF0aCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgdmFyIHBhdGhlcyA9IHRoaXMuZ2V0UGF0aGVzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHRbcGF0aGVzW2ldXTtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFBhdGhlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHBhdGhlcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXRoLmluZGV4T2YoJzsnKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoZXMgPSB0aGlzLnBhdGguc3BsaXQoJzsnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBhdGhlcyA9IHRoaXMucGF0aC5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwYXRoZXMubGVuZ3RoID09IDApIHBhdGhlcy5wdXNoKHRoaXMucGF0aCk7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VmFsdWUoaXRlbTogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWVOYW1lKSByZXR1cm4gaXRlbVt0aGlzLnZhbHVlTmFtZV07XHJcbiAgICAgICAgICAgIHZhciBsZW4gPSBPYmplY3Qua2V5cyhpdGVtKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChsZW4gPCAxKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bT2JqZWN0LmtleXMoaXRlbSlbMF1dO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFRpdGxlKGl0ZW06IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50aXRsZU5hbWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbVt0aGlzLnRpdGxlTmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNob2ljZXNCeVVybFwiLCBbXCJ1cmxcIiwgXCJwYXRoXCIsIFwidmFsdWVOYW1lXCIsIFwidGl0bGVOYW1lXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQ2hvaWNlc1Jlc3RmdWxsKCk7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbmRpdGlvbnMudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBDb25kaXRpb25zUGFyc2VyIHtcclxuICAgICAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHJvb3Q6IENvbmRpdGlvbk5vZGU7XHJcbiAgICAgICAgcHJpdmF0ZSBleHByZXNzaW9uTm9kZXM6IEFycmF5PENvbmRpdGlvbk5vZGU+O1xyXG4gICAgICAgIHByaXZhdGUgbm9kZTogQ29uZGl0aW9uTm9kZTtcclxuICAgICAgICBwcml2YXRlIGF0OiBudW1iZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBsZW5ndGg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgcGFyc2UodGV4dDogc3RyaW5nLCByb290OiBDb25kaXRpb25Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdC5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmF0ID0gMDtcclxuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnRleHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5wYXJzZVRleHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHRvU3RyaW5nKHJvb3Q6IENvbmRpdGlvbk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2RlVG9TdHJpbmcocm9vdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdG9TdHJpbmdDb3JlKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlW1wiY2hpbGRyZW5cIl0pIHJldHVybiB0aGlzLm5vZGVUb1N0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZVtcImxlZnRcIl0pIHJldHVybiB0aGlzLmNvbmRpdGlvblRvU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbm9kZVRvU3RyaW5nKG5vZGU6IENvbmRpdGlvbk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAobm9kZS5pc0VtcHR5KSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vZGVUZXh0ID0gdGhpcy50b1N0cmluZ0NvcmUobm9kZS5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobm9kZVRleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzKSByZXMgKz0gJyAnICsgbm9kZS5jb25uZWN0aXZlICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcyArPSBub2RlVGV4dDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm9kZSAhPSB0aGlzLnJvb3QgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXMgPSAnKCcgKyByZXMgKyAnKSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjb25kaXRpb25Ub1N0cmluZyhjb25kaXRpb246IENvbmRpdGlvbik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghY29uZGl0aW9uLnJpZ2h0IHx8ICFjb25kaXRpb24ub3BlcmF0b3IpIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IGNvbmRpdGlvbi5sZWZ0O1xyXG4gICAgICAgICAgICBpZiAobGVmdCAmJiAhdGhpcy5pc051bWVyaWMobGVmdCkpIGxlZnQgPSBcIidcIiArIGxlZnQgKyBcIidcIjtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IGxlZnQgKyAnICcgKyB0aGlzLm9wZXJhdGlvblRvU3RyaW5nKGNvbmRpdGlvbi5vcGVyYXRvcik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTm9SaWdodE9wZXJhdGlvbihjb25kaXRpb24ub3BlcmF0b3IpKSByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICB2YXIgcmlnaHQgPSBjb25kaXRpb24ucmlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChyaWdodCAmJiAhdGhpcy5pc051bWVyaWMocmlnaHQpKSByaWdodCA9IFwiJ1wiICsgcmlnaHQgKyBcIidcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcyArICcgJyArIHJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9wZXJhdGlvblRvU3RyaW5nKG9wOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gXCJlcXVhbFwiKSByZXR1cm4gXCI9XCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSBcIm5vdGVxdWFsXCIpIHJldHVybiBcIiE9XCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSBcImdyZWF0ZXJcIikgcmV0dXJuIFwiPlwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gXCJsZXNzXCIpIHJldHVybiBcIjxcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09IFwiZ3JlYXRlcm9yZXF1YWxcIikgcmV0dXJuIFwiPj1cIjtcclxuICAgICAgICAgICAgaWYgKG9wID09IFwibGVzc29yZXF1YWxcIikgcmV0dXJuIFwiPD1cIjtcclxuICAgICAgICAgICAgcmV0dXJuIG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzTnVtZXJpYyh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcGFyc2VUZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzLnB1c2godGhpcy5ub2RlKTtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMucmVhZENvbmRpdGlvbnMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcyAmJiB0aGlzLmF0ID49IHRoaXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJlYWRDb25kaXRpb25zKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5yZWFkQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgIGlmICghcmVzKSByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICB2YXIgY29ubmVjdGl2ZSA9IHRoaXMucmVhZENvbm5lY3RpdmUoKTtcclxuICAgICAgICAgICAgaWYgKGNvbm5lY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29ubmVjdGl2ZShjb25uZWN0aXZlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWRDb25kaXRpb25zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVhZENvbmRpdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlYWRFeHByZXNzaW9uKCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKCFsZWZ0KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBvcCA9IHRoaXMucmVhZE9wZXJhdG9yKCk7XHJcbiAgICAgICAgICAgIGlmICghb3ApIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGMgPSBuZXcgQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgIGMubGVmdCA9IGxlZnQ7IGMub3BlcmF0b3IgPSBvcDsgXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc05vUmlnaHRPcGVyYXRpb24ob3ApKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmlnaHQgPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGlmICghcmlnaHQpIHJldHVybiBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICBjLnJpZ2h0ID0gcmlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hZGRDb25kaXRpb24oYyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJlYWRFeHByZXNzaW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXQgPj0gdGhpcy5sZW5ndGggfHwgdGhpcy5jaCAhPSAnKCcpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmF0Kys7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaEV4cHJlc3Npb24oKTtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMucmVhZENvbmRpdGlvbnMoKTtcclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgICAgICAgICByZXMgPSB0aGlzLmNoID09ICcpJztcclxuICAgICAgICAgICAgICAgIHRoaXMuYXQrKztcclxuICAgICAgICAgICAgICAgIHRoaXMucG9wRXhwcmVzc2lvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0IGNoKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRleHQuY2hhckF0KHRoaXMuYXQpOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBza2lwKCkge1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5hdCA8IHRoaXMubGVuZ3RoICYmIHRoaXMuaXNTcGFjZSh0aGlzLmNoKSkgdGhpcy5hdCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzU3BhY2UoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjID09ICcgJyB8fCBjID09ICdcXG4nIHx8IGMgPT0gJ1xcdCcgfHwgYyA9PSAnXFxyJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1F1b3RlcyhjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGMgPT0gXCInXCIgfHwgYyA9PSAnXCInXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNPcGVyYXRvckNoYXIoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjID09ICc+JyB8fCBjID09ICc8JyB8fCBjID09ICc9JyB8fCBjID09ICchJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc0JyYWNrZXRzKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYyA9PSAnKCcgfHwgYyA9PSAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVhZFN0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXQgPj0gdGhpcy5sZW5ndGgpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLmF0O1xyXG4gICAgICAgICAgICB2YXIgaGFzUXVvdGVzID0gdGhpcy5pc1F1b3Rlcyh0aGlzLmNoKTtcclxuICAgICAgICAgICAgaWYgKGhhc1F1b3RlcykgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICB2YXIgaXNGaXJzdE9wQ2ggPSB0aGlzLmlzT3BlcmF0b3JDaGFyKHRoaXMuY2gpO1xyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5hdCA8IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc1F1b3RlcyAmJiB0aGlzLmlzU3BhY2UodGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNRdW90ZXModGhpcy5jaCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzUXVvdGVzKSB0aGlzLmF0Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc1F1b3Rlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpcnN0T3BDaCAhPSB0aGlzLmlzT3BlcmF0b3JDaGFyKHRoaXMuY2gpKSBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0JyYWNrZXRzKHRoaXMuY2gpKSBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYXQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5hdCA8PSBzdGFydCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnRleHQuc3Vic3RyKHN0YXJ0LCB0aGlzLmF0IC0gc3RhcnQpO1xyXG4gICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDEgJiYgdGhpcy5pc1F1b3RlcyhyZXNbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9IHJlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUXVvdGVzKHJlc1tyZXMubGVuZ3RoIC0gMV0pKSBsZW4tLTtcclxuICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMuc3Vic3RyKDEsIGxlbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc05vUmlnaHRPcGVyYXRpb24ob3A6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gb3AgPT0gXCJlbXB0eVwiIHx8IG9wID09IFwibm90ZW1wdHlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkT3BlcmF0b3IoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIG9wID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlmICghb3ApIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBvcCA9IG9wLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnPicpIG9wID0gXCJncmVhdGVyXCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnPCcpIG9wID0gXCJsZXNzXCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnPj0nIHx8IG9wID09ICc9PicpIG9wID0gXCJncmVhdGVyb3JlcXVhbFwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJzw9JyB8fCBvcCA9PSAnPTwnKSBvcCA9IFwibGVzc29yZXF1YWxcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09ICc9JyB8fCBvcCA9PSAnPT0nKSBvcCA9IFwiZXF1YWxcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09ICc8PicgfHwgb3AgPT0gJyE9Jykgb3AgPSBcIm5vdGVxdWFsXCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnY29udGFpbicpIG9wID0gXCJjb250YWluc1wiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJ25vdGNvbnRhaW4nKSBvcCA9IFwibm90Y29udGFpbnNcIjtcclxuICAgICAgICAgICAgcmV0dXJuIG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJlYWRDb25uZWN0aXZlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBjb24gPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKCFjb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBjb24gPSBjb24udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKGNvbiA9PSBcIiZcIiB8fCBjb24gPT0gXCImJlwiKSBjb24gPSBcImFuZFwiO1xyXG4gICAgICAgICAgICBpZiAoY29uID09IFwifFwiIHx8IGNvbiA9PSBcInx8XCIpIGNvbiA9IFwib3JcIjtcclxuICAgICAgICAgICAgaWYgKGNvbiAhPSBcImFuZFwiICYmIGNvbiAhPSBcIm9yXCIpIGNvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBjb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcHVzaEV4cHJlc3Npb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uTm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwb3BFeHByZXNzaW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZXhwcmVzc2lvbk5vZGVzLnBvcCgpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmV4cHJlc3Npb25Ob2Rlc1t0aGlzLmV4cHJlc3Npb25Ob2Rlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2gobm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkQ29uZGl0aW9uKGM6IENvbmRpdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChjKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRDb25uZWN0aXZlKGNvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNvbm5lY3RpdmUgPSBjb247XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2RlLmNvbm5lY3RpdmUgIT0gY29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZENvbiA9IHRoaXMubm9kZS5jb25uZWN0aXZlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRDaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY29ubmVjdGl2ZSA9IGNvbjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkTm9kZSA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkTm9kZS5jb25uZWN0aXZlID0gb2xkQ29uO1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZE5vZGUuY2hpbGRyZW4gPSBvbGRDaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChvbGROb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlID0gbmV3Tm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiY29uZGl0aW9uc1BhcnNlci50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ29uZGl0aW9uIHtcclxuICAgICAgICBzdGF0aWMgb3BlcmF0b3JzVmFsdWU6IEhhc2hUYWJsZTxGdW5jdGlvbj4gPSBudWxsO1xyXG4gICAgICAgIHN0YXRpYyBnZXQgb3BlcmF0b3JzKCkge1xyXG4gICAgICAgICAgICBpZiAoQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlICE9IG51bGwpIHJldHVybiBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWU7XHJcbiAgICAgICAgICAgIENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuICFsZWZ0OyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZW1wdHk6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gISghbGVmdCk7IH0sXHJcbiAgICAgICAgICAgICAgICBlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ID09IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCAhPSByaWdodDsgfSxcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgJiYgbGVmdFtcImluZGV4T2ZcIl0gJiYgbGVmdC5pbmRleE9mKHJpZ2h0KSA+IC0xOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gIWxlZnQgfHwgIWxlZnRbXCJpbmRleE9mXCJdIHx8IGxlZnQuaW5kZXhPZihyaWdodCkgPT0gLTE7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPiByaWdodDsgfSxcclxuICAgICAgICAgICAgICAgIGxlc3M6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA8IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICAgICAgZ3JlYXRlcm9yZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA+PSByaWdodDsgfSxcclxuICAgICAgICAgICAgICAgIGxlc3NvcmVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7IH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgcHVibGljIGxlZnQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgcmlnaHQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgZ2V0IG9wZXJhdG9yKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm9wVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9wZXJhdG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmICghQ29uZGl0aW9uLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBwZXJmb3JtKGxlZnQ6IGFueSA9IG51bGwsIHJpZ2h0OiBhbnkgPSBudWxsKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghbGVmdCkgbGVmdCA9IHRoaXMubGVmdDtcclxuICAgICAgICAgICAgaWYgKCFyaWdodCkgcmlnaHQgPSB0aGlzLnJpZ2h0O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNbdGhpcy5vcGVyYXRvcl0odGhpcy5nZXRQdXJlVmFsdWUobGVmdCksIHRoaXMuZ2V0UHVyZVZhbHVlKHJpZ2h0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UHVyZVZhbHVlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF2YWwgfHwgKHR5cGVvZiB2YWwgIT0gXCJzdHJpbmdcIikpIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDAgJiYgKHZhbFswXSA9PSBcIidcIiB8fCB2YWxbMF0gPT0gJ1wiJykpICB2YWwgPSB2YWwuc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gdmFsLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGxlbiA+IDAgJiYgKHZhbFtsZW4gLSAxXSA9PSBcIidcIiB8fCB2YWxbbGVuIC0gMV0gPT0gJ1wiJykpICB2YWwgPSB2YWwuc3Vic3RyKDAsIGxlbiAtIDEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBDb25kaXRpb25Ob2RlIHtcclxuICAgICAgICBwcml2YXRlIGNvbm5lY3RpdmVWYWx1ZTogc3RyaW5nID0gXCJhbmRcIjtcclxuICAgICAgICBwdWJsaWMgY2hpbGRyZW46IEFycmF5PGFueT4gPSBbXTtcclxuICAgICAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbm5lY3RpdmUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY29ubmVjdGl2ZVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb25uZWN0aXZlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcIiZcIiB8fCB2YWx1ZSA9PSBcIiYmXCIpIHZhbHVlID0gXCJhbmRcIjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IFwifFwiIHx8IHZhbHVlID09IFwifHxcIikgdmFsdWUgPSBcIm9yXCI7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBcImFuZFwiICYmIHZhbHVlICE9IFwib3JcIikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RpdmVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKSB7IHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PSAwOyB9XHJcbiAgICAgICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGl2ZSA9IFwiYW5kXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIENvbmRpdGlvblJ1bm5lciB7XHJcbiAgICAgICAgcHJpdmF0ZSBleHByZXNzaW9uVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHJvb3Q6IENvbmRpdGlvbk5vZGU7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+O1xyXG4gICAgICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5yb290ID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBleHByZXNzaW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmV4cHJlc3Npb25WYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgZXhwcmVzc2lvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmV4cHJlc3Npb24gPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5leHByZXNzaW9uVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgbmV3IENvbmRpdGlvbnNQYXJzZXIoKS5wYXJzZSh0aGlzLmV4cHJlc3Npb25WYWx1ZSwgdGhpcy5yb290KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJ1bih2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ydW5Ob2RlKHRoaXMucm9vdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcnVuTm9kZShub2RlOiBDb25kaXRpb25Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBvbkZpcnN0RmFpbCA9IG5vZGUuY29ubmVjdGl2ZSA9PSBcImFuZFwiO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnJ1bk5vZGVDb25kaXRpb24obm9kZS5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlcyAmJiBvbkZpcnN0RmFpbCkgcmV0dXJuIGZhbHNlOyBcclxuICAgICAgICAgICAgICAgIGlmIChyZXMgJiYgIW9uRmlyc3RGYWlsKSByZXR1cm4gdHJ1ZTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG9uRmlyc3RGYWlsOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBydW5Ob2RlQ29uZGl0aW9uKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVbXCJjaGlsZHJlblwiXSkgcmV0dXJuIHRoaXMucnVuTm9kZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZVtcImxlZnRcIl0pIHJldHVybiB0aGlzLnJ1bkNvbmRpdGlvbih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBydW5Db25kaXRpb24oY29uZGl0aW9uOiBDb25kaXRpb24pOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBjb25kaXRpb24ubGVmdDtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldFZhbHVlTmFtZShsZWZ0KTtcclxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghKG5hbWUgaW4gdGhpcy52YWx1ZXMpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gdGhpcy52YWx1ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gY29uZGl0aW9uLnJpZ2h0O1xyXG4gICAgICAgICAgICBuYW1lID0gdGhpcy5nZXRWYWx1ZU5hbWUocmlnaHQpO1xyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEobmFtZSBpbiB0aGlzLnZhbHVlcykpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy52YWx1ZXNbbmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbmRpdGlvbi5wZXJmb3JtKGxlZnQsIHJpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWYWx1ZU5hbWUobm9kZVZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFub2RlVmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5vZGVWYWx1ZSAhPT0gJ3N0cmluZycpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAobm9kZVZhbHVlLmxlbmd0aCA8IDMgfHwgbm9kZVZhbHVlWzBdICE9ICd7JyB8fCBub2RlVmFsdWVbbm9kZVZhbHVlLmxlbmd0aCAtIDFdICE9ICd9JykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlVmFsdWUuc3Vic3RyKDEsIG5vZGVWYWx1ZS5sZW5ndGggLSAyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgZHhTdXJ2ZXlTZXJ2aWNlIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VVcmw6IHN0cmluZyA9IFwiaHR0cHM6Ly9keHN1cnZleWFwaS5henVyZXdlYnNpdGVzLm5ldC9hcGkvU3VydmV5XCI7XHJcbiAgICAgICAgLy9wdWJsaWMgc3RhdGljIHNlcnZpY2VVcmw6IHN0cmluZyA9IFwiaHR0cDovL2xvY2FsaG9zdDo1MDQ4OC9hcGkvU3VydmV5XCI7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcsIG9uTG9hZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9nZXRTdXJ2ZXk/c3VydmV5SWQ9JyArIHN1cnZleUlkKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBvbkxvYWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNlbmRSZXN1bHQocG9zdElkOiBzdHJpbmcsIHJlc3VsdDogSlNPTiwgb25TZW5kUmVzdWx0OiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSk9PiB2b2lkLCBjbGllbnRJZDogc3RyaW5nID0gbnVsbCwgaXNQYXJ0aWFsQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignUE9TVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9wb3N0LycpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB7IHBvc3RJZDogcG9zdElkLCBzdXJ2ZXlSZXN1bHQ6IEpTT04uc3RyaW5naWZ5KHJlc3VsdCkgfTtcclxuICAgICAgICAgICAgaWYgKGNsaWVudElkKSBkYXRhWydjbGllbnRJZCddID0gY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIGlmIChpc1BhcnRpYWxDb21wbGV0ZWQpIGRhdGFbJ2lzUGFydGlhbENvbXBsZXRlZCddID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIGRhdGFTdHJpbmdpZnk6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghb25TZW5kUmVzdWx0KSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBvblNlbmRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKGRhdGFTdHJpbmdpZnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZEZpbGUocG9zdElkOiBzdHJpbmcsIGZpbGU6IEZpbGUsIG9uU2VuZEZpbGU6IChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvblNlbmRGaWxlKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBvblNlbmRGaWxlKHhoci5zdGF0dXMgPT0gMjAwLCBKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL3VwbG9hZC8nLCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XHJcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInBvc3RJZFwiLCBwb3N0SWQpO1xyXG4gICAgICAgICAgICB4aHIuc2VuZChmb3JtRGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBvbkdldFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIGRhdGE6IGFueSwgZGF0YUxpc3Q6IEFycmF5PGFueT4sIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJm5hbWU9JyArIG5hbWU7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0UmVzdWx0PycgKyBkYXRhKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXN1bHQuUXVlc3Rpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0geyBuYW1lOiBrZXksIHZhbHVlOiByZXN1bHQuUXVlc3Rpb25SZXN1bHRba2V5XSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9uR2V0UmVzdWx0KHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIGxpc3QsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBpc0NvbXBsZXRlZChyZXN1bHRJZDogc3RyaW5nLCBjbGllbnRJZDogc3RyaW5nLCBvbklzQ29tcGxldGVkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJmNsaWVudElkPScgKyBjbGllbnRJZDtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9pc0NvbXBsZXRlZD8nICsgZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb25Jc0NvbXBsZXRlZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCB2YXIgc3VydmV5TG9jYWxpemF0aW9uID0ge1xyXG4gICAgICAgIGN1cnJlbnRMb2NhbGU6IFwiXCIsXHJcbiAgICAgICAgbG9jYWxlczoge30sXHJcbiAgICAgICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2MgPSB0aGlzLmN1cnJlbnRMb2NhbGUgPyB0aGlzLmxvY2FsZXNbdGhpcy5jdXJyZW50TG9jYWxlXSA6IHN1cnZleVN0cmluZ3M7XHJcbiAgICAgICAgICAgIGlmICghbG9jIHx8ICFsb2Nbc3RyTmFtZV0pIGxvYyA9IHN1cnZleVN0cmluZ3M7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2Nbc3RyTmFtZV07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRMb2NhbGVzOiBmdW5jdGlvbiAoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICAgICAgcmVzLnB1c2goXCJcIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxvY2FsZXMpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzLnNvcnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgZXhwb3J0IHZhciBzdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICAgIHBhZ2VQcmV2VGV4dDogXCJQcmV2aW91c1wiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCJOZXh0XCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcIkNvbXBsZXRlXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJPdGhlciAoZGVzY3JpYmUpXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2UgezB9IG9mIHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcIlRoZXJlIGlzIG5vIGFueSB2aXNpYmxlIHBhZ2Ugb3IgdmlzaWJsZSBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LlwiLFxyXG4gICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiVGhhbmsgWW91IGZvciBDb21wbGV0aW5nIHRoZSBTdXJ2ZXkhXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCJTdXJ2ZXkgaXMgbG9hZGluZyBmcm9tIHRoZSBzZXJ2ZXIuLi5cIixcclxuICAgICAgICBvcHRpb25zQ2FwdGlvbjogXCJDaG9vc2UuLi5cIixcclxuICAgICAgICByZXF1aXJlZEVycm9yOiBcIlBsZWFzZSBhbnN3ZXIgdGhlIHF1ZXN0aW9uLlwiLFxyXG4gICAgICAgIG51bWVyaWNFcnJvcjogXCJUaGUgdmFsdWUgc2hvdWxkIGJlIGEgbnVtZXJpYy5cIixcclxuICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcIlBsZWFzZSBlbnRlciBhdCBsZWFzdCB7MH0gc3ltYm9scy5cIixcclxuICAgICAgICBtaW5Sb3dDb3VudEVycm9yOiBcIlBsZWFzZSBmaWxsIGF0IGxlYXN0IHswfSByb3dzLlwiLFxyXG4gICAgICAgIG1pblNlbGVjdEVycm9yOiBcIlBsZWFzZSBzZWxlY3QgYXQgbGVhc3QgezB9IHZhcmlhbnRzLlwiLFxyXG4gICAgICAgIG1heFNlbGVjdEVycm9yOiBcIlBsZWFzZSBzZWxlY3Qgbm90IG1vcmUgdGhhbiB7MH0gdmFyaWFudHMuXCIsXHJcbiAgICAgICAgbnVtZXJpY01pbk1heDogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIG1vcmUgdGhhbiB7MX0gYW5kIGVxdWFsIG9yIGxlc3MgdGhhbiB7Mn1cIixcclxuICAgICAgICBudW1lcmljTWluOiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfVwiLFxyXG4gICAgICAgIG51bWVyaWNNYXg6IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBsZXNzIHRoYW4gezF9XCIsXHJcbiAgICAgICAgaW52YWxpZEVtYWlsOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGUtbWFpbC5cIixcclxuICAgICAgICB1cmxSZXF1ZXN0RXJyb3I6IFwiVGhlIHJlcXVlc3QgcmV0dXJuIGVycm9yICd7MH0nLiB7MX1cIixcclxuICAgICAgICB1cmxHZXRDaG9pY2VzRXJyb3I6IFwiVGhlIHJlcXVlc3QgcmV0dXJucyBlbXB0eSBkYXRhIG9yIHRoZSAncGF0aCcgcHJvcGVydHkgaXMgaW5jb3JyZWN0XCIsXHJcbiAgICAgICAgZXhjZWVkTWF4U2l6ZTogXCJUaGUgZmlsZSBzaXplIHNob3VsZCBub3QgZXhjZWVkIHswfS5cIixcclxuICAgICAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiUGxlYXNlIGVudGVyIHRoZSBvdGhlcnMgdmFsdWUuXCIsXHJcbiAgICAgICAgdXBsb2FkaW5nRmlsZTogXCJZb3VyIGZpbGUgaXMgdXBsb2FkaW5nLiBQbGVhc2Ugd2FpdCBzZXZlcmFsIHNlY29uZHMgYW5kIHRyeSBhZ2Fpbi5cIixcclxuICAgICAgICBhZGRSb3c6IFwiQWRkIFJvd1wiLFxyXG4gICAgICAgIHJlbW92ZVJvdzogXCJSZW1vdmVcIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJlblwiXSA9IHN1cnZleVN0cmluZ3M7XHJcblxyXG4gICAgaWYgKCFTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdKSB7XHJcbiAgICAgICAgU3RyaW5nLnByb3RvdHlwZVtcImZvcm1hdFwiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgOiBtYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgQW5zd2VyUmVxdWlyZWRFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpICB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicmVxdWlyZWRFcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUmVxdXJlTnVtZXJpY0Vycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNFcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgRXhjZWVkU2l6ZUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHByaXZhdGUgbWF4U2l6ZTogbnVtYmVyO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG1heFNpemU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLm1heFNpemUgPSBtYXhTaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImV4Y2VlZE1heFNpemVcIilbXCJmb3JtYXRcIl0odGhpcy5nZXRUZXh0U2l6ZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRUZXh0U2l6ZSgpIHtcclxuICAgICAgICAgICAgdmFyIHNpemVzID0gWydCeXRlcycsICdLQicsICdNQicsICdHQicsICdUQiddO1xyXG4gICAgICAgICAgICB2YXIgZml4ZWQgPSBbMCwgMCwgMiwgMywgM107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFNpemUgPT0gMCkgcmV0dXJuICcwIEJ5dGUnO1xyXG4gICAgICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5sb2codGhpcy5tYXhTaXplKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5tYXhTaXplIC8gTWF0aC5wb3coMTAyNCwgaSk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKGZpeGVkW2ldKSArICcgJyArIHNpemVzW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQ3VzdG9tRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkJhc2UgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVF1ZXN0aW9uLCBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBxdWVzdGlvbkNvdW50ZXIgPSAxMDA7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UXVlc3Rpb25JZCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJzcV9cIiArIFF1ZXN0aW9uQmFzZS5xdWVzdGlvbkNvdW50ZXIrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGRhdGE6IElTdXJ2ZXlEYXRhO1xyXG4gICAgICAgIHByb3RlY3RlZCBzdXJ2ZXk6IElTdXJ2ZXk7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25kaXRpb25SdW5uZXI6IENvbmRpdGlvblJ1bm5lciA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHZpc2libGVJZjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwcml2YXRlIGlkVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHN0YXJ0V2l0aE5ld0xpbmU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHByaXZhdGUgdmlzaWJsZUluZGV4VmFsdWU6IG51bWJlciA9IC0xO1xyXG4gICAgICAgIHB1YmxpYyB3aWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcldpZHRoVmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHJpdmF0ZSByaWdodEluZGVudFZhbHVlOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbmRlbnQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9jdXNDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICByZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICByb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgdmlzaWJsZUluZGV4Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaWRWYWx1ZSA9IFF1ZXN0aW9uQmFzZS5nZXRRdWVzdGlvbklkKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZCg8SVF1ZXN0aW9uPnRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudmlzaWJsZUluZGV4VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUaXRsZSgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmlkVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJlbmRlcldpZHRoKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnJlbmRlcldpZHRoVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHJlbmRlcldpZHRoKHZhbDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gdGhpcy5yZW5kZXJXaWR0aCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcldpZHRoVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJpZ2h0SW5kZW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnJpZ2h0SW5kZW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHJpZ2h0SW5kZW50KHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gdGhpcy5yaWdodEluZGVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0SW5kZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZm9jdXMoKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xyXG4gICAgICAgICAgICBpZiAoIWVsIHx8ICFlbC5zY3JvbGxJbnRvVmlldykgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgZWxlbVRvcCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICAgICAgaWYgKGVsZW1Ub3AgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBlbC5zY3JvbGxJbnRvVmlldygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5mb2N1c0NhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzZXREYXRhKG5ld1ZhbHVlOiBJU3VydmV5RGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkgPSAobmV3VmFsdWUgJiYgbmV3VmFsdWVbXCJxdWVzdGlvbkFkZGVkXCJdKSA/IDxJU3VydmV5Pm5ld1ZhbHVlIDogbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5vblNldERhdGEoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGZpcmVDYWxsYmFjayhjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DcmVhdGluZygpIHsgfVxyXG4gICAgICAgIHB1YmxpYyBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmlzaWJsZUlmKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25kaXRpb25SdW5uZXIpIHRoaXMuY29uZGl0aW9uUnVubmVyID0gbmV3IENvbmRpdGlvblJ1bm5lcih0aGlzLnZpc2libGVJZik7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uUnVubmVyLmV4cHJlc3Npb24gPSB0aGlzLnZpc2libGVJZjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jb25kaXRpb25SdW5uZXIucnVuKHZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgLy9JUXVlc3Rpb25cclxuICAgICAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9uU3VydmV5TG9hZCgpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJxdWVzdGlvbmJhc2VcIiwgW1wiIW5hbWVcIiwgeyBuYW1lOiBcInZpc2libGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIFwidmlzaWJsZUlmOnRleHRcIiwgXHJcbiAgICAgICAgeyBuYW1lOiBcIndpZHRoXCIgfSwgeyBuYW1lOiBcInN0YXJ0V2l0aE5ld0xpbmU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfSwge25hbWU6IFwiaW5kZW50Om51bWJlclwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgM119XSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25GYWN0b3J5IHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBRdWVzdGlvbkZhY3RvcnkgPSBuZXcgUXVlc3Rpb25GYWN0b3J5KCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBEZWZhdWx0Q2hvaWNlcyA9IFtcIm9uZVwiLCBcInR3b3xzZWNvbmQgdmFsdWVcIiwgXCJ0aHJlZXx0aGlyZCB2YWx1ZVwiXTtcclxuICAgICAgICBwcml2YXRlIGNyZWF0b3JIYXNoOiBIYXNoVGFibGU8KG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb25CYXNlPiA9IHt9O1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdID0gcXVlc3Rpb25DcmVhdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0QWxsVHlwZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgICAgIHZhciBjcmVhdG9yID0gdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdO1xyXG4gICAgICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0b3IobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Sb3dNb2RlbCB7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICB2aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwYWdlOiBQYWdlTW9kZWwsIHB1YmxpYyBxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi5yb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uUm93VmlzaWJpbGl0eUNoYW5nZWQoKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25zOiBBcnJheTxRdWVzdGlvbkJhc2U+ID0gW107XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHVwZGF0ZVZpc2libGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHRoaXMuY2FsY1Zpc2libGUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRXaWR0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocTogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2gocSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WaXNpYmxlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaykgdGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRXaWR0aCgpIHtcclxuICAgICAgICAgICAgdmFyIHZpc0NvdW50ID0gdGhpcy5nZXRWaXNpYmxlQ291bnQoKTtcclxuICAgICAgICAgICAgaWYgKHZpc0NvdW50ID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNRdWVzdGlvblZpc2libGUodGhpcy5xdWVzdGlvbnNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0ucmVuZGVyV2lkdGggPSB0aGlzLnF1ZXN0aW9uLndpZHRoID8gdGhpcy5xdWVzdGlvbi53aWR0aCA6IE1hdGguZmxvb3IoMTAwIC8gdmlzQ291bnQpICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLnJpZ2h0SW5kZW50ID0gY291bnRlciA8IHZpc0NvdW50IC0gMSA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvblJvd1Zpc2liaWxpdHlDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2Uub25Sb3dWaXNpYmlsaXR5Q2hhbmdlZCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWaXNpYmxlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUXVlc3Rpb25WaXNpYmxlKHRoaXMucXVlc3Rpb25zW2ldKSkgcmVzKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1F1ZXN0aW9uVmlzaWJsZShxOiBRdWVzdGlvbkJhc2UpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZS5pc1F1ZXN0aW9uVmlzaWJsZShxKTsgfSBcclxuICAgICAgICBwcml2YXRlIGNhbGNWaXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5nZXRWaXNpYmxlQ291bnQoKSA+IDA7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElQYWdlLCBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgICAgICBwcml2YXRlIHJvd1ZhbHVlczogQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4gPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgY29uZGl0aW9uUnVubmVyOiBDb25kaXRpb25SdW5uZXIgPSBudWxsO1xyXG4gICAgICAgIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IG5ldyBBcnJheTxRdWVzdGlvbkJhc2U+KCk7XHJcbiAgICAgICAgcHVibGljIGRhdGE6IElTdXJ2ZXkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyB2aXNpYmxlSWY6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgdmlzaWJsZUluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgICAgICBwcml2YXRlIG51bVZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZyA9IFwiXCIpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcm93cygpOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiB7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWVzID0gdGhpcy5idWlsZFJvd3MoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93VmFsdWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzQWN0aXZlKCkgeyByZXR1cm4gKCF0aGlzLmRhdGEpIHx8IHRoaXMuZGF0YS5jdXJyZW50UGFnZSA9PSB0aGlzOyB9XHJcbiAgICAgICAgcHVibGljIGlzUXVlc3Rpb25WaXNpYmxlKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBib29sZWFuIHsgcmV0dXJuIHF1ZXN0aW9uLnZpc2libGUgfHwgdGhpcy5pc0Rlc2lnbk1vZGU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlUm93KHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBRdWVzdGlvblJvd01vZGVsIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJvd01vZGVsKHRoaXMsIHF1ZXN0aW9uKTsgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0IGlzRGVzaWduTW9kZSgpIHsgcmV0dXJuIHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEuaXNEZXNpZ25Nb2RlOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBidWlsZFJvd3MoKTogQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFF1ZXN0aW9uUm93TW9kZWw+KCk7XHJcbiAgICAgICAgICAgIHZhciBsYXN0Um93VmlzaWJsZUluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHEgPSB0aGlzLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlUm93KHEpKTtcclxuICAgICAgICAgICAgICAgIGlmIChxLnN0YXJ0V2l0aE5ld0xpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0Um93VmlzaWJsZUluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbaV0uYWRkUXVlc3Rpb24ocSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0Um93VmlzaWJsZUluZGV4IDwgMCkgbGFzdFJvd1Zpc2libGVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2xhc3RSb3dWaXNpYmxlSW5kZXhdLmFkZFF1ZXN0aW9uKHEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0uc2V0V2lkdGgoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBvblJvd1Zpc2liaWxpdHlDaGFuZ2VkKHJvdzogUXVlc3Rpb25Sb3dNb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmUgfHwgIXRoaXMucm93VmFsdWVzKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucm93VmFsdWVzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4OyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucm93VmFsdWVzW2ldLnF1ZXN0aW9ucy5pbmRleE9mKHJvdy5xdWVzdGlvbikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93VmFsdWVzW2ldLnVwZGF0ZVZpc2libGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEucHJvY2Vzc1RleHQodGhpcy50aXRsZSkgOiB0aGlzLnRpdGxlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBudW0oKSB7IHJldHVybiB0aGlzLm51bVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBudW0odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5udW1WYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm51bVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25OdW1DaGFuZ2VkKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucGFnZVZpc2liaWxpdHlDaGFuZ2VkKHRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicGFnZVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc1Zpc2libGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSwgaW5kZXg6IG51bWJlciA9IC0xKSB7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbiA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5xdWVzdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMCwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24uc2V0RGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnF1ZXN0aW9uQWRkZWQocXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkTmV3UXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHRoaXMuZGF0YS5xdWVzdGlvblJlbW92ZWQocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2Nyb2xsVG9GaXJzdFF1ZXN0aW9uKCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlLCBmb2N1c2VPbkZpcnN0RXJyb3I6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBmaXJzdEVycm9yUXVlc3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSAmJiB0aGlzLnF1ZXN0aW9uc1tpXS5oYXNFcnJvcnMoZmlyZUNhbGxiYWNrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2VPbkZpcnN0RXJyb3IgJiYgZmlyc3RFcnJvclF1ZXN0aW9uID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RFcnJvclF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZpcnN0RXJyb3JRdWVzdGlvbikgZmlyc3RFcnJvclF1ZXN0aW9uLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbnNUb0xpc3QobGlzdDogQXJyYXk8SVF1ZXN0aW9uPiwgdmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlT25seSAmJiAhdGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5xdWVzdGlvbnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmlzaWJsZUlmKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb25kaXRpb25SdW5uZXIpIHRoaXMuY29uZGl0aW9uUnVubmVyID0gbmV3IENvbmRpdGlvblJ1bm5lcih0aGlzLnZpc2libGVJZik7XHJcbiAgICAgICAgICAgIHRoaXMuY29uZGl0aW9uUnVubmVyLmV4cHJlc3Npb24gPSB0aGlzLnZpc2libGVJZjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jb25kaXRpb25SdW5uZXIucnVuKHZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbk51bUNoYW5nZWQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJwYWdlXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInF1ZXN0aW9uc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInF1ZXN0aW9uXCIgfSwgeyBuYW1lOiBcInZpc2libGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIFwidmlzaWJsZUlmXCIsIFwidGl0bGVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQYWdlTW9kZWwoKTsgfSk7XHJcbiB9IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImVycm9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogYW55LCBwdWJsaWMgZXJyb3I6IFN1cnZleUVycm9yID0gbnVsbCkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZhbGlkYXRvciBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0KSByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0RXJyb3JUZXh0KG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPjtcclxuICAgICAgICB2YWx1ZTogYW55O1xyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZztcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBWYWxpZGF0b3JSdW5uZXIge1xyXG4gICAgICAgIHB1YmxpYyBydW4ob3duZXI6IElWYWxpZGF0b3JPd25lcik6IFN1cnZleUVycm9yIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25lci52YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yUmVzdWx0ID0gb3duZXIudmFsaWRhdG9yc1tpXS52YWxpZGF0ZShvd25lci52YWx1ZSwgb3duZXIuZ2V0VmFsaWRhdG9yVGl0bGUoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LmVycm9yKSByZXR1cm4gdmFsaWRhdG9yUmVzdWx0LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIudmFsdWUgPSB2YWxpZGF0b3JSZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgTnVtZXJpY1ZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pblZhbHVlOiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4VmFsdWU6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwibnVtZXJpY3ZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlIHx8ICF0aGlzLmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IFJlcXVyZU51bWVyaWNFcnJvcigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFZhbGlkYXRvclJlc3VsdChwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlICYmIHRoaXMubWluVmFsdWUgPiByZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFZhbHVlICYmIHRoaXMubWF4VmFsdWUgPCByZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgPyBudWxsIDogcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHZOYW1lID0gbmFtZSA/IG5hbWUgOiBcInZhbHVlXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlICYmIHRoaXMubWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01pbk1heFwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5taW5WYWx1ZSwgdGhpcy5tYXhWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taW5WYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01pblwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5taW5WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljTWF4XCIpW1wiZm9ybWF0XCJdKHZOYW1lLCB0aGlzLm1heFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzTnVtYmVyKHZhbHVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5MZW5ndGg6IG51bWJlciA9IDApIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidGV4dHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5MZW5ndGggPD0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoIDwgdGhpcy5taW5MZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ0ZXh0TWluTGVuZ3RoXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluTGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEFuc3dlckNvdW50VmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluQ291bnQ6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhDb3VudDogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJhbnN3ZXJjb3VudHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZS5jb25zdHJ1Y3RvciAhPSBBcnJheSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciBjb3VudCA9IHZhbHVlLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluQ291bnQgJiYgY291bnQgPCB0aGlzLm1pbkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQoc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1pblNlbGVjdEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluQ291bnQpKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heENvdW50ICYmIGNvdW50ID4gdGhpcy5tYXhDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtYXhTZWxlY3RFcnJvclwiKVtcImZvcm1hdFwiXSh0aGlzLm1heENvdW50KSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUmVnZXhWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyByZWdleDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJyZWdleHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucmVnZXggfHwgIXZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cCh0aGlzLnJlZ2V4KTtcclxuICAgICAgICAgICAgaWYgKHJlLnRlc3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQodmFsdWUsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBFbWFpbFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgcHJpdmF0ZSByZSA9IC9eKChbXjw+KClcXFtcXF1cXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVxcW1xcXVxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFtePD4oKVtcXF1cXC4sOzpcXHNAXFxcIl0rXFwuKStbXjw+KClbXFxdXFwuLDs6XFxzQFxcXCJdezIsfSkkL2k7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImVtYWlsdmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZS50ZXN0KHZhbHVlKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KHZhbHVlLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImludmFsaWRFbWFpbFwiKTtcclxuICAgICAgICB9XHJcbiAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5dmFsaWRhdG9yXCIsIFtcInRleHRcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm51bWVyaWN2YWxpZGF0b3JcIiwgW1wibWluVmFsdWU6bnVtYmVyXCIsIFwibWF4VmFsdWU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTnVtZXJpY1ZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0dmFsaWRhdG9yXCIsIFtcIm1pbkxlbmd0aDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBUZXh0VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImFuc3dlcmNvdW50dmFsaWRhdG9yXCIsIFtcIm1pbkNvdW50Om51bWJlclwiLCBcIm1heENvdW50Om51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFuc3dlckNvdW50VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJlZ2V4dmFsaWRhdG9yXCIsIFtcInJlZ2V4XCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUmVnZXhWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiZW1haWx2YWxpZGF0b3JcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBFbWFpbFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuIFxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgY2xhc3MgVGV4dFByZVByb2Nlc3Nvckl0ZW0ge1xyXG4gICAgICAgIHB1YmxpYyBzdGFydDogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBlbmQ6IG51bWJlcjtcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBUZXh0UHJlUHJvY2Vzc29yIHtcclxuICAgICAgICBwdWJsaWMgb25Qcm9jZXNzOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uSGFzVmFsdWU6IChuYW1lOiBzdHJpbmcpID0+IGJvb2xlYW47XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgICAgICBwdWJsaWMgcHJvY2Vzcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXRleHQpIHJldHVybiB0ZXh0O1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMub25Qcm9jZXNzKSByZXR1cm4gdGV4dDtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXRJdGVtcyh0ZXh0KTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldE5hbWUodGV4dC5zdWJzdHJpbmcoaXRlbS5zdGFydCArIDEsIGl0ZW0uZW5kKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2FuUHJvY2Vzc05hbWUobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25IYXNWYWx1ZSAmJiAhdGhpcy5vbkhhc1ZhbHVlKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMub25Qcm9jZXNzKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cigwLCBpdGVtLnN0YXJ0KSArIHZhbHVlICsgdGV4dC5zdWJzdHIoaXRlbS5lbmQgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRJdGVtcyh0ZXh0OiBzdHJpbmcpOiBBcnJheTxUZXh0UHJlUHJvY2Vzc29ySXRlbT4ge1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnQgPSAtMTtcclxuICAgICAgICAgICAgdmFyIGNoID0gJyc7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNoID0gdGV4dFtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaCA9PSAneycpIHN0YXJ0ID0gaTtcclxuICAgICAgICAgICAgICAgIGlmIChjaCA9PSAnfScpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBUZXh0UHJlUHJvY2Vzc29ySXRlbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXJ0ID0gc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0TmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUudHJpbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNhblByb2Nlc3NOYW1lKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2ggPSBuYW1lW2ldO1xyXG4gICAgICAgICAgICAgICAgLy9UT0RPXHJcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT0gJyAnIHx8IGNoID09ICctJyB8fCBjaCA9PSAnJicpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJlcnJvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ2YWxpZGF0b3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidGV4dFByZVByb2Nlc3Nvci50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb25CYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvbkNvbW1lbnQ6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGlzUmVxdWlyZWRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgaGFzQ29tbWVudFZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBoYXNPdGhlclZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBjb21tZW50VGV4dFZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHByaXZhdGUgdGV4dFByZVByb2Nlc3NvcjogVGV4dFByZVByb2Nlc3NvcjtcclxuICAgICAgICBlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPiA9IFtdO1xyXG4gICAgICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG4gICAgICAgIHZhbHVlQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgZXJyb3JzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHRpdGxlQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuICh0aGlzLnRpdGxlVmFsdWUpID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZShuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGVWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnRpdGxlQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRUaXRsZSgpIHsgcmV0dXJuIHRoaXMuc3VydmV5ICE9IG51bGwgPyB0aGlzLnN1cnZleS5wcm9jZXNzVGV4dCh0aGlzLnRpdGxlKSA6IHRoaXMudGl0bGU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGZ1bGxUaXRsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZVRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGV4dFByZVByb2Nlc3Nvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3IgPSBuZXcgVGV4dFByZVByb2Nlc3NvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vbkhhc1ZhbHVlID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5jYW5Qcm9jZXNzZWRUZXh0VmFsdWVzKG5hbWUudG9Mb3dlckNhc2UoKSk7IH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uUHJvY2VzcyA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYuZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWUpOyB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dFByZVByb2Nlc3Nvci5wcm9jZXNzKHRoaXMuc3VydmV5LnF1ZXN0aW9uVGl0bGVUZW1wbGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJlcXVpcmVUZXh0ID0gdGhpcy5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgICAgIGlmIChyZXF1aXJlVGV4dCkgcmVxdWlyZVRleHQgKz0gXCIgXCI7XHJcbiAgICAgICAgICAgIHZhciBubyA9IHRoaXMubm87XHJcbiAgICAgICAgICAgIGlmIChubykgbm8gKz0gXCIuIFwiO1xyXG4gICAgICAgICAgICByZXR1cm4gbm8gKyByZXF1aXJlVGV4dCArIHRoaXMucHJvY2Vzc2VkVGl0bGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjYW5Qcm9jZXNzZWRUZXh0VmFsdWVzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZSA9PSBcIm5vXCIgfHwgbmFtZSA9PSBcInRpdGxlXCIgfHwgbmFtZSA9PSBcInJlcXVpcmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcIm5vXCIpIHJldHVybiB0aGlzLm5vO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcInRpdGxlXCIpIHJldHVybiB0aGlzLnByb2Nlc3NlZFRpdGxlO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcInJlcXVpcmVcIikgcmV0dXJuIHRoaXMucmVxdWlyZWRUZXh0O1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzUmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzUmVxdWlyZWRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgaXNSZXF1aXJlZCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXF1aXJlZCA9PSB2YWwpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5pc1JlcXVpcmVkVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudGl0bGVDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0NvbW1lbnRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgaGFzQ29tbWVudCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRDb21tZW50KCkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5oYXNDb21tZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0NvbW1lbnQpIHRoaXMuaGFzT3RoZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb21tZW50VGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jb21tZW50VGV4dFZhbHVlID8gdGhpcy5jb21tZW50VGV4dFZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVySXRlbVRleHRcIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbW1lbnRUZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50VGV4dFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzT3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc090aGVyVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGhhc090aGVyKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydE90aGVyKCkgfHwgdGhpcy5oYXNPdGhlciA9PSB2YWwpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5oYXNPdGhlclZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikgdGhpcy5oYXNDb21tZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuaGFzT3RoZXJDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBoYXNPdGhlckNoYW5nZWQoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IG5vKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVJbmRleCA8IDApIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IDE7XHJcbiAgICAgICAgICAgIHZhciBpc051bWVyaWMgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuc3VydmV5LnF1ZXN0aW9uU3RhcnRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gdGhpcy5zdXJ2ZXkucXVlc3Rpb25TdGFydEluZGV4O1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHN0cikpIHN0YXJ0SW5kZXggPSBwYXJzZUludChzdHIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RyLmxlbmd0aCA9PSAxKSBpc051bWVyaWMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNOdW1lcmljKSByZXR1cm4gKHRoaXMudmlzaWJsZUluZGV4ICsgc3RhcnRJbmRleCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoc3RyLmNoYXJDb2RlQXQoMCkgKyB0aGlzLnZpc2libGVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uU2V0RGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uU3VydmV5VmFsdWVDaGFuZ2VkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlRnJvbURhdGEodGhpcy5nZXRWYWx1ZUNvcmUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52YWx1ZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tbWVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5nZXRDb21tZW50KCk7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21tZW50ID09IG5ld1ZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29tbWVudChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29tbWVudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRDb21tZW50KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRDb21tZW50KHRoaXMubmFtZSkgOiB0aGlzLnF1ZXN0aW9uQ29tbWVudDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZhbHVlID09IG51bGw7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvckVycm9ycyhmaXJlQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByZXF1aXJlZFRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3VydmV5ICE9IG51bGwgJiYgdGhpcy5pc1JlcXVpcmVkID8gdGhpcy5zdXJ2ZXkucmVxdWlyZWRUZXh0IDogXCJcIjsgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tGb3JFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvckxlbmd0aCA9IHRoaXMuZXJyb3JzID8gdGhpcy5lcnJvcnMubGVuZ3RoIDogMDtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoZWNrRm9yRXJyb3JzKHRoaXMuZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwICYmIHRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMucnVuVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnN1cnZleS52YWxpZGF0ZVF1ZXN0aW9uKHRoaXMubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmlyZUNhbGxiYWNrICYmIChlcnJvckxlbmd0aCAhPSB0aGlzLmVycm9ycy5sZW5ndGggfHwgZXJyb3JMZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1JlcXVpcmVkRXJyb3IoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQW5zd2VyUmVxdWlyZWRFcnJvcigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaGFzUmVxdWlyZWRFcnJvcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZCAmJiB0aGlzLmlzRW1wdHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJ1bm5lcigpLnJ1bih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZUluRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlSW5EYXRhKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZVRvRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlQ29yZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWYWx1ZUNvcmUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRWYWx1ZSh0aGlzLm5hbWUpIDogdGhpcy5xdWVzdGlvblZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldFZhbHVlQ29yZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldFZhbHVlKHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGEodmFsOiBhbnkpOiBhbnkgeyByZXR1cm4gdmFsOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhKHZhbDogYW55KTogYW55IHsgcmV0dXJuIHZhbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXROZXdDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0Q29tbWVudCh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHRoaXMucXVlc3Rpb25Db21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVF1ZXN0aW9uXHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZUZyb21EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb21tZW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIG51bGw7IH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uXCIsIFt7IG5hbWU6IFwidGl0bGU6dGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNvbW1lbnRUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLmNvbW1lbnRUZXh0VmFsdWU7IH0gfSxcclxuICAgICAgICBcImlzUmVxdWlyZWQ6Ym9vbGVhblwiLCB7IG5hbWU6IFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dmFsaWRhdG9yXCIsIGNsYXNzTmFtZVBhcnQ6IFwidmFsaWRhdG9yXCJ9XSwgbnVsbCwgXCJxdWVzdGlvbmJhc2VcIik7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlzdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25TZWxlY3RCYXNlIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHByaXZhdGUgY29tbWVudFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJvdGVjdGVkIGNhY2hlZFZhbHVlOiBhbnk7XHJcbiAgICAgICAgb3RoZXJJdGVtOiBJdGVtVmFsdWUgPSBuZXcgSXRlbVZhbHVlKFwib3RoZXJcIiwgc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVySXRlbVRleHRcIikpO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc0Zyb21Vcmw6IEFycmF5PEl0ZW1WYWx1ZT4gPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlczogQXJyYXk8SXRlbVZhbHVlPiA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXNCeVVybDogQ2hvaWNlc1Jlc3RmdWxsO1xyXG4gICAgICAgIHB1YmxpYyBvdGhlckVycm9yVGV4dDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGNob2ljZXNPcmRlclZhbHVlOiBzdHJpbmcgPSBcIm5vbmVcIjtcclxuICAgICAgICBjaG9pY2VzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzQnlVcmwgPSB0aGlzLmNyZWF0ZVJlc3RmdWxsKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzQnlVcmwuZ2V0UmVzdWx0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4pIHsgc2VsZi5vbkxvYWRDaG9pY2VzRnJvbVVybChpdGVtcykgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc090aGVyU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkgPyB0aGlzLmdldEhhc090aGVyKHRoaXMudmFsdWUpIDogdGhpcy5nZXRIYXNPdGhlcih0aGlzLmNhY2hlZFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldEhhc090aGVyKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWwgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVSZXN0ZnVsbCgpOiBDaG9pY2VzUmVzdGZ1bGwgeyByZXR1cm4gbmV3IENob2ljZXNSZXN0ZnVsbCgpOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldENvbW1lbnQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLmdldENvbW1lbnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tbWVudFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzU2V0dGluZ0NvbW1lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgc2V0Q29tbWVudChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkpXHJcbiAgICAgICAgICAgICAgICBzdXBlci5zZXRDb21tZW50KG5ld1ZhbHVlKVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NldHRpbmdDb21tZW50ICYmIG5ld1ZhbHVlICE9IHRoaXMuY29tbWVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1NldHRpbmdDb21tZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnRWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3RoZXJTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlSW5EYXRhKHRoaXMuY2FjaGVkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2V0dGluZ0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVGcm9tRGF0YSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkpIHJldHVybiBzdXBlci52YWx1ZUZyb21EYXRhKHZhbCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkVmFsdWUgPSB0aGlzLnZhbHVlRnJvbURhdGFDb3JlKHZhbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGEodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpKSByZXR1cm4gc3VwZXIudmFsdWVUb0RhdGEodmFsKTtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZWRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVUb0RhdGFDb3JlKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZUZyb21EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNVbmtub3duVmFsdWUodmFsKSkgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZSkgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50ID0gdmFsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YUNvcmUodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMub3RoZXJJdGVtLnZhbHVlICYmIHRoaXMuZ2V0Q29tbWVudCgpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLmdldENvbW1lbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaGFzVW5rbm93blZhbHVlKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMuYWN0aXZlQ2hvaWNlcztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLnZhbHVlID09IHZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlczsgfVxyXG4gICAgICAgIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY2hvaWNlc1ZhbHVlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaGFzT3RoZXJDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY2hvaWNlc09yZGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNob2ljZXNPcmRlclZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGNob2ljZXNPcmRlcihuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSB0aGlzLmNob2ljZXNPcmRlclZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc09yZGVyVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IG90aGVyVGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vdGhlckl0ZW0udGV4dDsgfVxyXG4gICAgICAgIHNldCBvdGhlclRleHQodmFsdWU6IHN0cmluZykgeyB0aGlzLm90aGVySXRlbS50ZXh0ID0gdmFsdWU7IH1cclxuICAgICAgICBnZXQgdmlzaWJsZUNob2ljZXMoKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNPdGhlciAmJiB0aGlzLmNob2ljZXNPcmRlciA9PSBcIm5vbmVcIikgcmV0dXJuIHRoaXMuYWN0aXZlQ2hvaWNlcztcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuc29ydFZpc2libGVDaG9pY2VzKHRoaXMuYWN0aXZlQ2hvaWNlcy5zbGljZSgpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3RoZXIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMub3RoZXJJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldCBhY3RpdmVDaG9pY2VzKCk6IEFycmF5PEl0ZW1WYWx1ZT4geyByZXR1cm4gdGhpcy5jaG9pY2VzRnJvbVVybCA/IHRoaXMuY2hvaWNlc0Zyb21VcmwgOiB0aGlzLmNob2ljZXM7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgICAgICBzdXBlci5vbkNoZWNrRm9yRXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc090aGVyU2VsZWN0ZWQgfHwgdGhpcy5jb21tZW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5vdGhlckVycm9yVGV4dDtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVyUmVxdWlyZWRFcnJvclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3IodGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSB7IHJldHVybiB0aGlzLnN0b3JlT3RoZXJzQXNDb21tZW50ICYmICh0aGlzLnN1cnZleSAhPSBudWxsID8gdGhpcy5zdXJ2ZXkuc3RvcmVPdGhlcnNBc0NvbW1lbnQgOiB0cnVlKTsgfVxyXG4gICAgICAgIG9uU3VydmV5TG9hZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc0J5VXJsKSB0aGlzLmNob2ljZXNCeVVybC5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvbkxvYWRDaG9pY2VzRnJvbVVybChhcnJheTogQXJyYXk8SXRlbVZhbHVlPikge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JDb3VudCA9IHRoaXMuZXJyb3JzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc0J5VXJsICYmIHRoaXMuY2hvaWNlc0J5VXJsLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHRoaXMuY2hvaWNlc0J5VXJsLmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IDAgfHwgdGhpcy5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBuZXdDaG9pY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGFycmF5ICYmIGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5ld0Nob2ljZXMgPSBuZXcgQXJyYXk8SXRlbVZhbHVlPigpO1xyXG4gICAgICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEobmV3Q2hvaWNlcywgYXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc0Zyb21VcmwgPSBuZXdDaG9pY2VzO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNvcnRWaXNpYmxlQ2hvaWNlcyhhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICB2YXIgb3JkZXIgPSB0aGlzLmNob2ljZXNPcmRlci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJhc2NcIikgcmV0dXJuIHRoaXMuc29ydEFycmF5KGFycmF5LCAxKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwiZGVzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIC0xKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwicmFuZG9tXCIpIHJldHVybiB0aGlzLnJhbmRvbWl6ZUFycmF5KGFycmF5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNvcnRBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPiwgbXVsdDogbnVtYmVyKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS50ZXh0IDwgYi50ZXh0KSByZXR1cm4gLTEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgaWYgKGEudGV4dCA+IGIudGV4dCkgcmV0dXJuIDEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJhbmRvbWl6ZUFycmF5KGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBhcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBhcnJheVtqXSA9IHRlbXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveEJhc2UgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gMTtcclxuICAgICAgICBjb2xDb3VudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzZWxlY3RiYXNlXCIsIFtcImhhc0NvbW1lbnQ6Ym9vbGVhblwiLCBcImhhc090aGVyOmJvb2xlYW5cIixcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNob2ljZXNPcmRlclwiLCBkZWZhdWx0OiBcIm5vbmVcIiwgY2hvaWNlczogW1wibm9uZVwiLCBcImFzY1wiLCBcImRlc2NcIiwgXCJyYW5kb21cIl0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlc0J5VXJsOnJlc3RmdWxsXCIsIGNsYXNzTmFtZTogXCJDaG9pY2VzUmVzdGZ1bGxcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY2hvaWNlc0J5VXJsLmlzRW1wdHkgPyBudWxsIDogb2JqLmNob2ljZXNCeVVybDsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzQnlVcmwuc2V0RGF0YSh2YWx1ZSk7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwib3RoZXJUZXh0XCIsIGRlZmF1bHQ6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpIH0sIFwib3RoZXJFcnJvclRleHRcIixcclxuICAgICAgICB7IG5hbWU6IFwic3RvcmVPdGhlcnNBc0NvbW1lbnQ6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfV0sIG51bGwsIFwicXVlc3Rpb25cIik7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94YmFzZVwiLCBbeyBuYW1lOiBcImNvbENvdW50Om51bWJlclwiLCBkZWZhdWx0OiAxLCBjaG9pY2VzOiBbMCwgMSwgMiwgMywgNF0gfV0sIG51bGwsIFwic2VsZWN0YmFzZVwiKTtcclxufVxyXG4iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRIYXNPdGhlcih2YWw6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsLmluZGV4T2YodGhpcy5vdGhlckl0ZW0udmFsdWUpID49IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZUZyb21EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsIHx8ICF2YWwubGVuZ3RoKSByZXR1cm4gdmFsO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxbaV0gPT0gdGhpcy5vdGhlckl0ZW0udmFsdWUpIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNVbmtub3duVmFsdWUodmFsW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudCA9IHZhbFtpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsID0gdmFsLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF2YWwgfHwgIXZhbC5sZW5ndGgpIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q29tbWVudCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWwgPSB2YWwuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5nZXRDb21tZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdWYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNoZWNrYm94XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94XCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ29tbWVudE1vZGVsIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHB1YmxpYyByb3dzOiBudW1iZXIgPSA0O1xyXG4gICAgICAgIHB1YmxpYyBjb2xzOiBudW1iZXIgPSA1MDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjb21tZW50XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5pc0VtcHR5KCkgfHwgdGhpcy52YWx1ZSA9PSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21tZW50XCIsIFt7IG5hbWU6IFwiY29sczpudW1iZXJcIiwgZGVmYXVsdDogNTAgfSwgeyBuYW1lOiBcInJvd3M6bnVtYmVyXCIsIGRlZmF1bHQ6IDQgfV0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNvbW1lbnRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9zZWxlY3RiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Ecm9wZG93bk1vZGVsIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgICAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCkgeyByZXR1cm4gKHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSkgPyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3B0aW9uc0NhcHRpb25cIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9wdGlvbnNDYXB0aW9uKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJkcm9wZG93blwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJkcm9wZG93blwiLCBbeyBuYW1lOiBcIm9wdGlvbnNDYXB0aW9uXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLm9wdGlvbnNDYXB0aW9uVmFsdWU7IH19XSxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Ecm9wZG93bk1vZGVsKFwiXCIpOyB9LCBcInNlbGVjdGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25GaWxlTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93UHJldmlld1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1VwbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByZXZpZXdWYWx1ZUxvYWRlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHB1YmxpYyBpbWFnZUhlaWdodDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBpbWFnZVdpZHRoOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgbWF4U2l6ZTogbnVtYmVyO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImZpbGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzaG93UHJldmlldygpIHsgcmV0dXJuIHRoaXMuc2hvd1ByZXZpZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc2hvd1ByZXZpZXcodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5zaG93UHJldmlld1ZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgbG9hZEZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSAmJiAhdGhpcy5zdXJ2ZXkudXBsb2FkRmlsZSh0aGlzLm5hbWUsIGZpbGUsIHRoaXMuc3RvcmVEYXRhQXNUZXh0LCBmdW5jdGlvbiAoc3RhdHVzOiBzdHJpbmcpIHsgc2VsZi5pc1VwbG9hZGluZyA9IHN0YXR1cyA9PSBcInVwbG9hZGluZ1wiOyAgfSkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRGaWxlVmFsdWUoZmlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBwcmV2aWV3VmFsdWU6IGFueTtcclxuICAgICAgICBwcm90ZWN0ZWQgc2V0RmlsZVZhbHVlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKCFGaWxlUmVhZGVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG93UHJldmlldyAmJiAhdGhpcy5zdG9yZURhdGFBc1RleHQpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tGaWxlRm9yRXJyb3JzKGZpbGUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zaG93UHJldmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJldmlld1ZhbHVlID0gc2VsZi5pc0ZpbGVJbWFnZShmaWxlKSA/IGZpbGVSZWFkZXIucmVzdWx0IDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpcmVDYWxsYmFjayhzZWxmLnByZXZpZXdWYWx1ZUxvYWRlZENhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnN0b3JlRGF0YUFzVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBmaWxlUmVhZGVyLnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGxvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ1cGxvYWRpbmdGaWxlXCIpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZpbGVGb3JFcnJvcnMoZmlsZTogRmlsZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JMZW5ndGggPSB0aGlzLmVycm9ycyA/IHRoaXMuZXJyb3JzLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFNpemUgPiAwICYmIGZpbGUuc2l6ZSA+IHRoaXMubWF4U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgRXhjZWVkU2l6ZUVycm9yKHRoaXMubWF4U2l6ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvckxlbmd0aCAhPSB0aGlzLmVycm9ycy5sZW5ndGggfHwgdGhpcy5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzRmlsZUltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKCFmaWxlIHx8ICFmaWxlLnR5cGUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0ciA9IGZpbGUudHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyLmluZGV4T2YoXCJpbWFnZVwiKSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJmaWxlXCIsIFtcInNob3dQcmV2aWV3OmJvb2xlYW5cIiwgXCJpbWFnZUhlaWdodFwiLCBcImltYWdlV2lkdGhcIiwgXCJzdG9yZURhdGFBc1RleHQ6Ym9vbGVhblwiLCBcIm1heFNpemU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25GaWxlTW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImZpbGVcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkZpbGVNb2RlbChuYW1lKTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25IdG1sTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgaHRtbFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiaHRtbFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGh0bWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaHRtbFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBodG1sKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5odG1sVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRIdG1sKCkgeyByZXR1cm4gdGhpcy5zdXJ2ZXkgPyB0aGlzLnN1cnZleS5wcm9jZXNzSHRtbCh0aGlzLmh0bWwpIDogdGhpcy5odG1sOyB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiaHRtbFwiLCBbXCJodG1sOmh0bWxcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkh0bWxNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvbmJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImh0bWxcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkh0bWxNb2RlbChuYW1lKTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERhdGEge1xyXG4gICAgICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvd01vZGVsKTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhSb3dNb2RlbCBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU1hdHJpeERhdGE7XHJcbiAgICAgICAgcHJvdGVjdGVkIHJvd1ZhbHVlOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnksIHB1YmxpYyB0ZXh0OiBzdHJpbmcsIHB1YmxpYyBmdWxsTmFtZTogc3RyaW5nLCBkYXRhOiBJTWF0cml4RGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLnJvd1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSkgdGhpcy5kYXRhLm9uTWF0cml4Um93Q2hhbmdlZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEYXRhIHtcclxuICAgICAgICBwcml2YXRlIGNvbHVtbnNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGdlbmVyYXRlZFZpc2libGVSb3dzOiBBcnJheTxNYXRyaXhSb3dNb2RlbD47XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93c1ZhbHVlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjb2x1bW5zKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgICAgICBzZXQgY29sdW1ucyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNvbHVtbnNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICAgICAgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yb3dzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4Um93TW9kZWw+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhSb3dNb2RlbD4oKTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KHRoaXMucm93c1tpXS52YWx1ZSwgdGhpcy5yb3dzW2ldLnRleHQsIHRoaXMubmFtZSArICdfJyArIHRoaXMucm93c1tpXS52YWx1ZS50b1N0cmluZygpLCB2YWxbdGhpcy5yb3dzW2ldLnZhbHVlXSkpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyhudWxsLCBcIlwiLCB0aGlzLm5hbWUsIHZhbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3cobmFtZTogYW55LCB0ZXh0OiBzdHJpbmcsIGZ1bGxOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBNYXRyaXhSb3dNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4Um93TW9kZWwobmFtZSwgdGV4dCwgZnVsbE5hbWUsIHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nIHx8ICEodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgfHwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yb3dzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzWzBdLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd1ZhbCA9IHZhbFtyb3cubmFtZV0gPyB2YWxbcm93Lm5hbWVdIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLnZhbHVlID0gcm93VmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lNYXRyaXhEYXRhXHJcbiAgICAgICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93TW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzUm93cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShyb3cudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWVbcm93Lm5hbWVdID0gcm93LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4XCIsIFt7IG5hbWU6IFwiY29sdW1uczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNvbHVtbnMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNvbHVtbnMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgeyBuYW1lOiBcInJvd3M6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yb3dzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yb3dzID0gdmFsdWU7IH0gfV0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeE1vZGVsKG5hbWUpOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmNvbHVtbnMgPSBbXCJDb2x1bW4gMVwiLCBcIkNvbHVtbiAyXCIsIFwiQ29sdW1uIDNcIl07IHJldHVybiBxOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYWRpb2dyb3VwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhZGlvZ3JvdXBcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7fSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMjU7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpc0VtcHR5KCk6IGJvb2xlYW4geyAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7IH1cclxuICAgICAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0XCIsIFt7IG5hbWU6IFwic2l6ZTpudW1iZXJcIiwgZGVmYXVsdDogMjUgfV0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fZHJvcGRvd24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fY2hlY2tib3gudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fcmFkaW9ncm91cC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl90ZXh0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2NvbW1lbnQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fYmFzZXNlbGVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgICAgICBvblJvd0NoYW5nZWQoY2VsbDogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIG5ld1Jvd1ZhbHVlOiBhbnkpO1xyXG4gICAgICAgIGNvbHVtbnM6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPjtcclxuICAgICAgICBjcmVhdGVRdWVzdGlvbihyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25Db2x1bW4gZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgb3B0aW9uc0NhcHRpb246IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgaXNSZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBoYXNPdGhlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBtaW5XaWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgY2VsbFR5cGU6IHN0cmluZyA9IFwiZGVmYXVsdFwiO1xyXG4gICAgICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKSB7IHJldHVybiBcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7IHJldHVybiB0aGlzLnRpdGxlVmFsdWUgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLm5hbWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sQ291bnRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAtMSB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY2hvaWNlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93bkNlbGwge1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogUXVlc3Rpb247XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHB1YmxpYyByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZSA9IGRhdGEuY3JlYXRlUXVlc3Rpb24odGhpcy5yb3csIHRoaXMuY29sdW1uKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlLnNldERhdGEocm93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbiB7IHJldHVybiB0aGlzLnF1ZXN0aW9uVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnF1ZXN0aW9uLnZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UgaW1wbGVtZW50cyBJU3VydmV5RGF0YSB7XHJcbiAgICAgICAgcHJvdGVjdGVkIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGE7XHJcbiAgICAgICAgcHJpdmF0ZSByb3dWYWx1ZXM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSByb3dDb21tZW50czogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGlzU2V0dGluZ1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBjZWxsczogQXJyYXk8TWF0cml4RHJvcGRvd25DZWxsPiA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIG51bGw7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5yb3dWYWx1ZXM7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1NldHRpbmdWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWVzID0ge307XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd1ZhbHVlc1trZXldID0gdmFsdWVba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV0ucXVlc3Rpb24ub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy5nZXRWYWx1ZSh0aGlzLmNlbGxzW2ldLmNvbHVtbi5uYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1NldHRpbmdWYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93VmFsdWVzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU2V0dGluZ1ZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gXCJcIikgbmV3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXNbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnJvd1ZhbHVlc1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEub25Sb3dDaGFuZ2VkKHRoaXMsIHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dDb21tZW50c1tuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93Q29tbWVudHNbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGJ1aWxkQ2VsbHMoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5zID0gdGhpcy5kYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbHVtbiA9IGNvbHVtbnNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2godGhpcy5jcmVhdGVDZWxsKGNvbHVtbikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBNYXRyaXhEcm9wZG93bkNlbGwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duQ2VsbChjb2x1bW4sIHRoaXMsIHRoaXMuZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY29sdW1uc1ZhbHVlOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4gPSBbXTtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVkVmlzaWJsZVJvd3M6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPjtcclxuICAgICAgICBwcml2YXRlIGNlbGxUeXBlVmFsdWU6IHN0cmluZyA9IFwiZHJvcGRvd25cIjtcclxuICAgICAgICBwcml2YXRlIGNvbHVtbkNvbENvdW50VmFsdWU6IG51bWJlciA9IDA7XHJcbiAgICAgICAgcHVibGljIGNvbHVtbk1pbldpZHRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBob3Jpem9udGFsU2Nyb2xsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHVibGljIHVwZGF0ZUNlbGxzQ2FsbGJhazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25iYXNlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29sdW1ucygpOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbHVtbnModmFsdWU6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbnNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNlbGxUeXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNlbGxUeXBlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNlbGxUeXBlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2VsbFR5cGUgPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVHlwZVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudXBkYXRlQ2VsbHNDYWxsYmFrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2x1bW5Db2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2x1bW5Db2xDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb2x1bW5Db2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY29sdW1uQ29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnVwZGF0ZUNlbGxzQ2FsbGJhayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDb2x1bW5UaXRsZShjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNvbHVtbi50aXRsZTtcclxuICAgICAgICAgICAgaWYgKGNvbHVtbi5pc1JlcXVpcmVkICYmIHRoaXMuc3VydmV5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZVRleHQgPSB0aGlzLnN1cnZleS5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZVRleHQpIHJlcXVpcmVUZXh0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVxdWlyZVRleHQgKyByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENvbHVtbldpZHRoKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uLm1pbldpZHRoID8gY29sdW1uLm1pbldpZHRoIDogdGhpcy5jb2x1bW5NaW5XaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvcHRpb25zQ2FwdGlvbigpIHsgcmV0dXJuICh0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUpID8gdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wdGlvbnNDYXB0aW9uXCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBvcHRpb25zQ2FwdGlvbihuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGFkZENvbHVtbihuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTWF0cml4RHJvcGRvd25Db2x1bW4ge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW5zVmFsdWUucHVzaChjb2x1bW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gdGhpcy5nZW5lcmF0ZVJvd3MoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZW5lcmF0ZVJvd3MoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2U+IHsgcmV0dXJuIG51bGw7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1ZhbHVlKGN1clZhbHVlOiBhbnkpOiBhbnkgeyByZXR1cm4gIWN1clZhbHVlID8ge30gOiBjdXJWYWx1ZTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRSb3dWYWx1ZShyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBxdWVzdGlvblZhbHVlOiBhbnksIGNyZWF0ZTogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHF1ZXN0aW9uVmFsdWVbcm93LnJvd05hbWVdID8gcXVlc3Rpb25WYWx1ZVtyb3cucm93TmFtZV0gOiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCAmJiBjcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25WYWx1ZVtyb3cucm93TmFtZV0gPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nIHx8ICEodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgfHwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV0udmFsdWUgPSB0aGlzLmdldFJvd1ZhbHVlKHJvdywgdmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvc0luQ29sdW1ucyA9IHRoaXMuaGFzRXJyb3JJbkNvbHVtbnMoZmlyZUNhbGxiYWNrKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spIHx8IGVycm9zSW5Db2x1bW5zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGhhc0Vycm9ySW5Db2x1bW5zKGZpcmVDYWxsYmFjazogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgY29sSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxzID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS5jZWxscztcclxuICAgICAgICAgICAgICAgICAgICByZXMgPSBjZWxscyAmJiBjZWxsc1tjb2xJbmRleF0gJiYgY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uICYmIGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbi5oYXNFcnJvcnMoZmlyZUNhbGxiYWNrKSB8fCByZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JTWF0cml4RHJvcGRvd25EYXRhXHJcbiAgICAgICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuY3JlYXRlUXVlc3Rpb25Db3JlKHJvdywgY29sdW1uKTtcclxuICAgICAgICAgICAgcXVlc3Rpb24ubmFtZSA9IGNvbHVtbi5uYW1lO1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5pc1JlcXVpcmVkID0gY29sdW1uLmlzUmVxdWlyZWQ7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLmhhc090aGVyID0gY29sdW1uLmhhc090aGVyO1xyXG4gICAgICAgICAgICBpZiAoY29sdW1uLmhhc090aGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb24gaW5zdGFuY2VvZiBRdWVzdGlvblNlbGVjdEJhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAoPFF1ZXN0aW9uU2VsZWN0QmFzZT5xdWVzdGlvbikuc3RvcmVPdGhlcnNBc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcXVlc3Rpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVRdWVzdGlvbkNvcmUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uIHtcclxuICAgICAgICAgICAgdmFyIGNlbGxUeXBlID0gY29sdW1uLmNlbGxUeXBlID09IFwiZGVmYXVsdFwiID8gdGhpcy5jZWxsVHlwZSA6IGNvbHVtbi5jZWxsVHlwZTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldFF1ZXN0aW9uTmFtZShyb3csIGNvbHVtbik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSBcImNoZWNrYm94XCIpIHJldHVybiB0aGlzLmNyZWF0ZUNoZWNrYm94KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSBcInJhZGlvZ3JvdXBcIikgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaW9ncm91cChuYW1lLCBjb2x1bW4pO1xyXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT0gXCJ0ZXh0XCIpIHJldHVybiB0aGlzLmNyZWF0ZVRleHQobmFtZSwgY29sdW1uKTtcclxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09IFwiY29tbWVudFwiKSByZXR1cm4gdGhpcy5jcmVhdGVDb21tZW50KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURyb3Bkb3duKG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRRdWVzdGlvbk5hbWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7IHJldHVybiByb3cucm93TmFtZSArIFwiX1wiICsgY29sdW1uLm5hbWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW4uY2hvaWNlcyAmJiBjb2x1bW4uY2hvaWNlcy5sZW5ndGggPiAwID8gY29sdW1uLmNob2ljZXMgOiB0aGlzLmNob2ljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRDb2x1bW5PcHRpb25zQ2FwdGlvbihjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi5vcHRpb25zQ2FwdGlvbiA/IGNvbHVtbi5vcHRpb25zQ2FwdGlvbiA6IHRoaXMub3B0aW9uc0NhcHRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVEcm9wZG93bihuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkRyb3Bkb3duTW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgcSA9IDxRdWVzdGlvbkRyb3Bkb3duTW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJkcm9wZG93blwiLCBuYW1lKTtcclxuICAgICAgICAgICAgcS5jaG9pY2VzID0gdGhpcy5nZXRDb2x1bW5DaG9pY2VzKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHEub3B0aW9uc0NhcHRpb24gPSB0aGlzLmdldENvbHVtbk9wdGlvbnNDYXB0aW9uKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlQ2hlY2tib3gobmFtZTogc3RyaW5nLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb25DaGVja2JveE1vZGVsIHtcclxuICAgICAgICAgICAgdmFyIHEgPSA8UXVlc3Rpb25DaGVja2JveE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgbmFtZSk7XHJcbiAgICAgICAgICAgIHEuY2hvaWNlcyA9IHRoaXMuZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW4pO1xyXG4gICAgICAgICAgICBxLmNvbENvdW50ID0gY29sdW1uLmNvbENvdW50ID4gLSAxID8gY29sdW1uLmNvbENvdW50IDogdGhpcy5jb2x1bW5Db2xDb3VudDtcclxuICAgICAgICAgICAgcmV0dXJuIHE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVSYWRpb2dyb3VwKG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIHtcclxuICAgICAgICAgICAgdmFyIHEgPSA8UXVlc3Rpb25SYWRpb2dyb3VwTW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJyYWRpb2dyb3VwXCIsIG5hbWUpO1xyXG4gICAgICAgICAgICBxLmNob2ljZXMgPSB0aGlzLmdldENvbHVtbkNob2ljZXMoY29sdW1uKTtcclxuICAgICAgICAgICAgcS5jb2xDb3VudCA9IGNvbHVtbi5jb2xDb3VudCA+IC0gMSA/IGNvbHVtbi5jb2xDb3VudCA6IHRoaXMuY29sdW1uQ29sQ291bnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvblRleHRNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiA8UXVlc3Rpb25UZXh0TW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJ0ZXh0XCIsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlQ29tbWVudChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkNvbW1lbnRNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiA8UXVlc3Rpb25Db21tZW50TW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJjb21tZW50XCIsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlQ2VsbFF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHJldHVybiA8UXVlc3Rpb24+UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkZWxldGVSb3dWYWx1ZShuZXdWYWx1ZTogYW55LCByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlKTogYW55IHtcclxuICAgICAgICAgICAgZGVsZXRlIG5ld1ZhbHVlW3Jvdy5yb3dOYW1lXTtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5ld1ZhbHVlKS5sZW5ndGggPT0gMCA/IG51bGwgOiBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb25Sb3dDaGFuZ2VkKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIG5ld1Jvd1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHJvd1ZhbHVlID0gdGhpcy5nZXRSb3dWYWx1ZShyb3csIG5ld1ZhbHVlLCB0cnVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJvd1ZhbHVlKSBkZWxldGUgcm93VmFsdWVba2V5XTtcclxuICAgICAgICAgICAgaWYgKG5ld1Jvd1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdSb3dWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobmV3Um93VmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBuZXdSb3dWYWx1ZSkgcm93VmFsdWVba2V5XSA9IG5ld1Jvd1ZhbHVlW2tleV07XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyb3dWYWx1ZSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5kZWxldGVSb3dWYWx1ZShuZXdWYWx1ZSwgcm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInRpdGxlXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgXCJvcHRpb25zQ2FwdGlvblwiLCB7IG5hbWU6IFwiY2VsbFR5cGVcIiwgZGVmYXVsdDogXCJkZWZhdWx0XCIsIGNob2ljZXM6IFtcImRlZmF1bHRcIiwgXCJkcm9wZG93blwiLCBcImNoZWNrYm94XCIsIFwicmFkaW9ncm91cFwiLCBcInRleHRcIiwgXCJjb21tZW50XCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNvbENvdW50XCIsIGRlZmF1bHQ6IC0xLCBjaG9pY2VzOiBbLTEsIDAsIDEsIDIsIDMsIDRdIH0sIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLCBcIm1pbldpZHRoXCJdLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNYXRyaXhEcm9wZG93bkNvbHVtbihcIlwiKTsgfSk7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duYmFzZVwiLCBbeyBuYW1lOiBcImNvbHVtbnM6bWF0cml4ZHJvcGRvd25jb2x1bW5zXCIsIGNsYXNzTmFtZTogXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiIH0sXHJcbiAgICAgICAgXCJob3Jpem9udGFsU2Nyb2xsOmJvb2xlYW5cIiwgXHJcbiAgICAgICAgeyBuYW1lOiBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH19LFxyXG4gICAgICAgIHsgbmFtZTogXCJvcHRpb25zQ2FwdGlvblwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5vcHRpb25zQ2FwdGlvblZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNlbGxUeXBlXCIsIGRlZmF1bHQ6IFwiZHJvcGRvd25cIiwgY2hvaWNlczogW1wiZHJvcGRvd25cIiwgXCJjaGVja2JveFwiLCBcInJhZGlvZ3JvdXBcIiwgXCJ0ZXh0XCIsIFwiY29tbWVudFwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjb2x1bW5Db2xDb3VudFwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgMywgNF0gfSwgXCJjb2x1bW5NaW5XaWR0aFwiXSxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZShcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fbWF0cml4ZHJvcGRvd25iYXNlLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duUm93TW9kZWwgZXh0ZW5kcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihkYXRhLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZTsgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgICAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByb3dzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5yb3dzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yb3dzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdlbmVyYXRlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbD4oKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3MgfHwgdGhpcy5yb3dzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KHRoaXMucm93c1tpXS52YWx1ZSwgdGhpcy5yb3dzW2ldLnRleHQsIHZhbFt0aGlzLnJvd3NbaV0udmFsdWVdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeERyb3Bkb3duUm93TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duUm93TW9kZWwobmFtZSwgdGV4dCwgdGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuIFxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duXCIsIFt7IG5hbWU6IFwicm93czppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLnJvd3MgPSB2YWx1ZTsgfX1dLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwoXCJcIik7IH0sIFwibWF0cml4ZHJvcGRvd25iYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFsxLCAyLCAzLCA0LCA1XTsgcS5yb3dzID0gW1wiUm93IDFcIiwgXCJSb3cgMlwiXTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMVwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMlwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gM1wiKTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHluYW1pY1Jvd01vZGVsIGV4dGVuZHMgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmRleDogbnVtYmVyLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGRhdGEsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gXCJyb3dcIiArIHRoaXMuaW5kZXg7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgICAgICBzdGF0aWMgTWF4Um93Q291bnQgPSAxMDA7XHJcbiAgICAgICAgcHJpdmF0ZSByb3dDb3VudGVyID0gMDtcclxuICAgICAgICBwcml2YXRlIHJvd0NvdW50VmFsdWU6IG51bWJlciA9IDI7XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRSb3dUZXh0VmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSByZW1vdmVSb3dUZXh0VmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG1pblJvd0NvdW50ID0gMDtcclxuICAgICAgICBwdWJsaWMgcm93Q291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHluYW1pY1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJvd0NvdW50KCkgeyByZXR1cm4gdGhpcy5yb3dDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCByb3dDb3VudCh2YWw6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsIDwgMCB8fCB2YWwgPiBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbC5NYXhSb3dDb3VudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJvd0NvdW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUubGVuZ3RoID4gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcVZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBxVmFsLnNwbGljZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHFWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yb3dDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRSb3coKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3cobnVsbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucm93Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbW92ZVJvdyhpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5yb3dDb3VudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiBpbmRleCA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFsLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLmRlbGV0ZVJvd1ZhbHVlKHZhbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucm93Q291bnQtLTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBhZGRSb3dUZXh0KCkgeyByZXR1cm4gdGhpcy5hZGRSb3dUZXh0VmFsdWUgPyB0aGlzLmFkZFJvd1RleHRWYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJhZGRSb3dcIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGFkZFJvd1RleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFJvd1RleHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJlbW92ZVJvd1RleHQoKSB7IHJldHVybiB0aGlzLnJlbW92ZVJvd1RleHRWYWx1ZSA/IHRoaXMucmVtb3ZlUm93VGV4dFZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInJlbW92ZVJvd1wiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgcmVtb3ZlUm93VGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUm93VGV4dFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY2FjaGVkVmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2U+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgJiYgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gdGhpcy5yb3dDb3VudCkgcmV0dXJuIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2libGVSb3dzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgICAgICBzdXBlci5vbkNoZWNrRm9yRXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0Vycm9ySW5Sb3dzKCkpIHtcclxuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKG5ldyBDdXN0b21FcnJvcihzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWluUm93Q291bnRFcnJvclwiKVtcImZvcm1hdFwiXSh0aGlzLm1pblJvd0NvdW50KSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaGFzRXJyb3JJblJvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblJvd0NvdW50IDw9IDAgfHwgIXRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgc2V0Um93Q291bnQgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciByb3dJbmRleCA9IDA7IHJvd0luZGV4IDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGg7IHJvd0luZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW3Jvd0luZGV4XTtcclxuICAgICAgICAgICAgICAgIGlmICghcm93LmlzRW1wdHkpIHNldFJvd0NvdW50Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNldFJvd0NvdW50IDwgdGhpcy5taW5Sb3dDb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdlbmVyYXRlUm93cygpOiBBcnJheTxNYXRyaXhEeW5hbWljUm93TW9kZWw+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhEeW5hbWljUm93TW9kZWw+KCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJvd0NvdW50ID09PSAwKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KHRoaXMuZ2V0Um93VmFsdWVCeUluZGV4KHZhbCwgaSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KHZhbHVlOiBhbnkpOiBNYXRyaXhEeW5hbWljUm93TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeER5bmFtaWNSb3dNb2RlbCh0aGlzLnJvd0NvdW50ZXIgKyssIHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1ZhbHVlKGN1clZhbHVlOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gY3VyVmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHIgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiB0aGlzLnJvd0NvdW50KSByZXN1bHQuc3BsaWNlKHRoaXMucm93Q291bnQgLSAxKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHJlc3VsdC5sZW5ndGg7IGkgPCB0aGlzLnJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHt9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZGVsZXRlUm93VmFsdWUobmV3VmFsdWU6IGFueSwgcm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBpc0VtcHR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdWYWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG5ld1ZhbHVlW2ldKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNFbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpc0VtcHR5ID8gbnVsbCA6IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRSb3dWYWx1ZUJ5SW5kZXgocXVlc3Rpb25WYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBxdWVzdGlvblZhbHVlLmxlbmd0aCA/IHF1ZXN0aW9uVmFsdWVbaW5kZXhdIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFJvd1ZhbHVlKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIHF1ZXN0aW9uVmFsdWU6IGFueSwgY3JlYXRlOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSb3dWYWx1ZUJ5SW5kZXgocXVlc3Rpb25WYWx1ZSwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5pbmRleE9mKHJvdykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHluYW1pY1wiLCBbeyBuYW1lOiBcInJvd0NvdW50Om51bWJlclwiLCBkZWZhdWx0OiAyIH0sIHsgbmFtZTogXCJtaW5Sb3dDb3VudDpudW1iZXJcIiwgZGVmYXVsdDogMCB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJhZGRSb3dUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLmFkZFJvd1RleHRWYWx1ZTsgfSB9LCBcclxuICAgICAgICB7IG5hbWU6IFwicmVtb3ZlUm93VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5yZW1vdmVSb3dUZXh0VmFsdWU7IH0gfV0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsKFwiXCIpOyB9LCBcIm1hdHJpeGRyb3Bkb3duYmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4ZHluYW1pY1wiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gWzEsIDIsIDMsIDQsIDVdOyBxLmFkZENvbHVtbihcIkNvbHVtbiAxXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAyXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAzXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueTtcclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBNdWx0aXBsZVRleHRJdGVtTW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICBwcml2YXRlIGRhdGE6IElNdWx0aXBsZVRleHREYXRhO1xyXG4gICAgICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtdWx0aXBsZXRleHRpdGVtXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldERhdGEoZGF0YTogSU11bHRpcGxlVGV4dERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VGV4dDogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IG5ld1RleHQ7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhID8gdGhpcy5kYXRhLmdldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb25WYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lWYWxpZGF0b3JPd25lclxyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRpdGxlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNdWx0aXBsZVRleHREYXRhIHtcclxuICAgICAgICBwcml2YXRlIGNvbENvdW50VmFsdWU6IG51bWJlciA9IDE7XHJcbiAgICAgICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHVibGljIGl0ZW1TaXplOiBudW1iZXIgPSAyNTtcclxuICAgICAgICBwcml2YXRlIGl0ZW1zVmFsdWVzOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+ID0gbmV3IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4oKTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmKTtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHNlbGYuZmlyZUNhbGxiYWNrKHNlbGYuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibXVsdGlwbGV0ZXh0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXRlbXMoKTogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPiB7IHJldHVybiB0aGlzLml0ZW1zVmFsdWVzOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBpdGVtcyh2YWx1ZTogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPikge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zVmFsdWVzID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgQWRkSXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmNyZWF0ZVRleHRJdGVtKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDEgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbENvdW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJvd3MoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgICAgIHZhciBjb2xDb3VudCA9IHRoaXMuY29sQ291bnQ7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMuaXRlbXM7XHJcbiAgICAgICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93cy5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXS5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gY29sQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJvd3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBzdXBlci5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uSXRlbVZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtTW9kZWwobmFtZSwgdGl0bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICYmICh0aGlzLml0ZW1zW2ldLm5hbWUgaW4gdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSB0aGlzLnZhbHVlW3RoaXMuaXRlbXNbaV0ubmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zW2ldLm9uVmFsdWVDaGFuZ2VkKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBzdXBlci5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JTXVsdGlwbGVUZXh0RGF0YVxyXG4gICAgICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdWYWx1ZVtuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBbXCJuYW1lXCIsIHsgbmFtZTogXCJ0aXRsZVwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXZhbGlkYXRvclwiLCBjbGFzc05hbWVQYXJ0OiBcInZhbGlkYXRvclwiIH1dLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbU1vZGVsKFwiXCIpOyB9KTtcclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibXVsdGlwbGV0ZXh0XCIsIFt7IG5hbWU6IFwiIWl0ZW1zOnRleHRpdGVtc1wiLCBjbGFzc05hbWU6IFwibXVsdGlwbGV0ZXh0aXRlbVwiIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcIml0ZW1TaXplOm51bWJlclwiLCBkZWZhdWx0OiAyNSB9LCB7IG5hbWU6IFwiY29sQ291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDEsIGNob2ljZXM6IFsxLCAyLCAzLCA0XSB9XSxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibXVsdGlwbGV0ZXh0XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwobmFtZSk7IHEuQWRkSXRlbShcInRleHQxXCIpOyBxLkFkZEl0ZW0oXCJ0ZXh0MlwiKTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25SYXRpbmdNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBzdGF0aWMgZGVmYXVsdFJhdGVWYWx1ZXM6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSByYXRlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgbWluaW51bVJhdGVEZXNjcmlwdGlvbjogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgbWF4aW11bVJhdGVEZXNjcmlwdGlvbjogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICAgICAgcmF0ZVZhbHVlc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHJhdGVWYWx1ZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJhdGVzOyB9XHJcbiAgICAgICAgc2V0IHJhdGVWYWx1ZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yYXRlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJhdGVWYWx1ZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZVJhdGVWYWx1ZXMoKTogSXRlbVZhbHVlW10ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yYXRlVmFsdWVzLmxlbmd0aCA+IDApIHJldHVybiB0aGlzLnJhdGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBRdWVzdGlvblJhdGluZ01vZGVsLmRlZmF1bHRSYXRlVmFsdWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYXRpbmdcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfSBcclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgSXRlbVZhbHVlLnNldERhdGEoUXVlc3Rpb25SYXRpbmdNb2RlbC5kZWZhdWx0UmF0ZVZhbHVlcywgWzEsIDIsIDMsIDQsIDVdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJyYXRpbmdcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIHsgbmFtZTogXCJyYXRlVmFsdWVzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucmF0ZVZhbHVlcyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucmF0ZVZhbHVlcyA9IHZhbHVlOyB9fSxcclxuICAgICAgICBcIm1pbmludW1SYXRlRGVzY3JpcHRpb25cIiwgXCJtYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmdNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmF0aW5nXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmdNb2RlbChuYW1lKTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFRyaWdnZXIgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBzdGF0aWMgb3BlcmF0b3JzVmFsdWU6IEhhc2hUYWJsZTxGdW5jdGlvbj4gPSBudWxsO1xyXG4gICAgICAgIHN0YXRpYyBnZXQgb3BlcmF0b3JzKCkge1xyXG4gICAgICAgICAgICBpZiAoVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZSAhPSBudWxsKSByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICAgICAgVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICF2YWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVtcHR5OiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICEoIXZhbHVlKTsgfSxcclxuICAgICAgICAgICAgICAgIGVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlID09IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBub3RlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAhPSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgJiYgdmFsdWVbXCJpbmRleE9mXCJdICYmIHZhbHVlLmluZGV4T2YoZXhwZWN0ZWRWYWx1ZSkgPiAtMTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGNvbnRhaW5zOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICF2YWx1ZSB8fCAhdmFsdWVbXCJpbmRleE9mXCJdIHx8IHZhbHVlLmluZGV4T2YoZXhwZWN0ZWRWYWx1ZSkgPT0gLTE7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlID4gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIGxlc3M6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPCBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgZ3JlYXRlcm9yZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPj0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIGxlc3NvcmVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlIDw9IGV4cGVjdGVkVmFsdWU7IH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFRyaWdnZXIub3BlcmF0b3JzVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb3BWYWx1ZTogc3RyaW5nID0gXCJlcXVhbFwiO1xyXG4gICAgICAgIHB1YmxpYyB2YWx1ZTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG9wZXJhdG9yKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm9wVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9wZXJhdG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmICghVHJpZ2dlci5vcGVyYXRvcnNbdmFsdWVdKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMub3BWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2hlY2sodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoVHJpZ2dlci5vcGVyYXRvcnNbdGhpcy5vcGVyYXRvcl0odmFsdWUsIHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU3VjY2VzcygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkZhaWx1cmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TdWNjZXNzKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uRmFpbHVyZSgpIHsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleVRyaWdnZXJPd25lciB7XHJcbiAgICAgICAgZ2V0T2JqZWN0cyhwYWdlczogc3RyaW5nW10sIHF1ZXN0aW9uczogc3RyaW5nW10pOiBhbnlbXTtcclxuICAgICAgICBkb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgc2V0VHJpZ2dlclZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgaXNWYXJpYWJsZTogYm9vbGVhbik7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXIgZXh0ZW5kcyBUcmlnZ2VyIHtcclxuICAgICAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHByb3RlY3RlZCBvd25lcjogSVN1cnZleVRyaWdnZXJPd25lciA9IG51bGw7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRPd25lcihvd25lcjogSVN1cnZleVRyaWdnZXJPd25lcikge1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyID0gb3duZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNPbk5leHRQYWdlKCkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlclZpc2libGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBwdWJsaWMgcGFnZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgcHVibGljIHF1ZXN0aW9uczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidmlzaWJsZXRyaWdnZXJcIjsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtU3VjY2Vzcyk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25GYWlsdXJlKCkgeyB0aGlzLm9uVHJpZ2dlcih0aGlzLm9uSXRlbUZhaWx1cmUpOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBvblRyaWdnZXIoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvYmplY3RzID0gdGhpcy5vd25lci5nZXRPYmplY3RzKHRoaXMucGFnZXMsIHRoaXMucXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jKG9iamVjdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyBpdGVtLnZpc2libGUgPSB0cnVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbUZhaWx1cmUoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IGZhbHNlOyB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlckNvbXBsZXRlIGV4dGVuZHMgU3VydmV5VHJpZ2dlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImNvbXBsZXRldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc09uTmV4dFBhZ2UoKSB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgaWYgKHRoaXMub3duZXIpIHRoaXMub3duZXIuZG9Db21wbGV0ZSgpOyB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlclNldFZhbHVlIGV4dGVuZHMgU3VydmV5VHJpZ2dlciB7XHJcbiAgICAgICAgcHVibGljIHNldFRvTmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBpc1ZhcmlhYmxlOiBib29sZWFuO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzZXR2YWx1ZXRyaWdnZXJcIjsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZXRUb05hbWUgfHwgIXRoaXMub3duZXIpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vd25lci5zZXRUcmlnZ2VyVmFsdWUodGhpcy5zZXRUb05hbWUsIHRoaXMuc2V0VmFsdWUsIHRoaXMuaXNWYXJpYWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0cmlnZ2VyXCIsIFtcIm9wZXJhdG9yXCIsIFwiIXZhbHVlXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXl0cmlnZ2VyXCIsIFtcIiFuYW1lXCJdLCBudWxsLCBcInRyaWdnZXJcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidmlzaWJsZXRyaWdnZXJcIiwgW1wicGFnZXNcIiwgXCJxdWVzdGlvbnNcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSgpOyB9LCBcInN1cnZleXRyaWdnZXJcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY29tcGxldGV0cmlnZ2VyXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlckNvbXBsZXRlKCk7IH0sIFwic3VydmV5dHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzZXR2YWx1ZXRyaWdnZXJcIiwgW1wiIXNldFRvTmFtZVwiLCBcInNldFZhbHVlXCIsIFwiaXNWYXJpYWJsZTpib29sZWFuXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlclNldFZhbHVlKCk7IH0sIFwic3VydmV5dHJpZ2dlclwiKTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJwYWdlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyaWdnZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkeFN1cnZleVNlcnZpY2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidGV4dFByZVByb2Nlc3Nvci50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlNb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJU3VydmV5LCBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBwdWJsaWMgc3VydmV5SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHN1cnZleVBvc3RJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xpZW50SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGNvb2tpZU5hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHNlbmRSZXN1bHRPblBhZ2VOZXh0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBjb21tZW50UHJlZml4OiBzdHJpbmcgPSBcIi1Db21tZW50XCI7XHJcbiAgICAgICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBzaG93TmF2aWdhdGlvbkJ1dHRvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBzaG93VGl0bGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBzaG93UGFnZVRpdGxlczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIGNvbXBsZXRlZEh0bWw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHJlcXVpcmVkVGV4dDogc3RyaW5nID0gXCIqXCI7XHJcbiAgICAgICAgcHVibGljIHF1ZXN0aW9uU3RhcnRJbmRleDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25UaXRsZVRlbXBsYXRlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBzaG93UHJvZ3Jlc3NCYXI6IHN0cmluZyA9IFwib2ZmXCI7XHJcbiAgICAgICAgcHVibGljIHN0b3JlT3RoZXJzQXNDb21tZW50OiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgZ29OZXh0UGFnZUF1dG9tYXRpYzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogQXJyYXk8UGFnZU1vZGVsPiA9IG5ldyBBcnJheTxQYWdlTW9kZWw+KCk7XHJcbiAgICAgICAgcHVibGljIHRyaWdnZXJzOiBBcnJheTxTdXJ2ZXlUcmlnZ2VyPiA9IG5ldyBBcnJheTxTdXJ2ZXlUcmlnZ2VyPigpO1xyXG4gICAgICAgIHB1YmxpYyBjbGVhckludmlzaWJsZVZhbHVlczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgY3VycmVudFBhZ2VWYWx1ZTogUGFnZU1vZGVsID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHZhbHVlc0hhc2g6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSB2YXJpYWJsZXNIYXNoOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgcGFnZVByZXZUZXh0VmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHBhZ2VOZXh0VGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBjb21wbGV0ZVRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc2hvd1BhZ2VOdW1iZXJzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIHNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZTogc3RyaW5nID0gXCJvblwiO1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25UaXRsZUxvY2F0aW9uVmFsdWU6IHN0cmluZyA9IFwidG9wXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBsb2NhbGVWYWx1ZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwcml2YXRlIGlzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIHByb2Nlc3NlZFRleHRWYWx1ZXM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0UHJlUHJvY2Vzc29yOiBUZXh0UHJlUHJvY2Vzc29yO1xyXG5cclxuICAgICAgICBwdWJsaWMgb25Db21wbGV0ZTogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uQ3VycmVudFBhZ2VDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uVmFsdWVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uVmlzaWJsZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25QYWdlVmlzaWJsZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25RdWVzdGlvbkFkZGVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUXVlc3Rpb25SZW1vdmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uVmFsaWRhdGVRdWVzdGlvbjogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblByb2Nlc3NIdG1sOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uU2VuZFJlc3VsdDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvbkdldFJlc3VsdDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblVwbG9hZEZpbGU6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMganNvbkVycm9yczogQXJyYXk8SnNvbkVycm9yPiA9IG51bGw7XHJcblxyXG4gICAgICAgIHB1YmxpYyBtb2RlOiBzdHJpbmcgPSBcIm5vcm1hbFwiO1xyXG5cclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3NvciA9IG5ldyBUZXh0UHJlUHJvY2Vzc29yKCk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vbkhhc1ZhbHVlID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5wcm9jZXNzZWRUZXh0VmFsdWVzW25hbWUudG9Mb3dlckNhc2UoKV07IH07XHJcbiAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vblByb2Nlc3MgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5kYXRhID0gc2VsZjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2Vycy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5zZXRPd25lcihzZWxmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVDcmVhdGluZygpO1xyXG4gICAgICAgICAgICBpZiAoanNvbk9iaikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRKc29uT2JqZWN0KGpzb25PYmopO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTdXJ2ZXlGcm9tU2VydmljZSh0aGlzLnN1cnZleUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwic3VydmV5XCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGxvY2FsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NhbGVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgbG9jYWxlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzdXJ2ZXlMb2NhbGl6YXRpb24uY3VycmVudExvY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0TG9jU3RyaW5nKHN0cjogc3RyaW5nKSB7IHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKHN0cik7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGVtcHR5U3VydmV5VGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5nZXRMb2NTdHJpbmcoXCJlbXB0eVN1cnZleVwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcGFnZVByZXZUZXh0KCkgeyByZXR1cm4gKHRoaXMucGFnZVByZXZUZXh0VmFsdWUpID8gdGhpcy5wYWdlUHJldlRleHRWYWx1ZSA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwicGFnZVByZXZUZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBwYWdlUHJldlRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHBhZ2VOZXh0VGV4dCgpIHsgcmV0dXJuICh0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlKSA/IHRoaXMucGFnZU5leHRUZXh0VmFsdWUgOiB0aGlzLmdldExvY1N0cmluZyhcInBhZ2VOZXh0VGV4dFwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgcGFnZU5leHRUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5wYWdlTmV4dFRleHRWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb21wbGV0ZVRleHQoKSB7IHJldHVybiAodGhpcy5jb21wbGV0ZVRleHRWYWx1ZSkgPyB0aGlzLmNvbXBsZXRlVGV4dFZhbHVlIDogdGhpcy5nZXRMb2NTdHJpbmcoXCJjb21wbGV0ZVRleHRcIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbXBsZXRlVGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMuY29tcGxldGVUZXh0VmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc2hvd1BhZ2VOdW1iZXJzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zaG93UGFnZU51bWJlcnNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc2hvd1BhZ2VOdW1iZXJzKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5zaG93UGFnZU51bWJlcnMpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zaG93UGFnZU51bWJlcnNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc2hvd1F1ZXN0aW9uTnVtYmVycygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzVmFsdWU7IH07XHJcbiAgICAgICAgcHVibGljIHNldCBzaG93UXVlc3Rpb25OdW1iZXJzKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnMpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHVibGljIGdldCBxdWVzdGlvblRpdGxlTG9jYXRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25UaXRsZUxvY2F0aW9uVmFsdWU7IH07XHJcbiAgICAgICAgcHVibGljIHNldCBxdWVzdGlvblRpdGxlTG9jYXRpb24odmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMucXVlc3Rpb25UaXRsZUxvY2F0aW9uVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHVibGljIGdldCBkYXRhKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLnZhbHVlc0hhc2hba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IGRhdGEoZGF0YTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hba2V5XSA9IGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMoa2V5LCBkYXRhW2tleV0sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbW1lbnRzKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKHRoaXMuY29tbWVudFByZWZpeCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLnZhbHVlc0hhc2hba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZVBhZ2VzKCk6IEFycmF5PFBhZ2VNb2RlbD4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiB0aGlzLnBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5pc1Zpc2libGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBhZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFnZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjdXJyZW50UGFnZSgpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9PSBudWxsICYmIHZQYWdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZQYWdlcy5pbmRleE9mKHZhbHVlKSA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLmN1cnJlbnRQYWdlVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUuc2Nyb2xsVG9GaXJzdFF1ZXN0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdGF0ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xvYWRpbmcpIHJldHVybiBcImxvYWRpbmdcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDb21wbGV0ZWQpIHJldHVybiBcImNvbXBsZXRlZFwiO1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudFBhZ2UpID8gXCJydW5uaW5nXCIgOiBcImVtcHR5XCJcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc0hhc2ggPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlUGFnZUNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMudmlzaWJsZVBhZ2VzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBtZXJnZVZhbHVlcyhzcmM6IGFueSwgZGVzdDogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghZGVzdCB8fCAhc3JjKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNyY1trZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRlc3Rba2V5XSkgZGVzdFtrZXldID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXJnZVZhbHVlcyh2YWx1ZSwgZGVzdFtrZXldKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGN1cnJlbnRQYWdlQ2hhbmdlZChuZXdWYWx1ZTogUGFnZU1vZGVsLCBvbGRWYWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DdXJyZW50UGFnZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRDdXJyZW50UGFnZSc6IG9sZFZhbHVlLCAnbmV3Q3VycmVudFBhZ2UnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFByb2dyZXNzKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiAwO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoaW5kZXggKiAxMDAgLyB0aGlzLnZpc2libGVQYWdlQ291bnQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0Rlc2lnbk1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT0gXCJkZXNpZ25lclwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNDb29raWUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llO1xyXG4gICAgICAgICAgICByZXR1cm4gY29va2llcyAmJiBjb29raWVzLmluZGV4T2YodGhpcy5jb29raWVOYW1lICsgXCI9dHJ1ZVwiKSA+IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0Q29va2llKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29va2llTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSB0aGlzLmNvb2tpZU5hbWUgKyBcIj10cnVlOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMDowOjAgR01UXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkZWxldGVDb29raWUoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPTtcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG5leHRQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xhc3RQYWdlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja09uUGFnZVRyaWdnZXJzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbmRSZXN1bHRPblBhZ2VOZXh0ICYmIHRoaXMuY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCh0aGlzLnN1cnZleVBvc3RJZCwgdGhpcy5jbGllbnRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCArIDFdO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlzQ3VycmVudFBhZ2VIYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZS5oYXNFcnJvcnModHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBwcmV2UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNGaXJzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY29tcGxldGVMYXN0UGFnZSgpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRmlyc3RQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgPT0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0xhc3RQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICByZXR1cm4gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgPT0gdlBhZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkb0NvbXBsZXRlKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGVhckludmlzaWJsZVZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhckludmlzaWJsZVF1ZXN0aW9uVmFsdWVzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXRDb29raWUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldENvbXBsZXRlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkQ29tcGxldGVkSHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21wbGV0ZWRIdG1sKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzSHRtbCh0aGlzLmNvbXBsZXRlZEh0bWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxoMz5cIiArIHRoaXMuZ2V0TG9jU3RyaW5nKFwiY29tcGxldGluZ1N1cnZleVwiKSArIFwiPC9oMz5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRMb2FkaW5nSHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCI8aDM+XCIgKyB0aGlzLmdldExvY1N0cmluZyhcImxvYWRpbmdTdXJ2ZXlcIikgKyBcIjwvaDM+XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcHJvZ3Jlc3NUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TG9jU3RyaW5nKFwicHJvZ3Jlc3NUZXh0XCIpW1wiZm9ybWF0XCJdKGluZGV4LCB2UGFnZXMubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHVwbG9hZEZpbGUobmFtZTogc3RyaW5nLCBmaWxlOiBGaWxlLCBzdG9yZURhdGFBc1RleHQ6IGJvb2xlYW4sIHVwbG9hZGluZ0NhbGxiYWNrOiAoc3RhdHVzOiBzdHJpbmcpPT5hbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIGFjY2VwdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMub25VcGxvYWRGaWxlLmZpcmUodGhpcywgeyBuYW1lOiBuYW1lLCBmaWxlOiBmaWxlLCBhY2NlcHQ6IGFjY2VwdCB9KTtcclxuICAgICAgICAgICAgaWYgKCFhY2NlcHQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKCFzdG9yZURhdGFBc1RleHQgJiYgdGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkRmlsZUNvcmUobmFtZSwgZmlsZSwgdXBsb2FkaW5nQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwbG9hZEZpbGVDb3JlKG5hbWU6IHN0cmluZywgZmlsZTogRmlsZSwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZykgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKHVwbG9hZGluZ0NhbGxiYWNrKSB1cGxvYWRpbmdDYWxsYmFjayhcInVwbG9hZGluZ1wiKTtcclxuICAgICAgICAgICAgbmV3IGR4U3VydmV5U2VydmljZSgpLnNlbmRGaWxlKHRoaXMuc3VydmV5UG9zdElkLCBmaWxlLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVwbG9hZGluZ0NhbGxiYWNrKSB1cGxvYWRpbmdDYWxsYmFjayhzdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImVycm9yXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldFZhbHVlKG5hbWUsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFBhZ2UoaW5kZXg6IG51bWJlcik6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW2luZGV4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkUGFnZShwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmNyZWF0ZU5ld1BhZ2UobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbW92ZVBhZ2UocGFnZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucGFnZXMuaW5kZXhPZihwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoID4gMCA/IHRoaXMucGFnZXNbMF0gOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uQnlOYW1lKG5hbWU6IHN0cmluZywgY2FzZUluc2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2UpOiBJUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTmFtZSA9IHF1ZXN0aW9uc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkgcXVlc3Rpb25OYW1lID0gcXVlc3Rpb25OYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZihxdWVzdGlvbk5hbWUgPT0gbmFtZSkgcmV0dXJuIHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdLCBjYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IElRdWVzdGlvbltdIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lc1tpXSwgY2FzZUluc2Vuc2l0aXZlKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbikgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbjogSVF1ZXN0aW9uKTogUGFnZU1vZGVsIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKDxRdWVzdGlvbkJhc2U+cXVlc3Rpb24pID4gLTEpIHJldHVybiBwYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZUJ5TmFtZShuYW1lOiBzdHJpbmcpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFBhZ2VzQnlOYW1lcyhuYW1lczogc3RyaW5nW10pOiBQYWdlTW9kZWxbXXtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldFBhZ2VCeU5hbWUobmFtZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UpIHJlc3VsdC5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRBbGxRdWVzdGlvbnModmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PElRdWVzdGlvbj4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PElRdWVzdGlvbj4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0uYWRkUXVlc3Rpb25zVG9MaXN0KHJlc3VsdCwgdmlzaWJsZU9ubHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVOZXdQYWdlKG5hbWU6IHN0cmluZykgeyByZXR1cm4gbmV3IFBhZ2VNb2RlbChuYW1lKTsgfVxyXG4gICAgICAgIHByaXZhdGUgbm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0ubmFtZSAhPSBuYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uID0gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbiwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICduYW1lJzogbmFtZSwgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICd2YWx1ZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbnNbaV0sIHRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZG9TdXJ2ZXlWYWx1ZUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5vblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tPblBhZ2VUcmlnZ2VycygpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0Q3VycmVudFBhZ2VRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUocXVlc3Rpb24ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMocXVlc3Rpb24ubmFtZSwgdmFsdWUsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0Q3VycmVudFBhZ2VRdWVzdGlvbnMoKTogQXJyYXk8UXVlc3Rpb25CYXNlPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgICAgICBpZiAoIXBhZ2UpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHBhZ2UucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFxdWVzdGlvbi52aXNpYmxlIHx8ICFxdWVzdGlvbi5uYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrVHJpZ2dlcnMobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBpc09uTmV4dFBhZ2U6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMudHJpZ2dlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gdGhpcy50cmlnZ2Vyc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmICh0cmlnZ2VyLm5hbWUgPT0gbmFtZSAmJiB0cmlnZ2VyLmlzT25OZXh0UGFnZSA9PSBpc09uTmV4dFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyLmNoZWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGRvUXVlc3Rpb25zT25Mb2FkKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoZmFsc2UpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5TG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcnVuQ29uZGl0aW9ucygpIHtcclxuICAgICAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zRm9yTGlzdCh0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSkpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnNGb3JMaXN0KHRoaXMucGFnZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJ1bkNvbmRpdGlvbnNGb3JMaXN0KGxpc3Q6IEFycmF5PElDb25kaXRpb25SdW5uZXI+KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpXS5ydW5Db25kaXRpb24odGhpcy52YWx1ZXNIYXNoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZyA9IG51bGwsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoIXBvc3RJZCAmJiB0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgcG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwb3N0SWQpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGNsaWVudElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuc2VuZFJlc3VsdChwb3N0SWQsIHRoaXMuZGF0YSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25TZW5kUmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCByZXNwb25zZTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuZ2V0UmVzdWx0KHJlc3VsdElkLCBuYW1lLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogYW55W10sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25HZXRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGE6IGRhdGEsIGRhdGFMaXN0OiBkYXRhTGlzdCwgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5SWQgPSBzdXJ2ZXlJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5vbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkubG9hZFN1cnZleSh0aGlzLnN1cnZleUlkLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2VzcyAmJiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldEpzb25PYmplY3QocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkxvYWRTdXJ2ZXlGcm9tU2VydmljZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVmlzaWJsZUluZGV4ZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHRoaXMuc2hvd1BhZ2VOdW1iZXJzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uUGFnZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlzUGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzUGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXModmlzUGFnZXNbaV0ucXVlc3Rpb25zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSksIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0udmlzaWJsZUluZGV4ID0gdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gKGluZGV4KyspIDogLTE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLm51bSA9IHNob3dJbmRleCAmJiB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyB0aGlzLnBhZ2VzW2ldLnZpc2libGVJbmRleCArIDEgOiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXMocXVlc3Rpb25zOiBJUXVlc3Rpb25bXSwgc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbnNbaV0uc2V0VmlzaWJsZUluZGV4KHNob3dJbmRleCAmJiBxdWVzdGlvbnNbaV0udmlzaWJsZSAmJiBxdWVzdGlvbnNbaV0uaGFzVGl0bGUgPyAoaW5kZXgrKykgOiAtMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZXRKc29uT2JqZWN0KGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5qc29uRXJyb3JzID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGpzb25Db252ZXJ0ZXIgPSBuZXcgSnNvbk9iamVjdCgpO1xyXG4gICAgICAgICAgICBqc29uQ29udmVydGVyLnRvT2JqZWN0KGpzb25PYmosIHRoaXMpO1xyXG4gICAgICAgICAgICBpZiAoanNvbkNvbnZlcnRlci5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qc29uRXJyb3JzID0ganNvbkNvbnZlcnRlci5lcnJvcnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0Nvb2tpZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kb1F1ZXN0aW9uc09uTG9hZCgpO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25CZWZvcmVDcmVhdGluZygpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbXCJwYWdlbm9cIl0gPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gc2VsZi5jdXJyZW50UGFnZSAhPSBudWxsID8gc2VsZi52aXNpYmxlUGFnZXMuaW5kZXhPZihzZWxmLmN1cnJlbnRQYWdlKSArIDEgOiAwOyB9XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tcInBhZ2Vjb3VudFwiXSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBzZWxmLnZpc2libGVQYWdlQ291bnQ7IH1cclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1txdWVzdGlvbi5uYW1lLnRvTG93ZXJDYXNlKCldID0gXCJxdWVzdGlvblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAodmFsID09IFwicXVlc3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBxdWVzdGlvbiAhPSBudWxsID8gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbCA9PSBcInZhbHVlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhbHVlKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gXCJ2YXJpYWJsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRWYXJpYWJsZShuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNsZWFySW52aXNpYmxlUXVlc3Rpb25WYWx1ZXMoKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSwgbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFZhcmlhYmxlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRWYXJpYWJsZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IFwidmFyaWFibGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JU3VydmV5IGRhdGFcclxuICAgICAgICBwcml2YXRlIGdldFVuYmluZFZhbHVlKHZhbHVlOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIC8vZG8gbm90IHJldHVybiB0aGUgc2FtZSBvYmplY3QgaW5zdGFuY2UhISFcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VW5iaW5kVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUVxdWFsKG5hbWUsIG5ld1ZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gXCJcIiB8fCBuZXdWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmdldFVuYmluZFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW25hbWUudG9Mb3dlckNhc2UoKV0gPSBcInZhbHVlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKG5hbWUsIG5ld1ZhbHVlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZUVxdWFsKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gXCJcIikgbmV3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLmdldFZhbHVlKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IG51bGwgfHwgb2xkVmFsdWUgPT09IG51bGwpIHJldHVybiBuZXdWYWx1ZSA9PT0gb2xkVmFsdWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVHdvVmFsdWVFcXVhbHMobmV3VmFsdWUsIG9sZFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1R3b1ZhbHVlRXF1YWxzKHg6IGFueSwgeTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh4ID09PSB5KSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkgfHwgISh5IGluc3RhbmNlb2YgT2JqZWN0KSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgheC5oYXNPd25Qcm9wZXJ0eShwKSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXkuaGFzT3duUHJvcGVydHkocCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh4W3BdID09PSB5W3BdKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHhbcF0pICE9PSBcIm9iamVjdFwiKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNUd29WYWx1ZUVxdWFscyh4W3BdLCB5W3BdKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAocCBpbiB5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeS5oYXNPd25Qcm9wZXJ0eShwKSAmJiAheC5oYXNPd25Qcm9wZXJ0eShwKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5nb05leHRQYWdlQXV0b21hdGljIHx8ICF0aGlzLmN1cnJlbnRQYWdlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbiAmJiAhcXVlc3Rpb24uc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmdldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jdXJyZW50UGFnZS5oYXNFcnJvcnMoZmFsc2UsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzTGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRQYWdlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9Db21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZGF0YVtuYW1lICsgdGhpcy5jb21tZW50UHJlZml4XTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZSArIHRoaXMuY29tbWVudFByZWZpeDtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IFwiXCIgfHwgbmV3VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cnlHb05leHRQYWdlQXV0b21hdGljKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uUGFnZVZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncGFnZSc6IHBhZ2UsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IElRdWVzdGlvbiwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUXVlc3Rpb25Ub1Byb2Nlc3NlZFRleHRWYWx1ZXMocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlc3Rpb25BZGRlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSwgJ2luZGV4JzogaW5kZXggfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXN0aW9uUmVtb3ZlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uaXNFbXB0eSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBuYW1lOiBuYW1lLCB2YWx1ZTogdGhpcy5nZXRWYWx1ZShuYW1lKSwgZXJyb3I6IG51bGwgfTtcclxuICAgICAgICAgICAgdGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uZmlyZSh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZXJyb3IgPyBuZXcgQ3VzdG9tRXJyb3Iob3B0aW9ucy5lcnJvcikgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHsgaHRtbDogaHRtbCB9O1xyXG4gICAgICAgICAgICB0aGlzLm9uUHJvY2Vzc0h0bWwuZmlyZSh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1RleHQob3B0aW9ucy5odG1sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvY2Vzc1RleHQodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dFByZVByb2Nlc3Nvci5wcm9jZXNzKHRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lTdXJ2ZXlUcmlnZ2VyT3duZXJcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtde1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdCwgdGhpcy5nZXRQYWdlc0J5TmFtZXMocGFnZXMpKTtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFF1ZXN0aW9uc0J5TmFtZXMocXVlc3Rpb25zKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFRyaWdnZXJWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnksIGlzVmFyaWFibGU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChpc1ZhcmlhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhcmlhYmxlKG5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUobmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXlcIiwgW3sgbmFtZTogXCJsb2NhbGVcIiwgY2hvaWNlczogKCkgPT4geyByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldExvY2FsZXMoKSB9IH0sXHJcbiAgICAgICAgXCJ0aXRsZVwiLCBcImNvbXBsZXRlZEh0bWw6aHRtbFwiLCB7IG5hbWU6IFwicGFnZXNcIiwgY2xhc3NOYW1lOiBcInBhZ2VcIiB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJxdWVzdGlvbnNcIiwgYmFzZUNsYXNzTmFtZTogXCJxdWVzdGlvblwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBudWxsOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqLCB2YWx1ZSwganNvbkNvbnZlcnRlcikgeyB2YXIgcGFnZSA9IG9iai5hZGROZXdQYWdlKFwiXCIpOyBqc29uQ29udmVydGVyLnRvT2JqZWN0KHsgcXVlc3Rpb25zOiB2YWx1ZSB9LCBwYWdlKTsgfSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJ0cmlnZ2Vyczp0cmlnZ2Vyc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXRyaWdnZXJcIiwgY2xhc3NOYW1lUGFydDogXCJ0cmlnZ2VyXCIgfSxcclxuICAgICAgICBcInN1cnZleUlkXCIsIFwic3VydmV5UG9zdElkXCIsIFwiY29va2llTmFtZVwiLCBcInNlbmRSZXN1bHRPblBhZ2VOZXh0OmJvb2xlYW5cIixcclxuICAgICAgICB7IG5hbWU6IFwic2hvd05hdmlnYXRpb25CdXR0b25zOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCB7IG5hbWU6IFwic2hvd1RpdGxlOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCB7IG5hbWU6IFwic2hvd1BhZ2VUaXRsZXM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sXHJcbiAgICAgICAgXCJzaG93UGFnZU51bWJlcnM6Ym9vbGVhblwiLCB7IG5hbWU6IFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBkZWZhdWx0OiBcIm9uXCIsIGNob2ljZXM6IFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInF1ZXN0aW9uVGl0bGVMb2NhdGlvblwiLCBkZWZhdWx0OiBcInRvcFwiLCBjaG9pY2VzOiBbXCJ0b3BcIiwgXCJib3R0b21cIl0gfSxcclxuICAgICAgICB7IG5hbWU6IFwic2hvd1Byb2dyZXNzQmFyXCIsIGRlZmF1bHQ6IFwib2ZmXCIsIGNob2ljZXM6IFtcIm9mZlwiLCBcInRvcFwiLCBcImJvdHRvbVwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJzdG9yZU90aGVyc0FzQ29tbWVudDpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJnb05leHRQYWdlQXV0b21hdGljOmJvb2xlYW5cIiwgXCJjbGVhckludmlzaWJsZVZhbHVlczpib29sZWFuXCIsXHJcbiAgICAgICAgeyBuYW1lOiBcInBhZ2VQcmV2VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5wYWdlUHJldlRleHRWYWx1ZTsgfSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJwYWdlTmV4dFRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoucGFnZU5leHRUZXh0VmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY29tcGxldGVUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLmNvbXBsZXRlVGV4dFZhbHVlOyB9IH0sIFxyXG4gICAgICAgIHsgbmFtZTogXCJyZXF1aXJlZFRleHRcIiwgZGVmYXVsdDogXCIqXCIgfSwgXCJxdWVzdGlvblN0YXJ0SW5kZXhcIiwgXCJxdWVzdGlvblRpdGxlVGVtcGxhdGVcIl0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVdpbmRvd01vZGVsIGV4dGVuZHMgQmFzZSAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3VydmV5RWxlbWVudE5hbWUgPSBcIndpbmRvd1N1cnZleUpTXCI7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleU1vZGVsO1xyXG4gICAgICAgIHdpbmRvd0VsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICAgIGlzU2hvd2luZ1ZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIGlzRXhwYW5kZWRWYWx1ZTogYm9vbGVhbjtcclxuICAgICAgICB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgdGVtcGxhdGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdGhpcy5jcmVhdGVTdXJ2ZXkoanNvbk9iaik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUuc2hvd1RpdGxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpIDogc3RyaW5nIHsgcmV0dXJuIFwid2luZG93XCIgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleU1vZGVsIHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzU2hvd2luZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNTaG93aW5nVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzRXhwYW5kZWRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMuc3VydmV5LnRpdGxlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGV4cGFuZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNvbGxhcHNlKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVN1cnZleShqc29uT2JqOiBhbnkpOiBTdXJ2ZXlNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3VydmV5TW9kZWwoanNvbk9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGV4cGFuZGNvbGxhcHNlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNFeHBhbmRlZFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy9zdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgdmFyIGZpbm5pc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICBwYWdlUHJldlRleHQ6IFwiRWRlbGxpbmVuXCIsXHJcbiAgICAgIHBhZ2VOZXh0VGV4dDogXCJTZXVyYWF2YVwiLFxyXG4gICAgICBjb21wbGV0ZVRleHQ6IFwiVmFsbWlzXCIsXHJcbiAgICAgIG90aGVySXRlbVRleHQ6IFwiTXV1IChrdXZhaWxlKVwiLFxyXG4gICAgICBwcm9ncmVzc1RleHQ6IFwiU2l2dSB7MH0vezF9XCIsXHJcbiAgICAgIGVtcHR5U3VydmV5OiBcIlTDpHNzw6Qga3lzZWx5c3PDpCBlaSBvbGUgeWh0w6Rrw6TDpG4gbsOka3l2aWxsw6Qgb2xldmFhIHNpdnVhIHRhaSBreXN5bXlzdMOkLlwiLFxyXG4gICAgICBjb21wbGV0aW5nU3VydmV5OiBcIktpaXRvcyBreXNlbHl5biB2YXN0YWFtaXNlc3RhIVwiLFxyXG4gICAgICBsb2FkaW5nU3VydmV5OiBcIkt5c2VsecOkIGxhZGF0YWFuIHBhbHZlbGltZWx0YS4uLlwiLFxyXG4gICAgICBvcHRpb25zQ2FwdGlvbjogXCJWYWxpdHNlLi4uXCIsXHJcbiAgICAgIHJlcXVpcmVkRXJyb3I6IFwiVmFzdGFhIGt5c3lteWtzZWVuLCBraWl0b3MuXCIsXHJcbiAgICAgIG51bWVyaWNFcnJvcjogXCJBcnZvbiB0dWxlZSBvbGxhIG51bWVlcmluZW4uXCIsXHJcbiAgICAgIHRleHRNaW5MZW5ndGg6IFwiT2xlIGh5dsOkIGphIHN5w7Z0w6QgdsOkaGludMOkw6RuIHswfSBtZXJra2nDpC5cIixcclxuICAgICAgbWluU2VsZWN0RXJyb3I6IFwiT2xlIGh5dsOkIGphIHZhbGl0c2UgdsOkaGludMOkw6RuIHswfSB2YWlodG9laHRvYS5cIixcclxuICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiT2xlIGh5dsOkIGphIHZhbGl0c2UgZW5pbnTDpMOkbiB7MH0gdmFpaHRvZWh0b2EuXCIsXHJcbiAgICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScgdMOkeXR5eSBvbGxhIGVuZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfSBqYSB2w6RoZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsyfVwiLFxyXG4gICAgICBudW1lcmljTWluOiBcIid7MH0nIHTDpHl0eXkgb2xsYSBlbmVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7MX1cIixcclxuICAgICAgbnVtZXJpY01heDogXCInezB9JyB0w6R5dHl5IG9sbGEgdsOkaGVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7MX1cIixcclxuICAgICAgaW52YWxpZEVtYWlsOiBcIlN5w7Z0w6QgdmFsaWRpIHPDpGhrw7Zwb3N0aW9zb2l0ZS5cIixcclxuICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIk9sZSBoeXbDpCBqYSBzecO2dMOkIFxcXCJNdXUgKGt1dmFpbGUpXFxcIlwiXHJcbiAgfVxyXG5cclxuICBzdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImZpXCJdID0gZmlubmlzaFN1cnZleVN0cmluZ3M7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy9zdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxuLy9DcmVhdGVkIG9uIGJlaGFsZiBodHRwczovL2dpdGh1Yi5jb20vRnJhbmsxM1xyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIHZhciBmcmVuY2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICAgIHBhZ2VQcmV2VGV4dDogXCJQclxcdTAwZTljXFx1MDBlOWRlbnRcIixcclxuICAgICAgICBwYWdlTmV4dFRleHQ6IFwiU3VpdmFudFwiLFxyXG4gICAgICAgIGNvbXBsZXRlVGV4dDogXCJUZXJtaW5lclwiLFxyXG4gICAgICAgIG90aGVySXRlbVRleHQ6IFwiQXV0cmUgKHByXFx1MDBlOWNpc2VyKVwiLFxyXG4gICAgICAgIHByb2dyZXNzVGV4dDogXCJQYWdlIHswfSBzdXIgezF9XCIsXHJcbiAgICAgICAgZW1wdHlTdXJ2ZXk6IFwiSWwgbid5IGEgbmkgcGFnZSB2aXNpYmxlIG5pIHF1ZXN0aW9uIHZpc2libGUgZGFuc2NlIHF1ZXN0aW9ubmFpcmVcIixcclxuICAgICAgICBjb21wbGV0aW5nU3VydmV5OiBcIk1lcmNpIGQnYXZvaXIgclxcdTAwZTlwb25kdSBhdSBxdWVzdGlvbm5haXJlIVwiLFxyXG4gICAgICAgIGxvYWRpbmdTdXJ2ZXk6IFwiTGUgcXVlc3Rpb25uYWlyZSBlc3QgZW4gY291cnMgZGUgY2hhcmdlbWVudC4uLlwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIkNob2lzaXNzZXouLi5cIixcclxuICAgICAgICByZXF1aXJlZEVycm9yOiBcIkxhIHJcXHUwMGU5cG9uc2UgXFx1MDBlMCBjZXR0ZSBxdWVzdGlvbiBlc3Qgb2JsaWdhdG9pcmUuXCIsXHJcbiAgICAgICAgbnVtZXJpY0Vycm9yOiBcIkxhIHJcXHUwMGU5cG9uc2UgZG9pdCBcXHUwMGVhdHJlIHVuIG5vbWJyZS5cIixcclxuICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcIk1lcmNpIGQnZW50cmVyIGF1IG1vaW5zIHswfSBzeW1ib2xlcy5cIixcclxuICAgICAgICBtaW5TZWxlY3RFcnJvcjogXCJNZXJjaSBkZSBzXFx1MDBlOWxlY3Rpb25uZXIgYXUgbW9pbnMgezB9clxcdTAwZTlwb25zZXMuXCIsXHJcbiAgICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiTWVyY2kgZGUgc1xcdTAwZTlsZWN0aW9ubmVyIGF1IHBsdXMgezB9clxcdTAwZTlwb25zZXMuXCIsXHJcbiAgICAgICAgbnVtZXJpY01pbk1heDogXCJWb3RyZSByXFx1MDBlOXBvbnNlICd7MH0nIGRvaXQgXFx1MDBlYXRyZXN1cFxcdTAwZTlyaWV1cmUgb3UgXFx1MDBlOWdhbGUgXFx1MDBlMCB7MX0gZXQgaW5mXFx1MDBlOXJpZXVyZSBvdVxcdTAwZTlnYWxlIFxcdTAwZTAgezJ9XCIsXHJcbiAgICAgICAgbnVtZXJpY01pbjogXCJWb3RyZSByXFx1MDBlOXBvbnNlICd7MH0nIGRvaXQgXFx1MDBlYXRyZXN1cFxcdTAwZTlyaWV1cmUgb3UgXFx1MDBlOWdhbGUgXFx1MDBlMCB7MX1cIixcclxuICAgICAgICBudW1lcmljTWF4OiBcIlZvdHJlIHJcXHUwMGU5cG9uc2UgJ3swfScgZG9pdCBcXHUwMGVhdHJlaW5mXFx1MDBlOXJpZXVyZSBvdSBcXHUwMGU5Z2FsZSBcXHUwMGUwIHsxfVwiLFxyXG4gICAgICAgIGludmFsaWRFbWFpbDogXCJNZXJjaSBkJ2VudHJlciB1bmUgYWRyZXNzZSBtYWlsIHZhbGlkZS5cIixcclxuICAgICAgICBleGNlZWRNYXhTaXplOiBcIkxhIHRhaWxsZSBkdSBmaWNoaWVyIG5lIGRvaXQgcGFzIGV4Y1xcdTAwZTlkZXIgezB9LlwiLFxyXG4gICAgICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJNZXJjaSBkZSBwclxcdTAwZTljaXNlciBsZSBjaGFtcCAnQXV0cmUnLlwiXHJcbiAgICB9XHJcbiAgICBzdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImZyXCJdID0gZnJlbmNoU3VydmV5U3RyaW5ncztcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8vc3VydmV5U3RyaW5ncy50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgdmFyIGdlcm1hblN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgcGFnZVByZXZUZXh0OiBcIlp1csO8Y2tcIixcclxuICAgICAgICBwYWdlTmV4dFRleHQ6IFwiV2VpdGVyXCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcIkZlcnRpZ1wiLFxyXG4gICAgICAgIHByb2dyZXNzVGV4dDogXCJTZWl0ZSB7MH0gdm9uIHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcIkVzIGdpYnQga2VpbmUgc2ljaHRiYXJlIEZyYWdlLlwiLFxyXG4gICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiVmllbGVuIERhbmsgZsO8ciBkYXMgQXVzZsO8bGxlbiBkZXMgRnJhZ2Vib2dlbnMhXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCJEZXIgRnJhZ2Vib2dlbiB3aXJkIHZvbSBTZXJ2ZXIgZ2VsYWRlbi4uLlwiLFxyXG4gICAgICAgIG90aGVySXRlbVRleHQ6IFwiQmVudXR6ZXJkZWZpbmllcnRlIEFudHdvcnQuLi5cIixcclxuICAgICAgICBvcHRpb25zQ2FwdGlvbjogXCJXw6RobGVuLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCJCaXR0ZSBhbnR3b3J0ZW4gU2llIGF1ZiBkaWUgRnJhZ2UuXCIsXHJcbiAgICAgICAgbnVtZXJpY0Vycm9yOiBcIkRlciBXZXJ0IHNvbGx0ZSBlaW5lIFphaGwgc2Vpbi5cIixcclxuICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcIkJpdHRlIGdlYmVuIFNpZSBtaW5kZXN0ZW5zIHswfSBTeW1ib2xlLlwiLFxyXG4gICAgICAgIG1pblNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG1pbmRlc3RlbnMgezB9IFZhcmlhbnRlbi5cIixcclxuICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCJCaXR0ZSB3w6RobGVuIFNpZSBuaWNodCBtZWhyIGFscyB7MH0gVmFyaWFudGVuLlwiLFxyXG4gICAgICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScgc29sdGUgZ2xlaWNoIG9kZXIgZ3LDtsOfZXIgc2VpbiBhbHMgezF9IHVuZCBnbGVpY2ggb2RlciBrbGVpbmVyIGFscyB7Mn1cIixcclxuICAgICAgICBudW1lcmljTWluOiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGdyw7bDn2VyIHNlaW4gYWxzIHsxfVwiLFxyXG4gICAgICAgIG51bWVyaWNNYXg6IFwiJ3swfScgc29sdGUgZ2xlaWNoIG9kZXIga2xlaW5lciBhbHMgezF9XCIsXHJcbiAgICAgICAgaW52YWxpZEVtYWlsOiBcIkJpdHRlIGdlYmVuIFNpZSBlaW5lIGfDvGx0aWdlIEVtYWlsLUFkcmVzc2UgZWluLlwiLFxyXG4gICAgICAgIGV4Y2VlZE1heFNpemU6IFwiRGllIERhdGVpZ3LDtsOfZSBzb2xsIG5pY2h0IG1laHIgYWxzIHswfS5cIixcclxuICAgICAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiQml0dGUgZ2ViZW4gU2llIGVpbmVuIFdlcnQgZsO8ciBJaHJlIGJlbnV0emVyZGVmaW5pZXJ0ZSBBbnR3b3J0IGVpbi5cIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJkZVwiXSA9IGdlcm1hblN1cnZleVN0cmluZ3M7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy9zdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICB2YXIgcnVzc2lhblN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgcGFnZVByZXZUZXh0OiBcItCd0LDQt9Cw0LRcIixcclxuICAgICAgICBwYWdlTmV4dFRleHQ6IFwi0JTQsNC70LXQtVwiLFxyXG4gICAgICAgIGNvbXBsZXRlVGV4dDogXCLQk9C+0YLQvtCy0L5cIixcclxuICAgICAgICBwcm9ncmVzc1RleHQ6IFwi0KHRgtGA0LDQvdC40YbQsCB7MH0g0LjQtyB7MX1cIixcclxuICAgICAgICBlbXB0eVN1cnZleTogXCLQndC10YIg0L3QuCDQvtC00L3QvtCz0L4g0LLQvtC/0YDQvtGB0LAuXCIsXHJcbiAgICAgICAgY29tcGxldGluZ1N1cnZleTogXCLQkdC70LDQs9C+0LTQsNGA0LjQvCDQktCw0YEg0LfQsCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsNC90LrQtdGC0YshXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCLQl9Cw0LPRgNGD0LfQutCwINGBINGB0LXRgNCy0LXRgNCwLi4uXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCLQlNGA0YPQs9C+0LUgKNC/0L7QttCw0LvRg9C50YHRgtCwLCDQvtC/0LjRiNC40YLQtSlcIixcclxuICAgICAgICBvcHRpb25zQ2FwdGlvbjogXCLQktGL0LHRgNCw0YLRjC4uLlwiLFxyXG4gICAgICAgIHJlcXVpcmVkRXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINC+0YLQstC10YLRjNGC0LUg0L3QsCDQstC+0L/RgNC+0YEuXCIsXHJcbiAgICAgICAgbnVtZXJpY0Vycm9yOiBcItCe0YLQstC10YIg0LTQvtC70LbQtdC9INCx0YvRgtGMINGH0LjRgdC70L7QvC5cIixcclxuICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDRhdC+0YLRjyDQsdGLIHswfSDRgdC40LzQstC+0LvQvtCyLlwiLFxyXG4gICAgICAgIG1pblNlbGVjdEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstGL0LHQtdGA0LjRgtC1INGF0L7RgtGPINCx0YsgezB9INCy0LDRgNC40LDQvdGC0L7Qsi5cIixcclxuICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0LLRi9Cx0LXRgNC40YLQtSDQvdC1INCx0L7Qu9C10LUgezB9INCy0LDRgNC40LDQvdGC0L7Qsi5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIid7MH0nINC00L7Qu9C20L3QviDQsdGL0YLRjCDRgNCw0LLQvdGL0Lwg0LjQu9C4INCx0L7Qu9GM0YjQtSwg0YfQtdC8IHsxfSwg0Lgg0YDQsNCy0L3Ri9C8INC40LvQuCDQvNC10L3RjNGI0LUsINGH0LXQvCB7Mn1cIixcclxuICAgICAgICBudW1lcmljTWluOiBcIid7MH0nINC00L7Qu9C20L3QviDQsdGL0YLRjCDRgNCw0LLQvdGL0Lwg0LjQu9C4INCx0L7Qu9GM0YjQtSwg0YfQtdC8IHsxfVwiLFxyXG4gICAgICAgIG51bWVyaWNNYXg6IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LzQtdC90YzRiNC1LCDRh9C10LwgezF9XCIsXHJcbiAgICAgICAgaW52YWxpZEVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLLlwiLFxyXG4gICAgICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0LLQstC10LTQuNGC0LUg0LTQsNC90L3Ri9C1INCyINC/0L7Qu9C1IFxcXCLQlNGA0YPQs9C+0LVcXFwiXCJcclxuICAgIH1cclxuICAgIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wicnVcIl0gPSBydXNzaWFuU3VydmV5U3RyaW5ncztcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8vc3VydmV5U3RyaW5ncy50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgdmFyIHR1cmtpc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICAgICAgICBwYWdlUHJldlRleHQ6IFwiR2VyaVwiLFxyXG4gICAgICAgICAgICBwYWdlTmV4dFRleHQ6IFwixLBsZXJpXCIsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlVGV4dDogXCJBbmtldGkgVGFtYW1sYVwiLFxyXG4gICAgICAgICAgICBvdGhlckl0ZW1UZXh0OiBcIkRpxJ9lciAoYcOnxLFrbGF5xLFuxLF6KVwiLFxyXG4gICAgICAgICAgICBwcm9ncmVzc1RleHQ6IFwiU2F5ZmEgezB9IC8gezF9XCIsXHJcbiAgICAgICAgICAgIGVtcHR5U3VydmV5OiBcIkFua2V0dGUgZ8O2csO8bnTDvGxlbmVjZWsgc2F5ZmEgeWEgZGEgc29ydSBtZXZjdXQgZGXEn2lsLlwiLFxyXG4gICAgICAgICAgICBjb21wbGV0aW5nU3VydmV5OiBcIkFua2V0aW1pemkgdGFtYW1sYWTEscSfxLFuxLF6IGnDp2luIHRlxZ9la2vDvHIgZWRlcml6LlwiLFxyXG4gICAgICAgICAgICBsb2FkaW5nU3VydmV5OiBcIkFua2V0IHN1bnVjdWRhbiB5w7xrbGVuaXlvciAuLi5cIixcclxuICAgICAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiU2XDp2luaXogLi4uXCIsXHJcbiAgICAgICAgICAgIHJlcXVpcmVkRXJyb3I6IFwiTMO8dGZlbiBzb3J1eWEgY2V2YXAgdmVyaW5pelwiLFxyXG4gICAgICAgICAgICBudW1lcmljRXJyb3I6IFwiR2lyaWxlbiBkZcSfZXIgbnVtZXJpayBvbG1hbMSxZMSxclwiLFxyXG4gICAgICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcIkVuIGF6IHswfSBzZW1ib2wgZ2lyaW5pei5cIixcclxuICAgICAgICAgICAgbWluUm93Q291bnRFcnJvcjogXCJMw7x0ZmVuIGVuIGF6IHswfSBzYXTEsXLEsSBkb2xkdXJ1bi5cIixcclxuICAgICAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwiTMO8dGZlbiBlbiBheiB7MH0gc2XDp2VuZcSfaSBzZcOnaW5pei5cIixcclxuICAgICAgICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiTMO8dGZlbiB7MH0gYWRldHRlbiBmYXpsYSBzZcOnbWV5aW5pei5cIixcclxuICAgICAgICAgICAgbnVtZXJpY01pbk1heDogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIG1vcmUgdGhhbiB7MX0gYW5kIGVxdWFsIG9yIGxlc3MgdGhhbiB7Mn1cIixcclxuICAgICAgICAgICAgbnVtZXJpY01pbjogXCInezB9JyBkZcSfZXJpIHsxfSBkZcSfZXJpbmUgZcWfaXQgdmV5YSBiw7x5w7xrIG9sbWFsxLFkxLFyXCIsXHJcbiAgICAgICAgICAgIG51bWVyaWNNYXg6IFwiJ3swfScgZGXEn2VyaSB7MX0gZGXEn2VyaW5lIGXFn2l0IHlhIGRhIGvDvMOnw7xrIG9sbWFsxLFkxLFyLlwiLFxyXG4gICAgICAgICAgICBpbnZhbGlkRW1haWw6IFwiTMO8dGZlbiBnZcOnZXJsaSBiaXIgZXBvc3RhIGFkcmVzaSBnaXJpbml6LlwiLFxyXG4gICAgICAgICAgICB1cmxSZXF1ZXN0RXJyb3I6IFwiVGFsZWJpIMWfdSBoYXRhecSxIGTDtm5kw7wgJ3swfScuIHsxfVwiLFxyXG4gICAgICAgICAgICB1cmxHZXRDaG9pY2VzRXJyb3I6IFwiVGFsZXAgaGVyaGFuZ2kgYmlyIHZlcmkgZMO2bm1lZGkgeWEgZGEgJ3BhdGgnIMO2emVsbGnEn2kgaGF0YWzEsS5cIixcclxuICAgICAgICAgICAgZXhjZWVkTWF4U2l6ZTogXCJEb3N5YSBib3l1dHUgezB9IGRlxJ9lcmluaSBnZcOnZW1lei5cIixcclxuICAgICAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIkzDvHRmZW4gZGnEn2VyIGRlxJ9lcmxlcmkgZ2lyaW5pei5cIixcclxuICAgICAgICAgICAgdXBsb2FkaW5nRmlsZTogXCJEb3N5YW7EsXogecO8a2xlbml5b3IuIEzDnHRmZW4gYmlya2HDpyBzYW5peWUgYmVrbGV5aW4gdmUgdGVrcmFyIGRlbmV5aW4uXCIsXHJcbiAgICAgICAgICAgIGFkZFJvdzogXCJTYXTEsXIgRWtsZVwiLFxyXG4gICAgICAgICAgICByZW1vdmVSb3c6IFwiS2FsZMSxclwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1widHJcIl0gPSB0dXJraXNoU3VydmV5U3RyaW5ncztcclxufVxyXG4iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCB2YXIgZGVmYXVsdFN0YW5kYXJkQ3NzID0ge1xyXG4gICAgICAgIHJvb3Q6IFwic3ZfbWFpblwiLFxyXG4gICAgICAgIGhlYWRlcjogXCJcIixcclxuICAgICAgICBib2R5OiBcInN2X2JvZHlcIixcclxuICAgICAgICBmb290ZXI6IFwic3ZfbmF2XCIsXHJcbiAgICAgICAgbmF2aWdhdGlvbkJ1dHRvbjogXCJcIiwgbmF2aWdhdGlvbjogeyBjb21wbGV0ZTogXCJcIiwgcHJldjpcIlwiLCBuZXh0OiBcIlwifSxcclxuICAgICAgICBwcm9ncmVzczogXCJzdl9wcm9ncmVzc1wiLFxyXG4gICAgICAgIHBhZ2VUaXRsZTogXCJzdl9wX3RpdGxlXCIsXHJcbiAgICAgICAgcm93OiBcInN2X3Jvd1wiLFxyXG4gICAgICAgIHF1ZXN0aW9uOiB7IHJvb3Q6IFwic3ZfcVwiLCB0aXRsZTogXCJzdl9xX3RpdGxlXCIsIGNvbW1lbnQ6IFwiXCIsIGluZGVudDogMjAgfSxcclxuICAgICAgICBlcnJvcjogeyByb290OiBcInN2X3FfZXJib3hcIiwgaWNvbjogXCJcIiwgaXRlbTogXCJcIiB9LFxyXG5cclxuICAgICAgICBjaGVja2JveDogeyByb290OiBcInN2X3FjYmNcIiwgaXRlbTogXCJzdl9xX2NoZWNrYm94XCIsIG90aGVyOiBcInN2X3Ffb3RoZXJcIiB9LFxyXG4gICAgICAgIGNvbW1lbnQ6IFwiXCIsXHJcbiAgICAgICAgZHJvcGRvd246IFwiXCIsXHJcbiAgICAgICAgbWF0cml4OiB7IHJvb3Q6IFwic3ZfcV9tYXRyaXhcIiB9LFxyXG4gICAgICAgIG1hdHJpeGRyb3Bkb3duOiB7IHJvb3Q6IFwic3ZfcV9tYXRyaXhcIiB9LFxyXG4gICAgICAgIG1hdHJpeGR5bmFtaWM6IHsgcm9vdDogXCJ0YWJsZVwiLCBidXR0b246IFwiXCIgfSxcclxuICAgICAgICBtdWx0aXBsZXRleHQ6IHsgcm9vdDogXCJcIiwgaXRlbVRpdGxlOiBcIlwiLCBpdGVtVmFsdWU6IFwiXCIgfSxcclxuICAgICAgICByYWRpb2dyb3VwOiB7IHJvb3Q6IFwic3ZfcWNiY1wiLCBpdGVtOiBcInN2X3FfcmFkaW9ncm91cFwiLCBvdGhlcjogXCJzdl9xX290aGVyXCIgfSxcclxuICAgICAgICByYXRpbmc6IHsgcm9vdDogXCJzdl9xX3JhdGluZ1wiLCBpdGVtOiBcIlwiIH0sXHJcbiAgICAgICAgdGV4dDogXCJcIlxyXG4gICAgfTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9wYWdlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUm93IGV4dGVuZHMgUXVlc3Rpb25Sb3dNb2RlbCB7XHJcbiAgICAgICAga29WaXNpYmxlOiBhbnk7IFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwYWdlOiBQYWdlTW9kZWwsIHB1YmxpYyBxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHBhZ2UsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGUgPSBrby5vYnNlcnZhYmxlKHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZpc2libGVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvVmlzaWJsZSh0aGlzLnZpc2libGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMga29BZnRlclJlbmRlcihlbCwgY29uKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB0RWwgPSBlbFtpXTtcclxuICAgICAgICAgICAgICAgIHZhciBuTmFtZSA9IHRFbC5ub2RlTmFtZTtcclxuICAgICAgICAgICAgICAgIGlmIChuTmFtZSA9PSBcIiN0ZXh0XCIpIHRFbC5kYXRhID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZSBleHRlbmRzIFBhZ2VNb2RlbCB7XHJcbiAgICAgICAga29ObzogYW55OyBcclxuICAgICAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvTm8gPSBrby5vYnNlcnZhYmxlKFwiXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlUm93KHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBRdWVzdGlvblJvd01vZGVsIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJvdyh0aGlzLCBxdWVzdGlvbik7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DcmVhdGluZygpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbk51bUNoYW5nZWQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLmtvTm8odmFsdWUgPiAwID8gdmFsdWUgKyBcIi4gXCIgOiBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcInBhZ2VcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFBhZ2UoKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25iYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25JbXBsZW1lbnRvckJhc2Uge1xyXG4gICAgICAgIGtvVmlzaWJsZTogYW55OyBrb0Vycm9yczogYW55OyBrb01hcmdpbkxlZnQ6IGFueTsga29QYWRkaW5nUmlnaHQ6IGFueTsga29SZW5kZXJXaWR0aDogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgcXVlc3Rpb24udmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZpc2liaWxpdHlDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uUmVuZGVyV2lkdGhDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMua29WaXNpYmxlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnF1ZXN0aW9uLnZpc2libGUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvUmVuZGVyV2lkdGggPSBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb24ucmVuZGVyV2lkdGgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvRXJyb3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29NYXJnaW5MZWZ0ID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5rb1JlbmRlcldpZHRoKCk7IHJldHVybiBzZWxmLmdldEluZGVudFNpemUoc2VsZi5xdWVzdGlvbi5pbmRlbnQpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1BhZGRpbmdSaWdodCA9IGtvLm9ic2VydmFibGUoc2VsZi5nZXRJbmRlbnRTaXplKHNlbGYucXVlc3Rpb24ucmlnaHRJbmRlbnQpKTsgXHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1Zpc2libGVcIl0gPSB0aGlzLmtvVmlzaWJsZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvUmVuZGVyV2lkdGhcIl0gPSB0aGlzLmtvUmVuZGVyV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0Vycm9yc1wiXSA9IHRoaXMua29FcnJvcnM7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb01hcmdpbkxlZnRcIl0gPSB0aGlzLmtvTWFyZ2luTGVmdDtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvUGFkZGluZ1JpZ2h0XCJdID0gdGhpcy5rb1BhZGRpbmdSaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmlzaWJpbGl0eUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WaXNpYmxlKHRoaXMucXVlc3Rpb24udmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblJlbmRlcldpZHRoQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1JlbmRlcldpZHRoKHRoaXMucXVlc3Rpb24ucmVuZGVyV2lkdGgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFkZGluZ1JpZ2h0KHRoaXMuZ2V0SW5kZW50U2l6ZSh0aGlzLnF1ZXN0aW9uLnJpZ2h0SW5kZW50KSk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEluZGVudFNpemUoaW5kZW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoaW5kZW50IDwgMSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5xdWVzdGlvbltcImRhdGFcIl0pIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgY3NzID0gdGhpcy5xdWVzdGlvbltcImRhdGFcIl1bXCJjc3NcIl07XHJcbiAgICAgICAgICAgIGlmICghY3NzKSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIGluZGVudCAqIGNzcy5xdWVzdGlvbi5pbmRlbnQgKyBcInB4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvcXVlc3Rpb25iYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25JbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3JCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGlzVXBkYXRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGtvRHVtbXk6IGFueTtcclxuICAgICAgICBrb1ZhbHVlOiBhbnk7IGtvQ29tbWVudDogYW55OyBrb1RpdGxlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgcXVlc3Rpb24udmFsdWVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25WYWx1ZUNoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgcXVlc3Rpb24uY29tbWVudENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvbW1lbnRDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLmVycm9yc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkVycm9yc0NoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgcXVlc3Rpb24udGl0bGVDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25WaXNpYmxlSW5kZXhDaGFuZ2VkKCk7IH1cclxuICAgICAgICAgICAgcXVlc3Rpb24udmlzaWJsZUluZGV4Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uVmlzaWJsZUluZGV4Q2hhbmdlZCgpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmtvRHVtbXkgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSB0aGlzLmNyZWF0ZWtvVmFsdWUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQgPSBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb24uY29tbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMua29UaXRsZSA9IGtvLnB1cmVDb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYua29EdW1teSgpOyByZXR1cm4gc2VsZi5xdWVzdGlvbi5mdWxsVGl0bGU7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvRXJyb3JzKHRoaXMucXVlc3Rpb24uZXJyb3JzKTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1ZhbHVlXCJdID0gdGhpcy5rb1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29Db21tZW50XCJdID0gdGhpcy5rb0NvbW1lbnQ7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1RpdGxlXCJdID0gdGhpcy5rb1RpdGxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVXBkYXRpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRrb1ZhbHVlKHRoaXMucXVlc3Rpb24udmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Db21tZW50Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGRhdGluZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmtvQ29tbWVudCh0aGlzLnF1ZXN0aW9uLmNvbW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WaXNpYmlsaXR5Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGUodGhpcy5xdWVzdGlvbi52aXNpYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmlzaWJsZUluZGV4Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0R1bW15KHRoaXMua29EdW1teSgpICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkVycm9yc0NoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy5xdWVzdGlvbi5lcnJvcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRla29WYWx1ZSgpOiBhbnkgeyByZXR1cm4ga28ub2JzZXJ2YWJsZSh0aGlzLnF1ZXN0aW9uLnZhbHVlKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRrb1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZVZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1VwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmlzVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZUNvbW1lbnQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5pc1VwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRObygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvbi52aXNpYmxlSW5kZXggPiAtMSA/IHRoaXMucXVlc3Rpb24udmlzaWJsZUluZGV4ICsgMSArIFwiLiBcIiA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvcXVlc3Rpb24udHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblNlbGVjdEJhc2VJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3J7XHJcbiAgICAgICAga29PdGhlclZpc2libGU6IGFueTsga29WaXNpYmxlQ2hvaWNlczogYW55OyBcclxuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtvT3RoZXJWaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvVmFsdWUoKTsgcmV0dXJuIHNlbGYuaXNPdGhlclNlbGVjdGVkOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGVDaG9pY2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KCg8UXVlc3Rpb25DaGVja2JveEJhc2U+c2VsZi5xdWVzdGlvbikudmlzaWJsZUNob2ljZXMpO1xyXG4gICAgICAgICAgICAoPFF1ZXN0aW9uQ2hlY2tib3hCYXNlPnF1ZXN0aW9uKS5jaG9pY2VzQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmtvVmlzaWJsZUNob2ljZXMoKDxRdWVzdGlvbkNoZWNrYm94QmFzZT5zZWxmLnF1ZXN0aW9uKS52aXNpYmxlQ2hvaWNlcyk7IH07XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb090aGVyVmlzaWJsZVwiXSA9IHRoaXMua29PdGhlclZpc2libGU7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1Zpc2libGVDaG9pY2VzXCJdID0gdGhpcy5rb1Zpc2libGVDaG9pY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8UXVlc3Rpb25TZWxlY3RCYXNlPnRoaXMucXVlc3Rpb24pLmlzT3RoZXJTZWxlY3RlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveEJhc2VJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uU2VsZWN0QmFzZUltcGxlbWVudG9yIHtcclxuICAgICAgICBrb1dpZHRoOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5rb1dpZHRoID0ga28ub2JzZXJ2YWJsZSh0aGlzLmNvbFdpZHRoKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvV2lkdGhcIl0gPSB0aGlzLmtvV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0FmdGVyUmVuZGVyXCJdID0gdGhpcy5rb0FmdGVyUmVuZGVyO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25DaGVja2JveEJhc2U+dGhpcy5xdWVzdGlvbikuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Db2xDb3VudENoYW5nZWQoKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ29sQ291bnRDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29XaWR0aFwiXSA9IGtvLm9ic2VydmFibGUodGhpcy5jb2xXaWR0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgY29sV2lkdGgoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGNvbENvdW50ID0gKDxRdWVzdGlvbkNoZWNrYm94QmFzZT50aGlzLnF1ZXN0aW9uKS5jb2xDb3VudDtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbENvdW50ID4gMCA/ICgxMDAgLyBjb2xDb3VudCkgKyAnJScgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGtvQWZ0ZXJSZW5kZXIoZWwsIGNvbikge1xyXG4gICAgICAgICAgICB2YXIgdEVsID0gZWxbMF07XHJcbiAgICAgICAgICAgIGlmICh0RWwubm9kZU5hbWUgPT0gXCIjdGV4dFwiKSB0RWwuZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRFbCA9IGVsW2VsLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICBpZiAodEVsLm5vZGVOYW1lID09IFwiI3RleHRcIikgdEVsLmRhdGEgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9jaGVja2JveC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJrb3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGNsYXNzIFF1ZXN0aW9uQ2hlY2tib3hJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlSW1wbGVtZW50b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVrb1ZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9uLnZhbHVlID8ga28ub2JzZXJ2YWJsZUFycmF5KHRoaXMucXVlc3Rpb24udmFsdWUpIDoga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRrb1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUoW10uY29uY2F0KG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUoW10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ2hlY2tib3ggZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvbkNoZWNrYm94SW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwiY2hlY2tib3hcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ2hlY2tib3goXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjaGVja2JveFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkNoZWNrYm94KG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9jb21tZW50LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50IGV4dGVuZHMgUXVlc3Rpb25Db21tZW50TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvbkltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImNvbW1lbnRcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImNvbW1lbnRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNvbW1lbnQobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2Ryb3Bkb3duLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Ecm9wZG93biBleHRlbmRzIFF1ZXN0aW9uRHJvcGRvd25Nb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uU2VsZWN0QmFzZUltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImRyb3Bkb3duXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkRyb3Bkb3duKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25Ecm9wZG93bihuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fZmlsZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJrb3F1ZXN0aW9uLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBjbGFzcyBRdWVzdGlvbkZpbGVJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3Ige1xyXG4gICAgICAgIGtvRGF0YVVwZGF0ZXI6IGFueTsga29EYXRhOiBhbnk7IGtvSGFzVmFsdWU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29EYXRhVXBkYXRlciA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgICAgIHRoaXMua29EYXRhID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvRGF0YVVwZGF0ZXIoKTsgcmV0dXJuICg8UXVlc3Rpb25GaWxlTW9kZWw+c2VsZi5xdWVzdGlvbikucHJldmlld1ZhbHVlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0hhc1ZhbHVlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0RhdGFcIl0gPSB0aGlzLmtvRGF0YTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvSGFzVmFsdWVcIl0gPSB0aGlzLmtvSGFzVmFsdWU7XHJcblxyXG4gICAgICAgICAgICAoPFF1ZXN0aW9uRmlsZU1vZGVsPnRoaXMucXVlc3Rpb24pLnByZXZpZXdWYWx1ZUxvYWRlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uTG9hZFByZXZpZXcoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImRvY2hhbmdlXCJdID0gZnVuY3Rpb24gKGRhdGEsIGV2ZW50KSB7IHZhciBzcmMgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDsgc2VsZi5vbkNoYW5nZShzcmMpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uQ2hhbmdlKHNyYzogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghd2luZG93W1wiRmlsZVJlYWRlclwiXSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoIXNyYyB8fCAhc3JjLmZpbGVzIHx8IHNyYy5maWxlcy5sZW5ndGggPCAxKSByZXR1cm47XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25GaWxlTW9kZWw+dGhpcy5xdWVzdGlvbikubG9hZEZpbGUoc3JjLmZpbGVzWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvbkxvYWRQcmV2aWV3KCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvRGF0YVVwZGF0ZXIodGhpcy5rb0RhdGFVcGRhdGVyKCkgKyAxKTtcclxuICAgICAgICAgICAgdGhpcy5rb0hhc1ZhbHVlKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkZpbGUgZXh0ZW5kcyBRdWVzdGlvbkZpbGVNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uRmlsZUltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImZpbGVcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uRmlsZShcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImZpbGVcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkZpbGUobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2h0bWwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwia29xdWVzdGlvbmJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkh0bWwgZXh0ZW5kcyBRdWVzdGlvbkh0bWxNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3JCYXNlKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImh0bWxcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbChcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImh0bWxcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkh0bWwobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX21hdHJpeC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeFJvdyBleHRlbmRzIE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZywgZGF0YTogSU1hdHJpeERhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSwgdGV4dCwgZnVsbE5hbWUsIGRhdGEsIHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNWYWx1ZVVwZGF0aW5nKSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXggZXh0ZW5kcyBRdWVzdGlvbk1hdHJpeE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25JbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgZnVsbE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhSb3cobmFtZSwgdGV4dCwgZnVsbE5hbWUsIHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJtYXRyaXhcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4KFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4KG5hbWUpOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmNvbHVtbnMgPSBbXCJDb2x1bW4gMVwiLCBcIkNvbHVtbiAyXCIsIFwiQ29sdW1uIDNcIl07IHJldHVybiBxOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEcm9wZG93biBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwibWF0cml4ZHJvcGRvd25cIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd24oXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEeW5hbWljSW1wbGVtZW50b3IgZXh0ZW5kcyBRdWVzdGlvbkltcGxlbWVudG9yIHtcclxuICAgICAgICBrb1Jvd3M6IGFueTsga29SZWNhbGM6IGFueTtcclxuICAgICAgICBrb0FkZFJvd0NsaWNrOiBhbnk7IGtvUmVtb3ZlUm93Q2xpY2s6IGFueTsga29PdmVyZmxvd1g6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmtvUmVjYWxjID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICAgICAgdGhpcy5rb1Jvd3MgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1JlY2FsYygpOyByZXR1cm4gKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikuY2FjaGVkVmlzaWJsZVJvd3M7XHJcbiAgICAgICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLmtvT3ZlcmZsb3dYID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAoPFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2U+dGhpcy5xdWVzdGlvbikuaG9yaXpvbnRhbFNjcm9sbCA/IFwic2Nyb2xsXCI6IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvUm93c1wiXSA9IHRoaXMua29Sb3dzO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29BZGRSb3dDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hZGRSb3coKTsgfVxyXG4gICAgICAgICAgICB0aGlzLmtvUmVtb3ZlUm93Q2xpY2sgPSBmdW5jdGlvbiAoZGF0YSkgeyBzZWxmLnJlbW92ZVJvdyhkYXRhKTsgfVxyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29BZGRSb3dDbGlja1wiXSA9IHRoaXMua29BZGRSb3dDbGljaztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvUmVtb3ZlUm93Q2xpY2tcIl0gPSB0aGlzLmtvUmVtb3ZlUm93Q2xpY2s7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb092ZXJmbG93WFwiXSA9IHRoaXMua29PdmVyZmxvd1g7XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLnJvd0NvdW50Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uUm93Q291bnRDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLmNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Db2x1bW5DaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLnVwZGF0ZUNlbGxzQ2FsbGJhayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblVwZGF0ZUNlbGxzKCk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblVwZGF0ZUNlbGxzKCkge1xyXG4gICAgICAgICAgICAvL0dlbmVyZWF0ZSByb3dzIGFnYWluLlxyXG4gICAgICAgICAgICB2YXIgcm93cyA9ICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pW1wiZ2VuZXJhdGVkVmlzaWJsZVJvd3NcIl07XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5zID0gKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikuY29sdW1ucztcclxuICAgICAgICAgICAgaWYgKHJvd3MgJiYgcm93cy5sZW5ndGggPiAwICYmIGNvbHVtbnMgJiYgY29sdW1ucy5sZW5ndGggPiAwKSB0aGlzLm9uQ29sdW1uQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Db2x1bW5DaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2YXIgcm93cyA9ICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLnZpc2libGVSb3dzO1xyXG4gICAgICAgICAgICB0aGlzLm9uUm93Q291bnRDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblJvd0NvdW50Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1JlY2FsYyh0aGlzLmtvUmVjYWxjKCkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGFkZFJvdygpIHtcclxuICAgICAgICAgICAgKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikuYWRkUm93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCByZW1vdmVSb3cocm93OiBNYXRyaXhEeW5hbWljUm93TW9kZWwpIHtcclxuICAgICAgICAgICAgdmFyIHJvd3MgPSAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5jYWNoZWRWaXNpYmxlUm93cztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcm93cy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5yZW1vdmVSb3coaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeER5bmFtaWMgZXh0ZW5kcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pY0ltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcIm1hdHJpeGR5bmFtaWNcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pYyhcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeGR5bmFtaWNcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NYXRyaXhEeW5hbWljKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEucm93Q291bnQgPSAyOyBxLmFkZENvbHVtbihcIkNvbHVtbiAxXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAyXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAzXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTXVsdGlwbGVUZXh0SXRlbSBleHRlbmRzIE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7XHJcbiAgICAgICAgcHJpdmF0ZSBpc0tPVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSwgdGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuaXNLT1ZhbHVlVXBkYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvblZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNLT1ZhbHVlVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzS09WYWx1ZVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk11bHRpcGxlVGV4dEltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25JbXBsZW1lbnRvciB7XHJcbiAgICAgICAga29Sb3dzOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5rb1Jvd3MgPSBrby5vYnNlcnZhYmxlQXJyYXkoKDxRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsPnRoaXMucXVlc3Rpb24pLmdldFJvd3MoKSk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1Jvd3NcIl0gPSB0aGlzLmtvUm93cztcclxuICAgICAgICAgICAgdGhpcy5vbkNvbENvdW50Q2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbD50aGlzLnF1ZXN0aW9uKS5jb2xDb3VudENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvbENvdW50Q2hhbmdlZCgpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Db2xDb3VudENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29Sb3dzKCg8UXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbD50aGlzLnF1ZXN0aW9uKS5nZXRSb3dzKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHQgZXh0ZW5kcyBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVRleHRJdGVtKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbShuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbShcIlwiKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcIm11bHRpcGxldGV4dFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHQoXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtdWx0aXBsZXRleHRcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHQobmFtZSk7IHEuQWRkSXRlbShcInRleHQxXCIpOyBxLkFkZEl0ZW0oXCJ0ZXh0MlwiKTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhZGlvZ3JvdXAgZXh0ZW5kcyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uQ2hlY2tib3hCYXNlSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwicmFkaW9ncm91cFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvblJhZGlvZ3JvdXAobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX3JhdGluZy50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgY2xhc3MgUXVlc3Rpb25SYXRpbmdJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3Ige1xyXG4gICAgICAgIGtvVmlzaWJsZVJhdGVWYWx1ZXM6IGFueTsga29DaGFuZ2U6IGFueTsga29Dc3M6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmlzaWJsZVJhdGVWYWx1ZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkodGhpcy5nZXRWYWx1ZXMoKSk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1Zpc2libGVSYXRlVmFsdWVzXCJdID0gdGhpcy5rb1Zpc2libGVSYXRlVmFsdWVzO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29DaGFuZ2UgPSBmdW5jdGlvbiAodmFsKSB7IHNlbGYua29WYWx1ZSh2YWwuaXRlbVZhbHVlKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvQ2hhbmdlXCJdID0gdGhpcy5rb0NoYW5nZTtcclxuICAgICAgICAgICAgKDxRdWVzdGlvblJhdGluZz50aGlzLnF1ZXN0aW9uKS5yYXRlVmFsdWVzQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uUmF0ZVZhbHVlc0NoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvR2V0Q3NzXCJdID0gZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNzcyA9ICg8UXVlc3Rpb25SYXRpbmc+c2VsZi5xdWVzdGlvbikuaXRlbUNzcztcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnF1ZXN0aW9uW1wia29WYWx1ZVwiXSgpID09IHZhbC52YWx1ZSA/IGNzcyArIFwiIGFjdGl2ZVwiIDogY3NzOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25SYXRlVmFsdWVzQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGVSYXRlVmFsdWVzKHRoaXMuZ2V0VmFsdWVzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFZhbHVlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuICg8UXVlc3Rpb25SYXRpbmc+dGhpcy5xdWVzdGlvbikudmlzaWJsZVJhdGVWYWx1ZXM7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25SYXRpbmcgZXh0ZW5kcyBRdWVzdGlvblJhdGluZ01vZGVsIHtcclxuICAgICAgICBwdWJsaWMgaXRlbUNzczogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvblJhdGluZ0ltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1Dc3MgPSB0aGlzLmRhdGFbXCJjc3NcIl0ucmF0aW5nLml0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwicmF0aW5nXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZyhcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhdGluZ1wiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nKG5hbWUpOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl90ZXh0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25UZXh0IGV4dGVuZHMgUXVlc3Rpb25UZXh0TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvbkltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcInRleHRcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dChcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInRleHRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHQobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUJhc2UgZXh0ZW5kcyBTdXJ2ZXlNb2RlbCB7XHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHByaXZhdGUgY3NzVmFsdWU6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25SZW5kZXJlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+KCk7XHJcblxyXG4gICAgICAgIGtvQ3VycmVudFBhZ2U6IGFueTsga29Jc0ZpcnN0UGFnZTogYW55OyBrb0lzTGFzdFBhZ2U6IGFueTsgZHVtbXlPYnNlcnZhYmxlOiBhbnk7IGtvU3RhdGU6IGFueTtcclxuICAgICAgICBrb1Byb2dyZXNzOiBhbnk7IGtvUHJvZ3Jlc3NUZXh0OiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSA9IG51bGwsIHJlbmRlcmVkRWxlbWVudDogYW55ID0gbnVsbCwgY3NzOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGpzb25PYmopO1xyXG4gICAgICAgICAgICBpZiAoY3NzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNzcyA9IGNzcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVuZGVyZWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IHJlbmRlcmVkRWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGtvID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IEVycm9yKCdrbm9ja291dGpzIGxpYnJhcnkgaXMgbm90IGxvYWRlZC4nKTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIocmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjc3NOYXZpZ2F0aW9uQ29tcGxldGUoKSB7IHJldHVybiB0aGlzLmdldE5hdmlnYXRpb25Dc3ModGhpcy5jc3MubmF2aWdhdGlvbkJ1dHRvbiwgdGhpcy5jc3MubmF2aWdhdGlvbi5jb21wbGV0ZSk7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNzc05hdmlnYXRpb25QcmV2KCkgeyByZXR1cm4gdGhpcy5nZXROYXZpZ2F0aW9uQ3NzKHRoaXMuY3NzLm5hdmlnYXRpb25CdXR0b24sIHRoaXMuY3NzLm5hdmlnYXRpb24ucHJldik7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNzc05hdmlnYXRpb25OZXh0KCkgeyByZXR1cm4gdGhpcy5nZXROYXZpZ2F0aW9uQ3NzKHRoaXMuY3NzLm5hdmlnYXRpb25CdXR0b24sIHRoaXMuY3NzLm5hdmlnYXRpb24ubmV4dCk7IH1cclxuICAgICAgICBwcml2YXRlIGdldE5hdmlnYXRpb25Dc3MobWFpbjogc3RyaW5nLCBidG46IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKG1haW4pIHJlcyA9IG1haW47XHJcbiAgICAgICAgICAgIGlmIChidG4pIHJlcyArPSAnICcgKyBidG47XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY3NzKCk6IGFueSB7IHJldHVybiB0aGlzLmNzc1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjc3ModmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHZhbHVlLCB0aGlzLmNzc1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbmRlcihlbGVtZW50OiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmdldFRlbXBsYXRlKCk7XHJcbiAgICAgICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICAgICAgICAgIHNlbGYub25SZW5kZXJlZC5maXJlKHNlbGYsIHt9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCwgcmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJlZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gcmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLmxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRDb21wbGV0ZWQoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLnNldENvbXBsZXRlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1BhZ2UobmFtZTogc3RyaW5nKSB7IHJldHVybiBuZXcgUGFnZShuYW1lKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDc3NPYmplY3QoKTogYW55IHsgcmV0dXJuIG51bGw7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHsgdGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIG92ZXJyaWRlIHRoaXMgbWV0aG9kXCIpOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQmVmb3JlQ3JlYXRpbmcoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jc3NWYWx1ZSA9IHRoaXMuY3JlYXRlQ3NzT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICAgICAgdGhpcy5rb0N1cnJlbnRQYWdlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5jdXJyZW50UGFnZTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc0ZpcnN0UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuaXNGaXJzdFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNMYXN0UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuaXNMYXN0UGFnZTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Qcm9ncmVzc1RleHQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLnByb2dyZXNzVGV4dDsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Qcm9ncmVzcyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuZ2V0UHJvZ3Jlc3MoKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29TdGF0ZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuc3RhdGU7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlOiBQYWdlTW9kZWwsIG9sZFZhbHVlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgICAgIHN1cGVyLmN1cnJlbnRQYWdlQ2hhbmdlZChuZXdWYWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcHBseUJpbmRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZW5kZXJlZEVsZW1lbnQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgICAgIGtvLmNsZWFuTm9kZSh0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZUtvQ3VycmVudFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5d2luZG93LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvc3VydmV5LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5V2luZG93QmFzZSBleHRlbmRzIFN1cnZleVdpbmRvd01vZGVsIHtcclxuICAgICAgICBrb0V4cGFuZGVkOiBhbnk7XHJcbiAgICAgICAgZG9FeHBhbmQ6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoanNvbk9iaik7XHJcbiAgICAgICAgICAgIHRoaXMua29FeHBhbmRlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuZG9FeHBhbmQgPSBmdW5jdGlvbiAoKSB7IHNlbGYuY2hhbmdlRXhwYW5kZWQoKTsgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4geyBzZWxmLm9uQ29tcGxldGUoKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVTdXJ2ZXkoanNvbk9iajogYW55KTogU3VydmV5TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1cnZleUJhc2UoanNvbk9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGV4cGFuZGNvbGxhcHNlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLmV4cGFuZGNvbGxhcHNlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5rb0V4cGFuZGVkKHRoaXMuaXNFeHBhbmRlZFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0ZW1wbGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZVZhbHVlID8gdGhpcy50ZW1wbGF0ZVZhbHVlIDogdGhpcy5nZXREZWZhdWx0VGVtcGxhdGUoKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXQgdGVtcGxhdGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnRlbXBsYXRlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzaG93KCkge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd0VsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcclxuICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd0VsZW1lbnQpO1xyXG4gICAgICAgICAgICAoPFN1cnZleT50aGlzLnN1cnZleSkucmVuZGVyKFN1cnZleVdpbmRvdy5zdXJ2ZXlFbGVtZW50TmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93aW5nVmFsdWUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdFRlbXBsYXRlKCk6IHN0cmluZyB7IHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBvdmVycmlkZSB0aGlzIG1ldGhvZFwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBoaWRlKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd2luZ1ZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlRXhwYW5kZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoIXRoaXMuaXNFeHBhbmRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25Db21wbGV0ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUZW1wbGF0ZVRleHRCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlcGxhY2VUZXh0KHJlcGxhY2VUZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIHF1ZXN0aW9uVHlwZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZCA9IHRoaXMuZ2V0SWQoaWQsIHF1ZXN0aW9uVHlwZSk7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLnRleHQuaW5kZXhPZihpZCk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKCc+JywgcG9zKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0UG9zID0gcG9zICsgMTtcclxuICAgICAgICAgICAgdmFyIGVuZFN0cmluZyA9IFwiPC9zY3JpcHQ+XCI7XHJcbiAgICAgICAgICAgIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKGVuZFN0cmluZywgc3RhcnRQb3MpO1xyXG4gICAgICAgICAgICBpZiAocG9zIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0aGlzLnRleHQuc3Vic3RyKDAsIHN0YXJ0UG9zKSArIHJlcGxhY2VUZXh0ICsgdGhpcy50ZXh0LnN1YnN0cihwb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0SWQoaWQ6IHN0cmluZywgcXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICdpZD1cInN1cnZleS0nICsgaWQ7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvblR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIi1cIiArIHF1ZXN0aW9uVHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ICsgJ1wiJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHsgIH1cclxuICAgIH1cclxufVxyXG4iLCJtb2R1bGUgdGVtcGxhdGUua28geyBleHBvcnQgdmFyIGh0bWwgPSAnPHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktY29tbWVudFwiPiAgPGlucHV0IGRhdGEtYmluZD1cInZhbHVlOiRkYXRhLnF1ZXN0aW9uLmtvQ29tbWVudCwgdmlzaWJsZTokZGF0YS52aXNpYmxlLCBjc3M6ICRyb290LmNzcy5xdWVzdGlvbi5jb21tZW50XCIgLz48L3NjcmlwdD48ZGl2IGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnJvb3RcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAodGl0bGUubGVuZ3RoID4gMCkgJiYgc2hvd1RpdGxlICYmIGtvU3RhdGUoKSAhPSBcXCdjb21wbGV0ZWRcXCcsIGNzczogJHJvb3QuY3NzLmhlYWRlclwiPiAgICAgICAgPGgzIGRhdGEtYmluZD1cInRleHQ6dGl0bGVcIj48L2gzPiAgICA8L2Rpdj4gICAgPCEtLSBrbyBpZjoga29TdGF0ZSgpID09IFwicnVubmluZ1wiIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLmJvZHlcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd1Byb2dyZXNzQmFyID09XFwndG9wXFwnLCB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcHJvZ3Jlc3NcXCcsIGRhdGE6ICRkYXRhIH1cIj48L2Rpdj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXBhZ2VcXCcsIGRhdGE6IGtvQ3VycmVudFBhZ2UgfVwiPjwvZGl2PiAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiIGRhdGEtYmluZD1cInZpc2libGU6IHNob3dQcm9ncmVzc0JhciA9PVxcJ2JvdHRvbVxcJywgdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXByb2dyZXNzXFwnLCBkYXRhOiAkZGF0YSB9XCI+PC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHNob3dOYXZpZ2F0aW9uQnV0dG9ucyAmJiAhaXNEZXNpZ25Nb2RlLCBjc3M6ICRyb290LmNzcy5mb290ZXJcIj4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwidmFsdWU6IHBhZ2VQcmV2VGV4dCwgY2xpY2s6IHByZXZQYWdlLCB2aXNpYmxlOiAha29Jc0ZpcnN0UGFnZSgpLCBjc3M6ICRyb290LmNzc05hdmlnYXRpb25QcmV2XCIgLz4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwidmFsdWU6IHBhZ2VOZXh0VGV4dCwgY2xpY2s6IG5leHRQYWdlLCB2aXNpYmxlOiAha29Jc0xhc3RQYWdlKCksIGNzczogJHJvb3QuY3NzTmF2aWdhdGlvbk5leHRcIiAvPiAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogY29tcGxldGVUZXh0LCBjbGljazogY29tcGxldGVMYXN0UGFnZSwgdmlzaWJsZToga29Jc0xhc3RQYWdlKCksIGNzczogJHJvb3QuY3NzTmF2aWdhdGlvbkNvbXBsZXRlXCIgLz4gICAgPC9kaXY+ICAgIDwhLS0gL2tvIC0tPiAgICA8IS0tIGtvIGlmOiBrb1N0YXRlKCkgPT0gXCJjb21wbGV0ZWRcIiAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJodG1sOiBwcm9jZXNzZWRDb21wbGV0ZWRIdG1sXCI+PC9kaXY+ICAgIDwhLS0gL2tvIC0tPiAgICA8IS0tIGtvIGlmOiBrb1N0YXRlKCkgPT0gXCJsb2FkaW5nXCIgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwiaHRtbDogcHJvY2Vzc2VkTG9hZGluZ0h0bWxcIj48L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDwhLS0ga28gaWY6IGtvU3RhdGUoKSA9PSBcImVtcHR5XCIgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDplbXB0eVN1cnZleVRleHQsIGNzczogJHJvb3QuY3NzLmJvZHlcIj48L2Rpdj4gICAgPCEtLSAva28gLS0+PC9kaXY+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcGFnZVwiPiAgICA8aDQgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHByb2Nlc3NlZFRpdGxlLCBjc3M6ICRyb290LmNzcy5wYWdlVGl0bGVcIj48L2g0PiAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcm93cywgYXM6IFxcJ3Jvd1xcJ30gLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcm93LmtvVmlzaWJsZSwgY3NzOiAkcm9vdC5jc3Mucm93XCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcm93LnF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnICwgYWZ0ZXJSZW5kZXI6IHJvdy5rb0FmdGVyUmVuZGVyIH0gLS0+ICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb25cXCcsIGRhdGE6IHF1ZXN0aW9uIH0gLS0+PCEtLSAva28gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9kaXY+ICAgIDwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXByb2dyZXNzXCI+ICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDo2MCU7XCIgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MucHJvZ3Jlc3NcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MucHJvZ3Jlc3NCYXIsIHN0eWxlOnt3aWR0aDoga29Qcm9ncmVzcygpICsgXFwnJVxcJ31cIiAgICAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbWluPVwiMFwiICAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCIxMDBcIj4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OmtvUHJvZ3Jlc3NUZXh0XCI+PC9zcGFuPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWNoZWNrYm94XCI+ICAgIDxmb3JtIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLmNoZWNrYm94LnJvb3RcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi5rb1Zpc2libGVDaG9pY2VzLCBhczogXFwnaXRlbVxcJywgYWZ0ZXJSZW5kZXI6IHF1ZXN0aW9uLmtvQWZ0ZXJSZW5kZXJ9ICAtLT4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwic3R5bGU6e3dpZHRoOiBxdWVzdGlvbi5rb1dpZHRoLCBcXCdtYXJnaW4tcmlnaHRcXCc6IHF1ZXN0aW9uLmNvbENvdW50ID09IDAgPyBcXCc1cHhcXCc6IFxcJzBweFxcJ30sIGNzczogJHJvb3QuY3NzLmNoZWNrYm94Lml0ZW1cIj4gICAgICAgICAgICA8bGFiZWwgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MuY2hlY2tib3guaXRlbVwiPiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHF1ZXN0aW9uLm5hbWUsIHZhbHVlOiBpdGVtLnZhbHVlfSwgY2hlY2tlZDogcXVlc3Rpb24ua29WYWx1ZVwiIC8+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGV4dFwiPjwvc3Bhbj4gICAgICAgICAgICA8L2xhYmVsPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXIgJiYgKCRpbmRleCgpID09IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMoKS5sZW5ndGgtMSlcIj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogcXVlc3Rpb24ua29PdGhlclZpc2libGUgfSB9LCBjc3M6ICRyb290LmNzcy5jaGVja2JveC5vdGhlclwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9mb3JtPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWNvbW1lbnRcIj4gICAgPHRleHRhcmVhIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwiYXR0cjoge2NvbHM6IHF1ZXN0aW9uLmNvbHMsIHJvd3M6IHF1ZXN0aW9uLnJvd3N9LCB2YWx1ZTpxdWVzdGlvbi5rb1ZhbHVlLCBjc3M6ICRyb290LmNzcy5jb21tZW50XCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1kcm9wZG93blwiPiAgICA8c2VsZWN0IGRhdGEtYmluZD1cIm9wdGlvbnM6IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCBvcHRpb25zVmFsdWU6IFxcJ3ZhbHVlXFwnLCB2YWx1ZTogcXVlc3Rpb24ua29WYWx1ZSwgb3B0aW9uc0NhcHRpb246IHF1ZXN0aW9uLm9wdGlvbnNDYXB0aW9uLCBjc3M6ICRyb290LmNzcy5kcm9wZG93blwiPjwvc2VsZWN0PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uLCBcXCd2aXNpYmxlXFwnOiBxdWVzdGlvbi5rb090aGVyVmlzaWJsZSB9IH1cIj48L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tZXJyb3JzXCI+ICAgIDxkaXYgcm9sZT1cImFsZXJ0XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29FcnJvcnMoKS5sZW5ndGggPiAwLCBmb3JlYWNoOiB7IGRhdGE6IGtvRXJyb3JzLCBhczogXFwnZXJyb3JcXCd9LCBjc3M6ICRyb290LmNzcy5lcnJvci5yb290XCI+ICAgICAgICA8ZGl2PiAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLmVycm9yLmljb25cIj48L3NwYW4+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDplcnJvci5nZXRUZXh0KCksIGNzczogJHJvb3QuY3NzLmVycm9yLml0ZW1cIj48L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tZmlsZVwiPiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBkYXRhLWJpbmQ9XCJldmVudDoge2NoYW5nZTogZG9jaGFuZ2V9XCI+ICAgIDxkaXY+ICAgICAgICA8aW1nIGRhdGEtYmluZD1cImF0dHI6IHsgc3JjOiBxdWVzdGlvbi5rb0RhdGEsIGhlaWdodDogcXVlc3Rpb24uaW1hZ2VIZWlnaHQsIHdpZHRoOiBxdWVzdGlvbi5pbWFnZVdpZHRoIH0sIHZpc2libGU6IHF1ZXN0aW9uLmtvSGFzVmFsdWVcIj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24taHRtbFwiPiAgICA8ZGl2IGRhdGEtYmluZD1cImh0bWw6IHF1ZXN0aW9uLnByb2Nlc3NlZEh0bWxcIj48L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tYXRyaXhcIj4gICAgPHRhYmxlIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLm1hdHJpeC5yb290XCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzUm93c1wiPjwvdGg+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6JGRhdGEudGV4dFwiPjwvdGg+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3RoZWFkPiAgICAgICAgPHRib2R5PiAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlUm93cywgYXM6IFxcJ3Jvd1xcJyB9IC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc1Jvd3MsIHRleHQ6cm93LnRleHRcIj48L3RkPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmNvbHVtbnMgLS0+ICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBkYXRhLWJpbmQ9XCJhdHRyOiB7bmFtZTogcm93LmZ1bGxOYW1lLCB2YWx1ZTogJGRhdGEudmFsdWV9LCBjaGVja2VkOiByb3cua29WYWx1ZVwiLz4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDwvdGJvZHk+ICAgIDwvdGFibGU+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tbWF0cml4ZHJvcGRvd25cIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJzdHlsZToge292ZXJmbG93WDogcXVlc3Rpb24uaG9yaXpvbnRhbFNjcm9sbD8gXFwnc2Nyb2xsXFwnOiBcXCdcXCd9XCI+ICAgICAgICA8dGFibGUgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MubWF0cml4ZHJvcGRvd24ucm9vdFwiPiAgICAgICAgICAgIDx0aGVhZD4gICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmNvbHVtbnMgLS0+ICAgICAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogcXVlc3Rpb24uZ2V0Q29sdW1uVGl0bGUoJGRhdGEpLCBzdHlsZTogeyBtaW5XaWR0aDogcXVlc3Rpb24uZ2V0Q29sdW1uV2lkdGgoJGRhdGEpIH1cIj48L3RoPiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgPC90aGVhZD4gICAgICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlUm93cywgYXM6IFxcJ3Jvd1xcJyB9IC0tPiAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidGV4dDpyb3cudGV4dFwiPjwvdGQ+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHJvdy5jZWxscy0tPiAgICAgICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArICRkYXRhLnF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogJGRhdGEucXVlc3Rpb24sIGFzOiBcXCdxdWVzdGlvblxcJyB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgPC90YWJsZT4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tbWF0cml4ZHluYW1pY1wiPiAgICA8ZGl2IGRhdGEtYmluZD1cInN0eWxlOiB7b3ZlcmZsb3dYOiBxdWVzdGlvbi5ob3Jpem9udGFsU2Nyb2xsPyBcXCdzY3JvbGxcXCc6IFxcJ1xcJ31cIj4gICAgICAgIDx0YWJsZSBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5tYXRyaXhkeW5hbWljLnJvb3RcIj4gICAgICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiBxdWVzdGlvbi5nZXRDb2x1bW5UaXRsZSgkZGF0YSksIHN0eWxlOiB7IG1pbldpZHRoOiBxdWVzdGlvbi5nZXRDb2x1bW5XaWR0aCgkZGF0YSkgfVwiPjwvdGg+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwvdGhlYWQ+ICAgICAgICAgICAgPHRib2R5PiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb24ua29Sb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcm93LmNlbGxzLS0+ICAgICAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tZXJyb3JzXFwnLCBkYXRhOiAkZGF0YS5xdWVzdGlvbiB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArICRkYXRhLnF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogJGRhdGEucXVlc3Rpb24sIGFzOiBcXCdxdWVzdGlvblxcJyB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6cXVlc3Rpb24ua29SZW1vdmVSb3dDbGljaywgY3NzOiAkcm9vdC5jc3MubWF0cml4ZHluYW1pYy5idXR0b24sIHZhbHVlOiBxdWVzdGlvbi5yZW1vdmVSb3dUZXh0XCIgLz48L3RkPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgPC90YWJsZT4gICAgPC9kaXY+ICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6cXVlc3Rpb24ua29BZGRSb3dDbGljaywgY3NzOiAkcm9vdC5jc3MubWF0cml4ZHluYW1pYy5idXR0b24sIHZhbHVlOiBxdWVzdGlvbi5hZGRSb3dUZXh0XCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tdWx0aXBsZXRleHRcIj4gICAgPHRhYmxlIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLm11bHRpcGxldGV4dC5yb290LCBmb3JlYWNoOiB7IGRhdGE6ICBxdWVzdGlvbi5rb1Jvd3MsIGFzOiBcXCdyb3dcXCcgfVwiPiAgICAgICAgPHRyIGRhdGEtYmluZD1cImZvcmVhY2g6IHsgZGF0YTogcm93LCBhczogXFwnaXRlbVxcJyB9XCI+ICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGl0bGUsIGNzczogJHJvb3QuY3NzLm11bHRpcGxldGV4dC5pdGVtVGl0bGVcIj48L3RkPiAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBzdHlsZT1cImZsb2F0OmxlZnRcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7c2l6ZTogcXVlc3Rpb24uaXRlbVNpemV9LCB2YWx1ZTogaXRlbS5rb1ZhbHVlLCBjc3M6ICRyb290LmNzcy5tdWx0aXBsZXRleHQuaXRlbVZhbHVlXCIgLz48L3RkPiAgICAgICAgPC90cj4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYWRpb2dyb3VwXCI+ICAgIDxmb3JtIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnJhZGlvZ3JvdXAucm9vdFwiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMsIGFzOiBcXCdpdGVtXFwnLCBhZnRlclJlbmRlcjogcXVlc3Rpb24ua29BZnRlclJlbmRlcn0gIC0tPiAgICAgICAgPGRpdiAgZGF0YS1iaW5kPVwic3R5bGU6e3dpZHRoOiBxdWVzdGlvbi5rb1dpZHRoLCBcXCdtYXJnaW4tcmlnaHRcXCc6IHF1ZXN0aW9uLmNvbENvdW50ID09IDAgPyBcXCc1cHhcXCc6IFxcJzBweFxcJ30sIGNzczogJHJvb3QuY3NzLnJhZGlvZ3JvdXAuaXRlbVwiPiAgICAgICAgICAgIDxsYWJlbCBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5yYWRpb2dyb3VwLml0ZW1cIj4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiBxdWVzdGlvbi5uYW1lLCB2YWx1ZTogaXRlbS52YWx1ZX0sIGNoZWNrZWQ6IHF1ZXN0aW9uLmtvVmFsdWVcIiAvPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRleHRcIj48L3NwYW4+ICAgICAgICAgICAgPC9sYWJlbD4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc090aGVyICYmICgkaW5kZXgoKSA9PSBxdWVzdGlvbi5rb1Zpc2libGVDaG9pY2VzKCkubGVuZ3RoLTEpXCI+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlfX0sIGNzczogJHJvb3QuY3NzLnJhZGlvZ3JvdXAub3RoZXJcIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPCEtLSAva28gLS0+ICAgIDwvZm9ybT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi10ZXh0XCI+ICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cImF0dHI6IHtzaXplOiBxdWVzdGlvbi5zaXplfSwgdmFsdWU6cXVlc3Rpb24ua29WYWx1ZSwgY3NzOiAkcm9vdC5jc3MudGV4dFwiLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvblwiPiAgICA8ZGl2IHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCIgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MucXVlc3Rpb24ucm9vdCwgc3R5bGU6IHtkaXNwbGF5OiBxdWVzdGlvbi5rb1Zpc2libGUoKSA/IFxcJ2lubGluZS1ibG9ja1xcJzogXFwnbm9uZVxcJywgbWFyZ2luTGVmdDogcXVlc3Rpb24ua29NYXJnaW5MZWZ0LCBwYWRkaW5nUmlnaHQ6IHF1ZXN0aW9uLmtvUGFkZGluZ1JpZ2h0LCB3aWR0aDogcXVlc3Rpb24ua29SZW5kZXJXaWR0aCB9LCBhdHRyOiB7aWQ6IGlkfVwiPiAgICAgICAgPCEtLSBrbyBpZjogcXVlc3Rpb24uaGFzVGl0bGUgLS0+ICAgICAgICA8aDUgZGF0YS1iaW5kPVwidmlzaWJsZTogJHJvb3QucXVlc3Rpb25UaXRsZUxvY2F0aW9uID09IFxcJ3RvcFxcJywgdGV4dDogcXVlc3Rpb24ua29UaXRsZSgpLCBjc3M6ICRyb290LmNzcy5xdWVzdGlvbi50aXRsZVwiPjwvaDU+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLWVycm9yc1xcJywgZGF0YTogcXVlc3Rpb24gfSAtLT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgcXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc0NvbW1lbnRcIj4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRleHQ6cXVlc3Rpb24uY29tbWVudFRleHRcIj48L2Rpdj4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uLCBcXCd2aXNpYmxlXFwnOiB0cnVlIH0gfVwiPjwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIGtvIGlmOiBxdWVzdGlvbi5oYXNUaXRsZSAtLT4gICAgICAgIDxoNSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcm9vdC5xdWVzdGlvblRpdGxlTG9jYXRpb24gPT0gXFwnYm90dG9tXFwnLCB0ZXh0OiBxdWVzdGlvbi5rb1RpdGxlKCksIGNzczogJHJvb3QuY3NzLnF1ZXN0aW9uLnRpdGxlXCI+PC9oNT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYXRpbmdcIj4gICAgPGRpdiBkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIiBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5yYXRpbmcucm9vdFwiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5rb1Zpc2libGVSYXRlVmFsdWVzIC0tPiAgICAgICAgPGxhYmVsIGRhdGEtYmluZD1cImNzczogcXVlc3Rpb24ua29HZXRDc3MoJGRhdGEpXCI+ICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiICAgICAgICAgICAgICAgICAgIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiBxdWVzdGlvbi5uYW1lLCBpZDogcXVlc3Rpb24ubmFtZSArICRpbmRleCgpLCB2YWx1ZTogJGRhdGEudmFsdWV9LCBldmVudDogeyBjaGFuZ2U6IHF1ZXN0aW9uLmtvQ2hhbmdlfVwiIC8+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogJGluZGV4KCkgPT0gMCwgdGV4dDogcXVlc3Rpb24ubWluaW51bVJhdGVEZXNjcmlwdGlvblwiPjwvc3Bhbj4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkZGF0YS50ZXh0XCI+PC9zcGFuPiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInZpc2libGU6ICRpbmRleCgpID09IChxdWVzdGlvbi5rb1Zpc2libGVSYXRlVmFsdWVzKCkubGVuZ3RoLTEpLCB0ZXh0OiBxdWVzdGlvbi5tYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCI+PC9zcGFuPiAgICAgICAgPC9sYWJlbD4gICAgICAgIDwhLS0gL2tvIC0tPiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNPdGhlclwiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiB9IH1cIj48L2Rpdj4gICAgPC9kaXY+ICAgIDx0YWJsZSBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5yYXRpbmcucm9vdFwiPiAgICAgICAgPHRoZWFkPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24ua29WaXNpYmxlUmF0ZVZhbHVlcyAtLT4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6JGRhdGEudGV4dFwiPjwvdGg+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90aGVhZD4gICAgICAgIDx0Ym9keT4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OnF1ZXN0aW9uLm1pbmludW1SYXRlRGVzY3JpcHRpb25cIj48L3RkPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmtvVmlzaWJsZVJhdGVWYWx1ZXMgLS0+ICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBkYXRhLWJpbmQ9XCJhdHRyOiB7bmFtZTogcXVlc3Rpb24ubmFtZSwgdmFsdWU6ICRkYXRhLnZhbHVlfSwgY2hlY2tlZDogcXVlc3Rpb24ua29WYWx1ZVwiIC8+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidGV4dDpxdWVzdGlvbi5tYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCI+PC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNPdGhlclwiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiB9IH1cIj48L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+Jzt9IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRlbXBsYXRlLmtvLmh0bWwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4va29zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vZGVmYXVsdENzcy9jc3NzdGFuZGFyZC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleSBleHRlbmRzIFN1cnZleUJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSA9IG51bGwsIHJlbmRlcmVkRWxlbWVudDogYW55ID0gbnVsbCwgY3NzOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGpzb25PYmosIHJlbmRlcmVkRWxlbWVudCwgY3NzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7IHJldHVybiB0ZW1wbGF0ZS5rby5odG1sOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZUNzc09iamVjdCgpOiBhbnkgeyAgcmV0dXJuIGRlZmF1bHRTdGFuZGFyZENzczsgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9rb3N1cnZleXdpbmRvdy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJrb3N1cnZleXN0YW5kYXJkLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5V2luZG93IGV4dGVuZHMgU3VydmV5V2luZG93QmFzZSB7XHJcbiAgICAgICAga29FeHBhbmRlZDogYW55O1xyXG4gICAgICAgIGRvRXhwYW5kOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGpzb25PYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlU3VydmV5KGpzb25PYmo6IGFueSk6IFN1cnZleU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXkoanNvbk9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRUZW1wbGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGVtcGxhdGUud2luZG93LmtvLmh0bWwgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIHRlbXBsYXRlLndpbmRvdy5rbyB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwic3Zfd2luZG93XCI+ICAgIDxkaXYgY2xhc3M9XCJzdl93aW5kb3dfdGl0bGVcIj48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOmRvRXhwYW5kXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PHNwYW4gZGF0YS1iaW5kPVwidGV4dDp0aXRsZVwiPjwvc3Bhbj48L2E+PC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTprb0V4cGFuZGVkXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwic3Zfd2luZG93X2NvbnRlbnRcIiBpZD1cIndpbmRvd1N1cnZleUpTXCI+PC9kaXY+ICAgIDwvZGl2PjwvZGl2Pic7fSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZS5rby5odG1sLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3RlbXBsYXRlVGV4dC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRlbXBsYXRlVGV4dCBleHRlbmRzIFN1cnZleVRlbXBsYXRlVGV4dEJhc2Uge1xyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGVtcGxhdGUua28uaHRtbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7IHRlbXBsYXRlLmtvLmh0bWwgPSB2YWx1ZTsgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

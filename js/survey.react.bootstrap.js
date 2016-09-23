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
                if (!this.supportOther())
                    return;
                this.hasOtherValue = val;
                if (this.hasOther)
                    this.hasComment = false;
            },
            enumerable: true,
            configurable: true
        });
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
            get: function () { return Survey.surveyLocalization.getString("removeRow"); },
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
        { name: "addRowText", onGetValue: function (obj) { return obj.addRowTextValue; } }], function () { return new QuestionMatrixDynamicModel(""); }, "matrixdropdownbase");
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
var Survey;
(function (Survey) {
    Survey.defaultBootstrapCss = {
        root: "",
        header: "panel-heading",
        body: "panel-body",
        footer: "panel-footer",
        navigationButton: "", navigation: { complete: "", prev: "", next: "" },
        progress: "progress center-block",
        pageTitle: "",
        row: "",
        question: { root: "", title: "", comment: "form-control", indent: 20 },
        error: { root: "alert alert-danger", item: "glyphicon glyphicon-exclamation-sign" },
        checkbox: { root: "form-inline", item: "checkbox", other: "" },
        comment: "form-control",
        dropdown: "form-control",
        matrix: { root: "table" },
        matrixdropdown: { root: "table" },
        matrixdynamic: { root: "table", button: "button" },
        multipletext: { root: "table", itemTitle: "", itemValue: "form-control" },
        radiogroup: { root: "form-inline", item: "radio", other: "" },
        rating: { root: "btn-group", item: "btn btn-default" },
        text: "form-control"
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
/// <reference path="../survey.ts" />
/// <reference path="../question.ts" />
/// <reference path="../question_comment.ts" />
/// <reference path="../../typings/index.d.ts" />
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
        this.comment = this.question.comment;
        this.state = { value: this.comment };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }
    ReactSurveyQuestionCommentItem.prototype.handleOnChange = function (event) {
        this.comment = event.target.value;
        this.setState({ value: this.comment });
    };
    ReactSurveyQuestionCommentItem.prototype.handleOnBlur = function (event) {
        this.question.comment = this.comment;
    };
    ReactSurveyQuestionCommentItem.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
    };
    ReactSurveyQuestionCommentItem.prototype.render = function () {
        if (!this.question)
            return null;
        return (React.createElement("input", {type: "text", className: this.css.question.comment, value: this.state.value, onChange: this.handleOnChange, onBlur: this.handleOnBlur}));
    };
    return ReactSurveyQuestionCommentItem;
}(React.Component));

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
/// <reference path="../question.ts" />
/// <reference path="../surveyStrings.ts" />
/// <reference path="../../typings/index.d.ts" />
/// <reference path="reactQuestioncomment.tsx" />
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
        var value = this.question ? this.question.value : null;
        this.state = { visible: this.questionBase.visible, value: value, error: 0, renderWidth: 0 };
        var self = this;
        if (this.questionBase) {
            this.questionBase.renderWidthChangedCallback = function () {
                self.state.renderWidth = self.state.renderWidth + 1;
                self.setState(self.state);
            };
        }
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
        var titleTop = this.creator.questionTitleLocation() == "top" ? title : null;
        var titleBottom = this.creator.questionTitleLocation() == "bottom" ? title : null;
        var comment = (this.question && this.question.hasComment) ? this.renderComment() : null;
        var errors = this.renderErrors();
        var marginLeft = (this.questionBase.indent > 0) ? this.questionBase.indent * this.css.question.indent + "px" : null;
        var paddingRight = (this.questionBase.rightIndent > 0) ? this.questionBase.rightIndent * this.css.question.indent + "px" : null;
        var rootStyle = { display: 'inline-block', verticalAlign: 'top' };
        if (this.question.renderWidth)
            rootStyle["width"] = this.question.renderWidth;
        if (marginLeft)
            rootStyle["marginLeft"] = marginLeft;
        if (paddingRight)
            rootStyle["paddingRight"] = paddingRight;
        return (React.createElement("div", {id: this.questionBase.id, className: this.css.question.root, style: rootStyle}, titleTop, errors, questionRender, comment, titleBottom));
    };
    ReactSurveyQuestion.prototype.renderTitle = function () {
        var titleText = this.question.fullTitle;
        return (React.createElement("h5", {className: this.css.question.title}, titleText));
    };
    ReactSurveyQuestion.prototype.renderComment = function () {
        return (React.createElement("div", null, React.createElement("div", null, this.question.commentText), React.createElement("div", {className: this.css.question.comment}, React.createElement(ReactSurveyQuestionCommentItem, {question: this.question}))));
    };
    ReactSurveyQuestion.prototype.renderErrors = function () {
        return React.createElement(ReactSurveyQuestionErrors, {question: this.question, css: this.css, creator: this.creator});
    };
    return ReactSurveyQuestion;
}(React.Component));
var ReactSurveyQuestionErrors = (function (_super) {
    __extends(ReactSurveyQuestionErrors, _super);
    function ReactSurveyQuestionErrors(props) {
        _super.call(this, props);
        this.setQuestion(props.question);
        this.creator = props.creator;
        this.css = props.css;
    }
    ReactSurveyQuestionErrors.prototype.componentWillReceiveProps = function (nextProps) {
        this.setQuestion(nextProps.question);
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    };
    ReactSurveyQuestionErrors.prototype.setQuestion = function (question) {
        this.question = question instanceof Survey.Question ? question : null;
        if (this.question) {
            var self = this;
            this.question.errorsChangedCallback = function () {
                self.state.error = self.state.error + 1;
                self.setState(self.state);
            };
        }
        this.state = { error: 0 };
    };
    ReactSurveyQuestionErrors.prototype.render = function () {
        if (!this.question || this.question.errors.length == 0)
            return null;
        var errors = [];
        for (var i = 0; i < this.question.errors.length; i++) {
            var errorText = this.question.errors[i].getText();
            var key = "error" + i;
            errors.push(this.creator.renderError(key, errorText));
        }
        return (React.createElement("div", {className: this.css.error.root}, errors));
    };
    return ReactSurveyQuestionErrors;
}(React.Component));

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
/// <reference path="../../typings/index.d.ts" />
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
            return null;
        var title = this.renderTitle();
        var rows = [];
        var questionRows = this.page.rows;
        for (var i = 0; i < questionRows.length; i++) {
            rows.push(this.createRow(questionRows[i], i));
        }
        return (React.createElement("div", null, title, rows));
    };
    ReactSurveyPage.prototype.createRow = function (row, index) {
        var rowName = "row" + (index + 1);
        return React.createElement(ReactSurveyRow, {key: rowName, row: row, survey: this.survey, creator: this.creator, css: this.css});
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
var ReactSurveyRow = (function (_super) {
    __extends(ReactSurveyRow, _super);
    function ReactSurveyRow(props) {
        _super.call(this, props);
        this.setProperties(props);
    }
    ReactSurveyRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.setProperties(nextProps);
    };
    ReactSurveyRow.prototype.setProperties = function (props) {
        this.row = props.row;
        if (this.row) {
            var self = this;
            this.row.visibilityChangedCallback = function () { self.setState({ visible: self.row.visible }); };
        }
        this.survey = props.survey;
        this.creator = props.creator;
        this.css = props.css;
    };
    ReactSurveyRow.prototype.render = function () {
        if (this.row == null || this.survey == null || this.creator == null)
            return null;
        if (!this.row.visible)
            return null;
        var questions = [];
        for (var i = 0; i < this.row.questions.length; i++) {
            var question = this.row.questions[i];
            questions.push(this.createQuestion(question));
        }
        return (React.createElement("div", {className: this.css.row}, questions));
    };
    ReactSurveyRow.prototype.createQuestion = function (question) {
        return React.createElement(ReactSurveyQuestion, {key: question.name, question: question, creator: this.creator, css: this.css});
    };
    return ReactSurveyRow;
}(React.Component));

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
/// <reference path="../question_checkbox.ts" />
/// <reference path="../../typings/index.d.ts" />
var ReactSurveyQuestioncheckbox = (function (_super) {
    __extends(ReactSurveyQuestioncheckbox, _super);
    function ReactSurveyQuestioncheckbox(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.state = { choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        };
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
/// <reference path="../question_dropdown.ts" />
/// <reference path="../../typings/index.d.ts" />
var ReactSurveyQuestiondropdown = (function (_super) {
    __extends(ReactSurveyQuestiondropdown, _super);
    function ReactSurveyQuestiondropdown(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.state = { value: this.question.value, choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        };
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
/// <reference path="../question.ts" />
/// <reference path="../question_file.ts" />
/// <reference path="../../typings/index.d.ts" />
var ReactSurveyQuestionfile = (function (_super) {
    __extends(ReactSurveyQuestionfile, _super);
    function ReactSurveyQuestionfile(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.state = { fileLoaded: 0 };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    ReactSurveyQuestionfile.prototype.handleOnChange = function (event) {
        var src = event.target || event.srcElement;
        if (!window["FileReader"])
            return;
        if (!src || !src.files || src.files.length < 1)
            return;
        this.question.loadFile(src.files[0]);
        this.setState({ fileLoaded: this.state.fileLoaded + 1 });
    };
    ReactSurveyQuestionfile.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
    };
    ReactSurveyQuestionfile.prototype.render = function () {
        if (!this.question)
            return null;
        var img = this.renderImage();
        return (React.createElement("div", null, React.createElement("input", {type: "file", onChange: this.handleOnChange}), img));
    };
    ReactSurveyQuestionfile.prototype.renderImage = function () {
        if (!this.question.previewValue)
            return null;
        return (React.createElement("div", null, "  ", React.createElement("img", {src: this.question.previewValue, height: this.question.imageHeight, width: this.question.imageWidth})));
    };
    return ReactSurveyQuestionfile;
}(React.Component));

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
/// <reference path="../question.ts" />
/// <reference path="../question_html.ts" />
/// <reference path="../../typings/index.d.ts" />
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
/// <reference path="../question_matrix.ts" />
/// <reference path="../../typings/index.d.ts" />
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
/// <reference path="../question_matrixdropdown.ts" />
/// <reference path="../../typings/index.d.ts" />
var ReactSurveyQuestionmatrixdropdown = (function (_super) {
    __extends(ReactSurveyQuestionmatrixdropdown, _super);
    function ReactSurveyQuestionmatrixdropdown(props) {
        _super.call(this, props);
        this.setProperties(props);
    }
    ReactSurveyQuestionmatrixdropdown.prototype.componentWillReceiveProps = function (nextProps) {
        this.setProperties(nextProps);
    };
    ReactSurveyQuestionmatrixdropdown.prototype.setProperties = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.creator = nextProps.creator;
    };
    ReactSurveyQuestionmatrixdropdown.prototype.render = function () {
        if (!this.question)
            return null;
        var headers = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "column" + i;
            var minWidth = this.question.getColumnWidth(column);
            var columnStyle = minWidth ? { minWidth: minWidth } : {};
            headers.push(React.createElement("th", {key: key, style: columnStyle}, this.question.getColumnTitle(column)));
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row" + i;
            rows.push(React.createElement(ReactSurveyQuestionmatrixdropdownRow, {key: key, row: row, css: this.css, rootCss: this.rootCss, creator: this.creator}));
        }
        var divStyle = this.question.horizontalScroll ? { overflowX: 'scroll' } : {};
        return (React.createElement("div", {style: divStyle}, React.createElement("table", {className: this.css.root}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null), headers)), React.createElement("tbody", null, rows))));
    };
    return ReactSurveyQuestionmatrixdropdown;
}(React.Component));
var ReactSurveyQuestionmatrixdropdownRow = (function (_super) {
    __extends(ReactSurveyQuestionmatrixdropdownRow, _super);
    function ReactSurveyQuestionmatrixdropdownRow(props) {
        _super.call(this, props);
        this.setProperties(props);
    }
    ReactSurveyQuestionmatrixdropdownRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.setProperties(nextProps);
    };
    ReactSurveyQuestionmatrixdropdownRow.prototype.setProperties = function (nextProps) {
        this.row = nextProps.row;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.creator = nextProps.creator;
    };
    ReactSurveyQuestionmatrixdropdownRow.prototype.render = function () {
        if (!this.row)
            return null;
        var tds = [];
        for (var i = 0; i < this.row.cells.length; i++) {
            var cell = this.row.cells[i];
            var errors = React.createElement(ReactSurveyQuestionErrors, {question: cell.question, css: this.rootCss, creator: this.creator});
            var select = this.renderSelect(cell);
            tds.push(React.createElement("td", {key: "row" + i}, errors, select));
        }
        return (React.createElement("tr", null, React.createElement("td", null, this.row.text), tds));
    };
    ReactSurveyQuestionmatrixdropdownRow.prototype.renderSelect = function (cell) {
        return this.creator.createQuestionElement(cell.question);
    };
    return ReactSurveyQuestionmatrixdropdownRow;
}(React.Component));

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
/// <reference path="../question_matrixdynamic.ts" />
/// <reference path="reactquestion.tsx" />
/// <reference path="../../typings/index.d.ts" />
var ReactSurveyQuestionmatrixdynamic = (function (_super) {
    __extends(ReactSurveyQuestionmatrixdynamic, _super);
    function ReactSurveyQuestionmatrixdynamic(props) {
        _super.call(this, props);
        this.setProperties(props);
    }
    ReactSurveyQuestionmatrixdynamic.prototype.componentWillReceiveProps = function (nextProps) {
        this.setProperties(nextProps);
    };
    ReactSurveyQuestionmatrixdynamic.prototype.setProperties = function (nextProps) {
        this.question = nextProps.question;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.creator = nextProps.creator;
        var self = this;
        this.state = { rowCounter: 0 };
        this.question.rowCountChangedCallback = function () {
            self.state.rowCounter = self.state.rowCounter + 1;
            self.setState(self.state);
        };
        this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
    };
    ReactSurveyQuestionmatrixdynamic.prototype.handleOnRowAddClick = function (event) {
        this.question.addRow();
    };
    ReactSurveyQuestionmatrixdynamic.prototype.render = function () {
        if (!this.question)
            return null;
        var headers = [];
        for (var i = 0; i < this.question.columns.length; i++) {
            var column = this.question.columns[i];
            var key = "column" + i;
            var minWidth = this.question.getColumnWidth(column);
            var columnStyle = minWidth ? { minWidth: minWidth } : {};
            headers.push(React.createElement("th", {key: key, style: columnStyle}, this.question.getColumnTitle(column)));
        }
        var rows = [];
        var visibleRows = this.question.visibleRows;
        for (var i = 0; i < visibleRows.length; i++) {
            var row = visibleRows[i];
            var key = "row" + i;
            rows.push(React.createElement(ReactSurveyQuestionmatrixdynamicRow, {key: key, row: row, question: this.question, index: i, css: this.css, rootCss: this.rootCss, creator: this.creator}));
        }
        var divStyle = this.question.horizontalScroll ? { overflowX: 'scroll' } : {};
        return (React.createElement("div", null, React.createElement("div", {style: divStyle}, React.createElement("table", {className: this.css.root}, React.createElement("thead", null, React.createElement("tr", null, headers, React.createElement("th", null))), React.createElement("tbody", null, rows))), this.renderAddRowButton()));
    };
    ReactSurveyQuestionmatrixdynamic.prototype.renderAddRowButton = function () {
        return React.createElement("input", {className: this.css.button, type: "button", onClick: this.handleOnRowAddClick, value: this.question.addRowText});
    };
    return ReactSurveyQuestionmatrixdynamic;
}(React.Component));
var ReactSurveyQuestionmatrixdynamicRow = (function (_super) {
    __extends(ReactSurveyQuestionmatrixdynamicRow, _super);
    function ReactSurveyQuestionmatrixdynamicRow(props) {
        _super.call(this, props);
        this.setProperties(props);
    }
    ReactSurveyQuestionmatrixdynamicRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.setProperties(nextProps);
    };
    ReactSurveyQuestionmatrixdynamicRow.prototype.setProperties = function (nextProps) {
        this.row = nextProps.row;
        this.question = nextProps.question;
        this.index = nextProps.index;
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.creator = nextProps.creator;
        this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
    };
    ReactSurveyQuestionmatrixdynamicRow.prototype.handleOnRowRemoveClick = function (event) {
        this.question.removeRow(this.index);
    };
    ReactSurveyQuestionmatrixdynamicRow.prototype.render = function () {
        if (!this.row)
            return null;
        var tds = [];
        for (var i = 0; i < this.row.cells.length; i++) {
            var cell = this.row.cells[i];
            var errors = React.createElement(ReactSurveyQuestionErrors, {question: cell.question, css: this.rootCss, creator: this.creator});
            var select = this.renderQuestion(cell);
            tds.push(React.createElement("td", {key: "row" + i}, errors, select));
        }
        var removeButton = this.renderButton();
        tds.push(React.createElement("td", {key: "row" + this.row.cells.length + 1}, removeButton));
        return (React.createElement("tr", null, tds));
    };
    ReactSurveyQuestionmatrixdynamicRow.prototype.renderQuestion = function (cell) {
        return this.creator.createQuestionElement(cell.question);
    };
    ReactSurveyQuestionmatrixdynamicRow.prototype.renderButton = function () {
        return React.createElement("input", {className: this.css.button, type: "button", onClick: this.handleOnRowRemoveClick, value: this.question.removeRowText});
    };
    return ReactSurveyQuestionmatrixdynamicRow;
}(React.Component));

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
/// <reference path="../question_multipletext.ts" />
/// <reference path="../../typings/index.d.ts" />
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
/// <reference path="../question_radiogroup.ts" />
// <reference path="../question_baseselect.ts" />
/// <reference path="../../typings/index.d.ts" />
var ReactSurveyQuestionradiogroup = (function (_super) {
    __extends(ReactSurveyQuestionradiogroup, _super);
    function ReactSurveyQuestionradiogroup(props) {
        _super.call(this, props);
        this.question = props.question;
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.state = { choicesChanged: 0 };
        var self = this;
        this.question.choicesChangedCallback = function () {
            self.state.choicesChanged = self.state.choicesChanged + 1;
            self.setState(self.state);
        };
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
/// <reference path="../question_text.ts" />
/// <reference path="../../typings/index.d.ts" />
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
        var prevButton = !this.survey.isFirstPage ? this.renderButton(this.handlePrevClick, this.survey.pagePrevText, this.css.navigation.prev) : null;
        var nextButton = !this.survey.isLastPage ? this.renderButton(this.handleNextClick, this.survey.pageNextText, this.css.navigation.next) : null;
        var completeButton = this.survey.isLastPage ? this.renderButton(this.handleCompleteClick, this.survey.completeText, this.css.navigation.complete) : null;
        return (React.createElement("div", {className: this.css.footer}, prevButton, nextButton, completeButton));
    };
    ReactSurveyNavigation.prototype.renderButton = function (click, text, btnClassName) {
        var style = { marginRight: "5px" };
        var className = this.css.navigationButton + (btnClassName ? ' ' + btnClassName : "");
        return React.createElement("input", {className: className, style: style, type: "button", onClick: click, value: text});
    };
    return ReactSurveyNavigation;
}(React.Component));

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
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../survey.ts" />
/// <reference path="reactsurveymodel.tsx" />
/// <reference path="reactPage.tsx" />
/// <reference path="reactQuestion.tsx" />
/// <reference path="reactSurveyNavigation.tsx" />
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
        return React.createElement(this.getReactQuestionClass(question), { question: question, css: questionCss, rootCss: this.css, creator: this });
    };
    ReactSurveyBase.prototype.renderError = function (key, errorText) {
        return React.createElement("div", {key: key, className: this.css.error.item}, errorText);
    };
    ReactSurveyBase.prototype.questionTitleLocation = function () { return this.survey.questionTitleLocation; };
    return ReactSurveyBase;
}(React.Component));

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
/// <reference path="../../typings/index.d.ts" />
/// <reference path="../survey.ts" />
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
/// <reference path="../../survey.ts" />
/// <reference path="../../question_rating.ts" />
/// <reference path="../../../typings/index.d.ts" />
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
        var values = [];
        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
            var minText = i == 0 ? this.question.mininumRateDescription + " " : null;
            var maxText = i == this.question.visibleRateValues.length - 1 ? " " + this.question.maximumRateDescription : null;
            values.push(this.renderItem("value" + i, this.question.visibleRateValues[i], minText, maxText));
        }
        var comment = this.question.hasOther ? this.renderOther() : null;
        return (React.createElement("div", {className: this.css.root, "data-toggle": "buttons"}, values, comment));
    };
    ReactSurveyQuestionrating.prototype.renderItem = function (key, item, minText, maxText) {
        var isChecked = this.question.value == item.value;
        var className = this.css.item;
        if (isChecked)
            className += " active";
        var min = minText ? React.createElement("span", null, minText) : null;
        var max = maxText ? React.createElement("span", null, maxText) : null;
        return React.createElement("label", {key: key, className: className}, React.createElement("input", {type: "radio", name: this.question.name, value: item.value, checked: this.question.value == item.value, onChange: this.handleOnChange}), min, React.createElement("span", null, item.text), max);
    };
    ReactSurveyQuestionrating.prototype.renderOther = function () {
        return (React.createElement("div", {className: this.css.other}, React.createElement(ReactSurveyQuestionCommentItem, {question: this.question, css: this.rootCss})));
    };
    return ReactSurveyQuestionrating;
}(React.Component));

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
/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurveyProgress.tsx" />
var ReactSurveyProgress = (function (_super) {
    __extends(ReactSurveyProgress, _super);
    function ReactSurveyProgress(props) {
        _super.call(this, props);
    }
    ReactSurveyProgress.prototype.render = function () {
        var style = this.isTop ? { width: "60%" } : { width: "60%", marginTop: "10px" };
        var progressStyle = { width: this.progress + "%" };
        return (React.createElement("div", {className: this.css.progress, style: style}, React.createElement("div", {style: progressStyle, className: "progress-bar", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100"}, React.createElement("span", null, this.progressText))));
    };
    return ReactSurveyProgress;
}(ReactSurveyProgressBase));

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
/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurvey.tsx" />
/// <reference path="reactSurveyProgressBootstrap.tsx" />
/// <reference path="../../defaultCss/cssbootstrap.ts" />
var ReactSurvey = (function (_super) {
    __extends(ReactSurvey, _super);
    function ReactSurvey(props) {
        _super.call(this, props);
    }
    ReactSurvey.prototype.renderError = function (key, errorText) {
        return React.createElement("div", {key: key}, React.createElement("span", {className: this.css.error.item, "aria-hidden": "true"}), React.createElement("span", null, " ", errorText));
    };
    ReactSurvey.prototype.renderProgress = function (isTop) {
        return React.createElement(ReactSurveyProgress, {survey: this.survey, css: this.css, isTop: isTop});
    };
    ReactSurvey.prototype.createCssObject = function () { return Survey.defaultBootstrapCss; };
    return ReactSurvey;
}(ReactSurveyBase));

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
/// <reference path="../../../typings/index.d.ts" />
/// <reference path="reactSurveyBootstrap.tsx" />
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
        var style = { position: "fixed", bottom: "3px", right: "10px" };
        return React.createElement("div", {className: "modal-content", style: style}, header, body);
    };
    ReactSurveyWindow.prototype.renderHeader = function () {
        var styleA = { width: "100%" };
        var styleTitle = { paddingRight: "10px" };
        var glyphClassName = this.state.expanded ? "glyphicon-chevron-down" : "glyphicon-chevron-up";
        glyphClassName = "glyphicon pull-right " + glyphClassName;
        return React.createElement("div", {className: "modal-header panel-title"}, React.createElement("a", {href: "#", onClick: this.handleOnExpanded, style: styleA}, React.createElement("span", {className: "pull-left", style: styleTitle}, this.title), React.createElement("span", {className: glyphClassName, "aria-hidden": "true"})));
    };
    ReactSurveyWindow.prototype.renderBody = function () {
        return React.createElement("div", {class: "modal-body"}, this.renderSurvey());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudHMiLCJqc29ub2JqZWN0LnRzIiwiY2hvaWNlc1Jlc3RmdWxsLnRzIiwiY29uZGl0aW9uc1BhcnNlci50cyIsImNvbmRpdGlvbnMudHMiLCJkeFN1cnZleVNlcnZpY2UudHMiLCJzdXJ2ZXlTdHJpbmdzLnRzIiwiZXJyb3IudHMiLCJxdWVzdGlvbmJhc2UudHMiLCJxdWVzdGlvbmZhY3RvcnkudHMiLCJwYWdlLnRzIiwidmFsaWRhdG9yLnRzIiwidGV4dFByZVByb2Nlc3Nvci50cyIsInF1ZXN0aW9uLnRzIiwicXVlc3Rpb25fYmFzZXNlbGVjdC50cyIsInF1ZXN0aW9uX2NoZWNrYm94LnRzIiwicXVlc3Rpb25fY29tbWVudC50cyIsInF1ZXN0aW9uX2Ryb3Bkb3duLnRzIiwicXVlc3Rpb25fZmlsZS50cyIsInF1ZXN0aW9uX2h0bWwudHMiLCJxdWVzdGlvbl9tYXRyaXgudHMiLCJxdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwicXVlc3Rpb25fdGV4dC50cyIsInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50cyIsInF1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzIiwicXVlc3Rpb25fbWF0cml4ZHluYW1pYy50cyIsInF1ZXN0aW9uX211bHRpcGxldGV4dC50cyIsInF1ZXN0aW9uX3JhdGluZy50cyIsInRyaWdnZXIudHMiLCJzdXJ2ZXkudHMiLCJzdXJ2ZXlXaW5kb3cudHMiLCJsb2NhbGl6YXRpb24vZmlubmlzaC50cyIsImxvY2FsaXphdGlvbi9mcmVuY2gudHMiLCJsb2NhbGl6YXRpb24vZ2VybWFuLnRzIiwibG9jYWxpemF0aW9uL3J1c3NpYW4udHMiLCJkZWZhdWx0Q3NzL2Nzc2Jvb3RzdHJhcC50cyIsInJlYWN0L3JlYWN0cXVlc3Rpb25jb21tZW50LnRzeCIsInJlYWN0L3JlYWN0cXVlc3Rpb24udHN4IiwicmVhY3QvcmVhY3RwYWdlLnRzeCIsInJlYWN0L3JlYWN0cXVlc3Rpb25jaGVja2JveC50c3giLCJyZWFjdC9yZWFjdHF1ZXN0aW9uZHJvcGRvd24udHN4IiwicmVhY3QvcmVhY3RxdWVzdGlvbmZpbGUudHN4IiwicmVhY3QvcmVhY3RxdWVzdGlvbmh0bWwudHN4IiwicmVhY3QvcmVhY3RxdWVzdGlvbm1hdHJpeC50c3giLCJyZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4ZHJvcGRvd24udHN4IiwicmVhY3QvcmVhY3RxdWVzdGlvbm1hdHJpeGR5bmFtaWMudHN4IiwicmVhY3QvcmVhY3RxdWVzdGlvbm11bHRpcGxldGV4dC50c3giLCJyZWFjdC9yZWFjdHF1ZXN0aW9ucmFkaW9ncm91cC50c3giLCJyZWFjdC9yZWFjdHF1ZXN0aW9udGV4dC50c3giLCJyZWFjdC9yZWFjdHN1cnZleW1vZGVsLnRzeCIsInJlYWN0L3JlYWN0U3VydmV5TmF2aWdhdGlvbi50c3giLCJyZWFjdC9yZWFjdFN1cnZleS50c3giLCJyZWFjdC9yZWFjdFN1cnZleVByb2dyZXNzLnRzeCIsInJlYWN0L2Jvb3RzdHJhcC9yZWFjdHF1ZXN0aW9ucmF0aW5nQm9vdHN0cmFwLnRzeCIsInJlYWN0L2Jvb3RzdHJhcC9yZWFjdFN1cnZleVByb2dyZXNzQm9vdHN0cmFwLnRzeCIsInJlYWN0L2Jvb3RzdHJhcC9yZWFjdFN1cnZleUJvb3RzdHJhcC50c3giLCJyZWFjdC9ib290c3RyYXAvcmVhY3RTdXJ2ZXlXaW5kb3dCb290c3RyYXAudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0VBSUU7QUFFRSxJQUFPLE1BQU0sQ0FzSWhCO0FBdElHLFdBQU8sTUFBTSxFQUFDLENBQUM7SUEwQ2Y7UUE4QkksbUJBQVksS0FBVSxFQUFFLElBQW1CO1lBQW5CLG9CQUFtQixHQUFuQixXQUFtQjtZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDO1FBL0JhLGlCQUFPLEdBQXJCLFVBQXNCLEtBQXVCLEVBQUUsTUFBa0I7WUFDN0QsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDakIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3JDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDcEYsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLENBQUM7Z0JBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQztRQUNhLGlCQUFPLEdBQXJCLFVBQXNCLEtBQXVCO1lBQ3pDLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3BDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFPTSwyQkFBTyxHQUFkLGNBQTJCLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ2hELHNCQUFXLDRCQUFLO2lCQUFoQixjQUEwQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQ2xELFVBQWlCLFFBQWE7Z0JBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUM1QixJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDYixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxDQUFDO1lBQ0wsQ0FBQzs7O1dBVmlEO1FBV2xELHNCQUFXLDhCQUFPO2lCQUFsQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDdEUsc0JBQVcsMkJBQUk7aUJBQWY7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDdkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO2lCQUNELFVBQWdCLE9BQWU7Z0JBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQzVCLENBQUM7OztXQUhBO1FBbERhLG1CQUFTLEdBQUcsR0FBRyxDQUFDO1FBc0RsQyxnQkFBQztJQUFELENBdkRBLEFBdURDLElBQUE7SUF2RFksZ0JBQVMsWUF1RHJCLENBQUE7SUFFRDtRQUFBO1FBSUEsQ0FBQztRQUhVLHNCQUFPLEdBQWQ7WUFDSSxNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUNMLFdBQUM7SUFBRCxDQUpBLEFBSUMsSUFBQTtJQUpZLFdBQUksT0FJaEIsQ0FBQTtJQUNEO1FBQUE7UUFJQSxDQUFDO1FBSFUsNkJBQU8sR0FBZDtZQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0wsa0JBQUM7SUFBRCxDQUpBLEFBSUMsSUFBQTtJQUpZLGtCQUFXLGNBSXZCLENBQUE7SUFFRDtRQUFBO1FBdUJBLENBQUM7UUFyQkcsc0JBQVcsMEJBQU87aUJBQWxCLGNBQWdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUN2RixvQkFBSSxHQUFYLFVBQVksTUFBVyxFQUFFLE9BQWdCO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNuQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRyxFQUFFLENBQUM7Z0JBQzlDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXhELENBQUM7UUFDTCxDQUFDO1FBQ00sbUJBQUcsR0FBVixVQUFXLElBQU87WUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLEVBQUssQ0FBQztZQUNwQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNNLHNCQUFNLEdBQWIsVUFBYyxJQUFPO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNuQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDO1FBQ0wsQ0FBQztRQUNMLFlBQUM7SUFBRCxDQXZCQSxBQXVCQyxJQUFBO0lBdkJZLFlBQUssUUF1QmpCLENBQUE7QUFDTCxDQUFDLEVBdElVLE1BQU0sS0FBTixNQUFNLFFBc0loQjs7QUM1SUQ7Ozs7RUFJRTs7Ozs7O0FBRUYsZ0NBQWdDO0FBQ2hDLElBQU8sTUFBTSxDQTRhWjtBQTVhRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBRVg7UUFXSSw0QkFBbUIsSUFBWTtZQUFaLFNBQUksR0FBSixJQUFJLENBQVE7WUFWdkIsY0FBUyxHQUFXLElBQUksQ0FBQztZQUN6QixpQkFBWSxHQUFlLElBQUksQ0FBQztZQUNoQyxnQkFBVyxHQUFxQixJQUFJLENBQUM7WUFDdEMsY0FBUyxHQUFXLElBQUksQ0FBQztZQUN6QixrQkFBYSxHQUFXLElBQUksQ0FBQztZQUM3QixrQkFBYSxHQUFXLElBQUksQ0FBQztZQUM3QixpQkFBWSxHQUFRLElBQUksQ0FBQztZQUN6QixlQUFVLEdBQXNCLElBQUksQ0FBQztRQUk1QyxDQUFDO1FBQ0Qsc0JBQVcsb0NBQUk7aUJBQWYsY0FBNEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO2lCQUNoRixVQUFnQixLQUFhLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7V0FEc0I7UUFFaEYsc0JBQVcsZ0RBQWdCO2lCQUEzQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ2xELDJDQUFjLEdBQXJCLFVBQXNCLEtBQVU7WUFDNUIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekUsQ0FBQztRQUNNLHFDQUFRLEdBQWYsVUFBZ0IsR0FBUTtZQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELHNCQUFXLGdEQUFnQjtpQkFBM0IsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNsRCxxQ0FBUSxHQUFmLFVBQWdCLEdBQVEsRUFBRSxLQUFVLEVBQUUsUUFBb0I7WUFDdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxQyxDQUFDO1FBQ0wsQ0FBQztRQUNNLHVDQUFVLEdBQWpCLFVBQWtCLE9BQWU7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDeEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBQ00seUNBQVksR0FBbkIsVUFBb0IsU0FBaUI7WUFDakMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7UUFDMUgsQ0FBQztRQUNELHNCQUFXLHVDQUFPO2lCQUFsQjtnQkFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQztvQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDeEQsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDOzs7V0FBQTtRQUNNLHVDQUFVLEdBQWpCLFVBQWtCLEtBQWlCLEVBQUUsU0FBMkI7WUFDNUQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7UUFDakMsQ0FBQztRQUNMLHlCQUFDO0lBQUQsQ0E3Q0EsQUE2Q0MsSUFBQTtJQTdDWSx5QkFBa0IscUJBNkM5QixDQUFBO0lBQ0Q7UUFLSSwyQkFBbUIsSUFBWSxFQUFFLFVBQXNCLEVBQVMsT0FBeUIsRUFBUyxVQUF5QjtZQUFsRSx1QkFBZ0MsR0FBaEMsY0FBZ0M7WUFBRSwwQkFBZ0MsR0FBaEMsaUJBQWdDO1lBQXhHLFNBQUksR0FBSixJQUFJLENBQVE7WUFBaUMsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7WUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFlO1lBRjNILGVBQVUsR0FBOEIsSUFBSSxDQUFDO1lBQzdDLHVCQUFrQixHQUFrQixJQUFJLENBQUM7WUFFckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEtBQUssRUFBc0IsQ0FBQztZQUNsRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ00sZ0NBQUksR0FBWCxVQUFZLElBQVk7WUFDcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkUsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNPLDBDQUFjLEdBQXRCLFVBQXVCLFFBQWE7WUFDaEMsSUFBSSxZQUFZLEdBQUcsT0FBTyxRQUFRLEtBQUssUUFBUSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQzNFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxTQUFTLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixZQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELFlBQVksR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RCxDQUFDO1lBQ0QsWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO1lBQzdCLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUM5QixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7Z0JBQ3pDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksV0FBVyxHQUFHLE9BQU8sUUFBUSxDQUFDLE9BQU8sS0FBSyxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ25GLElBQUksWUFBWSxHQUFHLE9BQU8sUUFBUSxDQUFDLE9BQU8sS0FBSyxVQUFVLEdBQUcsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ3BGLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQzFDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztnQkFDMUMsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO2dCQUN4QyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7Z0JBQ2hELENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztnQkFDaEQsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTywyQ0FBZSxHQUF2QixVQUF3QixZQUFvQjtZQUN4QyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksaUJBQWlCLENBQUMsY0FBYyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFDekcsWUFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDeEIsQ0FBQztRQUNPLGdEQUFvQixHQUE1QixVQUE2QixZQUFvQjtZQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1lBQ2xELENBQUM7WUFDRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUE3RU0sZ0NBQWMsR0FBRyxHQUFHLENBQUM7UUFDckIsNEJBQVUsR0FBRyxHQUFHLENBQUM7UUE2RTVCLHdCQUFDO0lBQUQsQ0EvRUEsQUErRUMsSUFBQTtJQS9FWSx3QkFBaUIsb0JBK0U3QixDQUFBO0lBQ0Q7UUFBQTtZQUNZLFlBQU8sR0FBaUMsRUFBRSxDQUFDO1lBQzNDLG9CQUFlLEdBQXdDLEVBQUUsQ0FBQztZQUMxRCxvQkFBZSxHQUF5QyxFQUFFLENBQUM7WUFDM0QsNEJBQXVCLEdBQTZCLEVBQUUsQ0FBQztRQThGbkUsQ0FBQztRQTdGVSwrQkFBUSxHQUFmLFVBQWdCLElBQVksRUFBRSxVQUFzQixFQUFFLE9BQXlCLEVBQUUsVUFBeUI7WUFBcEQsdUJBQXlCLEdBQXpCLGNBQXlCO1lBQUUsMEJBQXlCLEdBQXpCLGlCQUF5QjtZQUN0RyxJQUFJLGFBQWEsR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsYUFBYSxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMxQyxDQUFDO2dCQUNELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3pELENBQUM7WUFDRCxNQUFNLENBQUMsYUFBYSxDQUFDO1FBQ3pCLENBQUM7UUFDTSw0Q0FBcUIsR0FBNUIsVUFBNkIsSUFBWSxFQUFFLE9BQWtCO1lBQ3pELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDaEIsYUFBYSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDcEMsQ0FBQztRQUNMLENBQUM7UUFDTSxvQ0FBYSxHQUFwQixVQUFxQixJQUFZO1lBQzdCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNkLFVBQVUsR0FBRyxJQUFJLEtBQUssRUFBc0IsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDO1lBQzVDLENBQUM7WUFDRCxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RCLENBQUM7UUFDTSxrQ0FBVyxHQUFsQixVQUFtQixJQUFZO1lBQzNCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25DLENBQUM7UUFDTSx5Q0FBa0IsR0FBekIsVUFBMEIsSUFBWSxFQUFFLFlBQTZCO1lBQTdCLDRCQUE2QixHQUE3QixvQkFBNkI7WUFDakUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNNLDRDQUFxQixHQUE1QixVQUE2QixJQUFZO1lBQ3JDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsVUFBVSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQzlDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7WUFDcEQsQ0FBQztZQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdEIsQ0FBQztRQUNPLDBDQUFtQixHQUEzQixVQUE0QixJQUFZLEVBQUUsWUFBcUIsRUFBRSxNQUFnQztZQUM3RixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUN0QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3JFLENBQUM7UUFDTCxDQUFDO1FBQ08sZ0NBQVMsR0FBakIsVUFBa0IsSUFBWTtZQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ08scUNBQWMsR0FBdEIsVUFBdUIsSUFBWSxFQUFFLElBQStCO1lBQ2hFLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckUsQ0FBQztRQUNMLENBQUM7UUFDTyxrQ0FBVyxHQUFuQixVQUFvQixRQUE0QixFQUFFLElBQStCLEVBQUUsUUFBZ0I7WUFDL0YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNWLEtBQUssQ0FBQztnQkFDVixDQUFDO1lBQ0wsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDdkIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDM0IsQ0FBQztRQUNMLENBQUM7UUFDTyw2Q0FBc0IsR0FBOUIsVUFBK0IsSUFBWSxFQUFFLElBQW1CO1lBQzVELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDdkUsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRSxDQUFDO1FBQ0wsQ0FBQztRQUNMLG1CQUFDO0lBQUQsQ0FsR0EsQUFrR0MsSUFBQTtJQWxHWSxtQkFBWSxlQWtHeEIsQ0FBQTtJQUNEO1FBR0ksbUJBQW1CLElBQVksRUFBUyxPQUFlO1lBQXBDLFNBQUksR0FBSixJQUFJLENBQVE7WUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFRO1lBRmhELGdCQUFXLEdBQVcsRUFBRSxDQUFDO1lBQ3pCLE9BQUUsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUV2QixDQUFDO1FBQ00sc0NBQWtCLEdBQXpCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFDTCxnQkFBQztJQUFELENBUkEsQUFRQyxJQUFBO0lBUlksZ0JBQVMsWUFRckIsQ0FBQTtJQUNEO1FBQThDLDRDQUFTO1FBQ25ELGtDQUFtQixZQUFvQixFQUFTLFNBQWlCO1lBQzdELGtCQUFNLGlCQUFpQixFQUFFLGdCQUFnQixHQUFHLFlBQVksR0FBRyxjQUFjLEdBQUcsU0FBUyxHQUFHLGVBQWUsQ0FBQyxDQUFDO1lBRDFGLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtZQUU3RCxJQUFJLFVBQVUsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM5RCxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxXQUFXLEdBQUcsd0NBQXdDLENBQUM7Z0JBQzVELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO29CQUNwQyxJQUFJLENBQUMsV0FBVyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzNDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUM7WUFDNUIsQ0FBQztRQUNMLENBQUM7UUFDTCwrQkFBQztJQUFELENBYkEsQUFhQyxDQWI2QyxTQUFTLEdBYXREO0lBYlksK0JBQXdCLDJCQWFwQyxDQUFBO0lBQ0Q7UUFBOEMsNENBQVM7UUFDbkQsa0NBQW1CLGFBQXFCLEVBQVMsSUFBWSxFQUFTLE9BQWU7WUFDakYsa0JBQU0sSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRE4sa0JBQWEsR0FBYixhQUFhLENBQVE7WUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQUVqRixJQUFJLENBQUMsV0FBVyxHQUFHLHFDQUFxQyxDQUFDO1lBQ3pELElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNsRCxDQUFDO1lBQ0QsSUFBSSxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUM7UUFDNUIsQ0FBQztRQUNMLCtCQUFDO0lBQUQsQ0FYQSxBQVdDLENBWDZDLFNBQVMsR0FXdEQ7SUFYWSwrQkFBd0IsMkJBV3BDLENBQUE7SUFDRDtRQUEwQyx3Q0FBd0I7UUFDOUQsOEJBQW1CLFlBQW9CLEVBQVMsYUFBcUI7WUFDakUsa0JBQU0sYUFBYSxFQUFFLHFCQUFxQixFQUFFLCtFQUErRSxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQztZQURwSSxpQkFBWSxHQUFaLFlBQVksQ0FBUTtZQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBRXJFLENBQUM7UUFDTCwyQkFBQztJQUFELENBSkEsQUFJQyxDQUp5Qyx3QkFBd0IsR0FJakU7SUFKWSwyQkFBb0IsdUJBSWhDLENBQUE7SUFDRDtRQUE0QywwQ0FBd0I7UUFDaEUsZ0NBQW1CLFlBQW9CLEVBQVMsYUFBcUI7WUFDakUsa0JBQU0sYUFBYSxFQUFFLHVCQUF1QixFQUFFLGlGQUFpRixHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQztZQUR4SSxpQkFBWSxHQUFaLFlBQVksQ0FBUTtZQUFTLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBRXJFLENBQUM7UUFDTCw2QkFBQztJQUFELENBSkEsQUFJQyxDQUoyQyx3QkFBd0IsR0FJbkU7SUFKWSw2QkFBc0IseUJBSWxDLENBQUE7SUFDRDtRQUErQyw2Q0FBUztRQUNwRCxtQ0FBbUIsWUFBb0IsRUFBUyxTQUFpQjtZQUM3RCxrQkFBTSxrQkFBa0IsRUFBRSxnQkFBZ0IsR0FBRyxZQUFZLEdBQUcsMEJBQTBCLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBRDVGLGlCQUFZLEdBQVosWUFBWSxDQUFRO1lBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUVqRSxDQUFDO1FBQ0wsZ0NBQUM7SUFBRCxDQUpBLEFBSUMsQ0FKOEMsU0FBUyxHQUl2RDtJQUpZLGdDQUF5Qiw0QkFJckMsQ0FBQTtJQUVEO1FBQUE7WUFLVyxXQUFNLEdBQUcsSUFBSSxLQUFLLEVBQWEsQ0FBQztRQWdKM0MsQ0FBQztRQWpKRyxzQkFBa0Isc0JBQVE7aUJBQTFCLGNBQStCLE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFFMUQsaUNBQVksR0FBbkIsVUFBb0IsR0FBUTtZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM1QyxDQUFDO1FBQ00sNkJBQVEsR0FBZixVQUFnQixPQUFZLEVBQUUsR0FBUTtZQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDckIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNkLFVBQVUsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNsRSxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxVQUFVLENBQUMsZ0JBQWdCLENBQUM7b0JBQUMsUUFBUSxDQUFDO2dCQUNqRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztvQkFDekMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDeEIsUUFBUSxDQUFDO2dCQUNiLENBQUM7Z0JBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xELEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksd0JBQXdCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN2RixRQUFRLENBQUM7Z0JBQ2IsQ0FBQztnQkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELENBQUM7UUFDTCxDQUFDO1FBQ1MscUNBQWdCLEdBQTFCLFVBQTJCLEdBQVEsRUFBRSxRQUE0QjtZQUM3RCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDN0UsQ0FBQztZQUNELElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNqRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNTLGdDQUFXLEdBQXJCLFVBQXNCLEdBQVEsRUFBRSxNQUFXLEVBQUUsUUFBNEI7WUFDckUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixLQUFLLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDM0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDbEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3BDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxDQUFDO2dCQUNELEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ2xELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNuRCxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDbEMsQ0FBQztRQUNMLENBQUM7UUFDUywrQkFBVSxHQUFwQixVQUFxQixLQUFVLEVBQUUsR0FBUSxFQUFFLEdBQVEsRUFBRSxRQUE0QjtZQUM3RSxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUMxQixFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLENBQUM7WUFDWCxDQUFDO1lBQ0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDcEMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDMUIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUM7UUFDTyxpQ0FBWSxHQUFwQixVQUFxQixLQUFVLElBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRyxpQ0FBWSxHQUFwQixVQUFxQixLQUFVLEVBQUUsUUFBNEI7WUFDekQsSUFBSSxNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUMzQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDdkQsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDbkMsQ0FBQztZQUNELFNBQVMsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDaEYsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RGLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNPLDJDQUFzQixHQUE5QixVQUErQixNQUFXLEVBQUUsS0FBVSxFQUFFLFFBQTRCLEVBQUUsU0FBaUI7WUFDbkcsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsSUFBSSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUM5RSxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoQyxLQUFLLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzs0QkFDeEUsS0FBSyxDQUFDO3dCQUNWLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2IsS0FBSyxHQUFHLElBQUksb0JBQW9CLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzVFLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osS0FBSyxHQUFHLElBQUksc0JBQXNCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzlFLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDTyxnQ0FBVyxHQUFuQixVQUFvQixLQUFnQixFQUFFLE9BQVk7WUFDOUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELEtBQUssQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM5RCxDQUFDO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUNPLGlDQUFZLEdBQXBCLFVBQXFCLEtBQWlCLEVBQUUsR0FBUSxFQUFFLEdBQVEsRUFBRSxRQUE0QjtZQUNwRixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLENBQUM7WUFDRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3JELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNsQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ2xCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVCLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ08saUNBQVksR0FBcEIsVUFBcUIsVUFBcUMsRUFBRSxHQUFRO1lBQ2hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDN0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQW5KYywyQkFBZ0IsR0FBRyxNQUFNLENBQUM7UUFDMUIsK0JBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQzdCLHdCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQWtKdEQsaUJBQUM7SUFBRCxDQXJKQSxBQXFKQyxJQUFBO0lBckpZLGlCQUFVLGFBcUp0QixDQUFBO0FBQ0wsQ0FBQyxFQTVhTSxNQUFNLEtBQU4sTUFBTSxRQTRhWjs7QUNuYkQ7Ozs7RUFJRTs7Ozs7O0FBRUYsZ0NBQWdDO0FBQ2hDLHNDQUFzQztBQUN0QyxJQUFPLE1BQU0sQ0FnR1o7QUFoR0QsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQXFDLG1DQUFJO1FBT3JDO1lBQ0ksaUJBQU8sQ0FBQztZQVBMLFFBQUcsR0FBVyxFQUFFLENBQUM7WUFDakIsU0FBSSxHQUFXLEVBQUUsQ0FBQztZQUNsQixjQUFTLEdBQVcsRUFBRSxDQUFDO1lBQ3ZCLGNBQVMsR0FBVyxFQUFFLENBQUM7WUFFdkIsVUFBSyxHQUFnQixJQUFJLENBQUM7UUFHakMsQ0FBQztRQUNNLDZCQUFHLEdBQVY7WUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ2pELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDL0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztZQUMxRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsR0FBRyxDQUFDLE1BQU0sR0FBRztnQkFDVCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUNuRCxDQUFDO1lBQ0wsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUNNLGlDQUFPLEdBQWQsY0FBMkIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbkQsc0JBQVcsb0NBQU87aUJBQWxCO2dCQUNJLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDekUsQ0FBQzs7O1dBQUE7UUFDTSxpQ0FBTyxHQUFkLFVBQWUsSUFBUztZQUNwQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4RCxDQUFDO1FBQ00sK0JBQUssR0FBWjtZQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQ1MsZ0NBQU0sR0FBaEIsVUFBaUIsTUFBVztZQUN4QixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixNQUFNLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDckMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt3QkFBQyxRQUFRLENBQUM7b0JBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3JDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxrQkFBVyxDQUFDLHlCQUFrQixDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDckYsQ0FBQztZQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ08saUNBQU8sR0FBZixVQUFnQixNQUFjLEVBQUUsUUFBZ0I7WUFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFXLENBQUMseUJBQWtCLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDMUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDTyw0Q0FBa0IsR0FBMUIsVUFBMkIsTUFBVztZQUNsQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzlCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDckMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUM3QixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ08sbUNBQVMsR0FBakI7WUFDSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ08sa0NBQVEsR0FBaEIsVUFBaUIsSUFBUztZQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hELElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ08sa0NBQVEsR0FBaEIsVUFBaUIsSUFBUztZQUN0QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQ0wsc0JBQUM7SUFBRCxDQTdGQSxBQTZGQyxDQTdGb0MsV0FBSSxHQTZGeEM7SUE3Rlksc0JBQWUsa0JBNkYzQixDQUFBO0lBQ0QsaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFFLGNBQWMsTUFBTSxDQUFDLElBQUksZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzSSxDQUFDLEVBaEdNLE1BQU0sS0FBTixNQUFNLFFBZ0daOztBQ3hHRDs7OztFQUlFO0FBRUYsZ0NBQWdDO0FBQ2hDLHNDQUFzQztBQUN0QyxJQUFPLE1BQU0sQ0EwTlo7QUExTkQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQUE7UUF3TkEsQ0FBQztRQWpOVSxnQ0FBSyxHQUFaLFVBQWEsSUFBWSxFQUFFLElBQW1CO1lBQzFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQy9CLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNNLG1DQUFRLEdBQWYsVUFBZ0IsSUFBbUI7WUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUNPLHVDQUFZLEdBQXBCLFVBQXFCLEtBQVU7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFDTyx1Q0FBWSxHQUFwQixVQUFxQixJQUFtQjtZQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDNUIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDWCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7d0JBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztvQkFDNUMsR0FBRyxJQUFJLFFBQVEsQ0FBQztnQkFDcEIsQ0FBQztZQUNMLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDMUIsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ08sNENBQWlCLEdBQXpCLFVBQTBCLFNBQW9CO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUN2RCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQzNELElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDNUQsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUFDLEtBQUssR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUMvRCxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDN0IsQ0FBQztRQUNPLDRDQUFpQixHQUF6QixVQUEwQixFQUFVO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxPQUFPLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLFNBQVMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxNQUFNLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUM3QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksZ0JBQWdCLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN4QyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksYUFBYSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDckMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFDTyxvQ0FBUyxHQUFqQixVQUFrQixLQUFhO1lBQzNCLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUM3QixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDTyxvQ0FBUyxHQUFqQjtZQUNJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3pDLENBQUM7UUFDTyx5Q0FBYyxHQUF0QjtZQUNJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ3JCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDakMsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNPLHdDQUFhLEdBQXJCO1lBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN6QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsR0FBRyxJQUFJLGdCQUFTLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUN6QixDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNwQixDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTyx5Q0FBYyxHQUF0QjtZQUNJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQzFELElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNWLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1osR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUNyQixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ1YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3pCLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNELHNCQUFZLGdDQUFFO2lCQUFkLGNBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUN0RCwrQkFBSSxHQUFaO1lBQ0ksT0FBTyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNyRSxDQUFDO1FBQ08sa0NBQU8sR0FBZixVQUFnQixDQUFTO1lBQ3JCLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQzNELENBQUM7UUFDTyxtQ0FBUSxHQUFoQixVQUFpQixDQUFTO1lBQ3RCLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUE7UUFDL0IsQ0FBQztRQUNPLHlDQUFjLEdBQXRCLFVBQXVCLENBQVM7WUFDNUIsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7UUFDeEQsQ0FBQztRQUNPLHFDQUFVLEdBQWxCLFVBQW1CLENBQVM7WUFDeEIsTUFBTSxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUNoQyxDQUFDO1FBQ08scUNBQVUsR0FBbEI7WUFDSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN4QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3BCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0MsT0FBTyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQUMsS0FBSyxDQUFDO2dCQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt3QkFBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3pCLEtBQUssQ0FBQztnQkFDVixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDYixFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQUMsS0FBSyxDQUFDO29CQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFBQyxLQUFLLENBQUM7Z0JBQ3hDLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2QsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDbEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDbkQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFBQyxHQUFHLEVBQUUsQ0FBQztvQkFDOUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ08sNkNBQWtCLEdBQTFCLFVBQTJCLEVBQVU7WUFDakMsTUFBTSxDQUFDLEVBQUUsSUFBSSxPQUFPLElBQUksRUFBRSxJQUFJLFVBQVUsQ0FBQztRQUM3QyxDQUFDO1FBQ08sdUNBQVksR0FBcEI7WUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNyQixFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7Z0JBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQztZQUM5QixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDO2dCQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDO2dCQUFDLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUM7Z0JBQUMsRUFBRSxHQUFHLGFBQWEsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUM7Z0JBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUM7Z0JBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQztZQUM5QyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksU0FBUyxDQUFDO2dCQUFDLEVBQUUsR0FBRyxVQUFVLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLFlBQVksQ0FBQztnQkFBQyxFQUFFLEdBQUcsYUFBYSxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQ08seUNBQWMsR0FBdEI7WUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN0QixHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQztnQkFBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQztnQkFBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQztnQkFBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ08seUNBQWMsR0FBdEI7WUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFhLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNyQixDQUFDO1FBQ08sd0NBQWEsR0FBckI7WUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNPLHVDQUFZLEdBQXBCLFVBQXFCLENBQVk7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDTyx3Q0FBYSxHQUFyQixVQUFzQixHQUFXO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7WUFDL0IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO29CQUMzQixJQUFJLE9BQU8sR0FBRyxJQUFJLG9CQUFhLEVBQUUsQ0FBQztvQkFDbEMsT0FBTyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7b0JBQzVCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDO29CQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pDLElBQUksT0FBTyxHQUFHLElBQUksb0JBQWEsRUFBRSxDQUFDO29CQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO2dCQUN4QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDTCx1QkFBQztJQUFELENBeE5BLEFBd05DLElBQUE7SUF4TlksdUJBQWdCLG1CQXdONUIsQ0FBQTtBQUNMLENBQUMsRUExTk0sTUFBTSxLQUFOLE1BQU0sUUEwTlo7O0FDbE9EOzs7O0VBSUU7QUFFRiw0Q0FBNEM7QUFFNUMsSUFBTyxNQUFNLENBdUhaO0FBdkhELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFFWDtRQUFBO1lBa0JZLFlBQU8sR0FBVyxPQUFPLENBQUM7UUF3QnRDLENBQUM7UUF4Q0csc0JBQVcsc0JBQVM7aUJBQXBCO2dCQUNJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO2dCQUN0RSxTQUFTLENBQUMsY0FBYyxHQUFHO29CQUN2QixLQUFLLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQy9DLFFBQVEsRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckQsS0FBSyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3ZELFFBQVEsRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxRQUFRLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNoRyxXQUFXLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEcsT0FBTyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3hELElBQUksRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxjQUFjLEVBQUUsVUFBVSxJQUFJLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsV0FBVyxFQUFFLFVBQVUsSUFBSSxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ2hFLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7WUFDcEMsQ0FBQzs7O1dBQUE7UUFJRCxzQkFBVywrQkFBUTtpQkFBbkIsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUN0RCxVQUFvQixLQUFhO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ25CLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLENBQUM7OztXQU5xRDtRQU8vQywyQkFBTyxHQUFkLFVBQWUsSUFBZ0IsRUFBRSxLQUFpQjtZQUFuQyxvQkFBZ0IsR0FBaEIsV0FBZ0I7WUFBRSxxQkFBaUIsR0FBakIsWUFBaUI7WUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFFL0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLENBQUM7UUFDTyxnQ0FBWSxHQUFwQixVQUFxQixHQUFRO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNqRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdFLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzRixNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQXhDTSx3QkFBYyxHQUF3QixJQUFJLENBQUM7UUF5Q3RELGdCQUFDO0lBQUQsQ0ExQ0EsQUEwQ0MsSUFBQTtJQTFDWSxnQkFBUyxZQTBDckIsQ0FBQTtJQUNEO1FBR0k7WUFGUSxvQkFBZSxHQUFXLEtBQUssQ0FBQztZQUNqQyxhQUFRLEdBQWUsRUFBRSxDQUFDO1FBQ1YsQ0FBQztRQUN4QixzQkFBVyxxQ0FBVTtpQkFBckIsY0FBa0MsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2lCQUNoRSxVQUFzQixLQUFhO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ25CLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQztvQkFBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNqRCxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUM7b0JBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7WUFDakMsQ0FBQzs7O1dBUitEO1FBU2hFLHNCQUFXLGtDQUFPO2lCQUFsQixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDbkQsNkJBQUssR0FBWjtZQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQzVCLENBQUM7UUFDTCxvQkFBQztJQUFELENBbEJBLEFBa0JDLElBQUE7SUFsQlksb0JBQWEsZ0JBa0J6QixDQUFBO0lBQ0Q7UUFJSSx5QkFBbUIsVUFBa0I7WUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxzQkFBVyx1Q0FBVTtpQkFBckIsY0FBa0MsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2lCQUNoRSxVQUFzQixLQUFhO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO2dCQUM3QixJQUFJLHVCQUFnQixFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xFLENBQUM7OztXQUwrRDtRQU16RCw2QkFBRyxHQUFWLFVBQVcsTUFBc0I7WUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDTyxpQ0FBTyxHQUFmLFVBQWdCLElBQW1CO1lBQy9CLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDO1lBQzNDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3pDLENBQUM7WUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3ZCLENBQUM7UUFDTywwQ0FBZ0IsR0FBeEIsVUFBeUIsS0FBVTtZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ08sc0NBQVksR0FBcEIsVUFBcUIsU0FBb0I7WUFDckMsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztZQUMxQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDekMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQztZQUNELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUN6QyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM5QixDQUFDO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDTyxzQ0FBWSxHQUFwQixVQUFxQixTQUFjO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN2RyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQ0wsc0JBQUM7SUFBRCxDQXREQSxBQXNEQyxJQUFBO0lBdERZLHNCQUFlLGtCQXNEM0IsQ0FBQTtBQUNMLENBQUMsRUF2SE0sTUFBTSxLQUFOLE1BQU0sUUF1SFo7O0FDL0hEOzs7O0VBSUU7QUFFRixJQUFPLE1BQU0sQ0FnRlo7QUFoRkQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBRUkseUVBQXlFO1FBQ3pFO1FBQ0EsQ0FBQztRQUNNLG9DQUFVLEdBQWpCLFVBQWtCLFFBQWdCLEVBQUUsTUFBaUU7WUFDakcsSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMvQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsVUFBVSxHQUFHLHNCQUFzQixHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztZQUMxRSxHQUFHLENBQUMsTUFBTSxHQUFHO2dCQUNULElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRCxDQUFDLENBQUM7WUFDRixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixDQUFDO1FBQ00sb0NBQVUsR0FBakIsVUFBa0IsTUFBYyxFQUFFLE1BQVksRUFBRSxZQUFzRCxFQUFFLFFBQXVCLEVBQUUsa0JBQW1DO1lBQTVELHdCQUF1QixHQUF2QixlQUF1QjtZQUFFLGtDQUFtQyxHQUFuQywwQkFBbUM7WUFDaEssSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMvQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQ3hELEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztZQUN4RSxJQUFJLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNwRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztnQkFBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUQsSUFBSSxhQUFhLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHO2dCQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQzFCLFlBQVksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQ00sa0NBQVEsR0FBZixVQUFnQixNQUFjLEVBQUUsSUFBVSxFQUFFLFVBQXFEO1lBQzdGLElBQUksR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDL0IsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxHQUFHO2dCQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ3hCLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQztZQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hFLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7WUFDOUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ00sbUNBQVMsR0FBaEIsVUFBaUIsUUFBZ0IsRUFBRSxJQUFZLEVBQUUsV0FBdUY7WUFDcEksSUFBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUMvQixJQUFJLElBQUksR0FBRyxXQUFXLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDcEQsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLFVBQVUsR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDbkUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQixHQUFHLENBQUMsTUFBTSxHQUFHO2dCQUNULElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbEMsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDVixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7d0JBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2xCLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2YsQ0FBQztRQUNNLHFDQUFXLEdBQWxCLFVBQW1CLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxhQUF3RTtZQUMzSCxJQUFJLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQy9CLElBQUksSUFBSSxHQUFHLFdBQVcsR0FBRyxRQUFRLEdBQUcsWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUM1RCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsVUFBVSxHQUFHLGVBQWUsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNyRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7WUFDMUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7Z0JBQ1QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEMsQ0FBQztnQkFDRCxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUM7WUFDRixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixDQUFDO1FBNUVhLDBCQUFVLEdBQVcsa0RBQWtELENBQUM7UUE2RTFGLHNCQUFDO0lBQUQsQ0E5RUEsQUE4RUMsSUFBQTtJQTlFWSxzQkFBZSxrQkE4RTNCLENBQUE7QUFDTCxDQUFDLEVBaEZNLE1BQU0sS0FBTixNQUFNLFFBZ0ZaOztBQ3RGRDs7OztFQUlFO0FBRUYsSUFBTyxNQUFNLENBNERaO0FBNURELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDQSx5QkFBa0IsR0FBRztRQUM1QixhQUFhLEVBQUUsRUFBRTtRQUNqQixPQUFPLEVBQUUsRUFBRTtRQUNYLFNBQVMsRUFBRSxVQUFVLE9BQWU7WUFDaEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxvQkFBYSxDQUFDO1lBQ2hGLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUFDLEdBQUcsR0FBRyxvQkFBYSxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUNELFVBQVUsRUFBRTtZQUNSLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixDQUFDO1lBQ0QsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1gsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7S0FDSixDQUFDO0lBQ1Msb0JBQWEsR0FBRztRQUN2QixZQUFZLEVBQUUsVUFBVTtRQUN4QixZQUFZLEVBQUUsTUFBTTtRQUNwQixZQUFZLEVBQUUsVUFBVTtRQUN4QixhQUFhLEVBQUUsa0JBQWtCO1FBQ2pDLFlBQVksRUFBRSxpQkFBaUI7UUFDL0IsV0FBVyxFQUFFLGlFQUFpRTtRQUM5RSxnQkFBZ0IsRUFBRSxzQ0FBc0M7UUFDeEQsYUFBYSxFQUFFLHNDQUFzQztRQUNyRCxjQUFjLEVBQUUsV0FBVztRQUMzQixhQUFhLEVBQUUsNkJBQTZCO1FBQzVDLFlBQVksRUFBRSxnQ0FBZ0M7UUFDOUMsYUFBYSxFQUFFLG9DQUFvQztRQUNuRCxnQkFBZ0IsRUFBRSxnQ0FBZ0M7UUFDbEQsY0FBYyxFQUFFLHNDQUFzQztRQUN0RCxjQUFjLEVBQUUsMkNBQTJDO1FBQzNELGFBQWEsRUFBRSx1RUFBdUU7UUFDdEYsVUFBVSxFQUFFLDRDQUE0QztRQUN4RCxVQUFVLEVBQUUsNENBQTRDO1FBQ3hELFlBQVksRUFBRSw4QkFBOEI7UUFDNUMsZUFBZSxFQUFFLHFDQUFxQztRQUN0RCxrQkFBa0IsRUFBRSxvRUFBb0U7UUFDeEYsYUFBYSxFQUFFLHNDQUFzQztRQUNyRCxrQkFBa0IsRUFBRSxnQ0FBZ0M7UUFDcEQsYUFBYSxFQUFFLG9FQUFvRTtRQUNuRixNQUFNLEVBQUUsU0FBUztRQUNqQixTQUFTLEVBQUUsUUFBUTtLQUN0QixDQUFBO0lBQ0QseUJBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLG9CQUFhLENBQUM7SUFFakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHO1lBQ3pCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztZQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxLQUFLLEVBQUUsTUFBTTtnQkFDbkQsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFdBQVc7c0JBQ25DLElBQUksQ0FBQyxNQUFNLENBQUM7c0JBQ1osS0FBSyxDQUNOO1lBQ1QsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7SUFDTixDQUFDO0FBQ0wsQ0FBQyxFQTVETSxNQUFNLEtBQU4sTUFBTSxRQTREWjs7QUNsRUQ7Ozs7RUFJRTs7Ozs7O0FBRUYsZ0NBQWdDO0FBQ2hDLHlDQUF5QztBQUN6QyxJQUFPLE1BQU0sQ0E4Q1o7QUE5Q0QsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQXlDLHVDQUFXO1FBQ2hEO1lBQ0ksaUJBQU8sQ0FBQztRQUNaLENBQUM7UUFDTSxxQ0FBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLHlCQUFrQixDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0wsMEJBQUM7SUFBRCxDQVBBLEFBT0MsQ0FQd0Msa0JBQVcsR0FPbkQ7SUFQWSwwQkFBbUIsc0JBTy9CLENBQUE7SUFDRDtRQUF3QyxzQ0FBVztRQUMvQztZQUNJLGlCQUFPLENBQUM7UUFDWixDQUFDO1FBQ00sb0NBQU8sR0FBZDtZQUNJLE1BQU0sQ0FBQyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNMLHlCQUFDO0lBQUQsQ0FQQSxBQU9DLENBUHVDLGtCQUFXLEdBT2xEO0lBUFkseUJBQWtCLHFCQU85QixDQUFBO0lBQ0Q7UUFBcUMsbUNBQVc7UUFFNUMseUJBQVksT0FBZTtZQUN2QixpQkFBTyxDQUFDO1lBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsQ0FBQztRQUNNLGlDQUFPLEdBQWQ7WUFDSSxNQUFNLENBQUMseUJBQWtCLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7UUFDTyxxQ0FBVyxHQUFuQjtZQUNJLElBQUksS0FBSyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzlDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDdkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDTCxzQkFBQztJQUFELENBakJBLEFBaUJDLENBakJvQyxrQkFBVyxHQWlCL0M7SUFqQlksc0JBQWUsa0JBaUIzQixDQUFBO0lBRUQ7UUFBaUMsK0JBQVc7UUFFeEMscUJBQVksSUFBWTtZQUNwQixpQkFBTyxDQUFDO1lBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUNNLDZCQUFPLEdBQWQ7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDO1FBQ0wsa0JBQUM7SUFBRCxDQVRBLEFBU0MsQ0FUZ0Msa0JBQVcsR0FTM0M7SUFUWSxrQkFBVyxjQVN2QixDQUFBO0FBQ0wsQ0FBQyxFQTlDTSxNQUFNLEtBQU4sTUFBTSxRQThDWjs7QUN0REQ7Ozs7RUFJRTs7Ozs7O0FBRUYsZ0NBQWdDO0FBQ2hDLHNDQUFzQztBQUN0QyxJQUFPLE1BQU0sQ0ErRlo7QUEvRkQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQWtDLGdDQUFJO1FBdUJsQyxzQkFBbUIsSUFBWTtZQUMzQixpQkFBTyxDQUFDO1lBRE8sU0FBSSxHQUFKLElBQUksQ0FBUTtZQWhCdkIsb0JBQWUsR0FBb0IsSUFBSSxDQUFDO1lBQ3pDLGNBQVMsR0FBVyxFQUFFLENBQUM7WUFFdEIsaUJBQVksR0FBWSxJQUFJLENBQUM7WUFDOUIscUJBQWdCLEdBQVksSUFBSSxDQUFDO1lBQ2hDLHNCQUFpQixHQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFVBQUssR0FBVyxFQUFFLENBQUM7WUFDbEIscUJBQWdCLEdBQVcsRUFBRSxDQUFDO1lBQzlCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztZQUM5QixXQUFNLEdBQVcsQ0FBQyxDQUFDO1lBU3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN0QixDQUFDO1FBekJjLDBCQUFhLEdBQTVCO1lBQ0ksTUFBTSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDbEQsQ0FBQztRQXdCRCxzQkFBVyxpQ0FBTztpQkFBbEIsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUMzRCxVQUFtQixHQUFZO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO2dCQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFZLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pFLENBQUM7WUFDTCxDQUFDOzs7V0FUMEQ7UUFVM0Qsc0JBQVcsc0NBQVk7aUJBQXZCLGNBQW9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUM3RCxnQ0FBUyxHQUFoQixVQUFpQixZQUE0QjtZQUE1Qiw0QkFBNEIsR0FBNUIsbUJBQTRCO1lBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUFDLENBQUM7UUFDekUsc0JBQVcsa0NBQVE7aUJBQW5CLGNBQWlDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNoRCxzQkFBVyxvQ0FBVTtpQkFBckIsY0FBbUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ2xELHNCQUFXLDRCQUFFO2lCQUFiLGNBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDaEQsc0JBQVcscUNBQVc7aUJBQXRCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2lCQUNsRSxVQUF1QixHQUFXO2dCQUM5QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDdkQsQ0FBQzs7O1dBTGlFO1FBTWxFLHNCQUFXLHFDQUFXO2lCQUF0QixjQUFtQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztpQkFDbEUsVUFBdUIsR0FBVztnQkFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUNwQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO2dCQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7OztXQUxpRTtRQU0zRCw0QkFBSyxHQUFaO1lBQ0ksSUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUN0QyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxQyxDQUFDO1FBQ0wsQ0FBQztRQUNELDhCQUFPLEdBQVAsVUFBUSxRQUFxQjtZQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFZLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDakYsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFDUyxtQ0FBWSxHQUF0QixVQUF1QixRQUFvQjtZQUN2QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUNTLGdDQUFTLEdBQW5CLGNBQXdCLENBQUM7UUFDZixpQ0FBVSxHQUFwQixjQUF5QixDQUFDO1FBQ25CLG1DQUFZLEdBQW5CLFVBQW9CLE1BQXNCO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxzQkFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ2pELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUNGLFdBQVc7UUFDViwyQ0FBb0IsR0FBcEIsVUFBcUIsUUFBYTtRQUNsQyxDQUFDO1FBQ0QsbUNBQVksR0FBWjtRQUNBLENBQUM7UUFDRCxzQ0FBZSxHQUFmLFVBQWdCLEtBQWE7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixJQUFJLEtBQUssQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDNUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFDRCxpREFBMEIsR0FBMUIsY0FBK0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUF6Ri9CLDRCQUFlLEdBQUcsR0FBRyxDQUFDO1FBMEZ6QyxtQkFBQztJQUFELENBM0ZBLEFBMkZDLENBM0ZpQyxXQUFJLEdBMkZyQztJQTNGWSxtQkFBWSxlQTJGeEIsQ0FBQTtJQUNELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLGdCQUFnQjtRQUMvRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBMEIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUksQ0FBQyxFQS9GTSxNQUFNLEtBQU4sTUFBTSxRQStGWjs7QUN2R0Q7Ozs7RUFJRTtBQUVGLHdDQUF3QztBQUN4QyxnQ0FBZ0M7QUFDaEMsSUFBTyxNQUFNLENBc0JaO0FBdEJELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUFBO1lBR1ksZ0JBQVcsR0FBOEMsRUFBRSxDQUFDO1FBaUJ4RSxDQUFDO1FBZlUsMENBQWdCLEdBQXZCLFVBQXdCLFlBQW9CLEVBQUUsZUFBK0M7WUFDekYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxlQUFlLENBQUM7UUFDckQsQ0FBQztRQUNNLHFDQUFXLEdBQWxCO1lBQ0ksSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztZQUNqQyxHQUFHLENBQUEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBQ00sd0NBQWMsR0FBckIsVUFBc0IsWUFBb0IsRUFBRSxJQUFZO1lBQ3BELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQWxCYSx3QkFBUSxHQUFvQixJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQ2xELDhCQUFjLEdBQUcsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQWtCcEYsc0JBQUM7SUFBRCxDQXBCQSxBQW9CQyxJQUFBO0lBcEJZLHNCQUFlLGtCQW9CM0IsQ0FBQTtBQUNMLENBQUMsRUF0Qk0sTUFBTSxLQUFOLE1BQU0sUUFzQlo7O0FDOUJEOzs7O0VBSUU7Ozs7OztBQUVGLHdDQUF3QztBQUN4QywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBRXRDLElBQU8sTUFBTSxDQW9NWDtBQXBNRixXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFHSSwwQkFBbUIsSUFBZSxFQUFTLFFBQXNCO1lBQTlDLFNBQUksR0FBSixJQUFJLENBQVc7WUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFjO1lBRnpELGlCQUFZLEdBQVksS0FBSyxDQUFDO1lBTS9CLGNBQVMsR0FBd0IsRUFBRSxDQUFDO1lBSHZDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUE0QixHQUFHLGNBQWMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0YsQ0FBQztRQUVELHNCQUFXLHFDQUFPO2lCQUFsQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQzNELFVBQW1CLEdBQVk7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzVCLENBQUM7OztXQUwwRDtRQU1wRCx3Q0FBYSxHQUFwQjtZQUNJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBQ00sc0NBQVcsR0FBbEIsVUFBbUIsQ0FBZTtZQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDekIsQ0FBQztRQUNTLDJDQUFnQixHQUExQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztnQkFBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUN6RSxDQUFDO1FBQ00sbUNBQVEsR0FBZjtZQUNJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUMxQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7Z0JBQzFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUM7b0JBQzdHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLE9BQU8sR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQy9ELE9BQU8sRUFBRSxDQUFDO2dCQUNkLENBQUM7UUFDVCxDQUFDO1FBQ08saURBQXNCLEdBQTlCO1lBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ08sMENBQWUsR0FBdkI7WUFDSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUMsR0FBRyxFQUFFLENBQUM7WUFDekQsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ08sNENBQWlCLEdBQXpCLFVBQTBCLENBQWUsSUFBYSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEYsc0NBQVcsR0FBbkIsY0FBaUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLHVCQUFDO0lBQUQsQ0FoREEsQUFnREMsSUFBQTtJQWhEWSx1QkFBZ0IsbUJBZ0Q1QixDQUFBO0lBRUQ7UUFBK0IsNkJBQUk7UUFXL0IsbUJBQW1CLElBQWlCO1lBQXhCLG9CQUF3QixHQUF4QixTQUF3QjtZQUNoQyxpQkFBTyxDQUFDO1lBRE8sU0FBSSxHQUFKLElBQUksQ0FBYTtZQVY1QixjQUFTLEdBQTRCLElBQUksQ0FBQztZQUMxQyxvQkFBZSxHQUFvQixJQUFJLENBQUM7WUFDaEQsY0FBUyxHQUF3QixJQUFJLEtBQUssRUFBZ0IsQ0FBQztZQUNwRCxTQUFJLEdBQVksSUFBSSxDQUFDO1lBQ3JCLGNBQVMsR0FBVyxFQUFFLENBQUM7WUFFdkIsVUFBSyxHQUFXLEVBQUUsQ0FBQztZQUNuQixpQkFBWSxHQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLGFBQVEsR0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0QixpQkFBWSxHQUFZLElBQUksQ0FBQztZQUdqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxLQUFLO2dCQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixDQUFDO2dCQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQztRQUNOLENBQUM7UUFDRCxzQkFBVywyQkFBSTtpQkFBZjtnQkFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDMUIsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVywrQkFBUTtpQkFBbkIsY0FBd0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDeEUscUNBQWlCLEdBQXhCLFVBQXlCLFFBQXNCLElBQWEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDakcsNkJBQVMsR0FBbkIsVUFBb0IsUUFBc0IsSUFBc0IsTUFBTSxDQUFDLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RyxzQkFBWSxtQ0FBWTtpQkFBeEIsY0FBNkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNsRSw2QkFBUyxHQUFqQjtZQUNJLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxFQUFvQixDQUFDO1lBQzNDLElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLG1CQUFtQixHQUFHLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUM7d0JBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDO29CQUNyRCxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLENBQUM7WUFDTCxDQUFDO1lBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN6QixDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ0QsMENBQXNCLEdBQXRCLFVBQXVCLEdBQXFCO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6RCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNsQyxLQUFLLENBQUM7Z0JBQ1YsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0Qsc0JBQVcscUNBQWM7aUJBQXpCLGNBQThCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQzFHLHNCQUFXLDBCQUFHO2lCQUFkLGNBQW1CLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztpQkFDMUMsVUFBZSxLQUFhO2dCQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLENBQUM7OztXQUx5QztRQU0xQyxzQkFBVyw4QkFBTztpQkFBbEIsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUMzRCxVQUFtQixLQUFjO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztZQUNMLENBQUM7OztXQVAwRDtRQVFwRCwyQkFBTyxHQUFkLGNBQTJCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNDLHNCQUFXLGdDQUFTO2lCQUFwQjtnQkFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM3QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQzt3QkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUMvQyxDQUFDO2dCQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQzs7O1dBQUE7UUFFTSwrQkFBVyxHQUFsQixVQUFtQixRQUFzQixFQUFFLEtBQWtCO1lBQWxCLHFCQUFrQixHQUFsQixTQUFpQixDQUFDO1lBQ3pELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM3QyxDQUFDO1FBQ0wsQ0FBQztRQUNNLGtDQUFjLEdBQXJCLFVBQXNCLFlBQW9CLEVBQUUsSUFBWTtZQUNwRCxJQUFJLFFBQVEsR0FBRyxzQkFBZSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBQ00sa0NBQWMsR0FBckIsVUFBc0IsUUFBc0I7WUFDeEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO2dCQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDTSx5Q0FBcUIsR0FBNUI7WUFDSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDMUIsS0FBSyxDQUFDO2dCQUNWLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNNLDZCQUFTLEdBQWhCLFVBQWlCLFlBQTRCLEVBQUUsa0JBQW1DO1lBQWpFLDRCQUE0QixHQUE1QixtQkFBNEI7WUFBRSxrQ0FBbUMsR0FBbkMsMEJBQW1DO1lBQzlFLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQztZQUM5QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekUsRUFBRSxDQUFDLENBQUMsa0JBQWtCLElBQUksa0JBQWtCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDbkQsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsQ0FBQztvQkFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixDQUFDO1lBQ0wsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO2dCQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNNLHNDQUFrQixHQUF6QixVQUEwQixJQUFzQixFQUFFLFdBQTRCO1lBQTVCLDJCQUE0QixHQUE1QixtQkFBNEI7WUFDMUUsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDekMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNyRCxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFBQyxRQUFRLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLENBQUM7UUFDTCxDQUFDO1FBQ00sZ0NBQVksR0FBbkIsVUFBb0IsTUFBc0I7WUFDdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7Z0JBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLHNCQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3RGLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ1MsZ0NBQVksR0FBdEIsVUFBdUIsS0FBYTtRQUNwQyxDQUFDO1FBQ0wsZ0JBQUM7SUFBRCxDQS9JQSxBQStJQyxDQS9JOEIsV0FBSSxHQStJbEM7SUEvSVksZ0JBQVMsWUErSXJCLENBQUE7SUFDRCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsRUFBRSxjQUFjLE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL00sQ0FBQyxFQXBNSyxNQUFNLEtBQU4sTUFBTSxRQW9NWDs7QUM5TUY7Ozs7RUFJRTs7Ozs7O0FBRUYsZ0NBQWdDO0FBQ2hDLGlDQUFpQztBQUNqQyxzQ0FBc0M7QUFDdEMsSUFBTyxNQUFNLENBdUpaO0FBdkpELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUNJLHlCQUFtQixLQUFVLEVBQVMsS0FBeUI7WUFBaEMscUJBQWdDLEdBQWhDLFlBQWdDO1lBQTVDLFVBQUssR0FBTCxLQUFLLENBQUs7WUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFvQjtRQUMvRCxDQUFDO1FBQ0wsc0JBQUM7SUFBRCxDQUhBLEFBR0MsSUFBQTtJQUhZLHNCQUFlLGtCQUczQixDQUFBO0lBRUQ7UUFBcUMsbUNBQUk7UUFFckM7WUFDSSxpQkFBTyxDQUFDO1lBRkwsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUd6QixDQUFDO1FBQ1Msc0NBQVksR0FBdEIsVUFBdUIsSUFBWTtZQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNTLDZDQUFtQixHQUE3QixVQUE4QixJQUFZO1lBQ3RDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQ00sa0NBQVEsR0FBZixVQUFnQixLQUFVLEVBQUUsSUFBbUI7WUFBbkIsb0JBQW1CLEdBQW5CLFdBQW1CO1lBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNMLHNCQUFDO0lBQUQsQ0FmQSxBQWVDLENBZm9DLFdBQUksR0FleEM7SUFmWSxzQkFBZSxrQkFlM0IsQ0FBQTtJQU1EO1FBQUE7UUFhQSxDQUFDO1FBWlUsNkJBQUcsR0FBVixVQUFXLEtBQXNCO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDL0MsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO2dCQUMzRixFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQzt3QkFBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQztvQkFDeEQsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLEtBQUssQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQztvQkFDeEMsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNMLHNCQUFDO0lBQUQsQ0FiQSxBQWFDLElBQUE7SUFiWSxzQkFBZSxrQkFhM0IsQ0FBQTtJQUVEO1FBQXNDLG9DQUFlO1FBQ2pELDBCQUFtQixRQUF1QixFQUFTLFFBQXVCO1lBQTlELHdCQUE4QixHQUE5QixlQUE4QjtZQUFFLHdCQUE4QixHQUE5QixlQUE4QjtZQUN0RSxpQkFBTyxDQUFDO1lBRE8sYUFBUSxHQUFSLFFBQVEsQ0FBZTtZQUFTLGFBQVEsR0FBUixRQUFRLENBQWU7UUFFMUUsQ0FBQztRQUNNLGtDQUFPLEdBQWQsY0FBMkIsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUNoRCxtQ0FBUSxHQUFmLFVBQWdCLEtBQVUsRUFBRSxJQUFtQjtZQUFuQixvQkFBbUIsR0FBbkIsV0FBbUI7WUFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLHlCQUFrQixFQUFFLENBQUMsQ0FBQztZQUMvRCxDQUFDO1lBQ0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksa0JBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ3ZELENBQUM7UUFDUyw4Q0FBbUIsR0FBN0IsVUFBOEIsSUFBWTtZQUN0QyxJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMseUJBQWtCLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4RyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLE1BQU0sQ0FBQyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEYsQ0FBQztnQkFDRCxNQUFNLENBQUMseUJBQWtCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEYsQ0FBQztRQUNMLENBQUM7UUFDTyxtQ0FBUSxHQUFoQixVQUFpQixLQUFLO1lBQ2xCLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNMLHVCQUFDO0lBQUQsQ0FsQ0EsQUFrQ0MsQ0FsQ3FDLGVBQWUsR0FrQ3BEO0lBbENZLHVCQUFnQixtQkFrQzVCLENBQUE7SUFFRDtRQUFtQyxpQ0FBZTtRQUM5Qyx1QkFBbUIsU0FBcUI7WUFBNUIseUJBQTRCLEdBQTVCLGFBQTRCO1lBQ3BDLGlCQUFPLENBQUM7WUFETyxjQUFTLEdBQVQsU0FBUyxDQUFZO1FBRXhDLENBQUM7UUFDTSwrQkFBTyxHQUFkLGNBQTJCLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQzdDLGdDQUFRLEdBQWYsVUFBZ0IsS0FBVSxFQUFFLElBQW1CO1lBQW5CLG9CQUFtQixHQUFuQixXQUFtQjtZQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLGtCQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNTLDJDQUFtQixHQUE3QixVQUE4QixJQUFZO1lBQ3RDLE1BQU0sQ0FBQyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25GLENBQUM7UUFDTCxvQkFBQztJQUFELENBZkEsQUFlQyxDQWZrQyxlQUFlLEdBZWpEO0lBZlksb0JBQWEsZ0JBZXpCLENBQUE7SUFFRDtRQUEwQyx3Q0FBZTtRQUNyRCw4QkFBbUIsUUFBdUIsRUFBUyxRQUF1QjtZQUE5RCx3QkFBOEIsR0FBOUIsZUFBOEI7WUFBRSx3QkFBOEIsR0FBOUIsZUFBOEI7WUFDdEUsaUJBQU8sQ0FBQztZQURPLGFBQVEsR0FBUixRQUFRLENBQWU7WUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFlO1FBRTFFLENBQUM7UUFDTSxzQ0FBTyxHQUFkLGNBQTJCLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDcEQsdUNBQVEsR0FBZixVQUFnQixLQUFVLEVBQUUsSUFBbUI7WUFBbkIsb0JBQW1CLEdBQW5CLFdBQW1CO1lBQzNDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUM3RCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksa0JBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHlCQUFrQixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsSixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxrQkFBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMseUJBQWtCLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xKLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDUyxrREFBbUIsR0FBN0IsVUFBOEIsSUFBWTtZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTCwyQkFBQztJQUFELENBbkJBLEFBbUJDLENBbkJ5QyxlQUFlLEdBbUJ4RDtJQW5CWSwyQkFBb0IsdUJBbUJoQyxDQUFBO0lBRUQ7UUFBb0Msa0NBQWU7UUFDL0Msd0JBQW1CLEtBQW9CO1lBQTNCLHFCQUEyQixHQUEzQixZQUEyQjtZQUNuQyxpQkFBTyxDQUFDO1lBRE8sVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUV2QyxDQUFDO1FBQ00sZ0NBQU8sR0FBZCxjQUEyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQzlDLGlDQUFRLEdBQWYsVUFBZ0IsS0FBVSxFQUFFLElBQW1CO1lBQW5CLG9CQUFtQixHQUFuQixXQUFtQjtZQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN2QyxJQUFJLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxrQkFBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFDTCxxQkFBQztJQUFELENBWEEsQUFXQyxDQVhtQyxlQUFlLEdBV2xEO0lBWFkscUJBQWMsaUJBVzFCLENBQUE7SUFDRDtRQUFvQyxrQ0FBZTtRQUUvQztZQUNJLGlCQUFPLENBQUM7WUFGSixPQUFFLEdBQUcsd0hBQXdILENBQUM7UUFHdEksQ0FBQztRQUNNLGdDQUFPLEdBQWQsY0FBMkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUM5QyxpQ0FBUSxHQUFmLFVBQWdCLEtBQVUsRUFBRSxJQUFtQjtZQUFuQixvQkFBbUIsR0FBbkIsV0FBbUI7WUFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxrQkFBVyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFDUyw0Q0FBbUIsR0FBN0IsVUFBOEIsSUFBWTtZQUNyQyxNQUFNLENBQUMseUJBQWtCLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDTixxQkFBQztJQUFELENBZEMsQUFjQSxDQWRvQyxlQUFlLEdBY25EO0lBZGEscUJBQWMsaUJBYzNCLENBQUE7SUFFQSxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDNUosaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3BJLGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDcEssaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQzNILGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBRXhILENBQUMsRUF2Sk0sTUFBTSxLQUFOLE1BQU0sUUF1Slo7O0FDaEtEOzs7O0VBSUU7QUFFRixJQUFPLE1BQU0sQ0EwRFo7QUExREQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQUE7UUFHQSxDQUFDO1FBQUQsMkJBQUM7SUFBRCxDQUhBLEFBR0MsSUFBQTtJQUNEO1FBR0k7UUFBZ0IsQ0FBQztRQUNWLGtDQUFPLEdBQWQsVUFBZSxJQUFZO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQUMsUUFBUSxDQUFDO2dCQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFBQyxRQUFRLENBQUM7Z0JBQ3hELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7b0JBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDOUIsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzFFLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTyxtQ0FBUSxHQUFoQixVQUFpQixJQUFZO1lBQ3pCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDZixJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDWixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM5QixFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNiLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUM7b0JBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDekIsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ1osRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDYixJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFvQixFQUFFLENBQUM7d0JBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUNuQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQzt3QkFDYixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNyQixDQUFDO29CQUNELEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDZixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNPLGtDQUFPLEdBQWYsVUFBZ0IsSUFBWTtZQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBQ08seUNBQWMsR0FBdEIsVUFBdUIsSUFBWTtZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU07Z0JBQ04sRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUM7b0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUMxRCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0wsdUJBQUM7SUFBRCxDQXBEQSxBQW9EQyxJQUFBO0lBcERZLHVCQUFnQixtQkFvRDVCLENBQUE7QUFDTCxDQUFDLEVBMURNLE1BQU0sS0FBTixNQUFNLFFBMERaOztBQ2hFRDs7OztFQUlFOzs7Ozs7QUFFRiwyQ0FBMkM7QUFDM0MsaUNBQWlDO0FBQ2pDLHFDQUFxQztBQUNyQyxzQ0FBc0M7QUFDdEMsd0NBQXdDO0FBQ3hDLDRDQUE0QztBQUM1QyxJQUFPLE1BQU0sQ0E2TFo7QUE3TEQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQThCLDRCQUFZO1FBZ0J0QyxrQkFBbUIsSUFBWTtZQUMzQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQURHLFNBQUksR0FBSixJQUFJLENBQVE7WUFmdkIsZUFBVSxHQUFXLElBQUksQ0FBQztZQUcxQixvQkFBZSxHQUFZLEtBQUssQ0FBQztZQUNqQyxvQkFBZSxHQUFZLEtBQUssQ0FBQztZQUNqQyxrQkFBYSxHQUFZLEtBQUssQ0FBQztZQUMvQixxQkFBZ0IsR0FBVyxFQUFFLENBQUM7WUFFdEMsV0FBTSxHQUF1QixFQUFFLENBQUM7WUFDaEMsZUFBVSxHQUEyQixJQUFJLEtBQUssRUFBbUIsQ0FBQztZQXdJMUQsMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBaEl2QyxDQUFDO1FBQ0Qsc0JBQVcsOEJBQVE7aUJBQW5CLGNBQWlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUMvQyxzQkFBVywyQkFBSztpQkFBaEIsY0FBNkIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQ3RGLFVBQWlCLFFBQWdCO2dCQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNqRCxDQUFDOzs7V0FKcUY7UUFLdEYsc0JBQVcsb0NBQWM7aUJBQXpCLGNBQThCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQzlHLHNCQUFXLCtCQUFTO2lCQUFwQjtnQkFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksdUJBQWdCLEVBQUUsQ0FBQzt3QkFDL0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsR0FBRyxVQUFVLElBQVksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2SCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxHQUFHLFVBQVUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNHLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2dCQUM1RSxDQUFDO2dCQUNELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztvQkFBQyxXQUFXLElBQUksR0FBRyxDQUFDO2dCQUNwQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNqQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQUMsRUFBRSxJQUFJLElBQUksQ0FBQztnQkFDbkIsTUFBTSxDQUFDLEVBQUUsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUNsRCxDQUFDOzs7V0FBQTtRQUNTLHlDQUFzQixHQUFoQyxVQUFpQyxJQUFZO1lBQ3pDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLFNBQVMsQ0FBQztRQUNoRSxDQUFDO1FBQ1Msd0NBQXFCLEdBQS9CLFVBQWdDLElBQVk7WUFDeEMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ00saUNBQWMsR0FBckIsY0FBbUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDM0MsK0JBQVksR0FBbkIsY0FBaUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEQsc0JBQVcsZ0NBQVU7aUJBQXJCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztpQkFDakUsVUFBc0IsR0FBWTtnQkFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNqRCxDQUFDOzs7V0FMZ0U7UUFNakUsc0JBQVcsZ0NBQVU7aUJBQXJCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztpQkFDakUsVUFBc0IsR0FBWTtnQkFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUMvQyxDQUFDOzs7V0FMZ0U7UUFNakUsc0JBQVcsaUNBQVc7aUJBQXRCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLHlCQUFrQixDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzFJLFVBQXVCLEtBQWE7Z0JBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDbEMsQ0FBQzs7O1dBSHlJO1FBSTFJLHNCQUFXLDhCQUFRO2lCQUFuQixjQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7aUJBQzdELFVBQW9CLEdBQVk7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7Z0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDL0MsQ0FBQzs7O1dBTDREO1FBTTdELHNCQUFjLHdCQUFFO2lCQUFoQjtnQkFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDO29CQUNyQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO3dCQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ2hELENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2xFLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3RFLENBQUM7OztXQUFBO1FBQ1MsNEJBQVMsR0FBbkI7WUFDSSxnQkFBSyxDQUFDLFNBQVMsV0FBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNELHNCQUFXLDJCQUFLO2lCQUFoQjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUNuRCxDQUFDO2lCQUNELFVBQWlCLFFBQWE7Z0JBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDakQsQ0FBQzs7O1dBSkE7UUFLRCxzQkFBVyw2QkFBTztpQkFBbEIsY0FBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQzFELFVBQW1CLFFBQWdCO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDbkQsQ0FBQzs7O1dBTHlEO1FBTWhELDZCQUFVLEdBQXBCLGNBQWlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDM0csNkJBQVUsR0FBcEIsVUFBcUIsUUFBZ0I7WUFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxDQUFDO1FBQ00sMEJBQU8sR0FBZCxjQUE0QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pELDRCQUFTLEdBQWhCLFVBQWlCLFlBQTRCO1lBQTVCLDRCQUE0QixHQUE1QixtQkFBNEI7WUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDRCxzQkFBVyxrQ0FBWTtpQkFBdkIsY0FBb0MsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDNUcsaUNBQWMsR0FBdEIsVUFBdUIsWUFBcUI7WUFDeEMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDakMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDUixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztZQUNMLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1QixDQUFDO1lBQ0wsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2xELENBQUM7UUFDTCxDQUFDO1FBQ1MsbUNBQWdCLEdBQTFCLFVBQTJCLE1BQTBCO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSwwQkFBbUIsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNMLENBQUM7UUFDUyxtQ0FBZ0IsR0FBMUI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0MsQ0FBQztRQUNTLGdDQUFhLEdBQXZCO1lBQ0ksTUFBTSxDQUFDLElBQUksc0JBQWUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRVMsOEJBQVcsR0FBckIsVUFBc0IsUUFBYTtZQUMvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFDUyxvQ0FBaUIsR0FBM0IsVUFBNEIsUUFBYTtZQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7UUFDTCxDQUFDO1FBQ08sK0JBQVksR0FBcEI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDbEYsQ0FBQztRQUNPLCtCQUFZLEdBQXBCLFVBQXFCLFFBQWE7WUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztZQUNsQyxDQUFDO1FBQ0wsQ0FBQztRQUNTLGdDQUFhLEdBQXZCLFVBQXdCLEdBQVEsSUFBUyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1Qyw4QkFBVyxHQUFyQixVQUFzQixHQUFRLElBQVMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsaUNBQWMsR0FBeEIsY0FBNkIsQ0FBQztRQUNwQixnQ0FBYSxHQUF2QixVQUF3QixRQUFnQjtZQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUFDLElBQUk7Z0JBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUM7UUFDM0MsQ0FBQztRQUNELFdBQVc7UUFDWCx1Q0FBb0IsR0FBcEIsVUFBcUIsUUFBYTtZQUM5QixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1lBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxLQUFLLENBQUM7UUFDeEMsQ0FBQztRQUNELGlCQUFpQjtRQUNqQixvQ0FBaUIsR0FBakIsY0FBOEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakQsZUFBQztJQUFELENBeExDLEFBd0xBLENBeEw4QixtQkFBWSxHQXdMMUM7SUF4TGEsZUFBUSxXQXdMckIsQ0FBQTtJQUNBLGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUN6RixvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3JKLENBQUMsRUE3TE0sTUFBTSxLQUFOLE1BQU0sUUE2TFo7O0FDek1EOzs7O0VBSUU7Ozs7OztBQUVGLG1DQUFtQztBQUNuQyxzQ0FBc0M7QUFDdEMseUNBQXlDO0FBQ3pDLElBQU8sTUFBTSxDQTZLWjtBQTdLRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFBd0Msc0NBQVE7UUFXNUMsNEJBQVksSUFBWTtZQUNwQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQVRoQixjQUFTLEdBQWMsSUFBSSxnQkFBUyxDQUFDLE9BQU8sRUFBRSx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNyRixtQkFBYyxHQUFxQixJQUFJLENBQUM7WUFDeEMsa0JBQWEsR0FBcUIsSUFBSSxLQUFLLEVBQWEsQ0FBQztZQUUxRCxtQkFBYyxHQUFXLElBQUksQ0FBQztZQUM5Qix5QkFBb0IsR0FBWSxJQUFJLENBQUM7WUFDNUMsc0JBQWlCLEdBQVcsTUFBTSxDQUFDO1lBbUIzQixxQkFBZ0IsR0FBWSxLQUFLLENBQUM7WUFmdEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxLQUF1QixJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQUNsSCxDQUFDO1FBQ0Qsc0JBQVcsK0NBQWU7aUJBQTFCO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM5RyxDQUFDOzs7V0FBQTtRQUNTLHdDQUFXLEdBQXJCLFVBQXNCLEdBQVE7WUFDMUIsTUFBTSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUN2QyxDQUFDO1FBQ1MsMkNBQWMsR0FBeEIsY0FBOEMsTUFBTSxDQUFDLElBQUksc0JBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSx1Q0FBVSxHQUFwQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxnQkFBSyxDQUFDLFVBQVUsV0FBRSxDQUFDO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzdCLENBQUM7UUFFUyx1Q0FBVSxHQUFwQixVQUFxQixRQUFnQjtZQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFDL0IsZ0JBQUssQ0FBQyxVQUFVLFlBQUMsUUFBUSxDQUFDLENBQUE7WUFDOUIsSUFBSSxDQUFDLENBQUM7Z0JBQ0YsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO29CQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztvQkFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQzdDLENBQUM7b0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztnQkFDbEMsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ1MsMENBQWEsR0FBdkIsVUFBd0IsR0FBUTtZQUM1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFBQyxNQUFNLENBQUMsZ0JBQUssQ0FBQyxhQUFhLFlBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDNUIsQ0FBQztRQUNTLHdDQUFXLEdBQXJCLFVBQXNCLEdBQVE7WUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLGdCQUFLLENBQUMsV0FBVyxZQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDUyw4Q0FBaUIsR0FBM0IsVUFBNEIsR0FBUTtZQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUMzQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDaEMsQ0FBQztRQUNTLDRDQUFlLEdBQXpCLFVBQTBCLEdBQVE7WUFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25ELEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDNUIsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ1MsNENBQWUsR0FBekIsVUFBMEIsR0FBUTtZQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3ZCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDL0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDNUMsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELHNCQUFJLHVDQUFPO2lCQUFYLGNBQTRCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDeEQsVUFBWSxRQUFvQjtnQkFDNUIsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNuRCxDQUFDOzs7V0FKdUQ7UUFLeEQsc0JBQUksNENBQVk7aUJBQWhCLGNBQTZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2lCQUM3RCxVQUFpQixRQUFnQjtnQkFDN0IsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7WUFDdEMsQ0FBQzs7O1dBSjREO1FBSzdELHNCQUFJLHlDQUFTO2lCQUFiLGNBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7aUJBQ3ZELFVBQWMsS0FBYSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUROO1FBRXZELHNCQUFJLDhDQUFjO2lCQUFsQjtnQkFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQzdFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ2pFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUM7OztXQUFBO1FBQ0Qsc0JBQVksNkNBQWE7aUJBQXpCLGNBQWdELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQzNHLDJDQUFjLEdBQXJCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFDLHlDQUFZLEdBQW5CLGNBQWlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLDZDQUFnQixHQUExQixVQUEyQixNQUEwQjtZQUNqRCxnQkFBSyxDQUFDLGdCQUFnQixZQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNsRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLEdBQUcseUJBQWtCLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUNTLG9EQUF1QixHQUFqQyxjQUFzQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUkseUNBQVksR0FBWjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuRCxDQUFDO1FBQ08saURBQW9CLEdBQTVCLFVBQTZCLEtBQXVCO1lBQ2hELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlDLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbEQsQ0FBQztZQUNELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQWEsQ0FBQztnQkFDcEMsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztZQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDTywrQ0FBa0IsR0FBMUIsVUFBMkIsS0FBdUI7WUFDOUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ08sc0NBQVMsR0FBakIsVUFBa0IsS0FBdUIsRUFBRSxJQUFZO1lBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTywyQ0FBYyxHQUF0QixVQUF1QixLQUF1QjtZQUMxQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNwQixDQUFDO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0wseUJBQUM7SUFBRCxDQXJKQSxBQXFKQyxDQXJKdUMsZUFBUSxHQXFKL0M7SUFySlkseUJBQWtCLHFCQXFKOUIsQ0FBQTtJQUVEO1FBQTBDLHdDQUFrQjtRQUd4RCw4QkFBbUIsSUFBWTtZQUMzQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQURHLFNBQUksR0FBSixJQUFJLENBQVE7WUFGdkIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFJbEMsQ0FBQztRQUNELHNCQUFXLDBDQUFRO2lCQUFuQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7aUJBQzVELFVBQW9CLEtBQWE7Z0JBQzdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO2dCQUMzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3BELENBQUM7OztXQUwyRDtRQU1oRSwyQkFBQztJQUFELENBWkEsQUFZQyxDQVp5QyxrQkFBa0IsR0FZM0Q7SUFaWSwyQkFBb0IsdUJBWWhDLENBQUE7SUFDRCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsb0JBQW9CLEVBQUUsa0JBQWtCO1FBQ2hGLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsSUFBSSxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsRUFBRSxLQUFVLElBQUksZ0JBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNqTSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRTtRQUNyRixFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLEVBQUUsS0FBVSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2pQLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUseUJBQWtCLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCO1FBQy9GLEVBQUUsSUFBSSxFQUFFLDhCQUE4QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUUvRSxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMxSSxDQUFDLEVBN0tNLE1BQU0sS0FBTixNQUFNLFFBNktaOztBQ3RMRDs7OztFQUlFOzs7Ozs7QUFFRixtQ0FBbUM7QUFDbkMsOENBQThDO0FBQzlDLDJDQUEyQztBQUMzQyxzQ0FBc0M7QUFDdEMsSUFBTyxNQUFNLENBMENaO0FBMUNELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUEyQyx5Q0FBb0I7UUFDM0QsK0JBQW1CLElBQVk7WUFDM0Isa0JBQU0sSUFBSSxDQUFDLENBQUM7WUFERyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBRS9CLENBQUM7UUFDUywyQ0FBVyxHQUFyQixVQUFzQixHQUFRO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNTLGlEQUFpQixHQUEzQixVQUE0QixHQUFRO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1lBRXBDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNsQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7b0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3pCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztvQkFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDbEIsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2YsQ0FBQztRQUNTLCtDQUFlLEdBQXpCLFVBQTBCLEdBQVE7WUFDOUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDcEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzt3QkFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFDbEIsQ0FBQztnQkFDTCxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDZixDQUFDO1FBQ00sdUNBQU8sR0FBZDtZQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdEIsQ0FBQztRQUNMLDRCQUFDO0lBQUQsQ0F0Q0EsQUFzQ0MsQ0F0QzBDLDJCQUFvQixHQXNDOUQ7SUF0Q1ksNEJBQXFCLHdCQXNDakMsQ0FBQTtJQUNELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLGNBQWMsTUFBTSxDQUFDLElBQUkscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDcEgsc0JBQWUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQUMsSUFBSSxJQUFPLElBQUksQ0FBQyxHQUFHLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLHNCQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hLLENBQUMsRUExQ00sTUFBTSxLQUFOLE1BQU0sUUEwQ1o7O0FDcEREOzs7O0VBSUU7Ozs7OztBQUVGLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQWdCWjtBQWhCRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFBMEMsd0NBQVE7UUFHOUMsOEJBQW1CLElBQVk7WUFDM0Isa0JBQU0sSUFBSSxDQUFDLENBQUM7WUFERyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBRnhCLFNBQUksR0FBVyxDQUFDLENBQUM7WUFDakIsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUd6QixDQUFDO1FBQ00sc0NBQU8sR0FBZDtZQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUNELHNDQUFPLEdBQVA7WUFDSSxNQUFNLENBQUMsZ0JBQUssQ0FBQyxPQUFPLFdBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUMvQyxDQUFDO1FBQ0wsMkJBQUM7SUFBRCxDQVpBLEFBWUMsQ0FaeUMsZUFBUSxHQVlqRDtJQVpZLDJCQUFvQix1QkFZaEMsQ0FBQTtJQUNELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFjLE1BQU0sQ0FBQyxJQUFJLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZMLHNCQUFlLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLElBQUksSUFBTyxNQUFNLENBQUMsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9HLENBQUMsRUFoQk0sTUFBTSxLQUFOLE1BQU0sUUFnQlo7O0FDekJEOzs7O0VBSUU7Ozs7OztBQUVGLDhDQUE4QztBQUM5QywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQWdCWjtBQWhCRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFBMkMseUNBQWtCO1FBRXpELCtCQUFtQixJQUFZO1lBQzNCLGtCQUFNLElBQUksQ0FBQyxDQUFDO1lBREcsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUUvQixDQUFDO1FBQ0Qsc0JBQVcsaURBQWM7aUJBQXpCLGNBQThCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsR0FBRyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzlJLFVBQTBCLFFBQWdCLElBQUksSUFBSSxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztXQUQwRDtRQUV2SSx1Q0FBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN0QixDQUFDO1FBQ0QsMERBQTBCLEdBQTFCLGNBQStCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pELDRCQUFDO0lBQUQsQ0FYQSxBQVdDLENBWDBDLHlCQUFrQixHQVc1RDtJQVhZLDRCQUFxQix3QkFXakMsQ0FBQTtJQUNELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQ3JJLGNBQWMsTUFBTSxDQUFDLElBQUkscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDekUsc0JBQWUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQUMsSUFBSSxJQUFPLElBQUksQ0FBQyxHQUFHLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLHNCQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hLLENBQUMsRUFoQk0sTUFBTSxLQUFOLE1BQU0sUUFnQlo7O0FDekJEOzs7O0VBSUU7Ozs7OztBQUVGLHVDQUF1QztBQUN2QywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQWlFWjtBQWpFRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFBdUMscUNBQVE7UUFRM0MsMkJBQW1CLElBQVk7WUFDM0Isa0JBQU0sSUFBSSxDQUFDLENBQUM7WUFERyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBUHZCLHFCQUFnQixHQUFZLEtBQUssQ0FBQztZQUNsQyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQVFyQyxDQUFDO1FBQ00sbUNBQU8sR0FBZDtZQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNELHNCQUFXLDBDQUFXO2lCQUF0QixjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztpQkFDMUQsVUFBdUIsS0FBYyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7V0FEZjtRQUVuRCxvQ0FBUSxHQUFmLFVBQWdCLElBQVU7WUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLFVBQVUsTUFBYyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxJQUFJLFdBQVcsQ0FBQyxDQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNwSyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFUyx3Q0FBWSxHQUF0QixVQUF1QixJQUFVO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzFDLElBQUksVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO2dCQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO29CQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2dCQUN2RCxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7Z0JBQ25DLENBQUM7WUFDTCxDQUFDLENBQUE7WUFDRCxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDUyw0Q0FBZ0IsR0FBMUIsVUFBMkIsTUFBMEI7WUFDakQsZ0JBQUssQ0FBQyxnQkFBZ0IsWUFBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBVyxDQUFDLHlCQUFrQixDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckYsQ0FBQztRQUNMLENBQUM7UUFDTyw4Q0FBa0IsR0FBMUIsVUFBMkIsSUFBVTtZQUNqQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFDTyx1Q0FBVyxHQUFuQixVQUFvQixJQUFVO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDaEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNMLHdCQUFDO0lBQUQsQ0E3REEsQUE2REMsQ0E3RHNDLGVBQVEsR0E2RDlDO0lBN0RZLHdCQUFpQixvQkE2RDdCLENBQUE7SUFDRCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMscUJBQXFCLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSx5QkFBeUIsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLGNBQWMsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdk0sc0JBQWUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSSxJQUFPLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekcsQ0FBQyxFQWpFTSxNQUFNLEtBQU4sTUFBTSxRQWlFWjs7QUMxRUQ7Ozs7RUFJRTs7Ozs7O0FBRUYsdUNBQXVDO0FBQ3ZDLDJDQUEyQztBQUMzQyxzQ0FBc0M7QUFDdEMsSUFBTyxNQUFNLENBaUJaO0FBakJELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUF1QyxxQ0FBWTtRQUUvQywyQkFBbUIsSUFBWTtZQUMzQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQURHLFNBQUksR0FBSixJQUFJLENBQVE7UUFFL0IsQ0FBQztRQUNNLG1DQUFPLEdBQWQ7WUFDSSxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxzQkFBVyxtQ0FBSTtpQkFBZixjQUE0QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BELFVBQWdCLEtBQWE7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQzNCLENBQUM7OztXQUhtRDtRQUlwRCxzQkFBVyw0Q0FBYTtpQkFBeEIsY0FBNkIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUN2Ryx3QkFBQztJQUFELENBYkEsQUFhQyxDQWJzQyxtQkFBWSxHQWFsRDtJQWJZLHdCQUFpQixvQkFhN0IsQ0FBQTtJQUNELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxjQUFjLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZILHNCQUFlLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFDLElBQUksSUFBTyxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pHLENBQUMsRUFqQk0sTUFBTSxLQUFOLE1BQU0sUUFpQlo7O0FDMUJEOzs7O0VBSUU7Ozs7OztBQUVGLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQW1HWjtBQW5HRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBSVg7UUFBb0Msa0NBQUk7UUFJcEMsd0JBQW1CLElBQVMsRUFBUyxJQUFZLEVBQVMsUUFBZ0IsRUFBRSxJQUFpQixFQUFFLEtBQVU7WUFDckcsaUJBQU8sQ0FBQztZQURPLFNBQUksR0FBSixJQUFJLENBQUs7WUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtZQUV0RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUMxQixDQUFDO1FBQ0Qsc0JBQVcsaUNBQUs7aUJBQWhCLGNBQXFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztpQkFDNUMsVUFBaUIsUUFBYTtnQkFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzFCLENBQUM7OztXQUwyQztRQU1sQyx1Q0FBYyxHQUF4QjtRQUNBLENBQUM7UUFDTCxxQkFBQztJQUFELENBakJBLEFBaUJDLENBakJtQyxXQUFJLEdBaUJ2QztJQWpCWSxxQkFBYyxpQkFpQjFCLENBQUE7SUFDRDtRQUF5Qyx1Q0FBUTtRQUs3Qyw2QkFBbUIsSUFBWTtZQUMzQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQURHLFNBQUksR0FBSixJQUFJLENBQVE7WUFKdkIsaUJBQVksR0FBZ0IsRUFBRSxDQUFDO1lBQy9CLGNBQVMsR0FBZ0IsRUFBRSxDQUFDO1lBQzVCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSTlCLENBQUM7UUFDTSxxQ0FBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBQ0Qsc0JBQVcsd0NBQU87aUJBQWxCO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDckMsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBSSx3Q0FBTztpQkFBWCxjQUE0QixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7aUJBQ3ZELFVBQVksUUFBb0I7Z0JBQzVCLGdCQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbkQsQ0FBQzs7O1dBSHNEO1FBSXZELHNCQUFJLHFDQUFJO2lCQUFSLGNBQXlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztpQkFDakQsVUFBUyxRQUFvQjtnQkFDekIsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNoRCxDQUFDOzs7V0FIZ0Q7UUFLakQsc0JBQVcsNENBQVc7aUJBQXRCO2dCQUNJLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxFQUFrQixDQUFDO2dCQUN6QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO2dCQUNuQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7d0JBQUMsUUFBUSxDQUFDO29CQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2SixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDO2dCQUNELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEIsQ0FBQzs7O1dBQUE7UUFDUyw2Q0FBZSxHQUF6QixVQUEwQixJQUFTLEVBQUUsSUFBWSxFQUFFLFFBQWdCLEVBQUUsS0FBVTtZQUMzRSxNQUFNLENBQUMsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFDUyw0Q0FBYyxHQUF4QjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUN4RyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDN0MsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ2xELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUNoRCxDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQy9CLENBQUM7UUFDRCxhQUFhO1FBQ2IsZ0RBQWtCLEdBQWxCLFVBQW1CLEdBQW1CO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQy9CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ1osUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDbEIsQ0FBQztnQkFDRCxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQy9CLENBQUM7UUFDTiwwQkFBQztJQUFELENBeEVDLEFBd0VBLENBeEV5QyxlQUFRLEdBd0VqRDtJQXhFYSwwQkFBbUIsc0JBd0VoQyxDQUFBO0lBQ0EsaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsSUFBSSxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsRUFBRSxLQUFVLElBQUksR0FBRyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDbk4sRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxJQUFJLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxFQUFFLEtBQVUsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQ3hLLGNBQWMsTUFBTSxDQUFDLElBQUksbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckUsc0JBQWUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQUMsSUFBSSxJQUFPLElBQUksQ0FBQyxHQUFHLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdk0sQ0FBQyxFQW5HTSxNQUFNLEtBQU4sTUFBTSxRQW1HWjs7QUM1R0Q7Ozs7RUFJRTs7Ozs7O0FBRUYsbUNBQW1DO0FBQ25DLDhDQUE4QztBQUM5QywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQVlaO0FBWkQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQTZDLDJDQUFvQjtRQUM3RCxpQ0FBbUIsSUFBWTtZQUMzQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQURHLFNBQUksR0FBSixJQUFJLENBQVE7UUFFL0IsQ0FBQztRQUNNLHlDQUFPLEdBQWQ7WUFDSSxNQUFNLENBQUMsWUFBWSxDQUFDO1FBQ3hCLENBQUM7UUFDRCw0REFBMEIsR0FBMUIsY0FBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakQsOEJBQUM7SUFBRCxDQVJBLEFBUUMsQ0FSNEMsMkJBQW9CLEdBUWhFO0lBUlksOEJBQXVCLDBCQVFuQyxDQUFBO0lBQ0QsaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN4SCxzQkFBZSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsVUFBQyxJQUFJLElBQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsc0JBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7QUFDM0ssQ0FBQyxFQVpNLE1BQU0sS0FBTixNQUFNLFFBWVo7O0FDdEJEOzs7O0VBSUU7Ozs7OztBQUVGLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQWNaO0FBZEQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQXVDLHFDQUFRO1FBRTNDLDJCQUFtQixJQUFZO1lBQzNCLGtCQUFNLElBQUksQ0FBQyxDQUFDO1lBREcsU0FBSSxHQUFKLElBQUksQ0FBUTtZQUR4QixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBR3pCLENBQUM7UUFDTSxtQ0FBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ0QsbUNBQU8sR0FBUCxjQUFzQixNQUFNLENBQUMsZ0JBQUssQ0FBQyxPQUFPLFdBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkUsc0RBQTBCLEdBQTFCLGNBQStCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pELHdCQUFDO0lBQUQsQ0FWQSxBQVVDLENBVnNDLGVBQVEsR0FVOUM7SUFWWSx3QkFBaUIsb0JBVTdCLENBQUE7SUFDRCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLGNBQWMsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDNUksc0JBQWUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSSxJQUFPLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekcsQ0FBQyxFQWRNLE1BQU0sS0FBTixNQUFNLFFBY1o7O0FDdkJEOzs7O0VBSUU7Ozs7OztBQUVGLG9DQUFvQztBQUNwQywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLDZDQUE2QztBQUM3Qyw2Q0FBNkM7QUFDN0MsK0NBQStDO0FBQy9DLHlDQUF5QztBQUN6Qyw0Q0FBNEM7QUFDNUMsK0NBQStDO0FBQy9DLElBQU8sTUFBTSxDQTBTWjtBQTFTRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBTVg7UUFBMEMsd0NBQUk7UUFTMUMsOEJBQW1CLElBQVksRUFBRSxLQUFvQjtZQUFwQixxQkFBb0IsR0FBcEIsWUFBb0I7WUFDakQsaUJBQU8sQ0FBQztZQURPLFNBQUksR0FBSixJQUFJLENBQVE7WUFSdkIsaUJBQVksR0FBZ0IsRUFBRSxDQUFDO1lBR2hDLGVBQVUsR0FBWSxLQUFLLENBQUM7WUFDNUIsYUFBUSxHQUFZLEtBQUssQ0FBQztZQUMxQixhQUFRLEdBQVcsRUFBRSxDQUFDO1lBQ3RCLGFBQVEsR0FBVyxTQUFTLENBQUM7WUFDNUIsa0JBQWEsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUduQyxDQUFDO1FBQ00sc0NBQU8sR0FBZCxjQUFtQixNQUFNLENBQUMsc0JBQXNCLENBQUEsQ0FBQyxDQUFDO1FBQ2xELHNCQUFXLHVDQUFLO2lCQUFoQixjQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUM1RSxVQUFpQixLQUFhLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7V0FEZ0I7UUFFNUUsc0JBQVcseUNBQU87aUJBQWxCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztpQkFNOUQsVUFBbUIsUUFBb0I7Z0JBQ25DLGdCQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbkQsQ0FBQzs7O1dBUjZEO1FBQzlELHNCQUFXLDBDQUFRO2lCQUFuQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7aUJBQzVELFVBQW9CLEtBQWE7Z0JBQzdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDcEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDL0IsQ0FBQzs7O1dBSjJEO1FBUWhFLDJCQUFDO0lBQUQsQ0F4QkEsQUF3QkMsQ0F4QnlDLFdBQUksR0F3QjdDO0lBeEJZLDJCQUFvQix1QkF3QmhDLENBQUE7SUFDRDtRQUVJLDRCQUFtQixNQUE0QixFQUFTLEdBQStCLEVBQUUsSUFBeUI7WUFBL0YsV0FBTSxHQUFOLE1BQU0sQ0FBc0I7WUFBUyxRQUFHLEdBQUgsR0FBRyxDQUE0QjtZQUNuRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNELHNCQUFXLHdDQUFRO2lCQUFuQixjQUFrQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQzlELHNCQUFXLHFDQUFLO2lCQUFoQixjQUEwQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUN2RCxVQUFpQixLQUFVO2dCQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDaEMsQ0FBQzs7O1dBSHNEO1FBSTNELHlCQUFDO0lBQUQsQ0FYQSxBQVdDLElBQUE7SUFYWSx5QkFBa0IscUJBVzlCLENBQUE7SUFDRDtRQVFJLG9DQUFZLElBQXlCLEVBQUUsS0FBVTtZQU56QyxjQUFTLEdBQW1CLEVBQUUsQ0FBQztZQUMvQixnQkFBVyxHQUFtQixFQUFFLENBQUM7WUFDakMsbUJBQWMsR0FBWSxLQUFLLENBQUM7WUFFakMsVUFBSyxHQUE4QixFQUFFLENBQUM7WUFHekMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFDRCxzQkFBVywrQ0FBTztpQkFBbEIsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ3JDLHNCQUFXLDZDQUFLO2lCQUFoQixjQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQzdDLFVBQWlCLEtBQVU7Z0JBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztnQkFDcEIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNyQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFGLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDaEMsQ0FBQzs7O1dBYjRDO1FBY3RDLDZDQUFRLEdBQWYsVUFBZ0IsSUFBWTtZQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBQ00sNkNBQVEsR0FBZixVQUFnQixJQUFZLEVBQUUsUUFBYTtZQUN2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDO2dCQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQ3BDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUNNLCtDQUFVLEdBQWpCLFVBQWtCLElBQVk7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNNLCtDQUFVLEdBQWpCLFVBQWtCLElBQVksRUFBRSxRQUFnQjtZQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUN0QyxDQUFDO1FBQ0Qsc0JBQVcsK0NBQU87aUJBQWxCO2dCQUNJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7OztXQUFBO1FBQ08sK0NBQVUsR0FBbEI7WUFDSSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNoQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQztRQUNMLENBQUM7UUFDUywrQ0FBVSxHQUFwQixVQUFxQixNQUE0QjtZQUM3QyxNQUFNLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQ0wsaUNBQUM7SUFBRCxDQS9EQSxBQStEQyxJQUFBO0lBL0RZLGlDQUEwQiw2QkErRHRDLENBQUE7SUFDRDtRQUFxRCxtREFBUTtRQWF6RCx5Q0FBbUIsSUFBWTtZQUMzQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQURHLFNBQUksR0FBSixJQUFJLENBQVE7WUFadkIsaUJBQVksR0FBZ0MsRUFBRSxDQUFDO1lBQy9DLGlCQUFZLEdBQWdCLEVBQUUsQ0FBQztZQUUvQixrQkFBYSxHQUFHLEtBQUssQ0FBQztZQUV0QixrQkFBYSxHQUFXLFVBQVUsQ0FBQztZQUNuQyx3QkFBbUIsR0FBVyxDQUFDLENBQUM7WUFDakMsbUJBQWMsR0FBVyxFQUFFLENBQUM7WUFDNUIscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBTXpDLENBQUM7UUFDTSxpREFBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDO1FBQ2hDLENBQUM7UUFDRCxzQkFBVyxvREFBTztpQkFBbEIsY0FBb0QsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUMvRSxVQUFtQixLQUFrQztnQkFDakQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDbkQsQ0FBQzs7O1dBSjhFO1FBSy9FLHNCQUFXLHFEQUFRO2lCQUFuQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7aUJBQzVELFVBQW9CLFFBQWdCO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDO2dCQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQy9DLENBQUM7OztXQUwyRDtRQU01RCxzQkFBVywyREFBYztpQkFBekIsY0FBc0MsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7aUJBQ3hFLFVBQTBCLEtBQWE7Z0JBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDL0MsQ0FBQzs7O1dBTHVFO1FBTWpFLHdEQUFjLEdBQXJCLFVBQXNCLE1BQTRCO1lBQzlDLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7Z0JBQzNDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztvQkFBQyxXQUFXLElBQUksR0FBRyxDQUFDO2dCQUNwQyxNQUFNLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQztZQUNsQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ00sd0RBQWMsR0FBckIsVUFBc0IsTUFBNEI7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ25FLENBQUM7UUFDRCxzQkFBVyxvREFBTztpQkFBbEIsY0FBbUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO2lCQUM5RCxVQUFtQixRQUFvQjtnQkFDbkMsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNuRCxDQUFDOzs7V0FINkQ7UUFJOUQsc0JBQVcsMkRBQWM7aUJBQXpCLGNBQThCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsR0FBRyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzlJLFVBQTBCLFFBQWdCLElBQUksSUFBSSxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztXQUQwRDtRQUV2SSxtREFBUyxHQUFoQixVQUFpQixJQUFZLEVBQUUsS0FBb0I7WUFBcEIscUJBQW9CLEdBQXBCLFlBQW9CO1lBQy9DLElBQUksTUFBTSxHQUFHLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUVELHNCQUFXLHdEQUFXO2lCQUF0QjtnQkFDSSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1lBQ3JDLENBQUM7OztXQUFBO1FBQ1Msc0RBQVksR0FBdEIsY0FBOEQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUseURBQWUsR0FBekIsVUFBMEIsSUFBUyxFQUFFLElBQVksRUFBRSxLQUFVO1lBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNTLHdEQUFjLEdBQXhCLFVBQXlCLFFBQWEsSUFBUyxNQUFNLENBQUMsQ0FBQyxRQUFRLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDeEUscURBQVcsR0FBckIsVUFBc0IsR0FBK0IsRUFBRSxhQUFrQixFQUFFLE1BQXVCO1lBQXZCLHNCQUF1QixHQUF2QixjQUF1QjtZQUM5RixJQUFJLE1BQU0sR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzVFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ1osYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDeEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNTLHdEQUFjLEdBQXhCO1lBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ3hHLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBQzFCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEUsQ0FBQztZQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQy9CLENBQUM7UUFDTSxtREFBUyxHQUFoQixVQUFpQixZQUE0QjtZQUE1Qiw0QkFBNEIsR0FBNUIsbUJBQTRCO1lBQ3pDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMxRCxNQUFNLENBQUMsZ0JBQUssQ0FBQyxTQUFTLFlBQUMsWUFBWSxDQUFDLElBQUksY0FBYyxDQUFDO1FBQzNELENBQUM7UUFDTywyREFBaUIsR0FBekIsVUFBMEIsWUFBcUI7WUFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUM3QyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7WUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO2dCQUNoRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDeEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDL0MsR0FBRyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUM7Z0JBQzFILENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFDRCxxQkFBcUI7UUFDZCx3REFBYyxHQUFyQixVQUFzQixHQUErQixFQUFFLE1BQTRCO1lBQy9FLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDcEQsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQzVCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUN4QyxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsWUFBWSx5QkFBa0IsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLFFBQVMsQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7Z0JBQ2hFLENBQUM7WUFDTCxDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDO1FBQ1MsNERBQWtCLEdBQTVCLFVBQTZCLEdBQStCLEVBQUUsTUFBNEI7WUFDdEYsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQzlFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3JFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekUsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDN0QsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkUsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDUyx5REFBZSxHQUF6QixVQUEwQixHQUErQixFQUFFLE1BQTRCLElBQVksTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xJLDBEQUFnQixHQUExQixVQUEyQixNQUE0QjtZQUNuRCxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3ZGLENBQUM7UUFDUyxpRUFBdUIsR0FBakMsVUFBa0MsTUFBNEI7WUFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQy9FLENBQUM7UUFDUyx3REFBYyxHQUF4QixVQUF5QixJQUFZLEVBQUUsTUFBNEI7WUFDL0QsSUFBSSxDQUFDLEdBQTBCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7UUFDUyx3REFBYyxHQUF4QixVQUF5QixJQUFZLEVBQUUsTUFBNEI7WUFDL0QsSUFBSSxDQUFDLEdBQTBCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUMzRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUNTLDBEQUFnQixHQUExQixVQUEyQixJQUFZLEVBQUUsTUFBNEI7WUFDakUsSUFBSSxDQUFDLEdBQTRCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0UsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUMzRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUNTLG9EQUFVLEdBQXBCLFVBQXFCLElBQVksRUFBRSxNQUE0QjtZQUMzRCxNQUFNLENBQW9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUNTLHVEQUFhLEdBQXZCLFVBQXdCLElBQVksRUFBRSxNQUE0QjtZQUM5RCxNQUFNLENBQXVCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUUsQ0FBQztRQUNTLDREQUFrQixHQUE1QixVQUE2QixZQUFvQixFQUFFLElBQVk7WUFDM0QsTUFBTSxDQUFXLHNCQUFlLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakYsQ0FBQztRQUNTLHdEQUFjLEdBQXhCLFVBQXlCLFFBQWEsRUFBRSxHQUErQjtZQUNuRSxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQy9ELENBQUM7UUFDRCxzREFBWSxHQUFaLFVBQWEsR0FBK0IsRUFBRSxXQUFnQjtZQUMxRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckQsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDO2dCQUFDLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUM7b0JBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqRSxDQUFDO1lBQ0YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQy9CLENBQUM7UUFDTCxzQ0FBQztJQUFELENBakxBLEFBaUxDLENBakxvRCxlQUFRLEdBaUw1RDtJQWpMWSxzQ0FBK0Isa0NBaUwzQyxDQUFBO0lBQ0QsaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDdkksRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxJQUFJLE1BQU0sQ0FBQyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxFQUFFLEtBQVUsSUFBSSxHQUFHLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQztRQUMvSyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQ3pJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLEVBQ3RILGNBQWMsTUFBTSxDQUFDLElBQUksb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUxRCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSwrQkFBK0IsRUFBRSxTQUFTLEVBQUUsc0JBQXNCLEVBQUU7UUFDNUgsMEJBQTBCO1FBQzFCLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsSUFBSSxNQUFNLENBQUMsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsRUFBRSxLQUFVLElBQUksR0FBRyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDL0ssRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDL0YsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQzdHLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsRUFDbkYsY0FBYyxNQUFNLENBQUMsSUFBSSwrQkFBK0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNyRixDQUFDLEVBMVNNLE1BQU0sS0FBTixNQUFNLFFBMFNaOztBQ3pURDs7OztFQUlFOzs7Ozs7QUFFRixvQ0FBb0M7QUFDcEMsMkNBQTJDO0FBQzNDLHNDQUFzQztBQUN0Qyx1REFBdUQ7QUFFdkQsSUFBTyxNQUFNLENBdUNaO0FBdkNELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUE0QywwQ0FBMEI7UUFDbEUsZ0NBQW1CLElBQVMsRUFBUyxJQUFZLEVBQUUsSUFBeUIsRUFBRSxLQUFVO1lBQ3BGLGtCQUFNLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQURKLFNBQUksR0FBSixJQUFJLENBQUs7WUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBRWpELENBQUM7UUFDRCxzQkFBVywyQ0FBTztpQkFBbEIsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUM5Qyw2QkFBQztJQUFELENBTEEsQUFLQyxDQUwyQyxpQ0FBMEIsR0FLckU7SUFMWSw2QkFBc0IseUJBS2xDLENBQUE7SUFDRDtRQUFpRCwrQ0FBK0I7UUFHNUUscUNBQW1CLElBQVk7WUFDM0Isa0JBQU0sSUFBSSxDQUFDLENBQUM7WUFERyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBRnZCLGNBQVMsR0FBZ0IsRUFBRSxDQUFDO1FBSXBDLENBQUM7UUFDTSw2Q0FBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQzVCLENBQUM7UUFDRCxzQkFBVyw2Q0FBSTtpQkFBZixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7aUJBQ3hELFVBQWdCLFFBQW9CO2dCQUNoQyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELENBQUM7OztXQUh1RDtRQUk5QyxrREFBWSxHQUF0QjtZQUNJLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxFQUEwQixDQUFDO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN4RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN4QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUFDLFFBQVEsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RyxDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ1MscURBQWUsR0FBekIsVUFBMEIsSUFBUyxFQUFFLElBQVksRUFBRSxLQUFVO1lBQ3pELE1BQU0sQ0FBQyxJQUFJLHNCQUFzQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDTCxrQ0FBQztJQUFELENBM0JBLEFBMkJDLENBM0JnRCxzQ0FBK0IsR0EyQi9FO0lBM0JZLGtDQUEyQiw4QkEyQnZDLENBQUE7SUFFRCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLElBQUksTUFBTSxDQUFDLGdCQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLEVBQUUsS0FBVSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFDbk4sY0FBYyxNQUFNLENBQUMsSUFBSSwyQkFBMkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3ZGLHNCQUFlLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLFVBQUMsSUFBSSxJQUFPLElBQUksQ0FBQyxHQUFHLElBQUksMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3USxDQUFDLEVBdkNNLE1BQU0sS0FBTixNQUFNLFFBdUNaOztBQ2xERDs7OztFQUlFOzs7Ozs7QUFFRixvQ0FBb0M7QUFDcEMsMkNBQTJDO0FBQzNDLHNDQUFzQztBQUN0Qyx1REFBdUQ7QUFFdkQsSUFBTyxNQUFNLENBdUhaO0FBdkhELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUEyQyx5Q0FBMEI7UUFDakUsK0JBQW1CLEtBQWEsRUFBRSxJQUF5QixFQUFFLEtBQVU7WUFDbkUsa0JBQU0sSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBREosVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUVoQyxDQUFDO1FBQ0Qsc0JBQVcsMENBQU87aUJBQWxCLGNBQXVCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ3ZELDRCQUFDO0lBQUQsQ0FMQSxBQUtDLENBTDBDLGlDQUEwQixHQUtwRTtJQUxZLDRCQUFxQix3QkFLakMsQ0FBQTtJQUNEO1FBQWdELDhDQUErQjtRQU8zRSxvQ0FBbUIsSUFBWTtZQUMzQixrQkFBTSxJQUFJLENBQUMsQ0FBQztZQURHLFNBQUksR0FBSixJQUFJLENBQVE7WUFMdkIsZUFBVSxHQUFHLENBQUMsQ0FBQztZQUNmLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1lBQzFCLG9CQUFlLEdBQVcsSUFBSSxDQUFDO1lBQ2hDLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBSXZCLENBQUM7UUFDTSw0Q0FBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQztRQUMzQixDQUFDO1FBQ0Qsc0JBQVcsZ0RBQVE7aUJBQW5CLGNBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDcEQsVUFBb0IsR0FBVztnQkFDM0IsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsMEJBQTBCLENBQUMsV0FBVyxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDcEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7Z0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNwRCxDQUFDOzs7V0FWbUQ7UUFXN0MsMkNBQU0sR0FBYjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQy9ELENBQUM7WUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUNNLDhDQUFTLEdBQWhCLFVBQWlCLEtBQWE7WUFDMUIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDckIsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNyQixDQUFDO1lBQ0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFDRCxzQkFBVyxrREFBVTtpQkFBckIsY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN4SCxVQUFzQixLQUFhO2dCQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUNqQyxDQUFDOzs7V0FIdUg7UUFJeEgsc0JBQVcscURBQWE7aUJBQXhCLGNBQTZCLE1BQU0sQ0FBQyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNoRixzQkFBVyx5REFBaUI7aUJBQTVCO2dCQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztnQkFDckgsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDNUIsQ0FBQzs7O1dBQUE7UUFDUyxxREFBZ0IsR0FBMUIsVUFBMkIsTUFBMEI7WUFDakQsZ0JBQUssQ0FBQyxnQkFBZ0IsWUFBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQVcsQ0FBQyx5QkFBa0IsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9HLENBQUM7UUFDTCxDQUFDO1FBQ08sbURBQWMsR0FBdEI7WUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3RFLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNoQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7WUFDcEIsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7Z0JBQzdFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO29CQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLENBQUM7WUFDRCxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDMUMsQ0FBQztRQUNTLGlEQUFZLEdBQXRCO1lBQ0ksSUFBSSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQXlCLENBQUM7WUFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN2QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDUyxvREFBZSxHQUF6QixVQUEwQixLQUFVO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUNTLG1EQUFjLEdBQXhCLFVBQXlCLFFBQWE7WUFDbEMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNTLG1EQUFjLEdBQXhCLFVBQXlCLFFBQWEsRUFBRSxHQUErQjtZQUNuRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLE9BQU8sR0FBRyxLQUFLLENBQUM7b0JBQ2hCLEtBQUssQ0FBQztnQkFDVixDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNyQyxDQUFDO1FBRU8sdURBQWtCLEdBQTFCLFVBQTJCLGFBQWtCLEVBQUUsS0FBYTtZQUN4RCxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3BGLENBQUM7UUFDUyxnREFBVyxHQUFyQixVQUFzQixHQUErQixFQUFFLGFBQWtCLEVBQUUsTUFBdUI7WUFBdkIsc0JBQXVCLEdBQXZCLGNBQXVCO1lBQzlGLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDO1FBekdNLHNDQUFXLEdBQUcsR0FBRyxDQUFDO1FBMEc3QixpQ0FBQztJQUFELENBM0dBLEFBMkdDLENBM0crQyxzQ0FBK0IsR0EyRzlFO0lBM0dZLGlDQUEwQiw2QkEyR3RDLENBQUE7SUFFRCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUU7UUFDOUgsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSwwQkFBMEIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2hMLHNCQUFlLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsRUFBRSxVQUFDLElBQUksSUFBTyxJQUFJLENBQUMsR0FBRyxJQUFJLDBCQUEwQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5TyxDQUFDLEVBdkhNLE1BQU0sS0FBTixNQUFNLFFBdUhaOztBQ2xJRDs7OztFQUlFOzs7Ozs7QUFFRixtQ0FBbUM7QUFDbkMsMkNBQTJDO0FBQzNDLHNDQUFzQztBQUN0QyxJQUFPLE1BQU0sQ0EwSVo7QUExSUQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQU1YO1FBQTJDLHlDQUFJO1FBSzNDLCtCQUFtQixJQUFnQixFQUFFLEtBQW9CO1lBQTdDLG9CQUF1QixHQUF2QixXQUF1QjtZQUFFLHFCQUFvQixHQUFwQixZQUFvQjtZQUNyRCxpQkFBTyxDQUFDO1lBRE8sU0FBSSxHQUFKLElBQUksQ0FBWTtZQUZuQyxlQUFVLEdBQTJCLElBQUksS0FBSyxFQUFtQixDQUFDO1lBSTlELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7UUFDTSx1Q0FBTyxHQUFkO1lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDO1FBQzlCLENBQUM7UUFDRCx1Q0FBTyxHQUFQLFVBQVEsSUFBdUI7WUFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUNELHNCQUFXLHdDQUFLO2lCQUFoQixjQUFxQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUM1RSxVQUFpQixPQUFlLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7V0FEWTtRQUU1RSxzQkFBVyx3Q0FBSztpQkFBaEI7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3hFLENBQUM7aUJBQ0QsVUFBaUIsS0FBVTtnQkFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3JELENBQUM7WUFDTCxDQUFDOzs7V0FMQTtRQU1ELDhDQUFjLEdBQWQsVUFBZSxRQUFhO1FBQzVCLENBQUM7UUFDRCxpQkFBaUI7UUFDakIsaURBQWlCLEdBQWpCLGNBQThCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN0RCw0QkFBQztJQUFELENBN0JBLEFBNkJDLENBN0IwQyxXQUFJLEdBNkI5QztJQTdCWSw0QkFBcUIsd0JBNkJqQyxDQUFBO0lBRUQ7UUFBK0MsNkNBQVE7UUFLbkQsbUNBQW1CLElBQVk7WUFDM0Isa0JBQU0sSUFBSSxDQUFDLENBQUM7WUFERyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBSnZCLGtCQUFhLEdBQVcsQ0FBQyxDQUFDO1lBRTNCLGFBQVEsR0FBVyxFQUFFLENBQUM7WUFDckIsZ0JBQVcsR0FBaUMsSUFBSSxLQUFLLEVBQXlCLENBQUM7WUErQy9FLGdDQUEyQixHQUFHLEtBQUssQ0FBQztZQTVDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsS0FBSztnQkFDN0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNsQixDQUFDLENBQUM7UUFDTixDQUFDO1FBQ00sMkNBQU8sR0FBZDtZQUNJLE1BQU0sQ0FBQyxjQUFjLENBQUM7UUFDMUIsQ0FBQztRQUNELHNCQUFXLDRDQUFLO2lCQUFoQixjQUFtRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQzdFLFVBQWlCLEtBQW1DO2dCQUNoRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUNwRCxDQUFDOzs7V0FKNEU7UUFLdEUsMkNBQU8sR0FBZCxVQUFlLElBQVksRUFBRSxLQUFvQjtZQUFwQixxQkFBb0IsR0FBcEIsWUFBb0I7WUFDN0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0Qsc0JBQVcsK0NBQVE7aUJBQW5CLGNBQWdDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDNUQsVUFBb0IsS0FBYTtnQkFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDcEQsQ0FBQzs7O1dBTDJEO1FBTXJELDJDQUFPLEdBQWQ7WUFDSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzdCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDdkIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xCLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxLQUFLLEVBQUUsQ0FBQztnQkFDUixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxDQUFDO1lBQ0wsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUVTLGtEQUFjLEdBQXhCO1lBQ0ksZ0JBQUssQ0FBQyxjQUFjLFdBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUM5QixDQUFDO1FBQ1Msa0RBQWMsR0FBeEIsVUFBeUIsSUFBWSxFQUFFLEtBQWE7WUFDaEQsTUFBTSxDQUFDLElBQUkscUJBQXFCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDUyxzREFBa0IsR0FBNUI7WUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzdDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0MsQ0FBQztnQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxDQUFDO1FBQ0wsQ0FBQztRQUNTLGlEQUFhLEdBQXZCO1lBQ0ksSUFBSSxLQUFLLEdBQUcsZ0JBQUssQ0FBQyxhQUFhLFdBQUUsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDaEMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN6QyxLQUFLLEdBQUcsSUFBSSxzQkFBZSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakQsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3BDLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxtQkFBbUI7UUFDbkIsd0RBQW9CLEdBQXBCLFVBQXFCLElBQVk7WUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUNELHdEQUFvQixHQUFwQixVQUFxQixJQUFZLEVBQUUsS0FBVTtZQUN6QyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsSUFBSSxDQUFDO1lBQ3hDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNaLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsQ0FBQztZQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFDO1FBQzdDLENBQUM7UUFDTCxnQ0FBQztJQUFELENBN0ZBLEFBNkZDLENBN0Y4QyxlQUFRLEdBNkZ0RDtJQTdGWSxnQ0FBeUIsNEJBNkZyQyxDQUFBO0lBQ0QsaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbkksRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsYUFBYSxFQUFFLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLGNBQWMsTUFBTSxDQUFDLElBQUkscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3SixpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLGtCQUFrQixFQUFFO1FBQ3JHLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDekcsY0FBYyxNQUFNLENBQUMsSUFBSSx5QkFBeUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMzRSxzQkFBZSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsVUFBQyxJQUFJLElBQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVLLENBQUMsRUExSU0sTUFBTSxLQUFOLE1BQU0sUUEwSVo7O0FDbkpEOzs7O0VBSUU7Ozs7OztBQUVGLG1DQUFtQztBQUNuQywyQ0FBMkM7QUFDM0Msc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQWdDWjtBQWhDRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFBeUMsdUNBQVE7UUFRN0MsNkJBQW1CLElBQVk7WUFDM0Isa0JBQU0sSUFBSSxDQUFDLENBQUM7WUFERyxTQUFJLEdBQUosSUFBSSxDQUFRO1lBTnZCLFVBQUssR0FBZ0IsRUFBRSxDQUFDO1lBQ3pCLDJCQUFzQixHQUFXLElBQUksQ0FBQztZQUN0QywyQkFBc0IsR0FBVyxJQUFJLENBQUM7UUFNN0MsQ0FBQztRQUNELHNCQUFJLDJDQUFVO2lCQUFkLGNBQStCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztpQkFDbkQsVUFBZSxRQUFvQjtnQkFDL0IsZ0JBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztZQUN0RCxDQUFDOzs7V0FKa0Q7UUFLbkQsc0JBQUksa0RBQWlCO2lCQUFyQjtnQkFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3ZELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQztZQUNqRCxDQUFDOzs7V0FBQTtRQUNNLHFDQUFPLEdBQWQ7WUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUM7UUFDTSw0Q0FBYyxHQUFyQixjQUFtQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQywwQ0FBWSxHQUFuQixjQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvQyx3REFBMEIsR0FBMUIsY0FBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUF4QnRDLHFDQUFpQixHQUFnQixFQUFFLENBQUM7UUF5Qi9DLDBCQUFDO0lBQUQsQ0ExQkEsQUEwQkMsQ0ExQndDLGVBQVEsR0EwQmhEO0lBMUJZLDBCQUFtQixzQkEwQi9CLENBQUE7SUFDRCxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFFLGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLElBQUksTUFBTSxDQUFDLGdCQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLEVBQUUsS0FBVSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDO1FBQ2xQLHdCQUF3QixFQUFFLHdCQUF3QixDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMxSCxzQkFBZSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBQyxJQUFJLElBQU8sTUFBTSxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RyxDQUFDLEVBaENNLE1BQU0sS0FBTixNQUFNLFFBZ0NaOztBQ3pDRDs7OztFQUlFOzs7Ozs7QUFFRixnQ0FBZ0M7QUFDaEMsc0NBQXNDO0FBQ3RDLElBQU8sTUFBTSxDQTBHWjtBQTFHRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1g7UUFBNkIsMkJBQUk7UUFvQjdCO1lBQ0ksaUJBQU8sQ0FBQztZQUhKLFlBQU8sR0FBVyxPQUFPLENBQUM7UUFJbEMsQ0FBQztRQXBCRCxzQkFBVyxvQkFBUztpQkFBcEI7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7Z0JBQ2xFLE9BQU8sQ0FBQyxjQUFjLEdBQUc7b0JBQ3JCLEtBQUssRUFBRSxVQUFVLEtBQUssRUFBRSxhQUFhLElBQUksTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDekQsUUFBUSxFQUFFLFVBQVUsS0FBSyxFQUFFLGFBQWEsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxLQUFLLEVBQUUsVUFBVSxLQUFLLEVBQUUsYUFBYSxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDekUsUUFBUSxFQUFFLFVBQVUsS0FBSyxFQUFFLGFBQWEsSUFBSSxNQUFNLENBQUMsS0FBSyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQzVFLFFBQVEsRUFBRSxVQUFVLEtBQUssRUFBRSxhQUFhLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BILFdBQVcsRUFBRSxVQUFVLEtBQUssRUFBRSxhQUFhLElBQUksTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxSCxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUUsYUFBYSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDMUUsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLGFBQWEsSUFBSSxNQUFNLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZFLGNBQWMsRUFBRSxVQUFVLEtBQUssRUFBRSxhQUFhLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNsRixXQUFXLEVBQUUsVUFBVSxLQUFLLEVBQUUsYUFBYSxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztpQkFDbEYsQ0FBQztnQkFDRixNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUNsQyxDQUFDOzs7V0FBQTtRQU1ELHNCQUFXLDZCQUFRO2lCQUFuQixjQUFnQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7aUJBQ3RELFVBQW9CLEtBQWE7Z0JBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDbkIsS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDekIsQ0FBQzs7O1dBTnFEO1FBTy9DLHVCQUFLLEdBQVosVUFBYSxLQUFVO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDckIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNyQixDQUFDO1FBQ0wsQ0FBQztRQUNTLDJCQUFTLEdBQW5CLGNBQXdCLENBQUM7UUFDZiwyQkFBUyxHQUFuQixjQUF3QixDQUFDO1FBckNsQixzQkFBYyxHQUF3QixJQUFJLENBQUM7UUFzQ3RELGNBQUM7SUFBRCxDQXZDQSxBQXVDQyxDQXZDNEIsV0FBSSxHQXVDaEM7SUF2Q1ksY0FBTyxVQXVDbkIsQ0FBQTtJQVFEO1FBQW1DLGlDQUFPO1FBR3RDO1lBQ0ksaUJBQU8sQ0FBQztZQUZGLFVBQUssR0FBd0IsSUFBSSxDQUFDO1FBRzVDLENBQUM7UUFDTSxnQ0FBUSxHQUFmLFVBQWdCLEtBQTBCO1lBQ3RDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxzQkFBVyx1Q0FBWTtpQkFBdkIsY0FBNEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQy9DLG9CQUFDO0lBQUQsQ0FWQSxBQVVDLENBVmtDLE9BQU8sR0FVekM7SUFWWSxvQkFBYSxnQkFVekIsQ0FBQTtJQUVEO1FBQTBDLHdDQUFhO1FBR25EO1lBQ0ksaUJBQU8sQ0FBQztZQUhMLFVBQUssR0FBYSxFQUFFLENBQUM7WUFDckIsY0FBUyxHQUFhLEVBQUUsQ0FBQztRQUdoQyxDQUFDO1FBQ00sc0NBQU8sR0FBZCxjQUEyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQzNDLHdDQUFTLEdBQW5CLGNBQXdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCx3Q0FBUyxHQUFuQixjQUF3QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsd0NBQVMsR0FBakIsVUFBa0IsSUFBYztZQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ3hCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUM7UUFDUyw0Q0FBYSxHQUF2QixVQUF3QixJQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pELDRDQUFhLEdBQXZCLFVBQXdCLElBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDaEUsMkJBQUM7SUFBRCxDQWxCQSxBQWtCQyxDQWxCeUMsYUFBYSxHQWtCdEQ7SUFsQlksMkJBQW9CLHVCQWtCaEMsQ0FBQTtJQUNEO1FBQTJDLHlDQUFhO1FBQ3BEO1lBQ0ksaUJBQU8sQ0FBQztRQUNaLENBQUM7UUFDTSx1Q0FBTyxHQUFkLGNBQTJCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDdEQsc0JBQVcsK0NBQVk7aUJBQXZCLGNBQTRCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNoQyx5Q0FBUyxHQUFuQixjQUF3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEUsNEJBQUM7SUFBRCxDQVBBLEFBT0MsQ0FQMEMsYUFBYSxHQU92RDtJQVBZLDRCQUFxQix3QkFPakMsQ0FBQTtJQUNEO1FBQTJDLHlDQUFhO1FBSXBEO1lBQ0ksaUJBQU8sQ0FBQztRQUNaLENBQUM7UUFDTSx1Q0FBTyxHQUFkLGNBQTJCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDNUMseUNBQVMsR0FBbkI7WUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFDTCw0QkFBQztJQUFELENBWkEsQUFZQyxDQVowQyxhQUFhLEdBWXZEO0lBWlksNEJBQXFCLHdCQVlqQyxDQUFBO0lBRUQsaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUUsaUJBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLGNBQWMsTUFBTSxDQUFDLElBQUksb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM1SSxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLGNBQWMsTUFBTSxDQUFDLElBQUkscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUMxSCxpQkFBVSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzVLLENBQUMsRUExR00sTUFBTSxLQUFOLE1BQU0sUUEwR1o7O0FDbEhEOzs7O0VBSUU7Ozs7OztBQUVGLGdDQUFnQztBQUNoQyxnQ0FBZ0M7QUFDaEMsbUNBQW1DO0FBQ25DLHNDQUFzQztBQUN0QywyQ0FBMkM7QUFDM0MsNENBQTRDO0FBRTVDLElBQU8sTUFBTSxDQXFzQlo7QUFyc0JELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUFpQywrQkFBSTtRQXNEakMscUJBQVksT0FBbUI7WUFBbkIsdUJBQW1CLEdBQW5CLGNBQW1CO1lBQzNCLGlCQUFPLENBQUM7WUF0REwsYUFBUSxHQUFXLElBQUksQ0FBQztZQUN4QixpQkFBWSxHQUFXLElBQUksQ0FBQztZQUM1QixhQUFRLEdBQVcsSUFBSSxDQUFDO1lBQ3hCLGVBQVUsR0FBVyxJQUFJLENBQUM7WUFDMUIseUJBQW9CLEdBQVksS0FBSyxDQUFDO1lBRXRDLGtCQUFhLEdBQVcsVUFBVSxDQUFDO1lBQ25DLFVBQUssR0FBVyxFQUFFLENBQUM7WUFDbkIsMEJBQXFCLEdBQVksSUFBSSxDQUFDO1lBQ3RDLGNBQVMsR0FBWSxJQUFJLENBQUM7WUFDMUIsbUJBQWMsR0FBWSxJQUFJLENBQUM7WUFDL0Isa0JBQWEsR0FBVyxFQUFFLENBQUM7WUFDM0IsaUJBQVksR0FBVyxHQUFHLENBQUM7WUFDM0IsdUJBQWtCLEdBQVcsRUFBRSxDQUFDO1lBQ2hDLDBCQUFxQixHQUFXLEVBQUUsQ0FBQztZQUNuQyxvQkFBZSxHQUFXLEtBQUssQ0FBQztZQUNoQyx5QkFBb0IsR0FBWSxJQUFJLENBQUM7WUFDckMsd0JBQW1CLEdBQVksS0FBSyxDQUFDO1lBQ3JDLFVBQUssR0FBcUIsSUFBSSxLQUFLLEVBQWEsQ0FBQztZQUNqRCxhQUFRLEdBQXlCLElBQUksS0FBSyxFQUFpQixDQUFDO1lBQzVELHlCQUFvQixHQUFZLEtBQUssQ0FBQztZQUNyQyxxQkFBZ0IsR0FBYyxJQUFJLENBQUM7WUFDbkMsZUFBVSxHQUFtQixFQUFFLENBQUM7WUFDaEMsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1lBSW5DLHlCQUFvQixHQUFZLEtBQUssQ0FBQztZQUN0Qyw2QkFBd0IsR0FBVyxJQUFJLENBQUM7WUFDeEMsK0JBQTBCLEdBQVcsS0FBSyxDQUFDO1lBQzNDLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1lBQ3pCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1lBQzdCLGNBQVMsR0FBWSxLQUFLLENBQUM7WUFDM0Isd0JBQW1CLEdBQW1CLEVBQUUsQ0FBQztZQUcxQyxlQUFVLEdBQTZDLElBQUksWUFBSyxFQUFxQyxDQUFDO1lBQ3RHLHlCQUFvQixHQUEyRCxJQUFJLFlBQUssRUFBbUQsQ0FBQztZQUM1SSxtQkFBYyxHQUEyRCxJQUFJLFlBQUssRUFBbUQsQ0FBQztZQUN0SSxxQkFBZ0IsR0FBMkQsSUFBSSxZQUFLLEVBQW1ELENBQUM7WUFDeEkseUJBQW9CLEdBQTJELElBQUksWUFBSyxFQUFtRCxDQUFDO1lBQzVJLG9CQUFlLEdBQTJELElBQUksWUFBSyxFQUFtRCxDQUFDO1lBQ3ZJLHNCQUFpQixHQUEyRCxJQUFJLFlBQUssRUFBbUQsQ0FBQztZQUN6SSx1QkFBa0IsR0FBMkQsSUFBSSxZQUFLLEVBQW1ELENBQUM7WUFDMUksa0JBQWEsR0FBMkQsSUFBSSxZQUFLLEVBQW1ELENBQUM7WUFDckksaUJBQVksR0FBMkQsSUFBSSxZQUFLLEVBQW1ELENBQUM7WUFDcEksZ0JBQVcsR0FBMkQsSUFBSSxZQUFLLEVBQW1ELENBQUM7WUFDbkksaUJBQVksR0FBMkQsSUFBSSxZQUFLLEVBQW1ELENBQUM7WUFDcEksZUFBVSxHQUFxQixJQUFJLENBQUM7WUFFcEMsU0FBSSxHQUFXLFFBQVEsQ0FBQztZQUszQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksdUJBQWdCLEVBQUUsQ0FBQztZQUMvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBWSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEgsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsR0FBRyxVQUFVLElBQVksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsS0FBSztnQkFDN0IsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsS0FBSztnQkFDaEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDOUMsQ0FBQztZQUNMLENBQUM7WUFDRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUNNLDZCQUFPLEdBQWQsY0FBMkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0Msc0JBQVcsK0JBQU07aUJBQWpCLGNBQThCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFDeEQsVUFBa0IsS0FBYTtnQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3pCLHlCQUFrQixDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDN0MsQ0FBQzs7O1dBSnVEO1FBS2pELGtDQUFZLEdBQW5CLFVBQW9CLEdBQVcsSUFBSSxNQUFNLENBQUMseUJBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxzQkFBVyx3Q0FBZTtpQkFBMUIsY0FBdUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNqRixzQkFBVyxxQ0FBWTtpQkFBdkIsY0FBNEIsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMzSCxVQUF3QixRQUFnQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7V0FEMkM7UUFFM0gsc0JBQVcscUNBQVk7aUJBQXZCLGNBQTRCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDM0gsVUFBd0IsUUFBZ0IsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O1dBRDJDO1FBRTNILHNCQUFXLHFDQUFZO2lCQUF2QixjQUE0QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNILFVBQXdCLFFBQWdCLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztXQUQyQztRQUUzSCxzQkFBVyx3Q0FBZTtpQkFBMUIsY0FBd0MsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7aUJBQzNFLFVBQTJCLEtBQWM7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsZUFBZSxDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDM0MsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztnQkFDbEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDaEMsQ0FBQzs7O1dBTDBFO1FBTTNFLHNCQUFXLDRDQUFtQjtpQkFBOUIsY0FBMkMsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7aUJBQ2xGLFVBQStCLEtBQWE7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsbUJBQW1CLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUMvQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUNoQyxDQUFDOzs7V0FMaUY7OztRQU1sRixzQkFBVyw4Q0FBcUI7aUJBQWhDLGNBQTZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO2lCQUN0RixVQUFpQyxLQUFhO2dCQUMxQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLDBCQUEwQixDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDdEQsSUFBSSxDQUFDLDBCQUEwQixHQUFHLEtBQUssQ0FBQztZQUM1QyxDQUFDOzs7V0FKcUY7OztRQUt0RixzQkFBVyw2QkFBSTtpQkFBZjtnQkFDSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUM7aUJBQ0QsVUFBZ0IsSUFBUztnQkFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1AsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDOUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDekIsQ0FBQzs7O1dBWEE7UUFZRCxzQkFBVyxpQ0FBUTtpQkFBbkI7Z0JBQ0ksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZDLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCLENBQUM7OztXQUFBO1FBQ0Qsc0JBQUkscUNBQVk7aUJBQWhCO2dCQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3pDLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7Z0JBQ3BDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsQ0FBQztnQkFDTCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbEIsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVyxnQ0FBTztpQkFBbEIsY0FBZ0MsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7OztXQUFBO1FBQ2hFLHNCQUFXLGtDQUFTO2lCQUFwQjtnQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDN0IsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVyx5Q0FBZ0I7aUJBQTNCO2dCQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUNwQyxDQUFDOzs7V0FBQTtRQUNELHNCQUFXLG9DQUFXO2lCQUF0QjtnQkFDSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDaEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztvQkFDNUIsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ2pDLENBQUM7aUJBQ0QsVUFBdUIsS0FBZ0I7Z0JBQ25DLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQy9CLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUN2RCxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDO29CQUFDLE1BQU0sQ0FBQztnQkFDM0MsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2dCQUNyQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDbEQsQ0FBQztZQUNMLENBQUM7OztXQVhBO1FBWUQsc0JBQVcsOEJBQUs7aUJBQWhCO2dCQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztnQkFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFBQyxNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUN6QyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsU0FBUyxHQUFHLE9BQU8sQ0FBQTtZQUNuRCxDQUFDOzs7V0FBQTtRQUNNLDJCQUFLLEdBQVo7WUFDSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDO1FBQ1MsaUNBQVcsR0FBckIsVUFBc0IsR0FBUSxFQUFFLElBQVM7WUFDckMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNTLHdDQUFrQixHQUE1QixVQUE2QixRQUFtQixFQUFFLFFBQW1CO1lBQ2pFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDckcsQ0FBQztRQUNNLGlDQUFXLEdBQWxCO1lBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDRCxzQkFBVyxxQ0FBWTtpQkFBdkIsY0FBcUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDdEUsc0JBQVcsa0NBQVM7aUJBQXBCO2dCQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNuQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUM5QixNQUFNLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0RSxDQUFDOzs7V0FBQTtRQUNNLCtCQUFTLEdBQWhCO1lBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUM3QixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsMkNBQTJDLENBQUM7UUFDcEYsQ0FBQztRQUNNLGtDQUFZLEdBQW5CO1lBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUM3QixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQzdDLENBQUM7UUFDTSw4QkFBUSxHQUFmO1lBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzlDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDNUQsQ0FBQztZQUNELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDL0IsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELHNCQUFJLCtDQUFzQjtpQkFBMUI7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRCxDQUFDOzs7V0FBQTtRQUNNLDhCQUFRLEdBQWY7WUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDbkMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUMvQixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUNNLHNDQUFnQixHQUF2QjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzlDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxzQkFBVyxvQ0FBVztpQkFBdEI7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUQsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVyxtQ0FBVTtpQkFBckI7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDMUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7OztXQUFBO1FBQ00sZ0NBQVUsR0FBakI7WUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN0QixDQUFDO1FBQ0wsQ0FBQztRQUNTLGtDQUFZLEdBQXRCO1lBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDNUIsQ0FBQztRQUNELHNCQUFXLCtDQUFzQjtpQkFBakM7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDaEQsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDcEUsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVyw2Q0FBb0I7aUJBQS9CO2dCQUNJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDakUsQ0FBQzs7O1dBQUE7UUFDRCxzQkFBVyxxQ0FBWTtpQkFBdkI7Z0JBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDL0IsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdFLENBQUM7OztXQUFBO1FBQ00sZ0NBQVUsR0FBakIsVUFBa0IsSUFBWSxFQUFFLElBQVUsRUFBRSxlQUF3QixFQUFFLGlCQUF3QztZQUMxRyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3pFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDUyxvQ0FBYyxHQUF4QixVQUF5QixJQUFZLEVBQUUsSUFBVSxFQUFFLGlCQUEwQztZQUN6RixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUM7Z0JBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEQsSUFBSSxzQkFBZSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLFVBQVUsT0FBZ0IsRUFBRSxRQUFhO2dCQUM3RixFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztvQkFBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dCQUN4RSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsNkJBQU8sR0FBUCxVQUFRLEtBQWE7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUNELDZCQUFPLEdBQVAsVUFBUSxJQUFlO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQ2hDLENBQUM7UUFDRCxnQ0FBVSxHQUFWLFVBQVcsSUFBWTtZQUNuQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0QsZ0NBQVUsR0FBVixVQUFXLElBQWU7WUFDdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDaEMsQ0FBQztRQUNNLHVDQUFpQixHQUF4QixVQUF5QixJQUFZLEVBQUUsZUFBZ0M7WUFBaEMsK0JBQWdDLEdBQWhDLHVCQUFnQztZQUNuRSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDO2dCQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDL0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2hELElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQztvQkFBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMvRCxFQUFFLENBQUEsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNNLHlDQUFtQixHQUExQixVQUEyQixLQUFlLEVBQUUsZUFBZ0M7WUFBaEMsK0JBQWdDLEdBQWhDLHVCQUFnQztZQUN4RSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUMsUUFBUSxDQUFDO2dCQUN4QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUNqRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ00sdUNBQWlCLEdBQXhCLFVBQXlCLFFBQW1CO1lBQ3hDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDakQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQWUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN6RSxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ00sbUNBQWEsR0FBcEIsVUFBcUIsSUFBWTtZQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2pELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztvQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ00scUNBQWUsR0FBdEIsVUFBdUIsS0FBZTtZQUNsQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUMxQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUMsUUFBUSxDQUFDO2dCQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ00scUNBQWUsR0FBdEIsVUFBdUIsV0FBNEI7WUFBNUIsMkJBQTRCLEdBQTVCLG1CQUE0QjtZQUMvQyxJQUFJLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBYSxDQUFDO1lBQ3BDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDMUQsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNTLG1DQUFhLEdBQXZCLFVBQXdCLElBQVksSUFBSSxNQUFNLENBQUMsSUFBSSxnQkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxrREFBNEIsR0FBcEMsVUFBcUMsSUFBWSxFQUFFLFFBQWE7WUFDNUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztZQUNwQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7b0JBQUMsUUFBUSxDQUFDO2dCQUN4QyxRQUFRLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDOUYsQ0FBQztRQUNPLHNEQUFnQyxHQUF4QztZQUNJLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzlFLENBQUM7UUFDTCxDQUFDO1FBQ1MsMENBQW9CLEdBQTlCLFVBQStCLFFBQW1CLEVBQUUsUUFBYTtZQUM3RCxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUNPLHlDQUFtQixHQUEzQjtZQUNJLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1lBQy9DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELENBQUM7UUFDTCxDQUFDO1FBQ08sNkNBQXVCLEdBQS9CO1lBQ0ksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQzdDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQUMsUUFBUSxDQUFDO2dCQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFCLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFDTyxtQ0FBYSxHQUFyQixVQUFzQixJQUFZLEVBQUUsUUFBYSxFQUFFLFlBQXFCO1lBQ3BFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDTyx1Q0FBaUIsR0FBekI7WUFDSSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN4QyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUM7UUFDTyxtQ0FBYSxHQUFyQjtZQUNJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ08sMENBQW9CLEdBQTVCLFVBQTZCLElBQTZCO1lBQ3RELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNuQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMxQyxDQUFDO1FBQ0wsQ0FBQztRQUNNLGdDQUFVLEdBQWpCLFVBQWtCLE1BQXFCLEVBQUUsUUFBdUIsRUFBRSxrQkFBbUM7WUFBbkYsc0JBQXFCLEdBQXJCLGFBQXFCO1lBQUUsd0JBQXVCLEdBQXZCLGVBQXVCO1lBQUUsa0NBQW1DLEdBQW5DLDBCQUFtQztZQUNqRyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDL0IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNwQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQzdCLENBQUM7WUFDRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxzQkFBZSxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsT0FBZ0IsRUFBRSxRQUFhO2dCQUN6RixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1lBQzFFLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUNNLCtCQUFTLEdBQWhCLFVBQWlCLFFBQWdCLEVBQUUsSUFBWTtZQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxzQkFBZSxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxPQUFnQixFQUFFLElBQVMsRUFBRSxRQUFlLEVBQUUsUUFBYTtnQkFDakgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDMUcsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ00sMkNBQXFCLEdBQTVCLFVBQTZCLFFBQXVCO1lBQXZCLHdCQUF1QixHQUF2QixlQUF1QjtZQUNoRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQzdCLENBQUM7WUFDRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7WUFDbEMsSUFBSSxzQkFBZSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxPQUFnQixFQUFFLE1BQWMsRUFBRSxRQUFhO2dCQUNyRyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDO29CQUN4QyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFDbkMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNTLGdEQUEwQixHQUFwQztRQUNBLENBQUM7UUFDUyw2Q0FBdUIsR0FBakM7UUFDQSxDQUFDO1FBQ08sMENBQW9CLEdBQTVCO1lBQ0ksSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNuRSxDQUFDO1lBQ0wsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUNyRyxDQUFDO1FBQ0wsQ0FBQztRQUNPLDhDQUF3QixHQUFoQyxVQUFpQyxTQUFrQjtZQUMvQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNqRyxDQUFDO1FBQ0wsQ0FBQztRQUNPLGtEQUE0QixHQUFwQyxVQUFxQyxTQUFzQixFQUFFLFNBQWtCO1lBQzNFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN4QyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUcsQ0FBQztRQUNMLENBQUM7UUFDTyxtQ0FBYSxHQUFyQixVQUFzQixPQUFZO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLGFBQWEsR0FBRyxJQUFJLGlCQUFVLEVBQUUsQ0FBQztZQUNyQyxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7WUFDM0MsQ0FBQztZQUNELElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDdEIsQ0FBQztZQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUNoQyxDQUFDO1FBQ1Msc0NBQWdCLEdBQTFCLGNBQStCLENBQUM7UUFDdEIsZ0NBQVUsR0FBcEIsY0FBeUIsQ0FBQztRQUNsQiwrQ0FBeUIsR0FBakM7WUFDSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQzlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQy9JLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUMsR0FBRyxVQUFVLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3pGLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUM7UUFDTCxDQUFDO1FBQ08sc0RBQWdDLEdBQXhDLFVBQXlDLFFBQW1CO1lBQ3hELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ3ZFLENBQUM7UUFDTywyQ0FBcUIsR0FBN0IsVUFBOEIsSUFBWTtZQUN0QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDOUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsRSxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsQ0FBQztZQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUNPLGtEQUE0QixHQUFwQztZQUNJLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztvQkFBQyxRQUFRLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztRQUNNLGlDQUFXLEdBQWxCLFVBQW1CLElBQVk7WUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ00saUNBQVcsR0FBbEIsVUFBbUIsSUFBWSxFQUFFLFFBQWE7WUFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDOUQsQ0FBQztRQUNELGNBQWM7UUFDTixvQ0FBYyxHQUF0QixVQUF1QixLQUFVO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsMkNBQTJDO2dCQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0MsQ0FBQztZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELDhCQUFRLEdBQVIsVUFBUyxJQUFZO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDM0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsOEJBQVEsR0FBUixVQUFTLElBQVksRUFBRSxRQUFhO1lBQ2hDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUM5QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksRUFBRSxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDakMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUMzRCxDQUFDO1lBQ0QsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQ08sa0NBQVksR0FBcEIsVUFBcUIsSUFBWSxFQUFFLFFBQWE7WUFDNUMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztnQkFBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3BDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDO1lBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFDTyxzQ0FBZ0IsR0FBeEIsVUFBeUIsQ0FBTSxFQUFFLENBQU07WUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxNQUFNLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ25FLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLFFBQVEsQ0FBQztnQkFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUMsUUFBUSxDQUFDO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3pELENBQUM7WUFDRCxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2xFLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTyw0Q0FBc0IsR0FBOUIsVUFBK0IsSUFBWTtZQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQzNELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDL0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7WUFDL0MsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDO1lBQ2xELENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDcEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNELGdDQUFVLEdBQVYsVUFBVyxJQUFZO1lBQ25CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsRCxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ0QsZ0NBQVUsR0FBVixVQUFXLElBQVksRUFBRSxRQUFnQjtZQUNyQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDakMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDckMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDakMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLENBQUM7UUFDTCxDQUFDO1FBQ0QsK0NBQXlCLEdBQXpCLFVBQTBCLFFBQW1CLEVBQUUsUUFBaUI7WUFDNUQsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzNHLENBQUM7UUFDRCwyQ0FBcUIsR0FBckIsVUFBc0IsSUFBVyxFQUFFLFFBQWlCO1lBQ2hELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBQ0QsbUNBQWEsR0FBYixVQUFjLFFBQW1CLEVBQUUsS0FBYTtZQUM1QyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsZ0NBQWdDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNyRyxDQUFDO1FBQ0QscUNBQWUsR0FBZixVQUFnQixRQUFtQjtZQUMvQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7UUFFRCxzQ0FBZ0IsR0FBaEIsVUFBaUIsSUFBWTtZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDakQsSUFBSSxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUN0RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNqRSxDQUFDO1FBQ0QsaUNBQVcsR0FBWCxVQUFZLElBQVk7WUFDcEIsSUFBSSxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsaUNBQVcsR0FBWCxVQUFZLElBQVk7WUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUNELHFCQUFxQjtRQUNyQixnQ0FBVSxHQUFWLFVBQVcsS0FBZSxFQUFFLFNBQW1CO1lBQzNDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNoQixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNELHFDQUFlLEdBQWYsVUFBZ0IsSUFBWSxFQUFFLEtBQVUsRUFBRSxVQUFtQjtZQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDYixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNMLENBQUM7UUFDTCxrQkFBQztJQUFELENBcHJCQSxBQW9yQkMsQ0FwckJnQyxXQUFJLEdBb3JCcEM7SUFwckJZLGtCQUFXLGNBb3JCdkIsQ0FBQTtJQUVELGlCQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLGNBQVEsTUFBTSxDQUFDLHlCQUFrQixDQUFDLFVBQVUsRUFBRSxDQUFBLENBQUMsQ0FBQyxFQUFFO1FBQ2pILE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRTtRQUNuRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFHLEVBQUUsS0FBSyxFQUFFLGFBQWEsSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUN0TyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUU7UUFDdkYsVUFBVSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsOEJBQThCO1FBQ3hFLEVBQUUsSUFBSSxFQUFFLCtCQUErQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtRQUN6Six5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDM0csRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUU7UUFDN0UsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFO1FBQzlFLEVBQUUsSUFBSSxFQUFFLDhCQUE4QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSw2QkFBNkIsRUFBRSw4QkFBOEI7UUFDdEgsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQVEsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzNGLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFRLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMzRixFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFVBQVUsR0FBUSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDM0YsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFDaEcsQ0FBQyxFQXJzQk0sTUFBTSxLQUFOLE1BQU0sUUFxc0JaOztBQ2x0QkQ7Ozs7RUFJRTs7Ozs7O0FBRUYsSUFBTyxNQUFNLENBbUNaO0FBbkNELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWDtRQUF1QyxxQ0FBSTtRQVN2QywyQkFBWSxPQUFZO1lBQ3BCLGlCQUFPLENBQUM7WUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ25DLElBQUksQ0FBQyxhQUFhLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUNNLG1DQUFPLEdBQWQsY0FBNEIsTUFBTSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7UUFDN0Msc0JBQVcscUNBQU07aUJBQWpCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDN0Qsc0JBQVcsd0NBQVM7aUJBQXBCLGNBQWtDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDL0Qsc0JBQVcseUNBQVU7aUJBQXJCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQzs7O1dBQUE7UUFDakUsc0JBQVcsb0NBQUs7aUJBQWhCLGNBQTZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUM1RixVQUFpQixLQUFhLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7V0FEZ0M7UUFFckYsa0NBQU0sR0FBYjtZQUNJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNNLG9DQUFRLEdBQWY7WUFDSSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFDUyx3Q0FBWSxHQUF0QixVQUF1QixPQUFZO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLGtCQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDbkMsQ0FBQztRQUNTLDBDQUFjLEdBQXhCLFVBQXlCLEtBQWM7WUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDakMsQ0FBQztRQS9CYSxtQ0FBaUIsR0FBRyxnQkFBZ0IsQ0FBQztRQWdDdkQsd0JBQUM7SUFBRCxDQWpDQSxBQWlDQyxDQWpDc0MsV0FBSSxHQWlDMUM7SUFqQ1ksd0JBQWlCLG9CQWlDN0IsQ0FBQTtBQUNMLENBQUMsRUFuQ00sTUFBTSxLQUFOLE1BQU0sUUFtQ1o7O0FDekNEOzs7O0VBSUU7QUFFRiw2Q0FBNkM7QUFDN0MsSUFBTyxNQUFNLENBd0JaO0FBeEJELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDYixJQUFJLG9CQUFvQixHQUFHO1FBQ3ZCLFlBQVksRUFBRSxXQUFXO1FBQ3pCLFlBQVksRUFBRSxVQUFVO1FBQ3hCLFlBQVksRUFBRSxRQUFRO1FBQ3RCLGFBQWEsRUFBRSxlQUFlO1FBQzlCLFlBQVksRUFBRSxjQUFjO1FBQzVCLFdBQVcsRUFBRSx1RUFBdUU7UUFDcEYsZ0JBQWdCLEVBQUUsZ0NBQWdDO1FBQ2xELGFBQWEsRUFBRSxrQ0FBa0M7UUFDakQsY0FBYyxFQUFFLFlBQVk7UUFDNUIsYUFBYSxFQUFFLDZCQUE2QjtRQUM1QyxZQUFZLEVBQUUsOEJBQThCO1FBQzVDLGFBQWEsRUFBRSwwQ0FBMEM7UUFDekQsY0FBYyxFQUFFLGdEQUFnRDtRQUNoRSxjQUFjLEVBQUUsK0NBQStDO1FBQy9ELGFBQWEsRUFBRSx1RkFBdUY7UUFDdEcsVUFBVSxFQUFFLG1EQUFtRDtRQUMvRCxVQUFVLEVBQUUsb0RBQW9EO1FBQ2hFLFlBQVksRUFBRSxnQ0FBZ0M7UUFDOUMsa0JBQWtCLEVBQUUscUNBQXFDO0tBQzVELENBQUE7SUFFRCx5QkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsb0JBQW9CLENBQUM7QUFDMUQsQ0FBQyxFQXhCTSxNQUFNLEtBQU4sTUFBTSxRQXdCWjs7QUMvQkQ7Ozs7RUFJRTtBQUVGLDZDQUE2QztBQUM3Qyw4Q0FBOEM7QUFDOUMsSUFBTyxNQUFNLENBd0JaO0FBeEJELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWCxJQUFJLG1CQUFtQixHQUFHO1FBQ3RCLFlBQVksRUFBRSxxQkFBcUI7UUFDbkMsWUFBWSxFQUFFLFNBQVM7UUFDdkIsWUFBWSxFQUFFLFVBQVU7UUFDeEIsYUFBYSxFQUFFLHVCQUF1QjtRQUN0QyxZQUFZLEVBQUUsa0JBQWtCO1FBQ2hDLFdBQVcsRUFBRSxtRUFBbUU7UUFDaEYsZ0JBQWdCLEVBQUUsOENBQThDO1FBQ2hFLGFBQWEsRUFBRSxnREFBZ0Q7UUFDL0QsY0FBYyxFQUFFLGVBQWU7UUFDL0IsYUFBYSxFQUFFLHdEQUF3RDtRQUN2RSxZQUFZLEVBQUUsMkNBQTJDO1FBQ3pELGFBQWEsRUFBRSx1Q0FBdUM7UUFDdEQsY0FBYyxFQUFFLHVEQUF1RDtRQUN2RSxjQUFjLEVBQUUsc0RBQXNEO1FBQ3RFLGFBQWEsRUFBRSw0SEFBNEg7UUFDM0ksVUFBVSxFQUFFLGlGQUFpRjtRQUM3RixVQUFVLEVBQUUsaUZBQWlGO1FBQzdGLFlBQVksRUFBRSx5Q0FBeUM7UUFDdkQsYUFBYSxFQUFFLG9EQUFvRDtRQUNuRSxrQkFBa0IsRUFBRSwwQ0FBMEM7S0FDakUsQ0FBQTtJQUNELHlCQUFrQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztBQUMzRCxDQUFDLEVBeEJNLE1BQU0sS0FBTixNQUFNLFFBd0JaOztBQ2hDRDs7OztFQUlFO0FBRUYsNkNBQTZDO0FBQzdDLElBQU8sTUFBTSxDQXdCWjtBQXhCRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBQ1gsSUFBSSxtQkFBbUIsR0FBRztRQUN0QixZQUFZLEVBQUUsUUFBUTtRQUN0QixZQUFZLEVBQUUsUUFBUTtRQUN0QixZQUFZLEVBQUUsUUFBUTtRQUN0QixZQUFZLEVBQUUsbUJBQW1CO1FBQ2pDLFdBQVcsRUFBRSxnQ0FBZ0M7UUFDN0MsZ0JBQWdCLEVBQUUsZ0RBQWdEO1FBQ2xFLGFBQWEsRUFBRSwyQ0FBMkM7UUFDMUQsYUFBYSxFQUFFLCtCQUErQjtRQUM5QyxjQUFjLEVBQUUsV0FBVztRQUMzQixhQUFhLEVBQUUsb0NBQW9DO1FBQ25ELFlBQVksRUFBRSxpQ0FBaUM7UUFDL0MsYUFBYSxFQUFFLHlDQUF5QztRQUN4RCxjQUFjLEVBQUUsNENBQTRDO1FBQzVELGNBQWMsRUFBRSxnREFBZ0Q7UUFDaEUsYUFBYSxFQUFFLDZFQUE2RTtRQUM1RixVQUFVLEVBQUUsNkNBQTZDO1FBQ3pELFVBQVUsRUFBRSx5Q0FBeUM7UUFDckQsWUFBWSxFQUFFLGlEQUFpRDtRQUMvRCxhQUFhLEVBQUUseUNBQXlDO1FBQ3hELGtCQUFrQixFQUFFLHFFQUFxRTtLQUM1RixDQUFBO0lBQ0QseUJBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLG1CQUFtQixDQUFDO0FBQzNELENBQUMsRUF4Qk0sTUFBTSxLQUFOLE1BQU0sUUF3Qlo7O0FDL0JEOzs7O0VBSUU7QUFFRiw2Q0FBNkM7QUFDN0MsSUFBTyxNQUFNLENBdUJaO0FBdkJELFdBQU8sTUFBTSxFQUFDLENBQUM7SUFDWCxJQUFJLG9CQUFvQixHQUFHO1FBQ3ZCLFlBQVksRUFBRSxPQUFPO1FBQ3JCLFlBQVksRUFBRSxPQUFPO1FBQ3JCLFlBQVksRUFBRSxRQUFRO1FBQ3RCLFlBQVksRUFBRSxxQkFBcUI7UUFDbkMsV0FBVyxFQUFFLHdCQUF3QjtRQUNyQyxnQkFBZ0IsRUFBRSxzQ0FBc0M7UUFDeEQsYUFBYSxFQUFFLHVCQUF1QjtRQUN0QyxhQUFhLEVBQUUsOEJBQThCO1FBQzdDLGNBQWMsRUFBRSxZQUFZO1FBQzVCLGFBQWEsRUFBRSxpQ0FBaUM7UUFDaEQsWUFBWSxFQUFFLDJCQUEyQjtRQUN6QyxhQUFhLEVBQUUsMkNBQTJDO1FBQzFELGNBQWMsRUFBRSw2Q0FBNkM7UUFDN0QsY0FBYyxFQUFFLDhDQUE4QztRQUM5RCxhQUFhLEVBQUUsNEVBQTRFO1FBQzNGLFVBQVUsRUFBRSw4Q0FBOEM7UUFDMUQsVUFBVSxFQUFFLDhDQUE4QztRQUMxRCxZQUFZLEVBQUUsNkRBQTZEO1FBQzNFLGtCQUFrQixFQUFFLDhDQUE4QztLQUNyRSxDQUFBO0lBQ0QseUJBQWtCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLG9CQUFvQixDQUFDO0FBQzVELENBQUMsRUF2Qk0sTUFBTSxLQUFOLE1BQU0sUUF1Qlo7O0FDOUJEOzs7O0VBSUU7QUFFRixJQUFPLE1BQU0sQ0F3Qlo7QUF4QkQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNBLDBCQUFtQixHQUFHO1FBQzdCLElBQUksRUFBRSxFQUFFO1FBQ1IsTUFBTSxFQUFFLGVBQWU7UUFDdkIsSUFBSSxFQUFFLFlBQVk7UUFDbEIsTUFBTSxFQUFFLGNBQWM7UUFDdEIsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBQ3RFLFFBQVEsRUFBRSx1QkFBdUI7UUFDakMsU0FBUyxFQUFFLEVBQUU7UUFDYixHQUFHLEVBQUUsRUFBRTtRQUNQLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUU7UUFDdEUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxzQ0FBc0MsRUFBRTtRQUVuRixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtRQUM5RCxPQUFPLEVBQUUsY0FBYztRQUN2QixRQUFRLEVBQUUsY0FBYztRQUN4QixNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1FBQ3pCLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7UUFDakMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO1FBQ2xELFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFO1FBQ3pFLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1FBQzdELE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1FBQ3RELElBQUksRUFBRSxjQUFjO0tBQ3ZCLENBQUM7QUFDTixDQUFDLEVBeEJNLE1BQU0sS0FBTixNQUFNLFFBd0JaOztBQzlCRDs7OztFQUlFOzs7Ozs7QUFFRixxQ0FBcUM7QUFDckMsdUNBQXVDO0FBQ3ZDLCtDQUErQztBQUMvQyxpREFBaUQ7QUFDakQ7SUFBeUMsOENBQXlCO0lBRzlELG9DQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxtREFBYyxHQUFkLFVBQWUsS0FBSztRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsOERBQXlCLEdBQXpCLFVBQTBCLFNBQWM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBQ3ZDLENBQUM7SUFDRCwyQ0FBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FDSCxxQkFBQyxRQUFRLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFJLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFNLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUssRUFBRyxDQUM1SixDQUFDO0lBQ04sQ0FBQztJQUNMLGlDQUFDO0FBQUQsQ0F2QkEsQUF1QkMsQ0F2QndDLEtBQUssQ0FBQyxTQUFTLEdBdUJ2RDtBQUVEO0lBQTZDLGtEQUF5QjtJQUlsRSx3Q0FBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsdURBQWMsR0FBZCxVQUFlLEtBQUs7UUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRCxxREFBWSxHQUFaLFVBQWEsS0FBSztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDekMsQ0FBQztJQUNELGtFQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsK0NBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMscUJBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQVEsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFNLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFhLEVBQUcsQ0FBQyxDQUFDO0lBQzVKLENBQUM7SUFDTCxxQ0FBQztBQUFELENBM0JBLEFBMkJDLENBM0I0QyxLQUFLLENBQUMsU0FBUyxHQTJCM0Q7O0FDOUREOzs7O0VBSUU7Ozs7OztBQUVGLEFBTUEscUNBTnFDO0FBQ3JDLHVDQUF1QztBQUN2Qyw0Q0FBNEM7QUFDNUMsaURBQWlEO0FBQ2pELGlEQUFpRDtBQVVqRDtJQUFrQyx1Q0FBeUI7SUFLdkQsNkJBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDekIsQ0FBQztJQUNELHVEQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUNPLHlDQUFXLEdBQW5CLFVBQW9CLFFBQVE7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLFlBQVksTUFBTSxDQUFDLFFBQVEsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3RFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUM1RixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsR0FBRztnQkFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUE7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUNELG9DQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNyRCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU07UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDNUMsSUFBSSxTQUFTLEdBQUcscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwRSxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25FLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztRQUM1RSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLElBQUksUUFBUSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEYsSUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN4RixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDakMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNwSCxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hJLElBQUksU0FBUyxHQUFHLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDbEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDOUUsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNyRCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsWUFBWSxDQUFDO1FBQzNELE1BQU0sQ0FBQyxDQUNILHFCQUFDLEdBQUcsSUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFHLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUssRUFBQyxLQUFLLEVBQUUsU0FBVSxHQUM5RSxRQUFTLEVBQ1QsTUFBTyxFQUNQLGNBQWUsRUFDZixPQUFRLEVBQ1IsV0FBWSxDQUNYLENBQ1QsQ0FBQztJQUNOLENBQUM7SUFDUyx5Q0FBVyxHQUFyQjtRQUNJLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxDQUFDLHFCQUFDLEVBQUUsSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBTSxHQUFFLFNBQVUsQ0FBSyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNTLDJDQUFhLEdBQXZCO1FBQ0ksTUFBTSxDQUFDLENBQUMscUJBQUMsR0FBRyxTQUNKLHFCQUFDLEdBQUcsU0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVksQ0FBTSxFQUN0QyxxQkFBQyxHQUFHLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQVEsR0FDMUMsb0JBQUMsOEJBQThCLEdBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFTLEVBQUUsQ0FDckQsQ0FDSixDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNTLDBDQUFZLEdBQXRCO1FBQ0ksTUFBTSxDQUFDLG9CQUFDLHlCQUF5QixHQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBSSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBUSxFQUFHLENBQUE7SUFDdkcsQ0FBQztJQUNMLDBCQUFDO0FBQUQsQ0F2RUEsQUF1RUMsQ0F2RWlDLEtBQUssQ0FBQyxTQUFTLEdBdUVoRDtBQUVEO0lBQXdDLDZDQUF5QjtJQUk3RCxtQ0FBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUN6QixDQUFDO0lBQ0QsNkRBQXlCLEdBQXpCLFVBQTBCLFNBQWM7UUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztJQUM3QixDQUFDO0lBQ08sK0NBQVcsR0FBbkIsVUFBb0IsUUFBUTtRQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsWUFBWSxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEdBQUc7Z0JBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNELDBDQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDcEUsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbEQsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxxQkFBQyxHQUFHLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUssR0FBRSxNQUFPLENBQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFDTCxnQ0FBQztBQUFELENBcENBLEFBb0NDLENBcEN1QyxLQUFLLENBQUMsU0FBUyxHQW9DdEQ7O0FDaklEOzs7O0VBSUU7Ozs7OztBQUVGLHFDQUFxQztBQUNyQyxpREFBaUQ7QUFDakQsMENBQTBDO0FBQzFDO0lBQThCLG1DQUF5QjtJQUtuRCx5QkFBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3pCLENBQUM7SUFDRCxtREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7SUFDN0IsQ0FBQztJQUNELGdDQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDbEYsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQ0gscUJBQUMsR0FBRyxTQUNDLEtBQU0sRUFDTixJQUFLLENBQ0EsQ0FDYixDQUFDO0lBQ04sQ0FBQztJQUNTLG1DQUFTLEdBQW5CLFVBQW9CLEdBQTRCLEVBQUUsS0FBYTtRQUMzRCxJQUFJLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLG9CQUFDLGNBQWMsR0FBQyxHQUFHLEVBQUUsT0FBUSxFQUFDLEdBQUcsRUFBRSxHQUFJLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFPLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFRLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFJLEVBQUcsQ0FBQztJQUNqSCxDQUFDO0lBQ1MscUNBQVcsR0FBckI7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2pFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7UUFDdkMsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLHFCQUFDLEVBQUUsSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFVLEdBQUUsSUFBSyxDQUFLLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQTdDQSxBQTZDQyxDQTdDNkIsS0FBSyxDQUFDLFNBQVMsR0E2QzVDO0FBRUQ7SUFBNkIsa0NBQXlCO0lBS2xELHdCQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDRCxrREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDTyxzQ0FBYSxHQUFyQixVQUFzQixLQUFVO1FBQzVCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLHlCQUF5QixHQUFHLGNBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdEcsQ0FBQztRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3pCLENBQUM7SUFDRCwrQkFBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2pGLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ25DLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNuQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2pELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFDRCxNQUFNLENBQUMsQ0FDSCxxQkFBQyxHQUFHLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBSSxHQUN4QixTQUFVLENBQ1QsQ0FDVCxDQUFDO0lBQ04sQ0FBQztJQUNTLHVDQUFjLEdBQXhCLFVBQXlCLFFBQTZCO1FBQ2xELE1BQU0sQ0FBQyxvQkFBQyxtQkFBbUIsR0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUssRUFBQyxRQUFRLEVBQUUsUUFBUyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBUSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBSSxFQUFHLENBQUM7SUFDakgsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0F2Q0EsQUF1Q0MsQ0F2QzRCLEtBQUssQ0FBQyxTQUFTLEdBdUMzQzs7QUMvRkQ7Ozs7RUFJRTs7Ozs7O0FBRUYscUNBQXFDO0FBQ3JDLGdEQUFnRDtBQUNoRCxpREFBaUQ7QUFDakQ7SUFBMEMsK0NBQXlCO0lBSS9ELHFDQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixHQUFHO1lBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUE7SUFDTCxDQUFDO0lBQ0QsK0RBQXlCLEdBQXpCLFVBQTBCLFNBQWM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUNELDRDQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxDQUNILHFCQUFDLElBQUksSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFLLEdBQzlCLElBQUksQ0FBQyxRQUFRLEVBQUksQ0FDUCxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNTLDhDQUFRLEdBQWxCO1FBQ0ksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMzRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ0Qsc0JBQWMsa0RBQVM7YUFBdkIsY0FBaUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3JDLGdEQUFVLEdBQXBCLFVBQXFCLEdBQVcsRUFBRSxJQUFTO1FBQ3ZDLE1BQU0sQ0FBQyxvQkFBQywrQkFBK0IsR0FBQyxHQUFHLEVBQUUsR0FBSSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBSSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBUSxFQUFDLElBQUksRUFBRSxJQUFLLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFVLEVBQUcsQ0FBQztJQUMvSixDQUFDO0lBQ0wsa0NBQUM7QUFBRCxDQXpDQSxBQXlDQyxDQXpDeUMsS0FBSyxDQUFDLFNBQVMsR0F5Q3hEO0FBQ0Q7SUFBOEMsbURBQXlCO0lBTW5FLHlDQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELG1FQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQztJQUNELHdEQUFjLEdBQWQsVUFBZSxLQUFLO1FBQ2hCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNaLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUNELElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdkIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNiLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxnREFBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDOUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUN2RixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUM5RCxJQUFJLFFBQVEsR0FBRyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ1osUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekYsSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUM3RyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFDRCxzQkFBYyx1REFBVTthQUF4QixjQUFrQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN4RCx3REFBYyxHQUF4QixVQUF5QixTQUFrQixFQUFFLFFBQWEsRUFBRSxTQUFzQjtRQUM5RSxNQUFNLENBQUMsQ0FBQyxxQkFBQyxHQUFHLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSyxFQUFDLEtBQUssRUFBRSxRQUFTLEdBQy9DLHFCQUFDLEtBQUssSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFLLEdBQzVCLHFCQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVyxFQUFFLE9BQU8sRUFBRSxTQUFVLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEVBQUcsRUFDckcscUJBQUMsSUFBSSxTQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSyxDQUFPLENBQ3JCLEVBQ1gsU0FBVSxDQUNULENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ1MscURBQVcsR0FBckI7UUFDSSxNQUFNLENBQUMsQ0FBQyxxQkFBQyxHQUFHLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBTSxHQUFDLG9CQUFDLDhCQUE4QixHQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBUSxFQUFHLENBQU0sQ0FBQyxDQUFDO0lBQ25JLENBQUM7SUFDTCxzQ0FBQztBQUFELENBakVBLEFBaUVDLENBakU2QyxLQUFLLENBQUMsU0FBUyxHQWlFNUQ7O0FDcEhEOzs7O0VBSUU7Ozs7OztBQUVGLHFDQUFxQztBQUNyQyxnREFBZ0Q7QUFDaEQsaURBQWlEO0FBQ2pEO0lBQTBDLCtDQUF5QjtJQUsvRCxxQ0FBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDL0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEdBQUc7WUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQTtRQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELG9EQUFjLEdBQWQsVUFBZSxLQUFLO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCwrREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztJQUNyQyxDQUFDO0lBQ0QsNENBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNyQixJQUFJLE1BQU0sR0FBRyxxQkFBQyxNQUFNLElBQUMsR0FBRyxFQUFFLEdBQUksRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQU0sR0FBRSxJQUFJLENBQUMsSUFBSyxDQUFTLENBQUM7WUFDdkUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEcsTUFBTSxDQUFDLENBQ0gscUJBQUMsR0FBRyxTQUNKLHFCQUFDLE1BQU0sSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUksRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFNLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEdBQ2xGLHFCQUFDLE1BQU0sSUFBQyxLQUFLLEVBQUMsRUFBRSxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBZSxDQUFTLEVBQ3ZELE9BQVEsQ0FDRixFQUNSLE9BQVEsQ0FDSCxDQUNULENBQUM7SUFDTixDQUFDO0lBQ1MsaURBQVcsR0FBckI7UUFDSSxJQUFJLEtBQUssR0FBRyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNqQyxNQUFNLENBQUMscUJBQUMsR0FBRyxJQUFDLEtBQUssRUFBRSxLQUFNLEdBQUMsb0JBQUMsOEJBQThCLEdBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFTLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFRLEVBQUUsQ0FBTSxDQUFDO0lBQ2xILENBQUM7SUFDTCxrQ0FBQztBQUFELENBbkRBLEFBbURDLENBbkR5QyxLQUFLLENBQUMsU0FBUyxHQW1EeEQ7O0FDNUREOzs7O0VBSUU7Ozs7OztBQUVGLHFDQUFxQztBQUNyQyx1Q0FBdUM7QUFDdkMsNENBQTRDO0FBQzVDLGlEQUFpRDtBQUNqRDtJQUFzQywyQ0FBeUI7SUFHM0QsaUNBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxnREFBYyxHQUFkLFVBQWUsS0FBSztRQUNoQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN2RCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFDRCwyREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQztJQUNELHdDQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsQ0FDSCxxQkFBQyxHQUFHLFNBQ0EscUJBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEVBQUUsRUFDbEQsR0FBSSxDQUNILENBQ1QsQ0FBQztJQUNOLENBQUM7SUFDUyw2Q0FBVyxHQUFyQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxDQUFDLHFCQUFDLEdBQUcsZUFBRyxxQkFBQyxHQUFHLElBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBYSxFQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVksRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFXLEVBQUcsQ0FBTSxDQUFDLENBQUM7SUFDdkksQ0FBQztJQUNMLDhCQUFDO0FBQUQsQ0FsQ0EsQUFrQ0MsQ0FsQ3FDLEtBQUssQ0FBQyxTQUFTLEdBa0NwRDs7QUM1Q0Q7Ozs7RUFJRTs7Ozs7O0FBRUYscUNBQXFDO0FBQ3JDLHVDQUF1QztBQUN2Qyw0Q0FBNEM7QUFDNUMsaURBQWlEO0FBQ2pEO0lBQXNDLDJDQUF5QjtJQUUzRCxpQ0FBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFDRCwyREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQztJQUNELHdDQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkQsSUFBSSxTQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUN2RCxNQUFNLENBQUMsQ0FBQyxxQkFBQyxHQUFHLElBQUMsdUJBQXVCLEVBQUUsU0FBVSxFQUFHLENBQUUsQ0FBQztJQUMxRCxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQWRBLEFBY0MsQ0FkcUMsS0FBSyxDQUFDLFNBQVMsR0FjcEQ7O0FDeEJEOzs7O0VBSUU7Ozs7OztBQUVGLHFDQUFxQztBQUNyQyw4Q0FBOEM7QUFDOUMsaURBQWlEO0FBQ2pEO0lBQXdDLDZDQUF5QjtJQUc3RCxtQ0FBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUN6QixDQUFDO0lBQ0QsNkRBQXlCLEdBQXpCLFVBQTBCLFNBQWM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztJQUM3QixDQUFDO0lBQ0QsMENBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcscUJBQUMsRUFBRSxRQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3ZELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RDLElBQUksR0FBRyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBQyxFQUFFLElBQUMsR0FBRyxFQUFFLEdBQUksR0FBRSxNQUFNLENBQUMsSUFBSyxDQUFLLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBQ0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDNUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBQyw0QkFBNEIsR0FBQyxHQUFHLEVBQUUsR0FBSSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFDLEdBQUcsRUFBRSxHQUFJLEVBQUcsQ0FBQyxDQUFDO1FBQzdGLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FDSCxxQkFBQyxLQUFLLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSyxHQUM1QixxQkFBQyxLQUFLLFNBQ0YscUJBQUMsRUFBRSxTQUNFLE9BQVEsRUFDUixPQUFRLENBQ1IsQ0FDRCxFQUNSLHFCQUFDLEtBQUssU0FDRCxJQUFLLENBQ0YsQ0FDTCxDQUNWLENBQUM7SUFDTixDQUFDO0lBQ0wsZ0NBQUM7QUFBRCxDQTFDQSxBQTBDQyxDQTFDdUMsS0FBSyxDQUFDLFNBQVMsR0EwQ3REO0FBRUQ7SUFBMkMsZ0RBQXlCO0lBR2hFLHNDQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELHFEQUFjLEdBQWQsVUFBZSxLQUFLO1FBQ2hCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDRCxnRUFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO0lBQzdCLENBQUM7SUFDRCw2Q0FBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMzQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxxQkFBQyxFQUFFLFNBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUssR0FBRyxJQUFJLENBQUM7UUFDdEUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLEdBQUcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDL0MsSUFBSSxFQUFFLEdBQUcscUJBQUMsRUFBRSxJQUFDLEdBQUcsRUFBRSxHQUFJLEdBQUMscUJBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBTSxFQUFDLE9BQU8sRUFBRSxTQUFVLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEVBQUUsQ0FBSyxDQUFDO1lBQ25KLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDakIsQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLHFCQUFDLEVBQUUsU0FBRSxPQUFRLEVBQUMsR0FBSSxDQUFLLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0wsbUNBQUM7QUFBRCxDQTlCQSxBQThCQyxDQTlCMEMsS0FBSyxDQUFDLFNBQVMsR0E4QnpEOztBQ25GRDs7OztFQUlFOzs7Ozs7QUFFRixxQ0FBcUM7QUFDckMsc0RBQXNEO0FBQ3RELGlEQUFpRDtBQUNqRDtJQUFnRCxxREFBeUI7SUFLckUsMkNBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELHFFQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNPLHlEQUFhLEdBQXJCLFVBQXNCLFNBQWM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDO1FBQ25DLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxrREFBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxJQUFJLEdBQUcsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELElBQUksV0FBVyxHQUFHLFFBQVEsR0FBRyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDekQsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBQyxFQUFFLElBQUMsR0FBRyxFQUFFLEdBQUksRUFBQyxLQUFLLEVBQUUsV0FBWSxHQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBRyxDQUFLLENBQUMsQ0FBQztRQUNqRyxDQUFDO1FBQ0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDNUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksR0FBRyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBQyxvQ0FBb0MsR0FBQyxHQUFHLEVBQUUsR0FBSSxFQUFDLEdBQUcsRUFBRSxHQUFJLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFJLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFRLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFRLEVBQUcsQ0FBQyxDQUFDO1FBQ3pJLENBQUM7UUFDRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQyxHQUFHLEVBQUUsQ0FBQztRQUM1RSxNQUFNLENBQUMsQ0FDSCxxQkFBQyxHQUFHLElBQUUsS0FBSyxFQUFFLFFBQVMsR0FDbEIscUJBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUssR0FDNUIscUJBQUMsS0FBSyxTQUNGLHFCQUFDLEVBQUUsU0FDQyxxQkFBQyxFQUFFLFFBQU0sRUFDUixPQUFRLENBQ1IsQ0FDRCxFQUNSLHFCQUFDLEtBQUssU0FDRCxJQUFLLENBQ0YsQ0FDSixDQUNOLENBQ1QsQ0FBQztJQUNOLENBQUM7SUFDTCx3Q0FBQztBQUFELENBcERBLEFBb0RDLENBcEQrQyxLQUFLLENBQUMsU0FBUyxHQW9EOUQ7QUFFRDtJQUFtRCx3REFBeUI7SUFLeEUsOENBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELHdFQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNPLDREQUFhLEdBQXJCLFVBQXNCLFNBQWM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxxREFBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzdDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksTUFBTSxHQUFHLG9CQUFDLHlCQUF5QixHQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBUSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBUSxFQUFHLENBQUE7WUFDN0csSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFDLEVBQUUsSUFBQyxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUUsR0FBRSxNQUFPLEVBQUMsTUFBTyxDQUFLLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMscUJBQUMsRUFBRSxTQUFDLHFCQUFDLEVBQUUsU0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBSyxFQUFDLEdBQUksQ0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNTLDJEQUFZLEdBQXRCLFVBQXVCLElBQStCO1FBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0wsMkNBQUM7QUFBRCxDQWhDQSxBQWdDQyxDQWhDa0QsS0FBSyxDQUFDLFNBQVMsR0FnQ2pFOztBQy9GRDs7OztFQUlFOzs7Ozs7QUFFRixxQ0FBcUM7QUFDckMscURBQXFEO0FBQ3JELDBDQUEwQztBQUMxQyxpREFBaUQ7QUFDakQ7SUFBK0Msb0RBQXlCO0lBS3BFLDBDQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDRCxvRUFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDTyx3REFBYSxHQUFyQixVQUFzQixTQUFjO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixHQUFHO1lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFDRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBQ0QsOERBQW1CLEdBQW5CLFVBQW9CLEtBQUs7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBQ0QsaURBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsSUFBSSxHQUFHLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUN2QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRCxJQUFJLFdBQVcsR0FBRyxRQUFRLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ3pELE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQUMsRUFBRSxJQUFDLEdBQUcsRUFBRSxHQUFJLEVBQUMsS0FBSyxFQUFFLFdBQVksR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUcsQ0FBSyxDQUFDLENBQUM7UUFDakcsQ0FBQztRQUNELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQzVDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFDLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQUMsbUNBQW1DLEdBQUMsR0FBRyxFQUFFLEdBQUksRUFBQyxHQUFHLEVBQUUsR0FBSSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUyxFQUFDLEtBQUssRUFBRSxDQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFJLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFRLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFRLEVBQUcsQ0FBQyxDQUFDO1FBQzNLLENBQUM7UUFDRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUM3RSxNQUFNLENBQUMsQ0FDSCxxQkFBQyxHQUFHLFNBQ0EscUJBQUMsR0FBRyxJQUFFLEtBQUssRUFBRSxRQUFTLEdBQ2xCLHFCQUFDLEtBQUssSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFLLEdBQzVCLHFCQUFDLEtBQUssU0FDRixxQkFBQyxFQUFFLFNBQ0UsT0FBUSxFQUNULHFCQUFDLEVBQUUsUUFBTSxDQUNQLENBQ0YsRUFDUixxQkFBQyxLQUFLLFNBQ0QsSUFBSyxDQUNGLENBQ0osQ0FDTixFQUNMLElBQUksQ0FBQyxrQkFBa0IsRUFBSSxDQUMxQixDQUNULENBQUM7SUFDTixDQUFDO0lBQ1MsNkRBQWtCLEdBQTVCO1FBQ0ksTUFBTSxDQUFDLHFCQUFDLEtBQUssSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFPLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLG1CQUFvQixFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVcsRUFBRyxDQUFDO0lBQ25JLENBQUM7SUFDTCx1Q0FBQztBQUFELENBcEVBLEFBb0VDLENBcEU4QyxLQUFLLENBQUMsU0FBUyxHQW9FN0Q7QUFFRDtJQUFrRCx1REFBeUI7SUFPdkUsNkNBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELHVFQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNPLDJEQUFhLEdBQXJCLFVBQXNCLFNBQWM7UUFDaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUNELG9FQUFzQixHQUF0QixVQUF1QixLQUFLO1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBQ0Qsb0RBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLE1BQU0sR0FBRyxvQkFBQyx5QkFBeUIsR0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVMsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQVEsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQVEsRUFBRyxDQUFBO1lBQzdHLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBQyxFQUFFLElBQUMsR0FBRyxFQUFFLEtBQUssR0FBRyxDQUFFLEdBQUUsTUFBTyxFQUFDLE1BQU8sQ0FBSyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2QyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFDLEVBQUUsSUFBQyxHQUFHLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFFLEdBQUUsWUFBYSxDQUFLLENBQUMsQ0FBQztRQUMxRSxNQUFNLENBQUMsQ0FBQyxxQkFBQyxFQUFFLFNBQUUsR0FBSSxDQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ1MsNERBQWMsR0FBeEIsVUFBeUIsSUFBK0I7UUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFDUywwREFBWSxHQUF0QjtRQUNJLE1BQU0sQ0FBQyxxQkFBQyxLQUFLLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTyxFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxzQkFBdUIsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFjLEVBQUcsQ0FBQztJQUN6SSxDQUFDO0lBQ0wsMENBQUM7QUFBRCxDQTdDQSxBQTZDQyxDQTdDaUQsS0FBSyxDQUFDLFNBQVMsR0E2Q2hFOztBQzdIRDs7OztFQUlFOzs7Ozs7QUFFRixxQ0FBcUM7QUFDckMsb0RBQW9EO0FBQ3BELGlEQUFpRDtBQUNqRDtJQUE4QyxtREFBeUI7SUFHbkUseUNBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDekIsQ0FBQztJQUNELG1FQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7SUFDN0IsQ0FBQztJQUNELGdEQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDeEMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQ0gscUJBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUssR0FDNUIscUJBQUMsS0FBSyxTQUNMLElBQUssQ0FDRSxDQUNKLENBQ1gsQ0FBQztJQUNOLENBQUM7SUFDUyxtREFBUyxHQUFuQixVQUFvQixHQUFXLEVBQUUsS0FBMEM7UUFDdkUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEdBQUcsQ0FBQyxJQUFJLENBQUMscUJBQUMsRUFBRSxJQUFDLEdBQUcsRUFBRSxPQUFPLEdBQUcsQ0FBRSxHQUFDLHFCQUFDLElBQUksSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFVLEdBQUUsSUFBSSxDQUFDLEtBQU0sQ0FBTyxDQUFLLENBQUMsQ0FBQztZQUM5RixHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFDLEVBQUUsSUFBQyxHQUFHLEVBQUUsT0FBTyxHQUFHLENBQUUsR0FBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBRSxDQUFLLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBQ0QsTUFBTSxDQUFDLHFCQUFDLEVBQUUsSUFBQyxHQUFHLEVBQUUsR0FBSSxHQUFFLEdBQUksQ0FBSyxDQUFDO0lBQ3BDLENBQUM7SUFDUyxvREFBVSxHQUFwQixVQUFxQixJQUFrQztRQUNuRCxNQUFNLENBQUMsb0JBQUMsbUNBQW1DLEdBQUMsSUFBSSxFQUFFLElBQUssRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUksRUFBRyxDQUFDO0lBQzlFLENBQUM7SUFDTCxzQ0FBQztBQUFELENBdkNBLEFBdUNDLENBdkM2QyxLQUFLLENBQUMsU0FBUyxHQXVDNUQ7QUFFRDtJQUFrRCx1REFBeUI7SUFHdkUsNkNBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELDREQUFjLEdBQWQsVUFBZSxLQUFLO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFDRCx1RUFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO0lBQzdCLENBQUM7SUFDRCxvREFBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUM1QixJQUFJLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxxQkFBQyxLQUFLLElBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBVSxFQUFDLEtBQUssRUFBRSxLQUFNLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFNLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEVBQUcsQ0FBQyxDQUFDO0lBQ3pJLENBQUM7SUFDRCxzQkFBYyw4REFBYTthQUEzQixjQUF3QyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDeEQsMENBQUM7QUFBRCxDQXhCQSxBQXdCQyxDQXhCaUQsS0FBSyxDQUFDLFNBQVMsR0F3QmhFOztBQzFFRDs7OztFQUlFOzs7Ozs7QUFFRixxQ0FBcUM7QUFDckMsa0RBQWtEO0FBQ2xELGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFDakQ7SUFBNEMsaURBQXlCO0lBSWpFLHVDQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixHQUFHO1lBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUE7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxpRUFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDRCxzREFBYyxHQUFkLFVBQWUsS0FBSztRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN6QyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsOENBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQ0gscUJBQUMsSUFBSSxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUssR0FDOUIsSUFBSSxDQUFDLFFBQVEsRUFBSSxDQUNYLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBQ1MsZ0RBQVEsR0FBbEI7UUFDSSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzNELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDRCxzQkFBYyxvREFBUzthQUF2QixjQUFpQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN4RCxrREFBVSxHQUFsQixVQUFtQixHQUFXLEVBQUUsSUFBc0I7UUFDbEQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUN2RixJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUM5RCxJQUFJLFFBQVEsR0FBRyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ1osUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsRCxJQUFJLFNBQVMsR0FBRyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDeEcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFDUyxtREFBVyxHQUFyQixVQUFzQixHQUFXLEVBQUUsSUFBc0IsRUFBRSxTQUFrQixFQUFFLFFBQWEsRUFBRSxTQUFzQjtRQUNoSCxNQUFNLENBQUMsQ0FBQyxxQkFBQyxHQUFHLElBQUMsR0FBRyxFQUFFLEdBQUksRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFLLEVBQUMsS0FBSyxFQUFFLFFBQVMsR0FDekQscUJBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUssR0FDNUIscUJBQUMsS0FBSyxJQUFDLElBQUksRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQU0sRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWUsRUFBRyxFQUM3RixxQkFBQyxJQUFJLElBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFVLEdBQUUsSUFBSSxDQUFDLElBQUssQ0FBTyxDQUN2QyxFQUNYLFNBQVUsQ0FDVCxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNTLG1EQUFXLEdBQXJCO1FBQ0ksTUFBTSxDQUFDLENBQUMscUJBQUMsR0FBRyxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQU0sR0FBQyxvQkFBQyw4QkFBOEIsR0FBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVMsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQVEsRUFBRyxDQUFNLENBQUMsQ0FBQztJQUNuSSxDQUFDO0lBQ0wsb0NBQUM7QUFBRCxDQW5FQSxBQW1FQyxDQW5FMkMsS0FBSyxDQUFDLFNBQVMsR0FtRTFEOztBQzdFRDs7OztFQUlFOzs7Ozs7QUFFRixxQ0FBcUM7QUFDckMsNENBQTRDO0FBQzVDLGlEQUFpRDtBQUNqRDtJQUFzQywyQ0FBeUI7SUFHM0QsaUNBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNELGdEQUFjLEdBQWQsVUFBZSxLQUFLO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCwyREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO0lBQzdCLENBQUM7SUFDRCx3Q0FBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQyxNQUFNLENBQUMsQ0FDSCxxQkFBQyxLQUFLLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFJLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFNLEVBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFlLEVBQUcsQ0FDeEcsQ0FBQztJQUNOLENBQUM7SUFDTCw4QkFBQztBQUFELENBeEJBLEFBd0JDLENBeEJxQyxLQUFLLENBQUMsU0FBUyxHQXdCcEQ7O0FDakNEOzs7O0VBSUU7Ozs7OztBQUVGLHFDQUFxQztBQUVyQztJQUErQixvQ0FBa0I7SUFFN0MsMEJBQVksT0FBbUI7UUFBbkIsdUJBQW1CLEdBQW5CLGNBQW1CO1FBQzNCLGtCQUFNLE9BQU8sQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFDTSxpQ0FBTSxHQUFiO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7SUFDTCxDQUFDO0lBQ00sbUNBQVEsR0FBZixVQUFnQixHQUFRLEVBQUUsSUFBUztRQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ1Msa0RBQXVCLEdBQWpDO1FBQ0ksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFDUyxxREFBMEIsR0FBcEM7UUFDSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUNMLHVCQUFDO0FBQUQsQ0FuQkEsQUFtQkMsQ0FuQjhCLE1BQU0sQ0FBQyxXQUFXLEdBbUJoRDs7QUMzQkQ7Ozs7RUFJRTs7Ozs7O0FBRUY7SUFBb0MseUNBQXlCO0lBR3pELCtCQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBQ0QseURBQXlCLEdBQXpCLFVBQTBCLFNBQWM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztJQUM3QixDQUFDO0lBQ0QsK0NBQWUsR0FBZixVQUFnQixLQUFLO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUNELCtDQUFlLEdBQWYsVUFBZ0IsS0FBSztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFDRCxtREFBbUIsR0FBbkIsVUFBb0IsS0FBSztRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUNELHNDQUFNLEdBQU47UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMvSSxJQUFJLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDOUksSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pKLE1BQU0sQ0FBQyxDQUNILHFCQUFDLEdBQUcsSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFPLEdBQzNCLFVBQVcsRUFDWCxVQUFXLEVBQ1gsY0FBZSxDQUNWLENBQ2IsQ0FBQztJQUNOLENBQUM7SUFDUyw0Q0FBWSxHQUF0QixVQUF1QixLQUFVLEVBQUUsSUFBWSxFQUFFLFlBQW9CO1FBQ2pFLElBQUksS0FBSyxHQUFHLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ25DLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLFlBQVksR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNyRixNQUFNLENBQUMscUJBQUMsS0FBSyxJQUFDLFNBQVMsRUFBRSxTQUFVLEVBQUMsS0FBSyxFQUFFLEtBQU0sRUFBQyxJQUFJLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxLQUFNLEVBQUMsS0FBSyxFQUFFLElBQUssRUFBRyxDQUFDO0lBQ3BHLENBQUM7SUFDTCw0QkFBQztBQUFELENBMUNBLEFBMENDLENBMUNtQyxLQUFLLENBQUMsU0FBUyxHQTBDbEQ7O0FDaEREOzs7O0VBSUU7Ozs7OztBQUVGLGlEQUFpRDtBQUNqRCxxQ0FBcUM7QUFDckMsNkNBQTZDO0FBQzdDLHNDQUFzQztBQUN0QywwQ0FBMEM7QUFDMUMsa0RBQWtEO0FBRWxEO0lBQThCLG1DQUF5QjtJQUduRCx5QkFBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQUMsTUFBTSwwREFBMEQsQ0FBQztRQUNoRixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDRCxtREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxnQ0FBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNwRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUNTLHlDQUFlLEdBQXpCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLHlDQUFlLEdBQXpCO1FBQ0ksSUFBSSxTQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO1FBQzlELE1BQU0sQ0FBQyxDQUFDLHFCQUFDLEdBQUcsSUFBQyx1QkFBdUIsRUFBRSxTQUFVLEVBQUcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFDUyx1Q0FBYSxHQUF2QjtRQUNJLElBQUksU0FBUyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUM1RCxNQUFNLENBQUMsQ0FBQyxxQkFBQyxHQUFHLElBQUMsdUJBQXVCLEVBQUUsU0FBVSxFQUFHLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ1Msc0NBQVksR0FBdEI7UUFDSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25GLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDckUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzFGLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNqRyxJQUFJLE9BQU8sR0FBRyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2xHLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNmLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQ0gscUJBQUMsR0FBRyxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUssR0FDekIsS0FBTSxFQUNQLHFCQUFDLEdBQUcsSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFLLEdBQ3pCLFdBQVksRUFDWixXQUFZLEVBQ1osY0FBZSxDQUNkLEVBQ0wsT0FBUSxDQUNQLENBQ1QsQ0FBQztJQUNOLENBQUM7SUFDUyxxQ0FBVyxHQUFyQjtRQUNJLE1BQU0sQ0FBQyxxQkFBQyxHQUFHLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTyxHQUFDLHFCQUFDLEVBQUUsU0FBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQU0sQ0FBSyxDQUFNLENBQUM7SUFDL0UsQ0FBQztJQUNTLG9DQUFVLEdBQXBCO1FBQ0ksTUFBTSxDQUFDLG9CQUFDLGVBQWUsR0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFZLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFJLEVBQUMsT0FBTyxFQUFFLElBQUssRUFBRyxDQUFDO0lBQ2pILENBQUM7SUFDUyx3Q0FBYyxHQUF4QixVQUF5QixLQUFjO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNTLDBDQUFnQixHQUExQjtRQUNJLE1BQU0sQ0FBQyxvQkFBQyxxQkFBcUIsR0FBQyxNQUFNLEVBQUksSUFBSSxDQUFDLE1BQU8sRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUksRUFBRSxDQUFDO0lBQzFFLENBQUM7SUFDUywyQ0FBaUIsR0FBM0I7UUFDSSxNQUFNLENBQUMsQ0FBQyxxQkFBQyxJQUFJLFNBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFnQixDQUFPLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRVMsc0NBQVksR0FBdEIsVUFBdUIsUUFBYTtRQUNoQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUNqQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3RELENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7UUFDekMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDaEUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3BELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkUsQ0FBQztRQUVELG9CQUFvQjtRQUNwQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUVwQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN6RSxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFDUyx5Q0FBZSxHQUF6QixVQUEwQixRQUFhO1FBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsR0FBRztZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxJQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLEVBQUUsT0FBTztZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQztnQkFBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xHLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLEVBQUUsT0FBTztZQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN6QyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN6QyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLE9BQU87WUFDM0MsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzdDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDekMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUM1QixPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLE9BQU87WUFDM0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7Z0JBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLElBQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sRUFBRSxPQUFPLElBQU8sRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDO1lBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xKLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sRUFBRSxPQUFPLElBQU8sUUFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sRUFBRSxPQUFPLElBQU8sUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdHLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLE9BQU8sSUFBTyxRQUFRLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0csQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sRUFBRSxPQUFPLElBQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBTSxFQUFFLE9BQU8sSUFBTyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLEVBQUUsT0FBTyxJQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckcsQ0FBQztJQUNMLENBQUM7SUFDUywrQ0FBcUIsR0FBL0IsVUFBZ0MsUUFBNkI7UUFDekQsSUFBSSxTQUFTLEdBQUcscUJBQXFCLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNELHFCQUFxQjtJQUNkLCtDQUFxQixHQUE1QixVQUE2QixRQUE2QjtRQUN0RCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNqSixDQUFDO0lBQ00scUNBQVcsR0FBbEIsVUFBbUIsR0FBVyxFQUFFLFNBQWlCO1FBQzdDLE1BQU0sQ0FBQyxxQkFBQyxHQUFHLElBQUMsR0FBRyxFQUFFLEdBQUksRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSyxHQUFFLFNBQVUsQ0FBTSxDQUFDO0lBQzVFLENBQUM7SUFDTSwrQ0FBcUIsR0FBNUIsY0FBeUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLHNCQUFDO0FBQUQsQ0ExSkEsQUEwSkMsQ0ExSjZCLEtBQUssQ0FBQyxTQUFTLEdBMEo1Qzs7QUN2S0Q7Ozs7RUFJRTs7Ozs7O0FBRUYsaURBQWlEO0FBQ2pELHFDQUFxQztBQUVyQztJQUFzQywyQ0FBeUI7SUFJM0QsaUNBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFDRCwyREFBeUIsR0FBekIsVUFBMEIsU0FBYztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBQ0Qsc0JBQWMsNkNBQVE7YUFBdEIsY0FBbUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN0RSxzQkFBYyxpREFBWTthQUExQixjQUF1QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM3RSw4QkFBQztBQUFELENBakJBLEFBaUJDLENBakJxQyxLQUFLLENBQUMsU0FBUyxHQWlCcEQ7O0FDMUJEOzs7O0VBSUU7Ozs7OztBQUVGLHdDQUF3QztBQUN4QyxpREFBaUQ7QUFDakQsb0RBQW9EO0FBQ3BEO0lBQXdDLDZDQUF5QjtJQUk3RCxtQ0FBWSxLQUFVO1FBQ2xCLGtCQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0Qsa0RBQWMsR0FBZCxVQUFlLEtBQUs7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNELDZEQUF5QixHQUF6QixVQUEwQixTQUFjO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDO0lBQ3JDLENBQUM7SUFDRCwwQ0FBTSxHQUFOO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlELElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ3pFLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1lBQ2xILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDcEcsQ0FBQztRQUNELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDakUsTUFBTSxDQUFDLENBQ0gscUJBQUMsR0FBRyxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUssR0FBQyxXQUFXLEdBQUMsU0FBUyxHQUMvQyxNQUFPLEVBQ1AsT0FBUSxDQUNQLENBQ1QsQ0FBQztJQUNOLENBQUM7SUFDUyw4Q0FBVSxHQUFwQixVQUFxQixHQUFXLEVBQUUsSUFBc0IsRUFBRSxPQUFlLEVBQUUsT0FBZTtRQUN0RixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2xELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUFDLFNBQVMsSUFBSSxTQUFTLENBQUM7UUFDdEMsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLHFCQUFDLElBQUksU0FBRSxPQUFRLENBQU8sR0FBRyxJQUFJLENBQUM7UUFDbEQsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLHFCQUFDLElBQUksU0FBRSxPQUFRLENBQU8sR0FBRyxJQUFJLENBQUM7UUFDbEQsTUFBTSxDQUFDLHFCQUFDLEtBQUssSUFBQyxHQUFHLEVBQUUsR0FBSSxFQUFDLFNBQVMsRUFBRSxTQUFVLEdBQ3pDLHFCQUFDLEtBQUssSUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUssRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQU0sRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQU0sRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWUsRUFBRyxFQUM3SSxHQUFJLEVBQ0wscUJBQUMsSUFBSSxTQUFFLElBQUksQ0FBQyxJQUFLLENBQU8sRUFDdkIsR0FBSSxDQUNHLENBQUM7SUFDakIsQ0FBQztJQUNTLCtDQUFXLEdBQXJCO1FBQ0ksTUFBTSxDQUFDLENBQUMscUJBQUMsR0FBRyxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQU0sR0FBQyxvQkFBQyw4QkFBOEIsR0FBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVMsRUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQVEsRUFBRyxDQUFNLENBQUMsQ0FBQztJQUNuSSxDQUFDO0lBQ0wsZ0NBQUM7QUFBRCxDQXBEQSxBQW9EQyxDQXBEdUMsS0FBSyxDQUFDLFNBQVMsR0FvRHREOztBQzdERDs7OztFQUlFOzs7Ozs7QUFFRixvREFBb0Q7QUFDcEQsd0NBQXdDO0FBQ3hDLG1EQUFtRDtBQUVuRDtJQUFrQyx1Q0FBdUI7SUFDckQsNkJBQVksS0FBVTtRQUNsQixrQkFBTSxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBQ0Qsb0NBQU0sR0FBTjtRQUNJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQztRQUMvRSxJQUFJLGFBQWEsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxDQUFDLHFCQUFDLEdBQUcsSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFTLEVBQUMsS0FBSyxFQUFFLEtBQU0sR0FDcEQscUJBQUMsR0FBRyxJQUFDLEtBQUssRUFBRSxhQUFjLEVBQUMsU0FBUyxFQUFDLGNBQWMsRUFBQyxJQUFJLEVBQUMsYUFBYSxHQUFDLGFBQWEsR0FBQyxHQUFHLEdBQUMsYUFBYSxHQUFDLEtBQUssR0FDeEcscUJBQUMsSUFBSSxTQUFFLElBQUksQ0FBQyxZQUFhLENBQU8sQ0FDOUIsQ0FDSixDQUFDLENBQUM7SUFDWixDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQWJBLEFBYUMsQ0FiaUMsdUJBQXVCLEdBYXhEOztBQ3ZCRDs7OztFQUlFOzs7Ozs7QUFFRixvREFBb0Q7QUFDcEQsd0NBQXdDO0FBQ3hDLDJDQUEyQztBQUMzQyx5REFBeUQ7QUFDekQseURBQXlEO0FBRXpEO0lBQTBCLCtCQUFlO0lBQ3JDLHFCQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUNNLGlDQUFXLEdBQWxCLFVBQW1CLEdBQVcsRUFBRSxTQUFpQjtRQUM3QyxNQUFNLENBQUMscUJBQUMsR0FBRyxJQUFFLEdBQUcsRUFBRSxHQUFJLEdBQ2QscUJBQUMsSUFBSSxJQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFLLEdBQUMsV0FBVyxHQUFDLE1BQU0sRUFBUSxFQUNoRSxxQkFBQyxJQUFJLGNBQUcsU0FBVSxDQUFPLENBQ3ZCLENBQUE7SUFDZCxDQUFDO0lBQ1Msb0NBQWMsR0FBeEIsVUFBeUIsS0FBYztRQUNuQyxNQUFNLENBQUMsb0JBQUMsbUJBQW1CLEdBQUMsTUFBTSxFQUFJLElBQUksQ0FBQyxNQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFJLEVBQUMsS0FBSyxFQUFJLEtBQU0sRUFBRyxDQUFDO0lBQ3pGLENBQUM7SUFDUyxxQ0FBZSxHQUF6QixjQUFtQyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUMzRSxrQkFBQztBQUFELENBZEEsQUFjQyxDQWR5QixlQUFlLEdBY3hDOztBQzFCRDs7OztFQUlFOzs7Ozs7QUFFRixvREFBb0Q7QUFDcEQsaURBQWlEO0FBRWpEO0lBQWdDLHFDQUFXO0lBRXZDLDJCQUFZLEtBQVU7UUFDbEIsa0JBQU0sS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQ0QsNENBQWdCLEdBQWhCLFVBQWlCLEtBQUs7UUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0Qsa0NBQU0sR0FBTjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNuQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUMxRCxJQUFJLEtBQUssR0FBRyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDaEUsTUFBTSxDQUFDLHFCQUFDLEdBQUcsSUFBQyxTQUFTLEVBQUMsZUFBZSxFQUFDLEtBQUssRUFBRSxLQUFNLEdBQzlDLE1BQU8sRUFDUCxJQUFLLENBQ0EsQ0FBQztJQUVmLENBQUM7SUFDUyx3Q0FBWSxHQUF0QjtRQUNJLElBQUksTUFBTSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQy9CLElBQUksVUFBVSxHQUFHLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQzFDLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLHdCQUF3QixHQUFHLHNCQUFzQixDQUFDO1FBQzdGLGNBQWMsR0FBRyx1QkFBdUIsR0FBRyxjQUFjLENBQUM7UUFDMUQsTUFBTSxDQUFDLHFCQUFDLEdBQUcsSUFBQyxTQUFTLEVBQUMsMEJBQTBCLEdBQzVDLHFCQUFDLENBQUMsSUFBQyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWlCLEVBQUMsS0FBSyxFQUFFLE1BQU8sR0FDdEQscUJBQUMsSUFBSSxJQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUMsS0FBSyxFQUFFLFVBQVcsR0FBRSxJQUFJLENBQUMsS0FBTSxDQUFPLEVBQ2xFLHFCQUFDLElBQUksSUFBQyxTQUFTLEVBQUUsY0FBZSxHQUFDLFdBQVcsR0FBQyxNQUFNLEVBQVEsQ0FDM0QsQ0FDRixDQUFDO0lBQ1gsQ0FBQztJQUNTLHNDQUFVLEdBQXBCO1FBQ0ksTUFBTSxDQUFDLHFCQUFDLEdBQUcsSUFBQyxLQUFLLEVBQUMsWUFBWSxHQUM3QixJQUFJLENBQUMsWUFBWSxFQUFJLENBQ1osQ0FBQTtJQUNkLENBQUM7SUFDUyx3Q0FBWSxHQUF0QixVQUF1QixRQUFhO1FBQ2hDLGdCQUFLLENBQUMsWUFBWSxZQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pFLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNuRSxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDdEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQXFCO1lBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCx3QkFBQztBQUFELENBakRBLEFBaURDLENBakQrQixXQUFXLEdBaUQxQyIsImZpbGUiOiJzdXJ2ZXkucmVhY3QuYm9vdHN0cmFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbiAgICBtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSGFzaFRhYmxlPFQ+IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBUO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5RGF0YSB7XHJcbiAgICAgICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSk7XHJcbiAgICAgICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5IGV4dGVuZHMgSVN1cnZleURhdGEge1xyXG4gICAgICAgIGN1cnJlbnRQYWdlOiBJUGFnZTtcclxuICAgICAgICBwYWdlVmlzaWJpbGl0eUNoYW5nZWQocGFnZTogSVBhZ2UsIG5ld1ZhbHVlOiBib29sZWFuKTtcclxuICAgICAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKTtcclxuICAgICAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpO1xyXG4gICAgICAgIHF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogSVF1ZXN0aW9uKTtcclxuICAgICAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yO1xyXG4gICAgICAgIHByb2Nlc3NIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZztcclxuICAgICAgICBwcm9jZXNzVGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICAgICAgaXNEZXNpZ25Nb2RlOiBib29sZWFuO1xyXG4gICAgICAgIHJlcXVpcmVkVGV4dDogc3RyaW5nO1xyXG4gICAgICAgIHF1ZXN0aW9uU3RhcnRJbmRleDogc3RyaW5nO1xyXG4gICAgICAgIHF1ZXN0aW9uVGl0bGVUZW1wbGF0ZTogc3RyaW5nO1xyXG4gICAgICAgIHN0b3JlT3RoZXJzQXNDb21tZW50OiBib29sZWFuO1xyXG4gICAgICAgIHVwbG9hZEZpbGUobmFtZTogc3RyaW5nLCBmaWxlOiBGaWxlLCBzdG9yZURhdGFBc1RleHQ6IGJvb2xlYW4sIHVwbG9hZGluZ0NhbGxiYWNrOiAoc3RhdHVzOiBzdHJpbmcpID0+IGFueSk6IGJvb2xlYW47XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgICAgIHJ1bkNvbmRpdGlvbih2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVF1ZXN0aW9uIGV4dGVuZHMgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICAgICAgaGFzVGl0bGU6IGJvb2xlYW47XHJcbiAgICAgICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpO1xyXG4gICAgICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgICAgIG9uU3VydmV5TG9hZCgpO1xyXG4gICAgICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCk6IGJvb2xlYW47XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElQYWdlIGV4dGVuZHMgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSXRlbVZhbHVlIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIFNlcGFyYXRvciA9ICd8JztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldERhdGEoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4sIHZhbHVlczogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBpdGVtcy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgSXRlbVZhbHVlKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUudmFsdWUpICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udGV4dCA9IHR5cGVvZiAodmFsdWUuaGFzVGV4dCkgIT09ICd1bmRlZmluZWQnID8gdmFsdWUuaXRlbVRleHQgOiB2YWx1ZVtcInRleHRcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlW1widmFsdWVcIl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaGFzVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgdmFsdWU6IGl0ZW0udmFsdWUsIHRleHQ6IGl0ZW0udGV4dCB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIGl0ZW1UZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgdGV4dDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIml0ZW12YWx1ZVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5pdGVtVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RyOiBzdHJpbmcgPSB0aGlzLml0ZW1WYWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzdHIuaW5kZXhPZihJdGVtVmFsdWUuU2VwYXJhdG9yKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gc3RyLnNsaWNlKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHN0ci5zbGljZShpbmRleCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVGV4dCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXRlbVRleHQgPyB0cnVlIDogZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzVGV4dCkgcmV0dXJuIHRoaXMuaXRlbVRleHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlKSByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KG5ld1RleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1UZXh0ID0gbmV3VGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2Uge1xyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50PFQgZXh0ZW5kcyBGdW5jdGlvbiwgT3B0aW9ucz4gIHtcclxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrczogQXJyYXk8VD47XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5jYWxsYmFja3MgPT0gbnVsbCB8fCB0aGlzLmNhbGxiYWNrcy5sZW5ndGggPT0gMDsgfVxyXG4gICAgICAgIHB1YmxpYyBmaXJlKHNlbmRlcjogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja3MubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbFJlc3VsdCA9IHRoaXMuY2FsbGJhY2tzW2ldKHNlbmRlciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGQoZnVuYzogVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgQXJyYXk8VD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlKGZ1bmM6IFQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jYWxsYmFja3MuaW5kZXhPZihmdW5jLCAwKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgIHByaXZhdGUgdHlwZVZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNmdW5jOiAoKSA9PiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGFzc05hbWVQYXJ0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnR5cGVWYWx1ZSA/IHRoaXMudHlwZVZhbHVlIDogXCJzdHJpbmdcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudHlwZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlR2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uR2V0VmFsdWU7IH0gXHJcbiAgICAgICAgcHVibGljIGlzRGVmYXVsdFZhbHVlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmRlZmF1bHRWYWx1ZSkgPyAodGhpcy5kZWZhdWx0VmFsdWUgPT0gdmFsdWUpIDogISh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRWYWx1ZShvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uR2V0VmFsdWUpIHJldHVybiB0aGlzLm9uR2V0VmFsdWUob2JqKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVG9Vc2VTZXRWYWx1ZSgpIHsgcmV0dXJuIHRoaXMub25TZXRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25TZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNldFZhbHVlKG9iaiwgdmFsdWUsIGpzb25Db252KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0T2JqVHlwZShvYmpUeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsYXNzTmFtZVBhcnQpIHJldHVybiBvYmpUeXBlO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqVHlwZS5yZXBsYWNlKHRoaXMuY2xhc3NOYW1lUGFydCwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY2xhc3NOYW1lUGFydCAmJiBjbGFzc05hbWUuaW5kZXhPZih0aGlzLmNsYXNzTmFtZVBhcnQpIDwgMCkgPyBjbGFzc05hbWUgKyB0aGlzLmNsYXNzTmFtZVBhcnQgOiBjbGFzc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc1ZhbHVlICE9IG51bGwpIHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc2Z1bmMgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc2Z1bmMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRDaG9pY2VzKHZhbHVlOiBBcnJheTxhbnk+LCB2YWx1ZUZ1bmM6ICgpID0+IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzZnVuYyA9IHZhbHVlRnVuYztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgIHN0YXRpYyByZXF1aXJlZFN5bWJvbCA9ICchJztcclxuICAgICAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgICAgICBwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+ID0gbnVsbDtcclxuICAgICAgICByZXF1aXJlZFByb3BlcnRpZXM6IEFycmF5PHN0cmluZz4gPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIHB1YmxpYyBjcmVhdG9yOiAoKSA9PiBhbnkgPSBudWxsLCBwdWJsaWMgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBuZXcgQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5jcmVhdGVQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnR5KHByb3BJbmZvOiBhbnkpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gdHlwZW9mIHByb3BJbmZvID09PSBcInN0cmluZ1wiID8gcHJvcEluZm8gOiBwcm9wSW5mby5uYW1lO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHlUeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHR5cGVJbmRleCA9IHByb3BlcnR5TmFtZS5pbmRleE9mKEpzb25NZXRhZGF0YUNsYXNzLnR5cGVTeW1ib2wpO1xyXG4gICAgICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5VHlwZSA9IHByb3BlcnR5TmFtZS5zdWJzdHJpbmcodHlwZUluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDAsIHR5cGVJbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gdGhpcy5nZXRQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSBuZXcgSnNvbk9iamVjdFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHByb3AudHlwZSA9IHByb3BlcnR5VHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3BJbmZvID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8udHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AudHlwZSA9IHByb3BJbmZvLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8uZGVmYXVsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AuZGVmYXVsdFZhbHVlID0gcHJvcEluZm8uZGVmYXVsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChwcm9wSW5mby5pc1JlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWtlUHJvcGVydHlSZXF1aXJlZChwcm9wLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BJbmZvLmNob2ljZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hvaWNlc0Z1bmMgPSB0eXBlb2YgcHJvcEluZm8uY2hvaWNlcyA9PT0gXCJmdW5jdGlvblwiID8gcHJvcEluZm8uY2hvaWNlcyA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNob2ljZXNWYWx1ZSA9IHR5cGVvZiBwcm9wSW5mby5jaG9pY2VzICE9PSBcImZ1bmN0aW9uXCIgPyBwcm9wSW5mby5jaG9pY2VzIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLnNldENob2ljZXMoY2hvaWNlc1ZhbHVlLCBjaG9pY2VzRnVuYyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8ub25HZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3Aub25HZXRWYWx1ZSA9IHByb3BJbmZvLm9uR2V0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8ub25TZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3Aub25TZXRWYWx1ZSA9IHByb3BJbmZvLm9uU2V0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8uY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5jbGFzc05hbWUgPSBwcm9wSW5mby5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8uYmFzZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AuYmFzZUNsYXNzTmFtZSA9IHByb3BJbmZvLmJhc2VDbGFzc05hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcEluZm8uY2xhc3NOYW1lUGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AuY2xhc3NOYW1lUGFydCA9IHByb3BJbmZvLmNsYXNzTmFtZVBhcnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZS5sZW5ndGggPT0gMCB8fCBwcm9wZXJ0eU5hbWVbMF0gIT0gSnNvbk1ldGFkYXRhQ2xhc3MucmVxdWlyZWRTeW1ib2wpIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zbGljZSgxKTtcclxuICAgICAgICAgICAgdGhpcy5tYWtlUHJvcGVydHlSZXF1aXJlZChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydHlOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NZXRhZGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc2VzOiBIYXNoVGFibGU8SnNvbk1ldGFkYXRhQ2xhc3M+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc1Byb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NSZXF1aXJlZFByb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxzdHJpbmc+PiA9IHt9O1xyXG4gICAgICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHBhcmVudE5hbWU6IHN0cmluZyA9IG51bGwpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gbmV3IEpzb25NZXRhZGF0YUNsYXNzKG5hbWUsIHByb3BlcnRpZXMsIGNyZWF0b3IsIHBhcmVudE5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXNbbmFtZV0gPSBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdLnB1c2gobWV0YURhdGFDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZUNsYXNzQ3JlYXRvcmUobmFtZTogc3RyaW5nLCBjcmVhdG9yOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MpIHtcclxuICAgICAgICAgICAgICAgIG1ldGFEYXRhQ2xhc3MuY3JlYXRvciA9IGNyZWF0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5jbGFzc1Byb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKG5hbWUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1Byb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlQ2xhc3MobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MuY3JlYXRvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW5DbGFzc2VzKG5hbWU6IHN0cmluZywgY2FuQmVDcmVhdGVkOiBib29sZWFuID0gZmFsc2UpOiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFJlcXVpcmVkUHJvcGVydGllcyhuYW1lLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4sIHJlc3VsdDogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+KSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2FuQmVDcmVhdGVkIHx8IGNoaWxkcmVuW2ldLmNyZWF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxDaGlsZHJlbkNsYXNzZXMoY2hpbGRyZW5baV0ubmFtZSwgY2FuQmVDcmVhdGVkLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmluZENsYXNzKG5hbWU6IHN0cmluZyk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaWxsUHJvcGVydGllcyhuYW1lOiBzdHJpbmcsIGxpc3Q6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4pIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eShtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXNbaV0sIGxpc3QsIGxpc3QubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZFByb3BlcnR5KHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHksIGxpc3Q6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGVuZEluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kSW5kZXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RbaV0ubmFtZSA9PSBwcm9wZXJ0eS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gocHJvcGVydHkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W2luZGV4XSA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcsIGxpc3Q6IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobGlzdCwgbWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFJlcXVpcmVkUHJvcGVydGllcyhtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUsIGxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25FcnJvciB7XHJcbiAgICAgICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBhdDogTnVtYmVyID0gLTE7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0RnVsbERlc2NyaXB0aW9uKCkgOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlICsgKHRoaXMuZGVzY3JpcHRpb24gPyBcIlxcblwiICsgdGhpcy5kZXNjcmlwdGlvbiA6IFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uVW5rbm93blByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwidW5rbm93bnByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBpbiBjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicgaXMgdW5rbm93bi5cIik7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJUaGUgbGlzdCBvZiBhdmFpbGFibGUgcHJvcGVydGllcyBhcmU6IFwiO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLCBcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IHByb3BlcnRpZXNbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gJy4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcih0eXBlLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGZvbGxvd2luZyB0eXBlcyBhcmUgYXZhaWxhYmxlOiBcIjtcclxuICAgICAgICAgICAgdmFyIHR5cGVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoYmFzZUNsYXNzTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gMCkgdGhpcy5kZXNjcmlwdGlvbiArPSBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiJ1wiICsgdHlwZXNbaV0ubmFtZSArIFwiJ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NaXNzaW5nVHlwZUVycm9yIGV4dGVuZHMgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoYmFzZUNsYXNzTmFtZSwgXCJtaXNzaW5ndHlwZXByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5IHR5cGUgaXMgbWlzc2luZyBpbiB0aGUgb2JqZWN0LiBQbGVhc2UgdGFrZSBhIGxvb2sgYXQgcHJvcGVydHk6ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25JbmNvcnJlY3RUeXBlRXJyb3IgZXh0ZW5kcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcImluY29ycmVjdHR5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIGluY29ycmVjdCBpbiB0aGUgb2JqZWN0LiBQbGVhc2UgdGFrZSBhIGxvb2sgYXQgcHJvcGVydHk6ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwicmVxdWlyZWRwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaXMgcmVxdWlyZWQgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25PYmplY3Qge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHR5cGVQcm9wZXJ0eU5hbWUgPSBcInR5cGVcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBwb3NpdGlvblByb3BlcnR5TmFtZSA9IFwicG9zXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbWV0YURhdGFWYWx1ZSA9IG5ldyBKc29uTWV0YWRhdGEoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldCBtZXRhRGF0YSgpIHsgcmV0dXJuIEpzb25PYmplY3QubWV0YURhdGFWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBlcnJvcnMgPSBuZXcgQXJyYXk8SnNvbkVycm9yPigpO1xyXG4gICAgICAgIHB1YmxpYyB0b0pzb25PYmplY3Qob2JqOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b0pzb25PYmplY3RDb3JlKG9iaiwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB0b09iamVjdChqc29uT2JqOiBhbnksIG9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChvYmouZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0ganNvbk9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkocHJvcGVydGllcywga2V5KTtcclxuICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5ld0Vycm9yKG5ldyBKc29uVW5rbm93blByb3BlcnR5RXJyb3Ioa2V5LnRvU3RyaW5nKCksIG9iai5nZXRUeXBlKCkpLCBqc29uT2JqKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9PYmooanNvbk9ialtrZXldLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB0b0pzb25PYmplY3RDb3JlKG9iajogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFvYmouZ2V0VHlwZSkgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiAoIXByb3BlcnR5LmNsYXNzTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWVdID0gcHJvcGVydHkuZ2V0T2JqVHlwZShvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb0pzb24ob2JqLCByZXN1bHQsIHByb3BlcnRpZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvSnNvbihvYmo6IGFueSwgcmVzdWx0OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5Lmhhc1RvVXNlR2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gcHJvcGVydHkuZ2V0VmFsdWUob2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUFycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyclZhbHVlID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyVmFsdWUucHVzaCh0aGlzLnRvSnNvbk9iamVjdENvcmUodmFsdWVbaV0sIHByb3BlcnR5KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGFyclZhbHVlLmxlbmd0aCA+IDAgPyBhcnJWYWx1ZSA6IG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkuaXNEZWZhdWx0VmFsdWUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcGVydHkubmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb09iaih2YWx1ZTogYW55LCBvYmo6IGFueSwga2V5OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkuaGFzVG9Vc2VTZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHkuc2V0VmFsdWUob2JqLCB2YWx1ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUFycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvQXJyYXkodmFsdWUsIG9iaiwga2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICBpZiAobmV3T2JqLm5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZSwgbmV3T2JqLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld09iai5uZXdPYmo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFuZXdPYmouZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IudG9TdHJpbmcoKS5pbmRleE9mKFwiQXJyYXlcIikgPiAtMTsgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlTmV3T2JqKHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0geyBuZXdPYmo6IG51bGwsIGVycm9yOiBudWxsIH07XHJcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSB2YWx1ZVtKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNsYXNzTmFtZSAmJiBwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5LmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gcHJvcGVydHkuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmdldENsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICByZXN1bHQubmV3T2JqID0gKGNsYXNzTmFtZSkgPyBKc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKGNsYXNzTmFtZSkgOiBudWxsO1xyXG4gICAgICAgICAgICByZXN1bHQuZXJyb3IgPSB0aGlzLmNoZWNrTmV3T2JqZWN0T25FcnJvcnMocmVzdWx0Lm5ld09iaiwgdmFsdWUsIHByb3BlcnR5LCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrTmV3T2JqZWN0T25FcnJvcnMobmV3T2JqOiBhbnksIHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHksIGNsYXNzTmFtZTogc3RyaW5nKTogSnNvbkVycm9yIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVpcmVkUHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXF1aXJlZFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZVtyZXF1aXJlZFByb3BlcnRpZXNbaV1dKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yKHJlcXVpcmVkUHJvcGVydGllc1tpXSwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmJhc2VDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uTWlzc2luZ1R5cGVFcnJvcihwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uSW5jb3JyZWN0VHlwZUVycm9yKHByb3BlcnR5Lm5hbWUsIHByb3BlcnR5LmJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IoZXJyb3IsIHZhbHVlKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZE5ld0Vycm9yKGVycm9yOiBKc29uRXJyb3IsIGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoanNvbk9iaiAmJiBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5hdCA9IGpzb25PYmpbSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZV0uc3RhcnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdmFsdWVUb0FycmF5KHZhbHVlOiBBcnJheTxhbnk+LCBvYmo6IGFueSwga2V5OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsdWVBcnJheShvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIG9ialtrZXldID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5jcmVhdGVOZXdPYmoodmFsdWVbaV0sIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZS5uZXdPYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZVtpXSwgbmV3VmFsdWUubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKHZhbHVlW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaW5kUHJvcGVydHkocHJvcGVydGllczogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Piwga2V5OiBhbnkpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzW2ldLm5hbWUgPT0ga2V5KSByZXR1cm4gcHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIENob2ljZXNSZXN0ZnVsbCBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHB1YmxpYyB1cmw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHBhdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHZhbHVlTmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgdGl0bGVOYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBnZXRSZXN1bHRDYWxsYmFjazogKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KSA9PiB2b2lkO1xyXG4gICAgICAgIHB1YmxpYyBlcnJvcjogU3VydmV5RXJyb3IgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcnVuKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudXJsIHx8ICF0aGlzLmdldFJlc3VsdENhbGxiYWNrKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCB0aGlzLnVybCk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYub25FcnJvcih4aHIuc3RhdHVzVGV4dCwgeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImNob2ljZXNCeVVybFwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXRoaXMudXJsICYmICF0aGlzLnBhdGggJiYgIXRoaXMudmFsdWVOYW1lICYmICF0aGlzLnRpdGxlTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldERhdGEoanNvbjogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKGpzb24udXJsKSB0aGlzLnVybCA9IGpzb24udXJsO1xyXG4gICAgICAgICAgICBpZiAoanNvbi5wYXRoKSB0aGlzLnBhdGggPSBqc29uLnBhdGg7XHJcbiAgICAgICAgICAgIGlmIChqc29uLnZhbHVlTmFtZSkgdGhpcy52YWx1ZU5hbWUgPSBqc29uLnZhbHVlTmFtZTtcclxuICAgICAgICAgICAgaWYgKGpzb24udGl0bGVOYW1lKSB0aGlzLnRpdGxlTmFtZSA9IGpzb24udGl0bGVOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXJsID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy5wYXRoID0gXCJcIjtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkxvYWQocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZ2V0UmVzdWx0QWZ0ZXJQYXRoKHJlc3VsdCk7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0W1wibGVuZ3RoXCJdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSByZXN1bHRbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdGVtVmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChuZXcgSXRlbVZhbHVlKHZhbHVlLCB0aXRsZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9IG5ldyBDdXN0b21FcnJvcihzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwidXJsR2V0Q2hvaWNlc0Vycm9yXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmdldFJlc3VsdENhbGxiYWNrKGl0ZW1zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvbkVycm9yKHN0YXR1czogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInVybFJlcXVlc3RFcnJvclwiKVtcImZvcm1hdFwiXShzdGF0dXMsIHJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVzdWx0Q2FsbGJhY2soW10pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFJlc3VsdEFmdGVyUGF0aChyZXN1bHQ6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnBhdGgpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIHZhciBwYXRoZXMgPSB0aGlzLmdldFBhdGhlcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3BhdGhlc1tpXV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRQYXRoZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciBwYXRoZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGF0aC5pbmRleE9mKCc7JykgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcGF0aGVzID0gdGhpcy5wYXRoLnNwbGl0KCc7Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYXRoZXMgPSB0aGlzLnBhdGguc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGF0aGVzLmxlbmd0aCA9PSAwKSBwYXRoZXMucHVzaCh0aGlzLnBhdGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aGVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFZhbHVlKGl0ZW06IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlTmFtZSkgcmV0dXJuIGl0ZW1bdGhpcy52YWx1ZU5hbWVdO1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gT2JqZWN0LmtleXMoaXRlbSkubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAobGVuIDwgMSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtW09iamVjdC5rZXlzKGl0ZW0pWzBdXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRUaXRsZShpdGVtOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudGl0bGVOYW1lKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bdGhpcy50aXRsZU5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjaG9pY2VzQnlVcmxcIiwgW1widXJsXCIsIFwicGF0aFwiLCBcInZhbHVlTmFtZVwiLCBcInRpdGxlTmFtZVwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IENob2ljZXNSZXN0ZnVsbCgpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJjb25kaXRpb25zLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ29uZGl0aW9uc1BhcnNlciB7XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSByb290OiBDb25kaXRpb25Ob2RlO1xyXG4gICAgICAgIHByaXZhdGUgZXhwcmVzc2lvbk5vZGVzOiBBcnJheTxDb25kaXRpb25Ob2RlPjtcclxuICAgICAgICBwcml2YXRlIG5vZGU6IENvbmRpdGlvbk5vZGU7XHJcbiAgICAgICAgcHJpdmF0ZSBhdDogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICAgICAgcHVibGljIHBhcnNlKHRleHQ6IHN0cmluZywgcm9vdDogQ29uZGl0aW9uTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgICAgICB0aGlzLnJvb3QuY2xlYXIoKTtcclxuICAgICAgICAgICAgdGhpcy5hdCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy50ZXh0Lmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMucGFyc2VUZXh0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB0b1N0cmluZyhyb290OiBDb25kaXRpb25Ob2RlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZVRvU3RyaW5nKHJvb3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHRvU3RyaW5nQ29yZSh2YWx1ZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZVtcImNoaWxkcmVuXCJdKSByZXR1cm4gdGhpcy5ub2RlVG9TdHJpbmcodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVbXCJsZWZ0XCJdKSByZXR1cm4gdGhpcy5jb25kaXRpb25Ub1N0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5vZGVUb1N0cmluZyhub2RlOiBDb25kaXRpb25Ob2RlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKG5vZGUuaXNFbXB0eSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSBcIlwiO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBub2RlVGV4dCA9IHRoaXMudG9TdHJpbmdDb3JlKG5vZGUuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGVUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcykgcmVzICs9ICcgJyArIG5vZGUuY29ubmVjdGl2ZSArICcgJztcclxuICAgICAgICAgICAgICAgICAgICByZXMgKz0gbm9kZVRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG5vZGUgIT0gdGhpcy5yb290ICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzID0gJygnICsgcmVzICsgJyknO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY29uZGl0aW9uVG9TdHJpbmcoY29uZGl0aW9uOiBDb25kaXRpb24pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIWNvbmRpdGlvbi5yaWdodCB8fCAhY29uZGl0aW9uLm9wZXJhdG9yKSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBjb25kaXRpb24ubGVmdDtcclxuICAgICAgICAgICAgaWYgKGxlZnQgJiYgIXRoaXMuaXNOdW1lcmljKGxlZnQpKSBsZWZ0ID0gXCInXCIgKyBsZWZ0ICsgXCInXCI7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSBsZWZ0ICsgJyAnICsgdGhpcy5vcGVyYXRpb25Ub1N0cmluZyhjb25kaXRpb24ub3BlcmF0b3IpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc05vUmlnaHRPcGVyYXRpb24oY29uZGl0aW9uLm9wZXJhdG9yKSkgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gY29uZGl0aW9uLnJpZ2h0O1xyXG4gICAgICAgICAgICBpZiAocmlnaHQgJiYgIXRoaXMuaXNOdW1lcmljKHJpZ2h0KSkgcmlnaHQgPSBcIidcIiArIHJpZ2h0ICsgXCInXCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMgKyAnICcgKyByaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcGVyYXRpb25Ub1N0cmluZyhvcDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKG9wID09IFwiZXF1YWxcIikgcmV0dXJuIFwiPVwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gXCJub3RlcXVhbFwiKSByZXR1cm4gXCIhPVwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gXCJncmVhdGVyXCIpIHJldHVybiBcIj5cIjtcclxuICAgICAgICAgICAgaWYgKG9wID09IFwibGVzc1wiKSByZXR1cm4gXCI8XCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSBcImdyZWF0ZXJvcmVxdWFsXCIpIHJldHVybiBcIj49XCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSBcImxlc3NvcmVxdWFsXCIpIHJldHVybiBcIjw9XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc051bWVyaWModmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc05hTih2YWwpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiBpc0Zpbml0ZSh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHBhcnNlVGV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlID0gdGhpcy5yb290O1xyXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25Ob2RlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmV4cHJlc3Npb25Ob2Rlcy5wdXNoKHRoaXMubm9kZSk7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnJlYWRDb25kaXRpb25zKCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMgJiYgdGhpcy5hdCA+PSB0aGlzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkQ29uZGl0aW9ucygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMucmVhZENvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICBpZiAoIXJlcykgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgdmFyIGNvbm5lY3RpdmUgPSB0aGlzLnJlYWRDb25uZWN0aXZlKCk7XHJcbiAgICAgICAgICAgIGlmIChjb25uZWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENvbm5lY3RpdmUoY29ubmVjdGl2ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkQ29uZGl0aW9ucygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJlYWRDb25kaXRpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZWFkRXhwcmVzc2lvbigpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlmICghbGVmdCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgb3AgPSB0aGlzLnJlYWRPcGVyYXRvcigpO1xyXG4gICAgICAgICAgICBpZiAoIW9wKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBjID0gbmV3IENvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICBjLmxlZnQgPSBsZWZ0OyBjLm9wZXJhdG9yID0gb3A7IFxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNOb1JpZ2h0T3BlcmF0aW9uKG9wKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJpZ2h0KSByZXR1cm4gZmFsc2U7IFxyXG4gICAgICAgICAgICAgICAgYy5yaWdodCA9IHJpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ29uZGl0aW9uKGMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkRXhwcmVzc2lvbigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmF0ID49IHRoaXMubGVuZ3RoIHx8IHRoaXMuY2ggIT0gJygnKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICB0aGlzLnB1c2hFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnJlYWRDb25kaXRpb25zKCk7XHJcbiAgICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgICAgICAgICAgcmVzID0gdGhpcy5jaCA9PSAnKSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0Kys7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBvcEV4cHJlc3Npb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldCBjaCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50ZXh0LmNoYXJBdCh0aGlzLmF0KTsgfVxyXG4gICAgICAgIHByaXZhdGUgc2tpcCgpIHtcclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuYXQgPCB0aGlzLmxlbmd0aCAmJiB0aGlzLmlzU3BhY2UodGhpcy5jaCkpIHRoaXMuYXQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1NwYWNlKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYyA9PSAnICcgfHwgYyA9PSAnXFxuJyB8fCBjID09ICdcXHQnIHx8IGMgPT0gJ1xccic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNRdW90ZXMoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjID09IFwiJ1wiIHx8IGMgPT0gJ1wiJ1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzT3BlcmF0b3JDaGFyKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYyA9PSAnPicgfHwgYyA9PSAnPCcgfHwgYyA9PSAnPScgfHwgYyA9PSAnISc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNCcmFja2V0cyhjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGMgPT0gJygnIHx8IGMgPT0gJyknO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJlYWRTdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmF0ID49IHRoaXMubGVuZ3RoKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5hdDtcclxuICAgICAgICAgICAgdmFyIGhhc1F1b3RlcyA9IHRoaXMuaXNRdW90ZXModGhpcy5jaCk7XHJcbiAgICAgICAgICAgIGlmIChoYXNRdW90ZXMpIHRoaXMuYXQrKztcclxuICAgICAgICAgICAgdmFyIGlzRmlyc3RPcENoID0gdGhpcy5pc09wZXJhdG9yQ2hhcih0aGlzLmNoKTtcclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuYXQgPCB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNRdW90ZXMgJiYgdGhpcy5pc1NwYWNlKHRoaXMuY2gpKSBicmVhaztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUXVvdGVzKHRoaXMuY2gpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1F1b3RlcykgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNRdW90ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdE9wQ2ggIT0gdGhpcy5pc09wZXJhdG9yQ2hhcih0aGlzLmNoKSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNCcmFja2V0cyh0aGlzLmNoKSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmF0Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuYXQgPD0gc3RhcnQpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy50ZXh0LnN1YnN0cihzdGFydCwgdGhpcy5hdCAtIHN0YXJ0KTtcclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAxICYmIHRoaXMuaXNRdW90ZXMocmVzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSByZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1F1b3RlcyhyZXNbcmVzLmxlbmd0aCAtIDFdKSkgbGVuLS07XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzLnN1YnN0cigxLCBsZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNOb1JpZ2h0T3BlcmF0aW9uKG9wOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9wID09IFwiZW1wdHlcIiB8fCBvcCA9PSBcIm5vdGVtcHR5XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVhZE9wZXJhdG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBvcCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoIW9wKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgb3AgPSBvcC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJz4nKSBvcCA9IFwiZ3JlYXRlclwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJzwnKSBvcCA9IFwibGVzc1wiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJz49JyB8fCBvcCA9PSAnPT4nKSBvcCA9IFwiZ3JlYXRlcm9yZXF1YWxcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09ICc8PScgfHwgb3AgPT0gJz08Jykgb3AgPSBcImxlc3NvcmVxdWFsXCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnPScgfHwgb3AgPT0gJz09Jykgb3AgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgICAgIGlmIChvcCA9PSAnPD4nIHx8IG9wID09ICchPScpIG9wID0gXCJub3RlcXVhbFwiO1xyXG4gICAgICAgICAgICBpZiAob3AgPT0gJ2NvbnRhaW4nKSBvcCA9IFwiY29udGFpbnNcIjtcclxuICAgICAgICAgICAgaWYgKG9wID09ICdub3Rjb250YWluJykgb3AgPSBcIm5vdGNvbnRhaW5zXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSByZWFkQ29ubmVjdGl2ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgY29uID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlmICghY29uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgY29uID0gY29uLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmIChjb24gPT0gXCImXCIgfHwgY29uID09IFwiJiZcIikgY29uID0gXCJhbmRcIjtcclxuICAgICAgICAgICAgaWYgKGNvbiA9PSBcInxcIiB8fCBjb24gPT0gXCJ8fFwiKSBjb24gPSBcIm9yXCI7XHJcbiAgICAgICAgICAgIGlmIChjb24gIT0gXCJhbmRcIiAmJiBjb24gIT0gXCJvclwiKSBjb24gPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gY29uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHB1c2hFeHByZXNzaW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcG9wRXhwcmVzc2lvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmV4cHJlc3Npb25Ob2Rlcy5wb3AoKTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlID0gdGhpcy5leHByZXNzaW9uTm9kZXNbdGhpcy5leHByZXNzaW9uTm9kZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZENvbmRpdGlvbihjOiBDb25kaXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2goYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkQ29ubmVjdGl2ZShjb246IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0aXZlID0gY29uO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5jb25uZWN0aXZlICE9IGNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRDb24gPSB0aGlzLm5vZGUuY29ubmVjdGl2ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkQ2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNvbm5lY3RpdmUgPSBjb247XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZE5vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZE5vZGUuY29ubmVjdGl2ZSA9IG9sZENvbjtcclxuICAgICAgICAgICAgICAgICAgICBvbGROb2RlLmNoaWxkcmVuID0gb2xkQ2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2gob2xkTm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG5ld05vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubm9kZSA9IG5ld05vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImNvbmRpdGlvbnNQYXJzZXIudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIENvbmRpdGlvbiB7XHJcbiAgICAgICAgc3RhdGljIG9wZXJhdG9yc1ZhbHVlOiBIYXNoVGFibGU8RnVuY3Rpb24+ID0gbnVsbDtcclxuICAgICAgICBzdGF0aWMgZ2V0IG9wZXJhdG9ycygpIHtcclxuICAgICAgICAgICAgaWYgKENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZSAhPSBudWxsKSByZXR1cm4gQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgICAgICBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAhbGVmdDsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVtcHR5OiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuICEoIWxlZnQpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA9PSByaWdodDsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgIT0gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgICAgICBjb250YWluczogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ICYmIGxlZnRbXCJpbmRleE9mXCJdICYmIGxlZnQuaW5kZXhPZihyaWdodCkgPiAtMTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGNvbnRhaW5zOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuICFsZWZ0IHx8ICFsZWZ0W1wiaW5kZXhPZlwiXSB8fCBsZWZ0LmluZGV4T2YocmlnaHQpID09IC0xOyB9LFxyXG4gICAgICAgICAgICAgICAgZ3JlYXRlcjogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ID4gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgICAgICBsZXNzOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPCByaWdodDsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXJvcmVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgICAgICBsZXNzb3JlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0IDw9IHJpZ2h0OyB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb3BWYWx1ZTogc3RyaW5nID0gXCJlcXVhbFwiO1xyXG4gICAgICAgIHB1YmxpYyBsZWZ0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIHJpZ2h0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGdldCBvcGVyYXRvcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBvcGVyYXRvcih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAoIUNvbmRpdGlvbi5vcGVyYXRvcnNbdmFsdWVdKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMub3BWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcGVyZm9ybShsZWZ0OiBhbnkgPSBudWxsLCByaWdodDogYW55ID0gbnVsbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIWxlZnQpIGxlZnQgPSB0aGlzLmxlZnQ7XHJcbiAgICAgICAgICAgIGlmICghcmlnaHQpIHJpZ2h0ID0gdGhpcy5yaWdodDtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBDb25kaXRpb24ub3BlcmF0b3JzW3RoaXMub3BlcmF0b3JdKHRoaXMuZ2V0UHVyZVZhbHVlKGxlZnQpLCB0aGlzLmdldFB1cmVWYWx1ZShyaWdodCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFB1cmVWYWx1ZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsIHx8ICh0eXBlb2YgdmFsICE9IFwic3RyaW5nXCIpKSByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHZhbC5sZW5ndGggPiAwICYmICh2YWxbMF0gPT0gXCInXCIgfHwgdmFsWzBdID09ICdcIicpKSAgdmFsID0gdmFsLnN1YnN0cigxKTtcclxuICAgICAgICAgICAgdmFyIGxlbiA9IHZhbC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChsZW4gPiAwICYmICh2YWxbbGVuIC0gMV0gPT0gXCInXCIgfHwgdmFsW2xlbiAtIDFdID09ICdcIicpKSAgdmFsID0gdmFsLnN1YnN0cigwLCBsZW4gLSAxKTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgQ29uZGl0aW9uTm9kZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb25uZWN0aXZlVmFsdWU6IHN0cmluZyA9IFwiYW5kXCI7XHJcbiAgICAgICAgcHVibGljIGNoaWxkcmVuOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICAgICAgcHVibGljIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb25uZWN0aXZlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbm5lY3RpdmVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29ubmVjdGl2ZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gXCImXCIgfHwgdmFsdWUgPT0gXCImJlwiKSB2YWx1ZSA9IFwiYW5kXCI7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBcInxcIiB8fCB2YWx1ZSA9PSBcInx8XCIpIHZhbHVlID0gXCJvclwiO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gXCJhbmRcIiAmJiB2YWx1ZSAhPSBcIm9yXCIpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aXZlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCkgeyByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT0gMDsgfVxyXG4gICAgICAgIHB1YmxpYyBjbGVhcigpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3RpdmUgPSBcImFuZFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBDb25kaXRpb25SdW5uZXIge1xyXG4gICAgICAgIHByaXZhdGUgZXhwcmVzc2lvblZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSByb290OiBDb25kaXRpb25Ob2RlO1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVzOiBIYXNoVGFibGU8YW55PjtcclxuICAgICAgICBwdWJsaWMgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgZXhwcmVzc2lvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5leHByZXNzaW9uVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGV4cHJlc3Npb24odmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5leHByZXNzaW9uID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2lvblZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIG5ldyBDb25kaXRpb25zUGFyc2VyKCkucGFyc2UodGhpcy5leHByZXNzaW9uVmFsdWUsIHRoaXMucm9vdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBydW4odmFsdWVzOiBIYXNoVGFibGU8YW55Pik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucnVuTm9kZSh0aGlzLnJvb3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJ1bk5vZGUobm9kZTogQ29uZGl0aW9uTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgb25GaXJzdEZhaWwgPSBub2RlLmNvbm5lY3RpdmUgPT0gXCJhbmRcIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5ydW5Ob2RlQ29uZGl0aW9uKG5vZGUuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXMgJiYgb25GaXJzdEZhaWwpIHJldHVybiBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmICFvbkZpcnN0RmFpbCkgcmV0dXJuIHRydWU7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvbkZpcnN0RmFpbDsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcnVuTm9kZUNvbmRpdGlvbih2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlW1wiY2hpbGRyZW5cIl0pIHJldHVybiB0aGlzLnJ1bk5vZGUodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWVbXCJsZWZ0XCJdKSByZXR1cm4gdGhpcy5ydW5Db25kaXRpb24odmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcnVuQ29uZGl0aW9uKGNvbmRpdGlvbjogQ29uZGl0aW9uKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gY29uZGl0aW9uLmxlZnQ7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXRWYWx1ZU5hbWUobGVmdCk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShuYW1lIGluIHRoaXMudmFsdWVzKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IHRoaXMudmFsdWVzW25hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IGNvbmRpdGlvbi5yaWdodDtcclxuICAgICAgICAgICAgbmFtZSA9IHRoaXMuZ2V0VmFsdWVOYW1lKHJpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghKG5hbWUgaW4gdGhpcy52YWx1ZXMpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IHRoaXMudmFsdWVzW25hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb25kaXRpb24ucGVyZm9ybShsZWZ0LCByaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VmFsdWVOYW1lKG5vZGVWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghbm9kZVZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlVmFsdWUgIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG5vZGVWYWx1ZS5sZW5ndGggPCAzIHx8IG5vZGVWYWx1ZVswXSAhPSAneycgfHwgbm9kZVZhbHVlW25vZGVWYWx1ZS5sZW5ndGggLSAxXSAhPSAnfScpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbm9kZVZhbHVlLnN1YnN0cigxLCBub2RlVmFsdWUubGVuZ3RoIC0gMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIGR4U3VydmV5U2VydmljZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHBzOi8vZHhzdXJ2ZXlhcGkuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL1N1cnZleVwiO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6NTA0ODgvYXBpL1N1cnZleVwiO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbG9hZFN1cnZleShzdXJ2ZXlJZDogc3RyaW5nLCBvbkxvYWQ6IChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0U3VydmV5P3N1cnZleUlkPScgKyBzdXJ2ZXlJZCk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgb25Mb2FkKHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nLCByZXN1bHQ6IEpTT04sIG9uU2VuZFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpPT4gdm9pZCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvcG9zdC8nKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0geyBwb3N0SWQ6IHBvc3RJZCwgc3VydmV5UmVzdWx0OiBKU09OLnN0cmluZ2lmeShyZXN1bHQpIH07XHJcbiAgICAgICAgICAgIGlmIChjbGllbnRJZCkgZGF0YVsnY2xpZW50SWQnXSA9IGNsaWVudElkO1xyXG4gICAgICAgICAgICBpZiAoaXNQYXJ0aWFsQ29tcGxldGVkKSBkYXRhWydpc1BhcnRpYWxDb21wbGV0ZWQnXSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBkYXRhU3RyaW5naWZ5OiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9uU2VuZFJlc3VsdCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgb25TZW5kUmVzdWx0KHhoci5zdGF0dXMgPT0gMjAwLCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZChkYXRhU3RyaW5naWZ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNlbmRGaWxlKHBvc3RJZDogc3RyaW5nLCBmaWxlOiBGaWxlLCBvblNlbmRGaWxlOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghb25TZW5kRmlsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgb25TZW5kRmlsZSh4aHIuc3RhdHVzID09IDIwMCwgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy91cGxvYWQvJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xyXG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJwb3N0SWRcIiwgcG9zdElkKTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVzdWx0KHJlc3VsdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgb25HZXRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBBcnJheTxhbnk+LCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZuYW1lPScgKyBuYW1lO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFJlc3VsdD8nICsgZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzdWx0LlF1ZXN0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHsgbmFtZToga2V5LCB2YWx1ZTogcmVzdWx0LlF1ZXN0aW9uUmVzdWx0W2tleV0gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvbkdldFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCBsaXN0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNDb21wbGV0ZWQocmVzdWx0SWQ6IHN0cmluZywgY2xpZW50SWQ6IHN0cmluZywgb25Jc0NvbXBsZXRlZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZjbGllbnRJZD0nICsgY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvaXNDb21wbGV0ZWQ/JyArIGRhdGEpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9uSXNDb21wbGV0ZWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgdmFyIHN1cnZleUxvY2FsaXphdGlvbiA9IHtcclxuICAgICAgICBjdXJyZW50TG9jYWxlOiBcIlwiLFxyXG4gICAgICAgIGxvY2FsZXM6IHt9LFxyXG4gICAgICAgIGdldFN0cmluZzogZnVuY3Rpb24gKHN0ck5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgbG9jID0gdGhpcy5jdXJyZW50TG9jYWxlID8gdGhpcy5sb2NhbGVzW3RoaXMuY3VycmVudExvY2FsZV0gOiBzdXJ2ZXlTdHJpbmdzO1xyXG4gICAgICAgICAgICBpZiAoIWxvYyB8fCAhbG9jW3N0ck5hbWVdKSBsb2MgPSBzdXJ2ZXlTdHJpbmdzO1xyXG4gICAgICAgICAgICByZXR1cm4gbG9jW3N0ck5hbWVdO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0TG9jYWxlczogZnVuY3Rpb24gKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgICAgICAgIHJlcy5wdXNoKFwiXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5sb2NhbGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlcy5zb3J0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGV4cG9ydCB2YXIgc3VydmV5U3RyaW5ncyA9IHtcclxuICAgICAgICBwYWdlUHJldlRleHQ6IFwiUHJldmlvdXNcIixcclxuICAgICAgICBwYWdlTmV4dFRleHQ6IFwiTmV4dFwiLFxyXG4gICAgICAgIGNvbXBsZXRlVGV4dDogXCJDb21wbGV0ZVwiLFxyXG4gICAgICAgIG90aGVySXRlbVRleHQ6IFwiT3RoZXIgKGRlc2NyaWJlKVwiLFxyXG4gICAgICAgIHByb2dyZXNzVGV4dDogXCJQYWdlIHswfSBvZiB7MX1cIixcclxuICAgICAgICBlbXB0eVN1cnZleTogXCJUaGVyZSBpcyBubyBhbnkgdmlzaWJsZSBwYWdlIG9yIHZpc2libGUgcXVlc3Rpb24gaW4gdGhlIHN1cnZleS5cIixcclxuICAgICAgICBjb21wbGV0aW5nU3VydmV5OiBcIlRoYW5rIFlvdSBmb3IgQ29tcGxldGluZyB0aGUgU3VydmV5IVwiLFxyXG4gICAgICAgIGxvYWRpbmdTdXJ2ZXk6IFwiU3VydmV5IGlzIGxvYWRpbmcgZnJvbSB0aGUgc2VydmVyLi4uXCIsXHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiQ2hvb3NlLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCJQbGVhc2UgYW5zd2VyIHRoZSBxdWVzdGlvbi5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiVGhlIHZhbHVlIHNob3VsZCBiZSBhIG51bWVyaWMuXCIsXHJcbiAgICAgICAgdGV4dE1pbkxlbmd0aDogXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgezB9IHN5bWJvbHMuXCIsXHJcbiAgICAgICAgbWluUm93Q291bnRFcnJvcjogXCJQbGVhc2UgZmlsbCBhdCBsZWFzdCB7MH0gcm93cy5cIixcclxuICAgICAgICBtaW5TZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IGF0IGxlYXN0IHswfSB2YXJpYW50cy5cIixcclxuICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IG5vdCBtb3JlIHRoYW4gezB9IHZhcmlhbnRzLlwiLFxyXG4gICAgICAgIG51bWVyaWNNaW5NYXg6IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9IGFuZCBlcXVhbCBvciBsZXNzIHRoYW4gezJ9XCIsXHJcbiAgICAgICAgbnVtZXJpY01pbjogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIG1vcmUgdGhhbiB7MX1cIixcclxuICAgICAgICBudW1lcmljTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbGVzcyB0aGFuIHsxfVwiLFxyXG4gICAgICAgIGludmFsaWRFbWFpbDogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlLW1haWwuXCIsXHJcbiAgICAgICAgdXJsUmVxdWVzdEVycm9yOiBcIlRoZSByZXF1ZXN0IHJldHVybiBlcnJvciAnezB9Jy4gezF9XCIsXHJcbiAgICAgICAgdXJsR2V0Q2hvaWNlc0Vycm9yOiBcIlRoZSByZXF1ZXN0IHJldHVybnMgZW1wdHkgZGF0YSBvciB0aGUgJ3BhdGgnIHByb3BlcnR5IGlzIGluY29ycmVjdFwiLFxyXG4gICAgICAgIGV4Y2VlZE1heFNpemU6IFwiVGhlIGZpbGUgc2l6ZSBzaG91bGQgbm90IGV4Y2VlZCB7MH0uXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIlBsZWFzZSBlbnRlciB0aGUgb3RoZXJzIHZhbHVlLlwiLFxyXG4gICAgICAgIHVwbG9hZGluZ0ZpbGU6IFwiWW91ciBmaWxlIGlzIHVwbG9hZGluZy4gUGxlYXNlIHdhaXQgc2V2ZXJhbCBzZWNvbmRzIGFuZCB0cnkgYWdhaW4uXCIsXHJcbiAgICAgICAgYWRkUm93OiBcIkFkZCBSb3dcIixcclxuICAgICAgICByZW1vdmVSb3c6IFwiUmVtb3ZlXCJcclxuICAgIH1cclxuICAgIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZW5cIl0gPSBzdXJ2ZXlTdHJpbmdzO1xyXG5cclxuICAgIGlmICghU3RyaW5nLnByb3RvdHlwZVtcImZvcm1hdFwiXSkge1xyXG4gICAgICAgIFN0cmluZy5wcm90b3R5cGVbXCJmb3JtYXRcIl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmdzW251bWJlcl0gIT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxyXG4gICAgICAgICAgICAgICAgICAgIDogbWF0Y2hcclxuICAgICAgICAgICAgICAgICAgICA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VydmV5U3RyaW5ncy50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIEFuc3dlclJlcXVpcmVkRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSAge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInJlcXVpcmVkRXJyb3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFJlcXVyZU51bWVyaWNFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljRXJyb3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEV4Y2VlZFNpemVFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBwcml2YXRlIG1heFNpemU6IG51bWJlcjtcclxuICAgICAgICBjb25zdHJ1Y3RvcihtYXhTaXplOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5tYXhTaXplID0gbWF4U2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJleGNlZWRNYXhTaXplXCIpW1wiZm9ybWF0XCJdKHRoaXMuZ2V0VGV4dFNpemUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGV4dFNpemUoKSB7XHJcbiAgICAgICAgICAgIHZhciBzaXplcyA9IFsnQnl0ZXMnLCAnS0InLCAnTUInLCAnR0InLCAnVEInXTtcclxuICAgICAgICAgICAgdmFyIGZpeGVkID0gWzAsIDAsIDIsIDMsIDNdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXhTaXplID09IDApIHJldHVybiAnMCBCeXRlJztcclxuICAgICAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKE1hdGgubG9nKHRoaXMubWF4U2l6ZSkgLyBNYXRoLmxvZygxMDI0KSk7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMubWF4U2l6ZSAvIE1hdGgucG93KDEwMjQsIGkpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9GaXhlZChmaXhlZFtpXSkgKyAnICcgKyBzaXplc1tpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEN1c3RvbUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25CYXNlIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElRdWVzdGlvbiwgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcXVlc3Rpb25Db3VudGVyID0gMTAwO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldFF1ZXN0aW9uSWQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwic3FfXCIgKyBRdWVzdGlvbkJhc2UucXVlc3Rpb25Db3VudGVyKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkYXRhOiBJU3VydmV5RGF0YTtcclxuICAgICAgICBwcm90ZWN0ZWQgc3VydmV5OiBJU3VydmV5O1xyXG4gICAgICAgIHByaXZhdGUgY29uZGl0aW9uUnVubmVyOiBDb25kaXRpb25SdW5uZXIgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyB2aXNpYmxlSWY6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBpZFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBzdGFydFdpdGhOZXdMaW5lOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVJbmRleFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBwdWJsaWMgd2lkdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJXaWR0aFZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHByaXZhdGUgcmlnaHRJbmRlbnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgICAgICBwdWJsaWMgaW5kZW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvY3VzQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICB2aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmlkVmFsdWUgPSBRdWVzdGlvbkJhc2UuZ2V0UXVlc3Rpb25JZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJvd1Zpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5LnF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQoPElRdWVzdGlvbj50aGlzLCB0aGlzLnZpc2libGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnZpc2libGVJbmRleFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVGl0bGUoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzQ29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCByZW5kZXJXaWR0aCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5yZW5kZXJXaWR0aFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCByZW5kZXJXaWR0aCh2YWw6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMucmVuZGVyV2lkdGgpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJXaWR0aFZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByaWdodEluZGVudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5yaWdodEluZGVudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCByaWdodEluZGVudCh2YWw6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMucmlnaHRJbmRlbnQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yaWdodEluZGVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZvY3VzKCkge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcclxuICAgICAgICAgICAgaWYgKCFlbCB8fCAhZWwuc2Nyb2xsSW50b1ZpZXcpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGVsZW1Ub3AgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgICAgIGlmIChlbGVtVG9wIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgZWwuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZm9jdXNDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShuZXdWYWx1ZTogSVN1cnZleURhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gKG5ld1ZhbHVlICYmIG5ld1ZhbHVlW1wicXVlc3Rpb25BZGRlZFwiXSkgPyA8SVN1cnZleT5uZXdWYWx1ZSA6IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMub25TZXREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBmaXJlQ2FsbGJhY2soY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICBwdWJsaWMgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpc2libGVJZikgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZGl0aW9uUnVubmVyKSB0aGlzLmNvbmRpdGlvblJ1bm5lciA9IG5ldyBDb25kaXRpb25SdW5uZXIodGhpcy52aXNpYmxlSWYpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvblJ1bm5lci5leHByZXNzaW9uID0gdGhpcy52aXNpYmxlSWY7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHRoaXMuY29uZGl0aW9uUnVubmVyLnJ1bih2YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgIC8vSVF1ZXN0aW9uXHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBvblN1cnZleUxvYWQoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFZpc2libGVJbmRleCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVJbmRleFZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52aXNpYmxlSW5kZXhDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicXVlc3Rpb25iYXNlXCIsIFtcIiFuYW1lXCIsIHsgbmFtZTogXCJ2aXNpYmxlOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCBcInZpc2libGVJZjp0ZXh0XCIsIFxyXG4gICAgICAgIHsgbmFtZTogXCJ3aWR0aFwiIH0sIHsgbmFtZTogXCJzdGFydFdpdGhOZXdMaW5lOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZX0sIHtuYW1lOiBcImluZGVudDpudW1iZXJcIiwgZGVmYXVsdDogMCwgY2hvaWNlczogWzAsIDEsIDIsIDNdfV0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogUXVlc3Rpb25GYWN0b3J5ID0gbmV3IFF1ZXN0aW9uRmFjdG9yeSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRGVmYXVsdENob2ljZXMgPSBbXCJvbmVcIiwgXCJ0d298c2Vjb25kIHZhbHVlXCIsIFwidGhyZWV8dGhpcmQgdmFsdWVcIl07XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdG9ySGFzaDogSGFzaFRhYmxlPChuYW1lOiBzdHJpbmcpID0+IFF1ZXN0aW9uQmFzZT4gPSB7fTtcclxuXHJcbiAgICAgICAgcHVibGljIHJlZ2lzdGVyUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uQ3JlYXRvcjogKG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXSA9IHF1ZXN0aW9uQ3JlYXRvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEFsbFR5cGVzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gdGhpcy5jcmVhdG9ySGFzaCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgICAgICB2YXIgY3JlYXRvciA9IHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXTtcclxuICAgICAgICAgICAgaWYgKGNyZWF0b3IgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBjcmVhdG9yKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUm93TW9kZWwge1xyXG4gICAgICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgdmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFnZTogUGFnZU1vZGVsLCBwdWJsaWMgcXVlc3Rpb246IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24ucm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblJvd1Zpc2liaWxpdHlDaGFuZ2VkKCk7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmlzaWJsZVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2aXNpYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB1cGRhdGVWaXNpYmxlKCkge1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGUgPSB0aGlzLmNhbGNWaXNpYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0V2lkdGgoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFF1ZXN0aW9uKHE6IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoKHEpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmlzaWJsZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spIHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0V2lkdGgoKSB7XHJcbiAgICAgICAgICAgIHZhciB2aXNDb3VudCA9IHRoaXMuZ2V0VmlzaWJsZUNvdW50KCk7XHJcbiAgICAgICAgICAgIGlmICh2aXNDb3VudCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKylcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUXVlc3Rpb25WaXNpYmxlKHRoaXMucXVlc3Rpb25zW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLnJlbmRlcldpZHRoID0gdGhpcy5xdWVzdGlvbi53aWR0aCA/IHRoaXMucXVlc3Rpb24ud2lkdGggOiBNYXRoLmZsb29yKDEwMCAvIHZpc0NvdW50KSArICclJztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1tpXS5yaWdodEluZGVudCA9IGNvdW50ZXIgPCB2aXNDb3VudCAtIDEgPyAxIDogMDtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25Sb3dWaXNpYmlsaXR5Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlLm9uUm93VmlzaWJpbGl0eUNoYW5nZWQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VmlzaWJsZUNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1F1ZXN0aW9uVmlzaWJsZSh0aGlzLnF1ZXN0aW9uc1tpXSkpIHJlcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNRdWVzdGlvblZpc2libGUocTogUXVlc3Rpb25CYXNlKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2UuaXNRdWVzdGlvblZpc2libGUocSk7IH0gXHJcbiAgICAgICAgcHJpdmF0ZSBjYWxjVmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCkgPiAwOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VNb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJUGFnZSwgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICAgICAgcHJpdmF0ZSByb3dWYWx1ZXM6IEFycmF5PFF1ZXN0aW9uUm93TW9kZWw+ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIGNvbmRpdGlvblJ1bm5lcjogQ29uZGl0aW9uUnVubmVyID0gbnVsbDtcclxuICAgICAgICBxdWVzdGlvbnM6IEFycmF5PFF1ZXN0aW9uQmFzZT4gPSBuZXcgQXJyYXk8UXVlc3Rpb25CYXNlPigpO1xyXG4gICAgICAgIHB1YmxpYyBkYXRhOiBJU3VydmV5ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgdmlzaWJsZUlmOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBudW1WYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJvd3MoKTogQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4ge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlcyA9IHRoaXMuYnVpbGRSb3dzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvd1ZhbHVlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0FjdGl2ZSgpIHsgcmV0dXJuICghdGhpcy5kYXRhKSB8fCB0aGlzLmRhdGEuY3VycmVudFBhZ2UgPT0gdGhpczsgfVxyXG4gICAgICAgIHB1YmxpYyBpc1F1ZXN0aW9uVmlzaWJsZShxdWVzdGlvbjogUXVlc3Rpb25CYXNlKTogYm9vbGVhbiB7IHJldHVybiBxdWVzdGlvbi52aXNpYmxlIHx8IHRoaXMuaXNEZXNpZ25Nb2RlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVJvdyhxdWVzdGlvbjogUXVlc3Rpb25CYXNlKTogUXVlc3Rpb25Sb3dNb2RlbCB7IHJldHVybiBuZXcgUXVlc3Rpb25Sb3dNb2RlbCh0aGlzLCBxdWVzdGlvbik7IH1cclxuICAgICAgICBwcml2YXRlIGdldCBpc0Rlc2lnbk1vZGUoKSB7IHJldHVybiB0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmlzRGVzaWduTW9kZTsgfVxyXG4gICAgICAgIHByaXZhdGUgYnVpbGRSb3dzKCk6IEFycmF5PFF1ZXN0aW9uUm93TW9kZWw+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxRdWVzdGlvblJvd01vZGVsPigpO1xyXG4gICAgICAgICAgICB2YXIgbGFzdFJvd1Zpc2libGVJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBxID0gdGhpcy5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZVJvdyhxKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocS5zdGFydFdpdGhOZXdMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFJvd1Zpc2libGVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldLmFkZFF1ZXN0aW9uKHEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFJvd1Zpc2libGVJbmRleCA8IDApIGxhc3RSb3dWaXNpYmxlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtsYXN0Um93VmlzaWJsZUluZGV4XS5hZGRRdWVzdGlvbihxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldLnNldFdpZHRoKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb25Sb3dWaXNpYmlsaXR5Q2hhbmdlZChyb3c6IFF1ZXN0aW9uUm93TW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlIHx8ICF0aGlzLnJvd1ZhbHVlcykgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnJvd1ZhbHVlcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBpbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJvd1ZhbHVlc1tpXS5xdWVzdGlvbnMuaW5kZXhPZihyb3cucXVlc3Rpb24pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd1ZhbHVlc1tpXS51cGRhdGVWaXNpYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRUaXRsZSgpIHsgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLnByb2Nlc3NUZXh0KHRoaXMudGl0bGUpIDogdGhpcy50aXRsZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgbnVtKCkgeyByZXR1cm4gdGhpcy5udW1WYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgbnVtKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubnVtVmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5udW1WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uTnVtQ2hhbmdlZCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmlzaWJsZVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnBhZ2VWaXNpYmlsaXR5Q2hhbmdlZCh0aGlzLCB0aGlzLnZpc2libGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInBhZ2VcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGFkZFF1ZXN0aW9uKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UsIGluZGV4OiBudW1iZXIgPSAtMSkge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24gPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucXVlc3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDAsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnNldERhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5xdWVzdGlvbkFkZGVkKHF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZE5ld1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVzdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbW92ZVF1ZXN0aW9uKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB0aGlzLmRhdGEucXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNjcm9sbFRvRmlyc3RRdWVzdGlvbigpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1tpXS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSwgZm9jdXNlT25GaXJzdEVycm9yOiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgZmlyc3RFcnJvclF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUgJiYgdGhpcy5xdWVzdGlvbnNbaV0uaGFzRXJyb3JzKGZpcmVDYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm9jdXNlT25GaXJzdEVycm9yICYmIGZpcnN0RXJyb3JRdWVzdGlvbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0RXJyb3JRdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaXJzdEVycm9yUXVlc3Rpb24pIGZpcnN0RXJyb3JRdWVzdGlvbi5mb2N1cygpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb25zVG9MaXN0KGxpc3Q6IEFycmF5PElRdWVzdGlvbj4sIHZpc2libGVPbmx5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICF0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMucXVlc3Rpb25zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpc2libGVJZikgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29uZGl0aW9uUnVubmVyKSB0aGlzLmNvbmRpdGlvblJ1bm5lciA9IG5ldyBDb25kaXRpb25SdW5uZXIodGhpcy52aXNpYmxlSWYpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbmRpdGlvblJ1bm5lci5leHByZXNzaW9uID0gdGhpcy52aXNpYmxlSWY7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSA9IHRoaXMuY29uZGl0aW9uUnVubmVyLnJ1bih2YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25OdW1DaGFuZ2VkKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicGFnZVwiLCBbXCJuYW1lXCIsIHsgbmFtZTogXCJxdWVzdGlvbnNcIiwgYmFzZUNsYXNzTmFtZTogXCJxdWVzdGlvblwiIH0sIHsgbmFtZTogXCJ2aXNpYmxlOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCBcInZpc2libGVJZlwiLCBcInRpdGxlXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUGFnZU1vZGVsKCk7IH0pO1xyXG4gfSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJlcnJvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IGFueSwgcHVibGljIGVycm9yOiBTdXJ2ZXlFcnJvciA9IG51bGwpIHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlWYWxpZGF0b3IgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBwdWJsaWMgdGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIDogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dCkgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj47XHJcbiAgICAgICAgdmFsdWU6IGFueTtcclxuICAgICAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmc7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgVmFsaWRhdG9yUnVubmVyIHtcclxuICAgICAgICBwdWJsaWMgcnVuKG93bmVyOiBJVmFsaWRhdG9yT3duZXIpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb3duZXIudmFsaWRhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRvclJlc3VsdCA9IG93bmVyLnZhbGlkYXRvcnNbaV0udmFsaWRhdGUob3duZXIudmFsdWUsIG93bmVyLmdldFZhbGlkYXRvclRpdGxlKCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC5lcnJvcikgcmV0dXJuIHZhbGlkYXRvclJlc3VsdC5lcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyLnZhbHVlID0gdmFsaWRhdG9yUmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE51bWVyaWNWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5WYWx1ZTogbnVtYmVyID0gbnVsbCwgcHVibGljIG1heFZhbHVlOiBudW1iZXIgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIm51bWVyaWN2YWxpZGF0b3JcIjsgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdGhpcy5pc051bWJlcih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBSZXF1cmVOdW1lcmljRXJyb3IoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBWYWxpZGF0b3JSZXN1bHQocGFyc2VGbG9hdCh2YWx1ZSkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5WYWx1ZSAmJiB0aGlzLm1pblZhbHVlID4gcmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXhWYWx1ZSAmJiB0aGlzLm1heFZhbHVlIDwgcmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpID8gbnVsbCA6IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciB2TmFtZSA9IG5hbWUgPyBuYW1lIDogXCJ2YWx1ZVwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5WYWx1ZSAmJiB0aGlzLm1heFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5NYXhcIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUsIHRoaXMubWF4VmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5cIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01heFwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5tYXhWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc051bWJlcih2YWx1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBUZXh0VmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluTGVuZ3RoOiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInRleHR2YWxpZGF0b3JcIjsgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluTGVuZ3RoIDw9IDApIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA8IHRoaXMubWluTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwidGV4dE1pbkxlbmd0aFwiKVtcImZvcm1hdFwiXSh0aGlzLm1pbkxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBbnN3ZXJDb3VudFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pbkNvdW50OiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4Q291bnQ6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIjsgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUuY29uc3RydWN0b3IgIT0gQXJyYXkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbkNvdW50ICYmIGNvdW50IDwgdGhpcy5taW5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtaW5TZWxlY3RFcnJvclwiKVtcImZvcm1hdFwiXSh0aGlzLm1pbkNvdW50KSkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXhDb3VudCAmJiBjb3VudCA+IHRoaXMubWF4Q291bnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWF4U2VsZWN0RXJyb3JcIilbXCJmb3JtYXRcIl0odGhpcy5tYXhDb3VudCkpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFJlZ2V4VmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVnZXg6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicmVnZXh2YWxpZGF0b3JcIjsgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlZ2V4IHx8ICF2YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAodGhpcy5yZWdleCk7XHJcbiAgICAgICAgICAgIGlmIChyZS50ZXN0KHZhbHVlKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KHZhbHVlLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgRW1haWxWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIHByaXZhdGUgcmUgPSAvXigoW148PigpXFxbXFxdXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClcXFtcXF1cXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChbXjw+KClbXFxdXFwuLDs6XFxzQFxcXCJdK1xcLikrW148PigpW1xcXVxcLiw7Olxcc0BcXFwiXXsyLH0pJC9pO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJlbWFpbHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmUudGVzdCh2YWx1ZSkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdCh2YWx1ZSwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJpbnZhbGlkRW1haWxcIik7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXZhbGlkYXRvclwiLCBbXCJ0ZXh0XCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJudW1lcmljdmFsaWRhdG9yXCIsIFtcIm1pblZhbHVlOm51bWJlclwiLCBcIm1heFZhbHVlOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE51bWVyaWNWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidGV4dHZhbGlkYXRvclwiLCBbXCJtaW5MZW5ndGg6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgVGV4dFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJhbnN3ZXJjb3VudHZhbGlkYXRvclwiLCBbXCJtaW5Db3VudDpudW1iZXJcIiwgXCJtYXhDb3VudDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBbnN3ZXJDb3VudFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJyZWdleHZhbGlkYXRvclwiLCBbXCJyZWdleFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFJlZ2V4VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImVtYWlsdmFsaWRhdG9yXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgRW1haWxWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiBcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGNsYXNzIFRleHRQcmVQcm9jZXNzb3JJdGVtIHtcclxuICAgICAgICBwdWJsaWMgc3RhcnQ6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgZW5kOiBudW1iZXI7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFByZVByb2Nlc3NvciB7XHJcbiAgICAgICAgcHVibGljIG9uUHJvY2VzczogKG5hbWU6IHN0cmluZykgPT4gYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkhhc1ZhbHVlOiAobmFtZTogc3RyaW5nKSA9PiBib29sZWFuO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICAgICAgcHVibGljIHByb2Nlc3ModGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm4gdGV4dDtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9uUHJvY2VzcykgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMuZ2V0SXRlbXModGV4dCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBpdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXROYW1lKHRleHQuc3Vic3RyaW5nKGl0ZW0uc3RhcnQgKyAxLCBpdGVtLmVuZCkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhblByb2Nlc3NOYW1lKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uSGFzVmFsdWUgJiYgIXRoaXMub25IYXNWYWx1ZShuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLm9uUHJvY2VzcyhuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIoMCwgaXRlbS5zdGFydCkgKyB2YWx1ZSArIHRleHQuc3Vic3RyKGl0ZW0uZW5kICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0SXRlbXModGV4dDogc3RyaW5nKTogQXJyYXk8VGV4dFByZVByb2Nlc3Nvckl0ZW0+IHtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gLTE7XHJcbiAgICAgICAgICAgIHZhciBjaCA9ICcnO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjaCA9IHRleHRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT0gJ3snKSBzdGFydCA9IGk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgVGV4dFByZVByb2Nlc3Nvckl0ZW0oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGFydCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmVuZCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldE5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lLnRyaW0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjYW5Qcm9jZXNzTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoID0gbmFtZVtpXTtcclxuICAgICAgICAgICAgICAgIC8vVE9ET1xyXG4gICAgICAgICAgICAgICAgaWYgKGNoID09ICcgJyB8fCBjaCA9PSAnLScgfHwgY2ggPT0gJyYnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXJyb3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidmFsaWRhdG9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRleHRQcmVQcm9jZXNzb3IudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbiBleHRlbmRzIFF1ZXN0aW9uQmFzZSBpbXBsZW1lbnRzIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICAgICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25Db21tZW50OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1JlcXVpcmVkVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc0NvbW1lbnRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgaGFzT3RoZXJWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgY29tbWVudFRleHRWYWx1ZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcbiAgICAgICAgZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4gPSBbXTtcclxuICAgICAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+ID0gbmV3IEFycmF5PFN1cnZleVZhbGlkYXRvcj4oKTtcclxuICAgICAgICB2YWx1ZUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBjb21tZW50Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGVycm9yc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICB0aXRsZUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUaXRsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCk6IHN0cmluZyB7IHJldHVybiAodGhpcy50aXRsZVZhbHVlKSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy50aXRsZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkVGl0bGUoKSB7IHJldHVybiB0aGlzLnN1cnZleSAhPSBudWxsID8gdGhpcy5zdXJ2ZXkucHJvY2Vzc1RleHQodGhpcy50aXRsZSkgOiB0aGlzLnRpdGxlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBmdWxsVGl0bGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuc3VydmV5LnF1ZXN0aW9uVGl0bGVUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRleHRQcmVQcm9jZXNzb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yID0gbmV3IFRleHRQcmVQcm9jZXNzb3IoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25IYXNWYWx1ZSA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYuY2FuUHJvY2Vzc2VkVGV4dFZhbHVlcyhuYW1lLnRvTG93ZXJDYXNlKCkpOyB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vblByb2Nlc3MgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHRQcmVQcm9jZXNzb3IucHJvY2Vzcyh0aGlzLnN1cnZleS5xdWVzdGlvblRpdGxlVGVtcGxhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXF1aXJlVGV4dCA9IHRoaXMucmVxdWlyZWRUZXh0O1xyXG4gICAgICAgICAgICBpZiAocmVxdWlyZVRleHQpIHJlcXVpcmVUZXh0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICB2YXIgbm8gPSB0aGlzLm5vO1xyXG4gICAgICAgICAgICBpZiAobm8pIG5vICs9IFwiLiBcIjtcclxuICAgICAgICAgICAgcmV0dXJuIG5vICsgcmVxdWlyZVRleHQgKyB0aGlzLnByb2Nlc3NlZFRpdGxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY2FuUHJvY2Vzc2VkVGV4dFZhbHVlcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWUgPT0gXCJub1wiIHx8IG5hbWUgPT0gXCJ0aXRsZVwiIHx8IG5hbWUgPT0gXCJyZXF1aXJlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQcm9jZXNzZWRUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJub1wiKSByZXR1cm4gdGhpcy5ubztcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJ0aXRsZVwiKSByZXR1cm4gdGhpcy5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJyZXF1aXJlXCIpIHJldHVybiB0aGlzLnJlcXVpcmVkVGV4dDtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc1JlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1JlcXVpcmVkVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGlzUmVxdWlyZWQodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUmVxdWlyZWQgPT0gdmFsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNSZXF1aXJlZFZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnRpdGxlQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNDb21tZW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGhhc0NvbW1lbnQodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0Q29tbWVudCgpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaGFzQ29tbWVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNDb21tZW50KSB0aGlzLmhhc090aGVyID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tbWVudFRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY29tbWVudFRleHRWYWx1ZSA/IHRoaXMuY29tbWVudFRleHRWYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb21tZW50VGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudFRleHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc090aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNPdGhlclZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBoYXNPdGhlcih2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRPdGhlcigpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaGFzT3RoZXJWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3RoZXIpIHRoaXMuaGFzQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IG5vKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVJbmRleCA8IDApIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IDE7XHJcbiAgICAgICAgICAgIHZhciBpc051bWVyaWMgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuc3VydmV5LnF1ZXN0aW9uU3RhcnRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gdGhpcy5zdXJ2ZXkucXVlc3Rpb25TdGFydEluZGV4O1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHN0cikpIHN0YXJ0SW5kZXggPSBwYXJzZUludChzdHIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RyLmxlbmd0aCA9PSAxKSBpc051bWVyaWMgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNOdW1lcmljKSByZXR1cm4gKHRoaXMudmlzaWJsZUluZGV4ICsgc3RhcnRJbmRleCkudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoc3RyLmNoYXJDb2RlQXQoMCkgKyB0aGlzLnZpc2libGVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uU2V0RGF0YSgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uU3VydmV5VmFsdWVDaGFuZ2VkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlRnJvbURhdGEodGhpcy5nZXRWYWx1ZUNvcmUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52YWx1ZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tbWVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5nZXRDb21tZW50KCk7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21tZW50ID09IG5ld1ZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29tbWVudChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29tbWVudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRDb21tZW50KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRDb21tZW50KHRoaXMubmFtZSkgOiB0aGlzLnF1ZXN0aW9uQ29tbWVudDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZhbHVlID09IG51bGw7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvckVycm9ycyhmaXJlQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByZXF1aXJlZFRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3VydmV5ICE9IG51bGwgJiYgdGhpcy5pc1JlcXVpcmVkID8gdGhpcy5zdXJ2ZXkucmVxdWlyZWRUZXh0IDogXCJcIjsgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tGb3JFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvckxlbmd0aCA9IHRoaXMuZXJyb3JzID8gdGhpcy5lcnJvcnMubGVuZ3RoIDogMDtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoZWNrRm9yRXJyb3JzKHRoaXMuZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwICYmIHRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMucnVuVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnN1cnZleS52YWxpZGF0ZVF1ZXN0aW9uKHRoaXMubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmlyZUNhbGxiYWNrICYmIChlcnJvckxlbmd0aCAhPSB0aGlzLmVycm9ycy5sZW5ndGggfHwgZXJyb3JMZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1JlcXVpcmVkRXJyb3IoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQW5zd2VyUmVxdWlyZWRFcnJvcigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaGFzUmVxdWlyZWRFcnJvcigpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZCAmJiB0aGlzLmlzRW1wdHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJ1bm5lcigpLnJ1bih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZUluRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlSW5EYXRhKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZVRvRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlQ29yZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWYWx1ZUNvcmUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRWYWx1ZSh0aGlzLm5hbWUpIDogdGhpcy5xdWVzdGlvblZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldFZhbHVlQ29yZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldFZhbHVlKHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGEodmFsOiBhbnkpOiBhbnkgeyByZXR1cm4gdmFsOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhKHZhbDogYW55KTogYW55IHsgcmV0dXJuIHZhbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXROZXdDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0Q29tbWVudCh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHRoaXMucXVlc3Rpb25Db21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVF1ZXN0aW9uXHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZUZyb21EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb21tZW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIG51bGw7IH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uXCIsIFt7IG5hbWU6IFwidGl0bGU6dGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNvbW1lbnRUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLmNvbW1lbnRUZXh0VmFsdWU7IH0gfSxcclxuICAgICAgICBcImlzUmVxdWlyZWQ6Ym9vbGVhblwiLCB7IG5hbWU6IFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dmFsaWRhdG9yXCIsIGNsYXNzTmFtZVBhcnQ6IFwidmFsaWRhdG9yXCJ9XSwgbnVsbCwgXCJxdWVzdGlvbmJhc2VcIik7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlzdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25TZWxlY3RCYXNlIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHByaXZhdGUgY29tbWVudFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJvdGVjdGVkIGNhY2hlZFZhbHVlOiBhbnk7XHJcbiAgICAgICAgb3RoZXJJdGVtOiBJdGVtVmFsdWUgPSBuZXcgSXRlbVZhbHVlKFwib3RoZXJcIiwgc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVySXRlbVRleHRcIikpO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc0Zyb21Vcmw6IEFycmF5PEl0ZW1WYWx1ZT4gPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlczogQXJyYXk8SXRlbVZhbHVlPiA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXNCeVVybDogQ2hvaWNlc1Jlc3RmdWxsO1xyXG4gICAgICAgIHB1YmxpYyBvdGhlckVycm9yVGV4dDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGNob2ljZXNPcmRlclZhbHVlOiBzdHJpbmcgPSBcIm5vbmVcIjtcclxuICAgICAgICBjaG9pY2VzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzQnlVcmwgPSB0aGlzLmNyZWF0ZVJlc3RmdWxsKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzQnlVcmwuZ2V0UmVzdWx0Q2FsbGJhY2sgPSBmdW5jdGlvbiAoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4pIHsgc2VsZi5vbkxvYWRDaG9pY2VzRnJvbVVybChpdGVtcykgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc090aGVyU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkgPyB0aGlzLmdldEhhc090aGVyKHRoaXMudmFsdWUpIDogdGhpcy5nZXRIYXNPdGhlcih0aGlzLmNhY2hlZFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldEhhc090aGVyKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWwgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVSZXN0ZnVsbCgpOiBDaG9pY2VzUmVzdGZ1bGwgeyByZXR1cm4gbmV3IENob2ljZXNSZXN0ZnVsbCgpOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldENvbW1lbnQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLmdldENvbW1lbnQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tbWVudFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzU2V0dGluZ0NvbW1lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgc2V0Q29tbWVudChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkpXHJcbiAgICAgICAgICAgICAgICBzdXBlci5zZXRDb21tZW50KG5ld1ZhbHVlKVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1NldHRpbmdDb21tZW50ICYmIG5ld1ZhbHVlICE9IHRoaXMuY29tbWVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1NldHRpbmdDb21tZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnRWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3RoZXJTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlSW5EYXRhKHRoaXMuY2FjaGVkVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2V0dGluZ0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVGcm9tRGF0YSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkpIHJldHVybiBzdXBlci52YWx1ZUZyb21EYXRhKHZhbCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkVmFsdWUgPSB0aGlzLnZhbHVlRnJvbURhdGFDb3JlKHZhbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGEodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpKSByZXR1cm4gc3VwZXIudmFsdWVUb0RhdGEodmFsKTtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZWRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVUb0RhdGFDb3JlKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZUZyb21EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNVbmtub3duVmFsdWUodmFsKSkgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZSkgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50ID0gdmFsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YUNvcmUodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMub3RoZXJJdGVtLnZhbHVlICYmIHRoaXMuZ2V0Q29tbWVudCgpKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLmdldENvbW1lbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaGFzVW5rbm93blZhbHVlKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMuYWN0aXZlQ2hvaWNlcztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLnZhbHVlID09IHZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlczsgfVxyXG4gICAgICAgIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY2hvaWNlc1ZhbHVlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY2hvaWNlc09yZGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNob2ljZXNPcmRlclZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGNob2ljZXNPcmRlcihuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSB0aGlzLmNob2ljZXNPcmRlclZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc09yZGVyVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IG90aGVyVGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vdGhlckl0ZW0udGV4dDsgfVxyXG4gICAgICAgIHNldCBvdGhlclRleHQodmFsdWU6IHN0cmluZykgeyB0aGlzLm90aGVySXRlbS50ZXh0ID0gdmFsdWU7IH1cclxuICAgICAgICBnZXQgdmlzaWJsZUNob2ljZXMoKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNPdGhlciAmJiB0aGlzLmNob2ljZXNPcmRlciA9PSBcIm5vbmVcIikgcmV0dXJuIHRoaXMuYWN0aXZlQ2hvaWNlcztcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuc29ydFZpc2libGVDaG9pY2VzKHRoaXMuYWN0aXZlQ2hvaWNlcy5zbGljZSgpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3RoZXIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMub3RoZXJJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldCBhY3RpdmVDaG9pY2VzKCk6IEFycmF5PEl0ZW1WYWx1ZT4geyByZXR1cm4gdGhpcy5jaG9pY2VzRnJvbVVybCA/IHRoaXMuY2hvaWNlc0Zyb21VcmwgOiB0aGlzLmNob2ljZXM7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgICAgICBzdXBlci5vbkNoZWNrRm9yRXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc090aGVyU2VsZWN0ZWQgfHwgdGhpcy5jb21tZW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5vdGhlckVycm9yVGV4dDtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVyUmVxdWlyZWRFcnJvclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3IodGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSB7IHJldHVybiB0aGlzLnN0b3JlT3RoZXJzQXNDb21tZW50ICYmICh0aGlzLnN1cnZleSAhPSBudWxsID8gdGhpcy5zdXJ2ZXkuc3RvcmVPdGhlcnNBc0NvbW1lbnQgOiB0cnVlKTsgfVxyXG4gICAgICAgIG9uU3VydmV5TG9hZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc0J5VXJsKSB0aGlzLmNob2ljZXNCeVVybC5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvbkxvYWRDaG9pY2VzRnJvbVVybChhcnJheTogQXJyYXk8SXRlbVZhbHVlPikge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JDb3VudCA9IHRoaXMuZXJyb3JzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc0J5VXJsICYmIHRoaXMuY2hvaWNlc0J5VXJsLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHRoaXMuY2hvaWNlc0J5VXJsLmVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IDAgfHwgdGhpcy5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBuZXdDaG9pY2VzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGFycmF5ICYmIGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG5ld0Nob2ljZXMgPSBuZXcgQXJyYXk8SXRlbVZhbHVlPigpO1xyXG4gICAgICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEobmV3Q2hvaWNlcywgYXJyYXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc0Zyb21VcmwgPSBuZXdDaG9pY2VzO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNvcnRWaXNpYmxlQ2hvaWNlcyhhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICB2YXIgb3JkZXIgPSB0aGlzLmNob2ljZXNPcmRlci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJhc2NcIikgcmV0dXJuIHRoaXMuc29ydEFycmF5KGFycmF5LCAxKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwiZGVzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIC0xKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwicmFuZG9tXCIpIHJldHVybiB0aGlzLnJhbmRvbWl6ZUFycmF5KGFycmF5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNvcnRBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPiwgbXVsdDogbnVtYmVyKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS50ZXh0IDwgYi50ZXh0KSByZXR1cm4gLTEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgaWYgKGEudGV4dCA+IGIudGV4dCkgcmV0dXJuIDEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJhbmRvbWl6ZUFycmF5KGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBhcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBhcnJheVtqXSA9IHRlbXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveEJhc2UgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gMTtcclxuICAgICAgICBjb2xDb3VudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzZWxlY3RiYXNlXCIsIFtcImhhc0NvbW1lbnQ6Ym9vbGVhblwiLCBcImhhc090aGVyOmJvb2xlYW5cIixcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgSXRlbVZhbHVlLnNldERhdGEob2JqLmNob2ljZXMsIHZhbHVlKTsgfX0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNob2ljZXNPcmRlclwiLCBkZWZhdWx0OiBcIm5vbmVcIiwgY2hvaWNlczogW1wibm9uZVwiLCBcImFzY1wiLCBcImRlc2NcIiwgXCJyYW5kb21cIl0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlc0J5VXJsOnJlc3RmdWxsXCIsIGNsYXNzTmFtZTogXCJDaG9pY2VzUmVzdGZ1bGxcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY2hvaWNlc0J5VXJsLmlzRW1wdHkgPyBudWxsIDogb2JqLmNob2ljZXNCeVVybDsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzQnlVcmwuc2V0RGF0YSh2YWx1ZSk7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwib3RoZXJUZXh0XCIsIGRlZmF1bHQ6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpIH0sIFwib3RoZXJFcnJvclRleHRcIixcclxuICAgICAgICB7IG5hbWU6IFwic3RvcmVPdGhlcnNBc0NvbW1lbnQ6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfV0sIG51bGwsIFwicXVlc3Rpb25cIik7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94YmFzZVwiLCBbeyBuYW1lOiBcImNvbENvdW50Om51bWJlclwiLCBkZWZhdWx0OiAxLCBjaG9pY2VzOiBbMCwgMSwgMiwgMywgNF0gfV0sIG51bGwsIFwic2VsZWN0YmFzZVwiKTtcclxufVxyXG4iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRIYXNPdGhlcih2YWw6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsLmluZGV4T2YodGhpcy5vdGhlckl0ZW0udmFsdWUpID49IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZUZyb21EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsIHx8ICF2YWwubGVuZ3RoKSByZXR1cm4gdmFsO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxbaV0gPT0gdGhpcy5vdGhlckl0ZW0udmFsdWUpIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNVbmtub3duVmFsdWUodmFsW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudCA9IHZhbFtpXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsID0gdmFsLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF2YWwgfHwgIXZhbC5sZW5ndGgpIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q29tbWVudCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdWYWwgPSB2YWwuc2xpY2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5nZXRDb21tZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdWYWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNoZWNrYm94XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94XCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ29tbWVudE1vZGVsIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHB1YmxpYyByb3dzOiBudW1iZXIgPSA0O1xyXG4gICAgICAgIHB1YmxpYyBjb2xzOiBudW1iZXIgPSA1MDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjb21tZW50XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5pc0VtcHR5KCkgfHwgdGhpcy52YWx1ZSA9PSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21tZW50XCIsIFt7IG5hbWU6IFwiY29sczpudW1iZXJcIiwgZGVmYXVsdDogNTAgfSwgeyBuYW1lOiBcInJvd3M6bnVtYmVyXCIsIGRlZmF1bHQ6IDQgfV0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNvbW1lbnRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9zZWxlY3RiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Ecm9wZG93bk1vZGVsIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgICAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCkgeyByZXR1cm4gKHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSkgPyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3B0aW9uc0NhcHRpb25cIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9wdGlvbnNDYXB0aW9uKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJkcm9wZG93blwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJkcm9wZG93blwiLCBbeyBuYW1lOiBcIm9wdGlvbnNDYXB0aW9uXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLm9wdGlvbnNDYXB0aW9uVmFsdWU7IH19XSxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Ecm9wZG93bk1vZGVsKFwiXCIpOyB9LCBcInNlbGVjdGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25GaWxlTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93UHJldmlld1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1VwbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByZXZpZXdWYWx1ZUxvYWRlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHB1YmxpYyBpbWFnZUhlaWdodDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBpbWFnZVdpZHRoOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgbWF4U2l6ZTogbnVtYmVyO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImZpbGVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzaG93UHJldmlldygpIHsgcmV0dXJuIHRoaXMuc2hvd1ByZXZpZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc2hvd1ByZXZpZXcodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5zaG93UHJldmlld1ZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgbG9hZEZpbGUoZmlsZTogRmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSAmJiAhdGhpcy5zdXJ2ZXkudXBsb2FkRmlsZSh0aGlzLm5hbWUsIGZpbGUsIHRoaXMuc3RvcmVEYXRhQXNUZXh0LCBmdW5jdGlvbiAoc3RhdHVzOiBzdHJpbmcpIHsgc2VsZi5pc1VwbG9hZGluZyA9IHN0YXR1cyA9PSBcInVwbG9hZGluZ1wiOyAgfSkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zZXRGaWxlVmFsdWUoZmlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBwcmV2aWV3VmFsdWU6IGFueTtcclxuICAgICAgICBwcm90ZWN0ZWQgc2V0RmlsZVZhbHVlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKCFGaWxlUmVhZGVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zaG93UHJldmlldyAmJiAhdGhpcy5zdG9yZURhdGFBc1RleHQpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tGaWxlRm9yRXJyb3JzKGZpbGUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zaG93UHJldmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJldmlld1ZhbHVlID0gc2VsZi5pc0ZpbGVJbWFnZShmaWxlKSA/IGZpbGVSZWFkZXIucmVzdWx0IDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmZpcmVDYWxsYmFjayhzZWxmLnByZXZpZXdWYWx1ZUxvYWRlZENhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnN0b3JlRGF0YUFzVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBmaWxlUmVhZGVyLnJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNVcGxvYWRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ1cGxvYWRpbmdGaWxlXCIpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZpbGVGb3JFcnJvcnMoZmlsZTogRmlsZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JMZW5ndGggPSB0aGlzLmVycm9ycyA/IHRoaXMuZXJyb3JzLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFNpemUgPiAwICYmIGZpbGUuc2l6ZSA+IHRoaXMubWF4U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgRXhjZWVkU2l6ZUVycm9yKHRoaXMubWF4U2l6ZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvckxlbmd0aCAhPSB0aGlzLmVycm9ycy5sZW5ndGggfHwgdGhpcy5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzRmlsZUltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICAgICAgaWYgKCFmaWxlIHx8ICFmaWxlLnR5cGUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0ciA9IGZpbGUudHlwZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyLmluZGV4T2YoXCJpbWFnZVwiKSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJmaWxlXCIsIFtcInNob3dQcmV2aWV3OmJvb2xlYW5cIiwgXCJpbWFnZUhlaWdodFwiLCBcImltYWdlV2lkdGhcIiwgXCJzdG9yZURhdGFBc1RleHQ6Ym9vbGVhblwiLCBcIm1heFNpemU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25GaWxlTW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImZpbGVcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkZpbGVNb2RlbChuYW1lKTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25iYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25IdG1sTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgaHRtbFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiaHRtbFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGh0bWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaHRtbFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBodG1sKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5odG1sVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRIdG1sKCkgeyByZXR1cm4gdGhpcy5zdXJ2ZXkgPyB0aGlzLnN1cnZleS5wcm9jZXNzSHRtbCh0aGlzLmh0bWwpIDogdGhpcy5odG1sOyB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiaHRtbFwiLCBbXCJodG1sOmh0bWxcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkh0bWxNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvbmJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImh0bWxcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkh0bWxNb2RlbChuYW1lKTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERhdGEge1xyXG4gICAgICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvd01vZGVsKTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhSb3dNb2RlbCBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU1hdHJpeERhdGE7XHJcbiAgICAgICAgcHJvdGVjdGVkIHJvd1ZhbHVlOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnksIHB1YmxpYyB0ZXh0OiBzdHJpbmcsIHB1YmxpYyBmdWxsTmFtZTogc3RyaW5nLCBkYXRhOiBJTWF0cml4RGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLnJvd1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSkgdGhpcy5kYXRhLm9uTWF0cml4Um93Q2hhbmdlZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEYXRhIHtcclxuICAgICAgICBwcml2YXRlIGNvbHVtbnNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGdlbmVyYXRlZFZpc2libGVSb3dzOiBBcnJheTxNYXRyaXhSb3dNb2RlbD47XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93c1ZhbHVlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjb2x1bW5zKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgICAgICBzZXQgY29sdW1ucyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNvbHVtbnNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICAgICAgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yb3dzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4Um93TW9kZWw+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhSb3dNb2RlbD4oKTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KHRoaXMucm93c1tpXS52YWx1ZSwgdGhpcy5yb3dzW2ldLnRleHQsIHRoaXMubmFtZSArICdfJyArIHRoaXMucm93c1tpXS52YWx1ZS50b1N0cmluZygpLCB2YWxbdGhpcy5yb3dzW2ldLnZhbHVlXSkpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyhudWxsLCBcIlwiLCB0aGlzLm5hbWUsIHZhbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3cobmFtZTogYW55LCB0ZXh0OiBzdHJpbmcsIGZ1bGxOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBNYXRyaXhSb3dNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4Um93TW9kZWwobmFtZSwgdGV4dCwgZnVsbE5hbWUsIHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nIHx8ICEodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgfHwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yb3dzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzWzBdLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvd1ZhbCA9IHZhbFtyb3cubmFtZV0gPyB2YWxbcm93Lm5hbWVdIDogbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLnZhbHVlID0gcm93VmFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lNYXRyaXhEYXRhXHJcbiAgICAgICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93TW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzUm93cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShyb3cudmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWVbcm93Lm5hbWVdID0gcm93LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4XCIsIFt7IG5hbWU6IFwiY29sdW1uczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNvbHVtbnMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNvbHVtbnMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgeyBuYW1lOiBcInJvd3M6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yb3dzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yb3dzID0gdmFsdWU7IH0gfV0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeE1vZGVsKG5hbWUpOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmNvbHVtbnMgPSBbXCJDb2x1bW4gMVwiLCBcIkNvbHVtbiAyXCIsIFwiQ29sdW1uIDNcIl07IHJldHVybiBxOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYWRpb2dyb3VwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhZGlvZ3JvdXBcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7fSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMjU7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpc0VtcHR5KCk6IGJvb2xlYW4geyAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7IH1cclxuICAgICAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0XCIsIFt7IG5hbWU6IFwic2l6ZTpudW1iZXJcIiwgZGVmYXVsdDogMjUgfV0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fZHJvcGRvd24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fY2hlY2tib3gudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fcmFkaW9ncm91cC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl90ZXh0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2NvbW1lbnQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fYmFzZXNlbGVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgICAgICBvblJvd0NoYW5nZWQoY2VsbDogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIG5ld1Jvd1ZhbHVlOiBhbnkpO1xyXG4gICAgICAgIGNvbHVtbnM6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPjtcclxuICAgICAgICBjcmVhdGVRdWVzdGlvbihyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25Db2x1bW4gZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgb3B0aW9uc0NhcHRpb246IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgaXNSZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBoYXNPdGhlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBtaW5XaWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgY2VsbFR5cGU6IHN0cmluZyA9IFwiZGVmYXVsdFwiO1xyXG4gICAgICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKSB7IHJldHVybiBcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7IHJldHVybiB0aGlzLnRpdGxlVmFsdWUgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLm5hbWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sQ291bnRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAtMSB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY2hvaWNlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93bkNlbGwge1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogUXVlc3Rpb247XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHB1YmxpYyByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZSA9IGRhdGEuY3JlYXRlUXVlc3Rpb24odGhpcy5yb3csIHRoaXMuY29sdW1uKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlLnNldERhdGEocm93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbiB7IHJldHVybiB0aGlzLnF1ZXN0aW9uVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnF1ZXN0aW9uLnZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UgaW1wbGVtZW50cyBJU3VydmV5RGF0YSB7XHJcbiAgICAgICAgcHJvdGVjdGVkIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGE7XHJcbiAgICAgICAgcHJpdmF0ZSByb3dWYWx1ZXM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSByb3dDb21tZW50czogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGlzU2V0dGluZ1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBjZWxsczogQXJyYXk8TWF0cml4RHJvcGRvd25DZWxsPiA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIG51bGw7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5yb3dWYWx1ZXM7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1NldHRpbmdWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWVzID0ge307XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd1ZhbHVlc1trZXldID0gdmFsdWVba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbaV0ucXVlc3Rpb24ub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy5nZXRWYWx1ZSh0aGlzLmNlbGxzW2ldLmNvbHVtbi5uYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1NldHRpbmdWYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93VmFsdWVzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU2V0dGluZ1ZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gXCJcIikgbmV3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXNbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnJvd1ZhbHVlc1tuYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEub25Sb3dDaGFuZ2VkKHRoaXMsIHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dDb21tZW50c1tuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93Q29tbWVudHNbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGJ1aWxkQ2VsbHMoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5zID0gdGhpcy5kYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbHVtbiA9IGNvbHVtbnNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2godGhpcy5jcmVhdGVDZWxsKGNvbHVtbikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBNYXRyaXhEcm9wZG93bkNlbGwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duQ2VsbChjb2x1bW4sIHRoaXMsIHRoaXMuZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY29sdW1uc1ZhbHVlOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4gPSBbXTtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVkVmlzaWJsZVJvd3M6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPjtcclxuICAgICAgICBwcml2YXRlIGNlbGxUeXBlVmFsdWU6IHN0cmluZyA9IFwiZHJvcGRvd25cIjtcclxuICAgICAgICBwcml2YXRlIGNvbHVtbkNvbENvdW50VmFsdWU6IG51bWJlciA9IDA7XHJcbiAgICAgICAgcHVibGljIGNvbHVtbk1pbldpZHRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBob3Jpem9udGFsU2Nyb2xsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIGNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgcHVibGljIHVwZGF0ZUNlbGxzQ2FsbGJhazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25iYXNlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29sdW1ucygpOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbHVtbnModmFsdWU6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPikge1xyXG4gICAgICAgICAgICB0aGlzLmNvbHVtbnNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNlbGxUeXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNlbGxUeXBlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNlbGxUeXBlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2VsbFR5cGUgPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVHlwZVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudXBkYXRlQ2VsbHNDYWxsYmFrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2x1bW5Db2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2x1bW5Db2xDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb2x1bW5Db2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY29sdW1uQ29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnVwZGF0ZUNlbGxzQ2FsbGJhayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDb2x1bW5UaXRsZShjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNvbHVtbi50aXRsZTtcclxuICAgICAgICAgICAgaWYgKGNvbHVtbi5pc1JlcXVpcmVkICYmIHRoaXMuc3VydmV5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZVRleHQgPSB0aGlzLnN1cnZleS5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZVRleHQpIHJlcXVpcmVUZXh0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVxdWlyZVRleHQgKyByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENvbHVtbldpZHRoKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uLm1pbldpZHRoID8gY29sdW1uLm1pbldpZHRoIDogdGhpcy5jb2x1bW5NaW5XaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvcHRpb25zQ2FwdGlvbigpIHsgcmV0dXJuICh0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUpID8gdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wdGlvbnNDYXB0aW9uXCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBvcHRpb25zQ2FwdGlvbihuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGFkZENvbHVtbihuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTWF0cml4RHJvcGRvd25Db2x1bW4ge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICAgICAgdGhpcy5jb2x1bW5zVmFsdWUucHVzaChjb2x1bW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gY29sdW1uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gdGhpcy5nZW5lcmF0ZVJvd3MoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZW5lcmF0ZVJvd3MoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2U+IHsgcmV0dXJuIG51bGw7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1ZhbHVlKGN1clZhbHVlOiBhbnkpOiBhbnkgeyByZXR1cm4gIWN1clZhbHVlID8ge30gOiBjdXJWYWx1ZTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRSb3dWYWx1ZShyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBxdWVzdGlvblZhbHVlOiBhbnksIGNyZWF0ZTogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHF1ZXN0aW9uVmFsdWVbcm93LnJvd05hbWVdID8gcXVlc3Rpb25WYWx1ZVtyb3cucm93TmFtZV0gOiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCAmJiBjcmVhdGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25WYWx1ZVtyb3cucm93TmFtZV0gPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nIHx8ICEodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgfHwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV0udmFsdWUgPSB0aGlzLmdldFJvd1ZhbHVlKHJvdywgdmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvc0luQ29sdW1ucyA9IHRoaXMuaGFzRXJyb3JJbkNvbHVtbnMoZmlyZUNhbGxiYWNrKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spIHx8IGVycm9zSW5Db2x1bW5zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGhhc0Vycm9ySW5Db2x1bW5zKGZpcmVDYWxsYmFjazogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgY29sSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGxzID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS5jZWxscztcclxuICAgICAgICAgICAgICAgICAgICByZXMgPSBjZWxscyAmJiBjZWxsc1tjb2xJbmRleF0gJiYgY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uICYmIGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbi5oYXNFcnJvcnMoZmlyZUNhbGxiYWNrKSB8fCByZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JTWF0cml4RHJvcGRvd25EYXRhXHJcbiAgICAgICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuY3JlYXRlUXVlc3Rpb25Db3JlKHJvdywgY29sdW1uKTtcclxuICAgICAgICAgICAgcXVlc3Rpb24ubmFtZSA9IGNvbHVtbi5uYW1lO1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5pc1JlcXVpcmVkID0gY29sdW1uLmlzUmVxdWlyZWQ7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLmhhc090aGVyID0gY29sdW1uLmhhc090aGVyO1xyXG4gICAgICAgICAgICBpZiAoY29sdW1uLmhhc090aGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb24gaW5zdGFuY2VvZiBRdWVzdGlvblNlbGVjdEJhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAoPFF1ZXN0aW9uU2VsZWN0QmFzZT5xdWVzdGlvbikuc3RvcmVPdGhlcnNBc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcXVlc3Rpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVRdWVzdGlvbkNvcmUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uIHtcclxuICAgICAgICAgICAgdmFyIGNlbGxUeXBlID0gY29sdW1uLmNlbGxUeXBlID09IFwiZGVmYXVsdFwiID8gdGhpcy5jZWxsVHlwZSA6IGNvbHVtbi5jZWxsVHlwZTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldFF1ZXN0aW9uTmFtZShyb3csIGNvbHVtbik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSBcImNoZWNrYm94XCIpIHJldHVybiB0aGlzLmNyZWF0ZUNoZWNrYm94KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgICAgIGlmIChjZWxsVHlwZSA9PSBcInJhZGlvZ3JvdXBcIikgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaW9ncm91cChuYW1lLCBjb2x1bW4pO1xyXG4gICAgICAgICAgICBpZiAoY2VsbFR5cGUgPT0gXCJ0ZXh0XCIpIHJldHVybiB0aGlzLmNyZWF0ZVRleHQobmFtZSwgY29sdW1uKTtcclxuICAgICAgICAgICAgaWYgKGNlbGxUeXBlID09IFwiY29tbWVudFwiKSByZXR1cm4gdGhpcy5jcmVhdGVDb21tZW50KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURyb3Bkb3duKG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRRdWVzdGlvbk5hbWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7IHJldHVybiByb3cucm93TmFtZSArIFwiX1wiICsgY29sdW1uLm5hbWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2x1bW4uY2hvaWNlcyAmJiBjb2x1bW4uY2hvaWNlcy5sZW5ndGggPiAwID8gY29sdW1uLmNob2ljZXMgOiB0aGlzLmNob2ljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRDb2x1bW5PcHRpb25zQ2FwdGlvbihjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi5vcHRpb25zQ2FwdGlvbiA/IGNvbHVtbi5vcHRpb25zQ2FwdGlvbiA6IHRoaXMub3B0aW9uc0NhcHRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVEcm9wZG93bihuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkRyb3Bkb3duTW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgcSA9IDxRdWVzdGlvbkRyb3Bkb3duTW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJkcm9wZG93blwiLCBuYW1lKTtcclxuICAgICAgICAgICAgcS5jaG9pY2VzID0gdGhpcy5nZXRDb2x1bW5DaG9pY2VzKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHEub3B0aW9uc0NhcHRpb24gPSB0aGlzLmdldENvbHVtbk9wdGlvbnNDYXB0aW9uKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlQ2hlY2tib3gobmFtZTogc3RyaW5nLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb25DaGVja2JveE1vZGVsIHtcclxuICAgICAgICAgICAgdmFyIHEgPSA8UXVlc3Rpb25DaGVja2JveE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgbmFtZSk7XHJcbiAgICAgICAgICAgIHEuY2hvaWNlcyA9IHRoaXMuZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW4pO1xyXG4gICAgICAgICAgICBxLmNvbENvdW50ID0gY29sdW1uLmNvbENvdW50ID4gLSAxID8gY29sdW1uLmNvbENvdW50IDogdGhpcy5jb2x1bW5Db2xDb3VudDtcclxuICAgICAgICAgICAgcmV0dXJuIHE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVSYWRpb2dyb3VwKG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIHtcclxuICAgICAgICAgICAgdmFyIHEgPSA8UXVlc3Rpb25SYWRpb2dyb3VwTW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJyYWRpb2dyb3VwXCIsIG5hbWUpO1xyXG4gICAgICAgICAgICBxLmNob2ljZXMgPSB0aGlzLmdldENvbHVtbkNob2ljZXMoY29sdW1uKTtcclxuICAgICAgICAgICAgcS5jb2xDb3VudCA9IGNvbHVtbi5jb2xDb3VudCA+IC0gMSA/IGNvbHVtbi5jb2xDb3VudCA6IHRoaXMuY29sdW1uQ29sQ291bnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvblRleHRNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiA8UXVlc3Rpb25UZXh0TW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJ0ZXh0XCIsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlQ29tbWVudChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkNvbW1lbnRNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiA8UXVlc3Rpb25Db21tZW50TW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJjb21tZW50XCIsIG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlQ2VsbFF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHJldHVybiA8UXVlc3Rpb24+UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkZWxldGVSb3dWYWx1ZShuZXdWYWx1ZTogYW55LCByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlKTogYW55IHtcclxuICAgICAgICAgICAgZGVsZXRlIG5ld1ZhbHVlW3Jvdy5yb3dOYW1lXTtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5ld1ZhbHVlKS5sZW5ndGggPT0gMCA/IG51bGwgOiBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb25Sb3dDaGFuZ2VkKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIG5ld1Jvd1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHJvd1ZhbHVlID0gdGhpcy5nZXRSb3dWYWx1ZShyb3csIG5ld1ZhbHVlLCB0cnVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJvd1ZhbHVlKSBkZWxldGUgcm93VmFsdWVba2V5XTtcclxuICAgICAgICAgICAgaWYgKG5ld1Jvd1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdSb3dWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobmV3Um93VmFsdWUpKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBuZXdSb3dWYWx1ZSkgcm93VmFsdWVba2V5XSA9IG5ld1Jvd1ZhbHVlW2tleV07XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyb3dWYWx1ZSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5kZWxldGVSb3dWYWx1ZShuZXdWYWx1ZSwgcm93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInRpdGxlXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgXCJvcHRpb25zQ2FwdGlvblwiLCB7IG5hbWU6IFwiY2VsbFR5cGVcIiwgZGVmYXVsdDogXCJkZWZhdWx0XCIsIGNob2ljZXM6IFtcImRlZmF1bHRcIiwgXCJkcm9wZG93blwiLCBcImNoZWNrYm94XCIsIFwicmFkaW9ncm91cFwiLCBcInRleHRcIiwgXCJjb21tZW50XCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNvbENvdW50XCIsIGRlZmF1bHQ6IC0xLCBjaG9pY2VzOiBbLTEsIDAsIDEsIDIsIDMsIDRdIH0sIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLCBcIm1pbldpZHRoXCJdLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNYXRyaXhEcm9wZG93bkNvbHVtbihcIlwiKTsgfSk7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duYmFzZVwiLCBbeyBuYW1lOiBcImNvbHVtbnM6bWF0cml4ZHJvcGRvd25jb2x1bW5zXCIsIGNsYXNzTmFtZTogXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiIH0sXHJcbiAgICAgICAgXCJob3Jpem9udGFsU2Nyb2xsOmJvb2xlYW5cIiwgXHJcbiAgICAgICAgeyBuYW1lOiBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH19LFxyXG4gICAgICAgIHsgbmFtZTogXCJvcHRpb25zQ2FwdGlvblwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5vcHRpb25zQ2FwdGlvblZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNlbGxUeXBlXCIsIGRlZmF1bHQ6IFwiZHJvcGRvd25cIiwgY2hvaWNlczogW1wiZHJvcGRvd25cIiwgXCJjaGVja2JveFwiLCBcInJhZGlvZ3JvdXBcIiwgXCJ0ZXh0XCIsIFwiY29tbWVudFwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjb2x1bW5Db2xDb3VudFwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgMywgNF0gfSwgXCJjb2x1bW5NaW5XaWR0aFwiXSxcclxuICAgICAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZShcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fbWF0cml4ZHJvcGRvd25iYXNlLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duUm93TW9kZWwgZXh0ZW5kcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihkYXRhLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZTsgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgICAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByb3dzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5yb3dzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yb3dzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdlbmVyYXRlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbD4oKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3MgfHwgdGhpcy5yb3dzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KHRoaXMucm93c1tpXS52YWx1ZSwgdGhpcy5yb3dzW2ldLnRleHQsIHZhbFt0aGlzLnJvd3NbaV0udmFsdWVdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeERyb3Bkb3duUm93TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duUm93TW9kZWwobmFtZSwgdGV4dCwgdGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuIFxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duXCIsIFt7IG5hbWU6IFwicm93czppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLnJvd3MgPSB2YWx1ZTsgfX1dLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwoXCJcIik7IH0sIFwibWF0cml4ZHJvcGRvd25iYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFsxLCAyLCAzLCA0LCA1XTsgcS5yb3dzID0gW1wiUm93IDFcIiwgXCJSb3cgMlwiXTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMVwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMlwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gM1wiKTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHluYW1pY1Jvd01vZGVsIGV4dGVuZHMgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmRleDogbnVtYmVyLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGRhdGEsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gXCJyb3dcIiArIHRoaXMuaW5kZXg7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgICAgICBzdGF0aWMgTWF4Um93Q291bnQgPSAxMDA7XHJcbiAgICAgICAgcHJpdmF0ZSByb3dDb3VudGVyID0gMDtcclxuICAgICAgICBwcml2YXRlIHJvd0NvdW50VmFsdWU6IG51bWJlciA9IDI7XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRSb3dUZXh0VmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG1pblJvd0NvdW50ID0gMDtcclxuICAgICAgICBwdWJsaWMgcm93Q291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHluYW1pY1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJvd0NvdW50KCkgeyByZXR1cm4gdGhpcy5yb3dDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCByb3dDb3VudCh2YWw6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsIDwgMCB8fCB2YWwgPiBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbC5NYXhSb3dDb3VudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJvd0NvdW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUubGVuZ3RoID4gdmFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcVZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBxVmFsLnNwbGljZSh2YWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHFWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yb3dDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRSb3coKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3cobnVsbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucm93Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbW92ZVJvdyhpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5yb3dDb3VudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiBpbmRleCA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFsLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLmRlbGV0ZVJvd1ZhbHVlKHZhbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucm93Q291bnQtLTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBhZGRSb3dUZXh0KCkgeyByZXR1cm4gdGhpcy5hZGRSb3dUZXh0VmFsdWUgPyB0aGlzLmFkZFJvd1RleHRWYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJhZGRSb3dcIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGFkZFJvd1RleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFJvd1RleHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHJlbW92ZVJvd1RleHQoKSB7IHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicmVtb3ZlUm93XCIpOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBjYWNoZWRWaXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSB0aGlzLnJvd0NvdW50KSByZXR1cm4gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVJvd3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRXJyb3JJblJvd3MoKSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtaW5Sb3dDb3VudEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluUm93Q291bnQpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBoYXNFcnJvckluUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluUm93Q291bnQgPD0gMCB8fCAhdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBzZXRSb3dDb3VudCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgcm93SW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3Nbcm93SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyb3cuaXNFbXB0eSkgc2V0Um93Q291bnQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2V0Um93Q291bnQgPCB0aGlzLm1pblJvd0NvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVSb3dzKCk6IEFycmF5PE1hdHJpeER5bmFtaWNSb3dNb2RlbD4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PE1hdHJpeER5bmFtaWNSb3dNb2RlbD4oKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucm93Q291bnQgPT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5nZXRSb3dWYWx1ZUJ5SW5kZXgodmFsLCBpKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3codmFsdWU6IGFueSk6IE1hdHJpeER5bmFtaWNSb3dNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHluYW1pY1Jvd01vZGVsKHRoaXMucm93Q291bnRlciArKywgdGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3VmFsdWUoY3VyVmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBjdXJWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgciA9IFtdO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IHRoaXMucm93Q291bnQpIHJlc3VsdC5zcGxpY2UodGhpcy5yb3dDb3VudCAtIDEpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gcmVzdWx0Lmxlbmd0aDsgaSA8IHRoaXMucm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe30pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkZWxldGVSb3dWYWx1ZShuZXdWYWx1ZTogYW55LCByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGlzRW1wdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld1ZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobmV3VmFsdWVbaV0pLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGlzRW1wdHkgPyBudWxsIDogbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGdldFJvd1ZhbHVlQnlJbmRleChxdWVzdGlvblZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHF1ZXN0aW9uVmFsdWUubGVuZ3RoID8gcXVlc3Rpb25WYWx1ZVtpbmRleF0gOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0Um93VmFsdWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgcXVlc3Rpb25WYWx1ZTogYW55LCBjcmVhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJvd1ZhbHVlQnlJbmRleChxdWVzdGlvblZhbHVlLCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmluZGV4T2Yocm93KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkeW5hbWljXCIsIFt7IG5hbWU6IFwicm93Q291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDIgfSwgeyBuYW1lOiBcIm1pblJvd0NvdW50Om51bWJlclwiLCBkZWZhdWx0OiAwIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImFkZFJvd1RleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouYWRkUm93VGV4dFZhbHVlOyB9IH1dLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWwoXCJcIik7IH0sIFwibWF0cml4ZHJvcGRvd25iYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkeW5hbWljXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU11bHRpcGxlVGV4dERhdGE7XHJcbiAgICAgICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnkgPSBudWxsLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dGl0ZW1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZShuZXdUZXh0OiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gbmV3VGV4dDsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEgPyB0aGlzLmRhdGEuZ2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRNdWx0aXBsZVRleHRWYWx1ZSh0aGlzLm5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBvblZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGU7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gMTtcclxuICAgICAgICBjb2xDb3VudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBwdWJsaWMgaXRlbVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIHByaXZhdGUgaXRlbXNWYWx1ZXM6IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4gPSBuZXcgQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPigpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5maXJlQ2FsbGJhY2soc2VsZi5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtdWx0aXBsZXRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpdGVtcygpOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+IHsgcmV0dXJuIHRoaXMuaXRlbXNWYWx1ZXM7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGl0ZW1zKHZhbHVlOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXNWYWx1ZXMgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBBZGRJdGVtKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlVGV4dEl0ZW0obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMSB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Um93cygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgdmFyIGNvbENvdW50ID0gdGhpcy5jb2xDb3VudDtcclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5pdGVtcztcclxuICAgICAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByb3dzLnB1c2goW10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcm93c1tyb3dzLmxlbmd0aCAtIDFdLnB1c2goaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBjb2xDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcm93cztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25JdGVtVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0SXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbChuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZykgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgKHRoaXMuaXRlbXNbaV0ubmFtZSBpbiB0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1WYWx1ZSA9IHRoaXMudmFsdWVbdGhpcy5pdGVtc1tpXS5uYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNbaV0ub25WYWx1ZUNoYW5nZWQoaXRlbVZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgcnVuVmFsaWRhdG9ycygpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHN1cGVyLnJ1blZhbGlkYXRvcnMoKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBWYWxpZGF0b3JSdW5uZXIoKS5ydW4odGhpcy5pdGVtc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lNdWx0aXBsZVRleHREYXRhXHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRpdGVtXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInRpdGxlXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dmFsaWRhdG9yXCIsIGNsYXNzTmFtZVBhcnQ6IFwidmFsaWRhdG9yXCIgfV0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtTW9kZWwoXCJcIik7IH0pO1xyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRcIiwgW3sgbmFtZTogXCIhaXRlbXM6dGV4dGl0ZW1zXCIsIGNsYXNzTmFtZTogXCJtdWx0aXBsZXRleHRpdGVtXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwiaXRlbVNpemU6bnVtYmVyXCIsIGRlZmF1bHQ6IDI1IH0sIHsgbmFtZTogXCJjb2xDb3VudDpudW1iZXJcIiwgZGVmYXVsdDogMSwgY2hvaWNlczogWzEsIDIsIDMsIDRdIH1dLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtdWx0aXBsZXRleHRcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChuYW1lKTsgcS5BZGRJdGVtKFwidGV4dDFcIik7IHEuQWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhdGluZ01vZGVsIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHN0YXRpYyBkZWZhdWx0UmF0ZVZhbHVlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHJhdGVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBtaW5pbnVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBtYXhpbXVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICByYXRlVmFsdWVzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgcmF0ZVZhbHVlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucmF0ZXM7IH1cclxuICAgICAgICBzZXQgcmF0ZVZhbHVlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJhdGVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmF0ZVZhbHVlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUmF0ZVZhbHVlcygpOiBJdGVtVmFsdWVbXSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJhdGVWYWx1ZXMubGVuZ3RoID4gMCkgcmV0dXJuIHRoaXMucmF0ZVZhbHVlcztcclxuICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uUmF0aW5nTW9kZWwuZGVmYXVsdFJhdGVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJhdGluZ1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9IFxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0cnVlOyB9XHJcbiAgICB9XHJcbiAgICBJdGVtVmFsdWUuc2V0RGF0YShRdWVzdGlvblJhdGluZ01vZGVsLmRlZmF1bHRSYXRlVmFsdWVzLCBbMSwgMiwgMywgNCwgNV0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhdGluZ1wiLCBbXCJoYXNDb21tZW50OmJvb2xlYW5cIiwgeyBuYW1lOiBcInJhdGVWYWx1ZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yYXRlVmFsdWVzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yYXRlVmFsdWVzID0gdmFsdWU7IH19LFxyXG4gICAgICAgIFwibWluaW51bVJhdGVEZXNjcmlwdGlvblwiLCBcIm1heGltdW1SYXRlRGVzY3JpcHRpb25cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZ01vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZ01vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8qIVxuKiBzdXJ2ZXlqcyAtIFN1cnZleSBKYXZhU2NyaXB0IGxpYnJhcnkgdjAuOS4xMlxuKiAoYykgQW5kcmV3IFRlbG5vdiAtIGh0dHA6Ly9zdXJ2ZXlqcy5vcmcvXG4qIExpY2Vuc2U6IE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApXG4qL1xuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgVHJpZ2dlciBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICAgICAgc3RhdGljIGdldCBvcGVyYXRvcnMoKSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlICE9IG51bGwpIHJldHVybiBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgICAgICBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gISghdmFsdWUpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlICE9IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBjb250YWluczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtcImluZGV4T2ZcIl0gJiYgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA+IC0xOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlIHx8ICF2YWx1ZVtcImluZGV4T2ZcIl0gfHwgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPiBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPD0gZXhwZWN0ZWRWYWx1ZTsgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFUcmlnZ2VyLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGVjayh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25GYWlsdXJlKCkgeyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtdO1xyXG4gICAgICAgIGRvQ29tcGxldGUoKTtcclxuICAgICAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlciBleHRlbmRzIFRyaWdnZXIge1xyXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHJvdGVjdGVkIG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldE93bmVyKG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc09uTmV4dFBhZ2UoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSBleHRlbmRzIFN1cnZleVRyaWdnZXIge1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ2aXNpYmxldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1TdWNjZXNzKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgICAgICBwcml2YXRlIG9uVHJpZ2dlcihmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3duZXIpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm93bmVyLmdldE9iamVjdHModGhpcy5wYWdlcywgdGhpcy5xdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMob2JqZWN0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbVN1Y2Nlc3MoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtRmFpbHVyZShpdGVtOiBhbnkpIHsgaXRlbS52aXNpYmxlID0gZmFsc2U7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiY29tcGxldGV0cmlnZ2VyXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzT25OZXh0UGFnZSgpIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TdWNjZXNzKCkgeyBpZiAodGhpcy5vd25lcikgdGhpcy5vd25lci5kb0NvbXBsZXRlKCk7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBwdWJsaWMgc2V0VG9OYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHNldFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGlzVmFyaWFibGU6IGJvb2xlYW47XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInNldHZhbHVldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNldFRvTmFtZSB8fCAhdGhpcy5vd25lcikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLnNldFRyaWdnZXJWYWx1ZSh0aGlzLnNldFRvTmFtZSwgdGhpcy5zZXRWYWx1ZSwgdGhpcy5pc1ZhcmlhYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRyaWdnZXJcIiwgW1wib3BlcmF0b3JcIiwgXCIhdmFsdWVcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIl0sIG51bGwsIFwidHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ2aXNpYmxldHJpZ2dlclwiLCBbXCJwYWdlc1wiLCBcInF1ZXN0aW9uc1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFN1cnZleVRyaWdnZXJWaXNpYmxlKCk7IH0sIFwic3VydmV5dHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21wbGV0ZXRyaWdnZXJcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNldHZhbHVldHJpZ2dlclwiLCBbXCIhc2V0VG9OYW1lXCIsIFwic2V0VmFsdWVcIiwgXCJpc1ZhcmlhYmxlOmJvb2xlYW5cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG59IiwiLyohXG4qIHN1cnZleWpzIC0gU3VydmV5IEphdmFTY3JpcHQgbGlicmFyeSB2MC45LjEyXG4qIChjKSBBbmRyZXcgVGVsbm92IC0gaHR0cDovL3N1cnZleWpzLm9yZy9cbiogTGljZW5zZTogTUlUIChodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocClcbiovXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInBhZ2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidHJpZ2dlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImR4U3VydmV5U2VydmljZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZXh0UHJlUHJvY2Vzc29yLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElTdXJ2ZXksIElTdXJ2ZXlUcmlnZ2VyT3duZXIge1xyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY29va2llTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdE9uUGFnZU5leHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIGNvbW1lbnRQcmVmaXg6IHN0cmluZyA9IFwiLUNvbW1lbnRcIjtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dOYXZpZ2F0aW9uQnV0dG9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dUaXRsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dQYWdlVGl0bGVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgY29tcGxldGVkSHRtbDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgcmVxdWlyZWRUZXh0OiBzdHJpbmcgPSBcIipcIjtcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25TdGFydEluZGV4OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvblRpdGxlVGVtcGxhdGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dQcm9ncmVzc0Jhcjogc3RyaW5nID0gXCJvZmZcIjtcclxuICAgICAgICBwdWJsaWMgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBnb05leHRQYWdlQXV0b21hdGljOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHBhZ2VzOiBBcnJheTxQYWdlTW9kZWw+ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgICAgICBwdWJsaWMgdHJpZ2dlcnM6IEFycmF5PFN1cnZleVRyaWdnZXI+ID0gbmV3IEFycmF5PFN1cnZleVRyaWdnZXI+KCk7XHJcbiAgICAgICAgcHVibGljIGNsZWFySW52aXNpYmxlVmFsdWVzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50UGFnZVZhbHVlOiBQYWdlTW9kZWwgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHZhcmlhYmxlc0hhc2g6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBwYWdlUHJldlRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgcGFnZU5leHRUZXh0VmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGNvbXBsZXRlVGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93UGFnZU51bWJlcnNWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOiBzdHJpbmcgPSBcIm9uXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZTogc3RyaW5nID0gXCJ0b3BcIjtcclxuICAgICAgICBwcml2YXRlIGxvY2FsZVZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHByaXZhdGUgaXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgcHJvY2Vzc2VkVGV4dFZhbHVlczogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNvbXBsZXRlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25DdXJyZW50UGFnZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblBhZ2VWaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblF1ZXN0aW9uQWRkZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25RdWVzdGlvblJlbW92ZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWxpZGF0ZVF1ZXN0aW9uOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUHJvY2Vzc0h0bWw6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25TZW5kUmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uR2V0UmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uVXBsb2FkRmlsZTogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBqc29uRXJyb3JzOiBBcnJheTxKc29uRXJyb3I+ID0gbnVsbDtcclxuXHJcbiAgICAgICAgcHVibGljIG1vZGU6IHN0cmluZyA9IFwibm9ybWFsXCI7XHJcblxyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yID0gbmV3IFRleHRQcmVQcm9jZXNzb3IoKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uSGFzVmFsdWUgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLnByb2Nlc3NlZFRleHRWYWx1ZXNbbmFtZS50b0xvd2VyQ2FzZSgpXTsgfTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uUHJvY2VzcyA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYuZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWUpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLmRhdGEgPSBzZWxmO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLnNldE93bmVyKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZUNyZWF0aW5nKCk7XHJcbiAgICAgICAgICAgIGlmIChqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEpzb25PYmplY3QoanNvbk9iaik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFN1cnZleUZyb21TZXJ2aWNlKHRoaXMuc3VydmV5SWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzdXJ2ZXlcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgbG9jYWxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmxvY2FsZVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBsb2NhbGUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2FsZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHN1cnZleUxvY2FsaXphdGlvbi5jdXJyZW50TG9jYWxlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRMb2NTdHJpbmcoc3RyOiBzdHJpbmcpIHsgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoc3RyKTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgZW1wdHlTdXJ2ZXlUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldExvY1N0cmluZyhcImVtcHR5U3VydmV5XCIpOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBwYWdlUHJldlRleHQoKSB7IHJldHVybiAodGhpcy5wYWdlUHJldlRleHRWYWx1ZSkgPyB0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlIDogdGhpcy5nZXRMb2NTdHJpbmcoXCJwYWdlUHJldlRleHRcIik7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHBhZ2VQcmV2VGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMucGFnZVByZXZUZXh0VmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcGFnZU5leHRUZXh0KCkgeyByZXR1cm4gKHRoaXMucGFnZU5leHRUZXh0VmFsdWUpID8gdGhpcy5wYWdlTmV4dFRleHRWYWx1ZSA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwicGFnZU5leHRUZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBwYWdlTmV4dFRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlVGV4dCgpIHsgcmV0dXJuICh0aGlzLmNvbXBsZXRlVGV4dFZhbHVlKSA/IHRoaXMuY29tcGxldGVUZXh0VmFsdWUgOiB0aGlzLmdldExvY1N0cmluZyhcImNvbXBsZXRlVGV4dFwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29tcGxldGVUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5jb21wbGV0ZVRleHRWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBzaG93UGFnZU51bWJlcnMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnNob3dQYWdlTnVtYmVyc1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBzaG93UGFnZU51bWJlcnModmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnNob3dQYWdlTnVtYmVycykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dQYWdlTnVtYmVyc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzaG93UXVlc3Rpb25OdW1iZXJzKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZTsgfTtcclxuICAgICAgICBwdWJsaWMgc2V0IHNob3dRdWVzdGlvbk51bWJlcnModmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycykgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwdWJsaWMgZ2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZTsgfTtcclxuICAgICAgICBwdWJsaWMgc2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgZGF0YShkYXRhOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoID0ge307XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtrZXldID0gZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhrZXksIGRhdGFba2V5XSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tbWVudHMoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5jb21tZW50UHJlZml4KSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZU1vZGVsPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGVzaWduTW9kZSkgcmV0dXJuIHRoaXMucGFnZXM7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8UGFnZU1vZGVsPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VzW2ldLmlzVmlzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMucGFnZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZXMubGVuZ3RoID09IDA7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IFBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGN1cnJlbnRQYWdlKCk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZVZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IG51bGwgJiYgdlBhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCBjdXJyZW50UGFnZSh2YWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdlBhZ2VzLmluZGV4T2YodmFsdWUpIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gdGhpcy5jdXJyZW50UGFnZVZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZS5zY3JvbGxUb0ZpcnN0UXVlc3Rpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN0YXRlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTG9hZGluZykgcmV0dXJuIFwibG9hZGluZ1wiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlZCkgcmV0dXJuIFwiY29tcGxldGVkXCI7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50UGFnZSkgPyBcInJ1bm5pbmdcIiA6IFwiZW1wdHlcIlxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzSGFzaCA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVQYWdlQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy52aXNpYmxlUGFnZXNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG1lcmdlVmFsdWVzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFkZXN0IHx8ICFzcmMpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNyYykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gc3JjW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVzdFtrZXldKSBkZXN0W2tleV0gPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHZhbHVlLCBkZXN0W2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkZXN0W2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlOiBQYWdlTW9kZWwsIG9sZFZhbHVlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ29sZEN1cnJlbnRQYWdlJzogb2xkVmFsdWUsICduZXdDdXJyZW50UGFnZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvZ3Jlc3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChpbmRleCAqIDEwMCAvIHRoaXMudmlzaWJsZVBhZ2VDb3VudCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRGVzaWduTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImRlc2lnbmVyXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc0Nvb2tpZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgICAgIHJldHVybiBjb29raWVzICYmIGNvb2tpZXMuaW5kZXhPZih0aGlzLmNvb2tpZU5hbWUgKyBcIj10cnVlXCIpID4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRDb29raWUoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPXRydWU7IGV4cGlyZXM9RnJpLCAzMSBEZWMgOTk5OSAwOjA6MCBHTVRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRlbGV0ZUNvb2tpZSgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gdGhpcy5jb29raWVOYW1lICsgXCI9O1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbmV4dFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGFzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrT25QYWdlVHJpZ2dlcnMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VuZFJlc3VsdE9uUGFnZU5leHQgJiYgdGhpcy5jbGllbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KHRoaXMuc3VydmV5UG9zdElkLCB0aGlzLmNsaWVudElkLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4ICsgMV07XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaXNDdXJyZW50UGFnZUhhc0Vycm9ycygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyh0cnVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHByZXZQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0ZpcnN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjb21wbGV0ZUxhc3RQYWdlKCkgOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzTGFzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHJldHVybiB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSB2UGFnZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRvQ29tcGxldGUoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsZWFySW52aXNpYmxlVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFySW52aXNpYmxlUXVlc3Rpb25WYWx1ZXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldENvb2tpZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldENvbXBsZXRlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29tcGxldGUuZmlyZSh0aGlzLCBudWxsKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5UG9zdElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRSZXN1bHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0Q29tcGxldGVkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9jZXNzZWRDb21wbGV0ZWRIdG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBsZXRlZEh0bWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NIdG1sKHRoaXMuY29tcGxldGVkSHRtbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFwiPGgzPlwiICsgdGhpcy5nZXRMb2NTdHJpbmcoXCJjb21wbGV0aW5nU3VydmV5XCIpICsgXCI8L2gzPlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZExvYWRpbmdIdG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIjxoMz5cIiArIHRoaXMuZ2V0TG9jU3RyaW5nKFwibG9hZGluZ1N1cnZleVwiKSArIFwiPC9oMz5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9ncmVzc1RleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMb2NTdHJpbmcoXCJwcm9ncmVzc1RleHRcIilbXCJmb3JtYXRcIl0oaW5kZXgsIHZQYWdlcy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdXBsb2FkRmlsZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbiwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZyk9PmFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgYWNjZXB0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5vblVwbG9hZEZpbGUuZmlyZSh0aGlzLCB7IG5hbWU6IG5hbWUsIGZpbGU6IGZpbGUsIGFjY2VwdDogYWNjZXB0IH0pO1xyXG4gICAgICAgICAgICBpZiAoIWFjY2VwdCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIXN0b3JlRGF0YUFzVGV4dCAmJiB0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlQ29yZShuYW1lLCBmaWxlLCB1cGxvYWRpbmdDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBsb2FkRmlsZUNvcmUobmFtZTogc3RyaW5nLCBmaWxlOiBGaWxlLCB1cGxvYWRpbmdDYWxsYmFjazogKHN0YXR1czogc3RyaW5nKSA9PiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAodXBsb2FkaW5nQ2FsbGJhY2spIHVwbG9hZGluZ0NhbGxiYWNrKFwidXBsb2FkaW5nXCIpO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuc2VuZEZpbGUodGhpcy5zdXJ2ZXlQb3N0SWQsIGZpbGUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXBsb2FkaW5nQ2FsbGJhY2spIHVwbG9hZGluZ0NhbGxiYWNrKHN1Y2Nlc3MgPyBcInN1Y2Nlc3NcIiA6IFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0VmFsdWUobmFtZSwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0UGFnZShpbmRleDogbnVtYmVyKTogUGFnZU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFnZXNbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGRQYWdlKHBhZ2U6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAocGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMucHVzaChwYWdlKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGROZXdQYWdlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3JlYXRlTmV3UGFnZShuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVtb3ZlUGFnZShwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5wYWdlcy5pbmRleE9mKHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9PSBwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5wYWdlcy5sZW5ndGggPiAwID8gdGhpcy5wYWdlc1swXSA6IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UXVlc3Rpb25CeU5hbWUobmFtZTogc3RyaW5nLCBjYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IElRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb25OYW1lID0gcXVlc3Rpb25zW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBxdWVzdGlvbk5hbWUgPSBxdWVzdGlvbk5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmKHF1ZXN0aW9uTmFtZSA9PSBuYW1lKSByZXR1cm4gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UXVlc3Rpb25zQnlOYW1lcyhuYW1lczogc3RyaW5nW10sIGNhc2VJbnNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogSVF1ZXN0aW9uW10ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWVzW2ldLCBjYXNlSW5zZW5zaXRpdmUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uKSByZXN1bHQucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uOiBJUXVlc3Rpb24pOiBQYWdlTW9kZWwge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UucXVlc3Rpb25zLmluZGV4T2YoPFF1ZXN0aW9uQmFzZT5xdWVzdGlvbikgPiAtMSkgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlQnlOYW1lKG5hbWU6IHN0cmluZyk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZXNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSk6IFBhZ2VNb2RlbFtde1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZ2V0UGFnZUJ5TmFtZShuYW1lc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZSkgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEFsbFF1ZXN0aW9ucyh2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SVF1ZXN0aW9uPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8SVF1ZXN0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5hZGRRdWVzdGlvbnNUb0xpc3QocmVzdWx0LCB2aXNpYmxlT25seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1BhZ2UobmFtZTogc3RyaW5nKSB7IHJldHVybiBuZXcgUGFnZU1vZGVsKG5hbWUpOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5uYW1lICE9IG5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb24gPSBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvU3VydmV5VmFsdWVDaGFuZ2VkKHF1ZXN0aW9uLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ25hbWUnOiBuYW1lLCAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ3ZhbHVlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvU3VydmV5VmFsdWVDaGFuZ2VkKHF1ZXN0aW9uc1tpXSwgdGhpcy5nZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBkb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja09uUGFnZVRyaWdnZXJzKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhxdWVzdGlvbi5uYW1lLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpOiBBcnJheTxRdWVzdGlvbkJhc2U+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgICAgIGlmICghcGFnZSkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcGFnZS5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUgfHwgIXF1ZXN0aW9uLm5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tUcmlnZ2VycyhuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIGlzT25OZXh0UGFnZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy50cmlnZ2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSB0aGlzLnRyaWdnZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRyaWdnZXIubmFtZSA9PSBuYW1lICYmIHRyaWdnZXIuaXNPbk5leHRQYWdlID09IGlzT25OZXh0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXIuY2hlY2sobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZG9RdWVzdGlvbnNPbkxvYWQoKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbnNbaV0ub25TdXJ2ZXlMb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBydW5Db25kaXRpb25zKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnNGb3JMaXN0KHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuQ29uZGl0aW9uc0Zvckxpc3QodGhpcy5wYWdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcnVuQ29uZGl0aW9uc0Zvckxpc3QobGlzdDogQXJyYXk8SUNvbmRpdGlvblJ1bm5lcj4pIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W2ldLnJ1bkNvbmRpdGlvbih0aGlzLnZhbHVlc0hhc2gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nID0gbnVsbCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICghcG9zdElkICYmIHRoaXMuc3VydmV5UG9zdElkKSB7XHJcbiAgICAgICAgICAgICAgICBwb3N0SWQgPSB0aGlzLnN1cnZleVBvc3RJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXBvc3RJZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5zZW5kUmVzdWx0KHBvc3RJZCwgdGhpcy5kYXRhLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblNlbmRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIHJlc3BvbnNlOiByZXNwb25zZX0pO1xyXG4gICAgICAgICAgICB9LCB0aGlzLmNsaWVudElkLCBpc1BhcnRpYWxDb21wbGV0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVzdWx0KHJlc3VsdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5nZXRSZXN1bHQocmVzdWx0SWQsIG5hbWUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBhbnlbXSwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkdldFJlc3VsdC5maXJlKHNlbGYsIHsgc3VjY2Vzczogc3VjY2VzcywgZGF0YTogZGF0YSwgZGF0YUxpc3Q6IGRhdGFMaXN0LCByZXNwb25zZTogcmVzcG9uc2UgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbG9hZFN1cnZleUZyb21TZXJ2aWNlKHN1cnZleUlkOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChzdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlJZCA9IHN1cnZleUlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5sb2FkU3VydmV5KHRoaXMuc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICYmIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0SnNvbk9iamVjdChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZFN1cnZleUZyb21TZXJ2aWNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkxvYWRTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVWaXNpYmxlSW5kZXhlcygpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXModGhpcy5zaG93UGFnZU51bWJlcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25QYWdlXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2aXNQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNQYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh2aXNQYWdlc1tpXS5xdWVzdGlvbnMsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSwgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXMoc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggPSB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyAoaW5kZXgrKykgOiAtMTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0ubnVtID0gc2hvd0luZGV4ICYmIHRoaXMucGFnZXNbaV0udmlzaWJsZSA/IHRoaXMucGFnZXNbaV0udmlzaWJsZUluZGV4ICsgMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyhxdWVzdGlvbnM6IElRdWVzdGlvbltdLCBzaG93SW5kZXg6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5zZXRWaXNpYmxlSW5kZXgoc2hvd0luZGV4ICYmIHF1ZXN0aW9uc1tpXS52aXNpYmxlICYmIHF1ZXN0aW9uc1tpXS5oYXNUaXRsZSA/IChpbmRleCsrKSA6IC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEpzb25PYmplY3QoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIganNvbkNvbnZlcnRlciA9IG5ldyBKc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoanNvbk9iaiwgdGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChqc29uQ29udmVydGVyLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBqc29uQ29udmVydGVyLmVycm9ycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29va2llKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRvUXVlc3Rpb25zT25Mb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZUNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlcyA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tcInBhZ2Vub1wiXSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBzZWxmLmN1cnJlbnRQYWdlICE9IG51bGwgPyBzZWxmLnZpc2libGVQYWdlcy5pbmRleE9mKHNlbGYuY3VycmVudFBhZ2UpICsgMSA6IDA7IH1cclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW1wicGFnZWNvdW50XCJdID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHNlbGYudmlzaWJsZVBhZ2VDb3VudDsgfVxyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUXVlc3Rpb25Ub1Byb2Nlc3NlZFRleHRWYWx1ZXMocXVlc3Rpb25zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uOiBJUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW3F1ZXN0aW9uLm5hbWUudG9Mb3dlckNhc2UoKV0gPSBcInF1ZXN0aW9uXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gXCJxdWVzdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uICE9IG51bGwgPyB0aGlzLmdldFZhbHVlKHF1ZXN0aW9uLm5hbWUpIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsID09IFwidmFsdWVcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbCA9PSBcInZhcmlhYmxlXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhcmlhYmxlKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWwobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2xlYXJJbnZpc2libGVRdWVzdGlvblZhbHVlcygpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0udmlzaWJsZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VmFyaWFibGUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFZhcmlhYmxlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YXJpYWJsZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lTdXJ2ZXkgZGF0YVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VW5iaW5kVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgLy9kbyBub3QgcmV0dXJuIHRoZSBzYW1lIG9iamVjdCBpbnN0YW5jZSEhIVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRVbmJpbmRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlRXF1YWwobmFtZSwgbmV3VmFsdWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuZ2V0VW5iaW5kVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IFwidmFsdWVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMobmFtZSwgbmV3VmFsdWUsIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5R29OZXh0UGFnZUF1dG9tYXRpYyhuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlRXF1YWwobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiKSBuZXdWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gbnVsbCB8fCBvbGRWYWx1ZSA9PT0gbnVsbCkgcmV0dXJuIG5ld1ZhbHVlID09PSBvbGRWYWx1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNUd29WYWx1ZUVxdWFscyhuZXdWYWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzVHdvVmFsdWVFcXVhbHMoeDogYW55LCB5OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHggPT09IHkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoISh4IGluc3RhbmNlb2YgT2JqZWN0KSB8fCAhKHkgaW5zdGFuY2VvZiBPYmplY3QpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4geCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF4Lmhhc093blByb3BlcnR5KHApKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmICgheS5oYXNPd25Qcm9wZXJ0eShwKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhbcF0gPT09IHlbcF0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoeFtwXSkgIT09IFwib2JqZWN0XCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1R3b1ZhbHVlRXF1YWxzKHhbcF0sIHlbcF0pKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChwIGluIHkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh5Lmhhc093blByb3BlcnR5KHApICYmICF4Lmhhc093blByb3BlcnR5KHApKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdHJ5R29OZXh0UGFnZUF1dG9tYXRpYyhuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdvTmV4dFBhZ2VBdXRvbWF0aWMgfHwgIXRoaXMuY3VycmVudFBhZ2UpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uICYmICFxdWVzdGlvbi5zdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyhmYWxzZSwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNMYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5kYXRhW25hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXhdO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lICsgdGhpcy5jb21tZW50UHJlZml4O1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gXCJcIiB8fCBuZXdWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSwgJ3Zpc2libGUnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2U6IElQYWdlLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25QYWdlVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdwYWdlJzogcGFnZSwgJ3Zpc2libGUnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcXVlc3Rpb25BZGRlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMub25RdWVzdGlvbkFkZGVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAnaW5kZXgnOiBpbmRleCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlc3Rpb25SZW1vdmVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5pc0VtcHR5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7IG5hbWU6IG5hbWUsIHZhbHVlOiB0aGlzLmdldFZhbHVlKG5hbWUpLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgICAgICB0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5lcnJvciA/IG5ldyBDdXN0b21FcnJvcihvcHRpb25zLmVycm9yKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb2Nlc3NIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBodG1sOiBodG1sIH07XHJcbiAgICAgICAgICAgIHRoaXMub25Qcm9jZXNzSHRtbC5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzVGV4dChvcHRpb25zLmh0bWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9jZXNzVGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0UHJlUHJvY2Vzc29yLnByb2Nlc3ModGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVN1cnZleVRyaWdnZXJPd25lclxyXG4gICAgICAgIGdldE9iamVjdHMocGFnZXM6IHN0cmluZ1tdLCBxdWVzdGlvbnM6IHN0cmluZ1tdKTogYW55W117XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFBhZ2VzQnlOYW1lcyhwYWdlcykpO1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UXVlc3Rpb25zQnlOYW1lcyhxdWVzdGlvbnMpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VHJpZ2dlclZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgaXNWYXJpYWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGlzVmFyaWFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmFyaWFibGUobmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleVwiLCBbeyBuYW1lOiBcImxvY2FsZVwiLCBjaG9pY2VzOiAoKSA9PiB7IHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0TG9jYWxlcygpIH0gfSxcclxuICAgICAgICBcInRpdGxlXCIsIFwiY29tcGxldGVkSHRtbDpodG1sXCIsIHsgbmFtZTogXCJwYWdlc1wiLCBjbGFzc05hbWU6IFwicGFnZVwiIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInF1ZXN0aW9uc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInF1ZXN0aW9uXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG51bGw7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmosIHZhbHVlLCBqc29uQ29udmVydGVyKSB7IHZhciBwYWdlID0gb2JqLmFkZE5ld1BhZ2UoXCJcIik7IGpzb25Db252ZXJ0ZXIudG9PYmplY3QoeyBxdWVzdGlvbnM6IHZhbHVlIH0sIHBhZ2UpOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInRyaWdnZXJzOnRyaWdnZXJzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dHJpZ2dlclwiLCBjbGFzc05hbWVQYXJ0OiBcInRyaWdnZXJcIiB9LFxyXG4gICAgICAgIFwic3VydmV5SWRcIiwgXCJzdXJ2ZXlQb3N0SWRcIiwgXCJjb29raWVOYW1lXCIsIFwic2VuZFJlc3VsdE9uUGFnZU5leHQ6Ym9vbGVhblwiLFxyXG4gICAgICAgIHsgbmFtZTogXCJzaG93TmF2aWdhdGlvbkJ1dHRvbnM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIHsgbmFtZTogXCJzaG93VGl0bGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIHsgbmFtZTogXCJzaG93UGFnZVRpdGxlczpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSxcclxuICAgICAgICBcInNob3dQYWdlTnVtYmVyczpib29sZWFuXCIsIHsgbmFtZTogXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIGRlZmF1bHQ6IFwib25cIiwgY2hvaWNlczogW1wib25cIiwgXCJvblBhZ2VcIiwgXCJvZmZcIl0gfSxcclxuICAgICAgICB7IG5hbWU6IFwicXVlc3Rpb25UaXRsZUxvY2F0aW9uXCIsIGRlZmF1bHQ6IFwidG9wXCIsIGNob2ljZXM6IFtcInRvcFwiLCBcImJvdHRvbVwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJzaG93UHJvZ3Jlc3NCYXJcIiwgZGVmYXVsdDogXCJvZmZcIiwgY2hvaWNlczogW1wib2ZmXCIsIFwidG9wXCIsIFwiYm90dG9tXCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInN0b3JlT3RoZXJzQXNDb21tZW50OmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCBcImdvTmV4dFBhZ2VBdXRvbWF0aWM6Ym9vbGVhblwiLCBcImNsZWFySW52aXNpYmxlVmFsdWVzOmJvb2xlYW5cIixcclxuICAgICAgICB7IG5hbWU6IFwicGFnZVByZXZUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnBhZ2VQcmV2VGV4dFZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInBhZ2VOZXh0VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5wYWdlTmV4dFRleHRWYWx1ZTsgfSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjb21wbGV0ZVRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tcGxldGVUZXh0VmFsdWU7IH0gfSwgXHJcbiAgICAgICAgeyBuYW1lOiBcInJlcXVpcmVkVGV4dFwiLCBkZWZhdWx0OiBcIipcIiB9LCBcInF1ZXN0aW9uU3RhcnRJbmRleFwiLCBcInF1ZXN0aW9uVGl0bGVUZW1wbGF0ZVwiXSk7XHJcbn0iLCIvKiFcbiogc3VydmV5anMgLSBTdXJ2ZXkgSmF2YVNjcmlwdCBsaWJyYXJ5IHYwLjkuMTJcbiogKGMpIEFuZHJldyBUZWxub3YgLSBodHRwOi8vc3VydmV5anMub3JnL1xuKiBMaWNlbnNlOiBNSVQgKGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwKVxuKi9cblxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5V2luZG93TW9kZWwgZXh0ZW5kcyBCYXNlICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdXJ2ZXlFbGVtZW50TmFtZSA9IFwid2luZG93U3VydmV5SlNcIjtcclxuICAgICAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5TW9kZWw7XHJcbiAgICAgICAgd2luZG93RWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgaXNTaG93aW5nVmFsdWU6IGJvb2xlYW47XHJcbiAgICAgICAgaXNFeHBhbmRlZFZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgICAgICB0ZW1wbGF0ZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB0aGlzLmNyZWF0ZVN1cnZleShqc29uT2JqKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5zaG93VGl0bGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dFbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCkgOiBzdHJpbmcgeyByZXR1cm4gXCJ3aW5kb3dcIiB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5TW9kZWwgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNTaG93aW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1Nob3dpbmdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNFeHBhbmRlZFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5zdXJ2ZXkudGl0bGU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZXhwYW5kKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY29sbGFwc2UoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlU3VydmV5KGpzb25PYmo6IGFueSk6IFN1cnZleU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlNb2RlbChqc29uT2JqKVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZXhwYW5kY29sbGFwc2UodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc0V4cGFuZGVkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICB2YXIgZmlubmlzaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgIHBhZ2VQcmV2VGV4dDogXCJFZGVsbGluZW5cIixcclxuICAgICAgcGFnZU5leHRUZXh0OiBcIlNldXJhYXZhXCIsXHJcbiAgICAgIGNvbXBsZXRlVGV4dDogXCJWYWxtaXNcIixcclxuICAgICAgb3RoZXJJdGVtVGV4dDogXCJNdXUgKGt1dmFpbGUpXCIsXHJcbiAgICAgIHByb2dyZXNzVGV4dDogXCJTaXZ1IHswfS97MX1cIixcclxuICAgICAgZW1wdHlTdXJ2ZXk6IFwiVMOkc3PDpCBreXNlbHlzc8OkIGVpIG9sZSB5aHTDpGvDpMOkbiBuw6RreXZpbGzDpCBvbGV2YWEgc2l2dWEgdGFpIGt5c3lteXN0w6QuXCIsXHJcbiAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiS2lpdG9zIGt5c2VseXluIHZhc3RhYW1pc2VzdGEhXCIsXHJcbiAgICAgIGxvYWRpbmdTdXJ2ZXk6IFwiS3lzZWx5w6QgbGFkYXRhYW4gcGFsdmVsaW1lbHRhLi4uXCIsXHJcbiAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIlZhbGl0c2UuLi5cIixcclxuICAgICAgcmVxdWlyZWRFcnJvcjogXCJWYXN0YWEga3lzeW15a3NlZW4sIGtpaXRvcy5cIixcclxuICAgICAgbnVtZXJpY0Vycm9yOiBcIkFydm9uIHR1bGVlIG9sbGEgbnVtZWVyaW5lbi5cIixcclxuICAgICAgdGV4dE1pbkxlbmd0aDogXCJPbGUgaHl2w6QgamEgc3nDtnTDpCB2w6RoaW50w6TDpG4gezB9IG1lcmtracOkLlwiLFxyXG4gICAgICBtaW5TZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSB2w6RoaW50w6TDpG4gezB9IHZhaWh0b2VodG9hLlwiLFxyXG4gICAgICBtYXhTZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSBlbmludMOkw6RuIHswfSB2YWlodG9laHRvYS5cIixcclxuICAgICAgbnVtZXJpY01pbk1heDogXCInezB9JyB0w6R5dHl5IG9sbGEgZW5lbW3DpG4gdGFpIHlodMOkIHN1dXJpIGt1aW4gezF9IGphIHbDpGhlbW3DpG4gdGFpIHlodMOkIHN1dXJpIGt1aW4gezJ9XCIsXHJcbiAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgdMOkeXR5eSBvbGxhIGVuZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgICBudW1lcmljTWF4OiBcIid7MH0nIHTDpHl0eXkgb2xsYSB2w6RoZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgICBpbnZhbGlkRW1haWw6IFwiU3nDtnTDpCB2YWxpZGkgc8OkaGvDtnBvc3Rpb3NvaXRlLlwiLFxyXG4gICAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiT2xlIGh5dsOkIGphIHN5w7Z0w6QgXFxcIk11dSAoa3V2YWlsZSlcXFwiXCJcclxuICB9XHJcblxyXG4gIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZmlcIl0gPSBmaW5uaXNoU3VydmV5U3RyaW5ncztcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG4vL0NyZWF0ZWQgb24gYmVoYWxmIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmFuazEzXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgdmFyIGZyZW5jaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgcGFnZVByZXZUZXh0OiBcIlByXFx1MDBlOWNcXHUwMGU5ZGVudFwiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCJTdWl2YW50XCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcIlRlcm1pbmVyXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJBdXRyZSAocHJcXHUwMGU5Y2lzZXIpXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2UgezB9IHN1ciB7MX1cIixcclxuICAgICAgICBlbXB0eVN1cnZleTogXCJJbCBuJ3kgYSBuaSBwYWdlIHZpc2libGUgbmkgcXVlc3Rpb24gdmlzaWJsZSBkYW5zY2UgcXVlc3Rpb25uYWlyZVwiLFxyXG4gICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiTWVyY2kgZCdhdm9pciByXFx1MDBlOXBvbmR1IGF1IHF1ZXN0aW9ubmFpcmUhXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCJMZSBxdWVzdGlvbm5haXJlIGVzdCBlbiBjb3VycyBkZSBjaGFyZ2VtZW50Li4uXCIsXHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiQ2hvaXNpc3Nlei4uLlwiLFxyXG4gICAgICAgIHJlcXVpcmVkRXJyb3I6IFwiTGEgclxcdTAwZTlwb25zZSBcXHUwMGUwIGNldHRlIHF1ZXN0aW9uIGVzdCBvYmxpZ2F0b2lyZS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiTGEgclxcdTAwZTlwb25zZSBkb2l0IFxcdTAwZWF0cmUgdW4gbm9tYnJlLlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwiTWVyY2kgZCdlbnRyZXIgYXUgbW9pbnMgezB9IHN5bWJvbGVzLlwiLFxyXG4gICAgICAgIG1pblNlbGVjdEVycm9yOiBcIk1lcmNpIGRlIHNcXHUwMGU5bGVjdGlvbm5lciBhdSBtb2lucyB7MH1yXFx1MDBlOXBvbnNlcy5cIixcclxuICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCJNZXJjaSBkZSBzXFx1MDBlOWxlY3Rpb25uZXIgYXUgcGx1cyB7MH1yXFx1MDBlOXBvbnNlcy5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIlZvdHJlIHJcXHUwMGU5cG9uc2UgJ3swfScgZG9pdCBcXHUwMGVhdHJlc3VwXFx1MDBlOXJpZXVyZSBvdSBcXHUwMGU5Z2FsZSBcXHUwMGUwIHsxfSBldCBpbmZcXHUwMGU5cmlldXJlIG91XFx1MDBlOWdhbGUgXFx1MDBlMCB7Mn1cIixcclxuICAgICAgICBudW1lcmljTWluOiBcIlZvdHJlIHJcXHUwMGU5cG9uc2UgJ3swfScgZG9pdCBcXHUwMGVhdHJlc3VwXFx1MDBlOXJpZXVyZSBvdSBcXHUwMGU5Z2FsZSBcXHUwMGUwIHsxfVwiLFxyXG4gICAgICAgIG51bWVyaWNNYXg6IFwiVm90cmUgclxcdTAwZTlwb25zZSAnezB9JyBkb2l0IFxcdTAwZWF0cmVpbmZcXHUwMGU5cmlldXJlIG91IFxcdTAwZTlnYWxlIFxcdTAwZTAgezF9XCIsXHJcbiAgICAgICAgaW52YWxpZEVtYWlsOiBcIk1lcmNpIGQnZW50cmVyIHVuZSBhZHJlc3NlIG1haWwgdmFsaWRlLlwiLFxyXG4gICAgICAgIGV4Y2VlZE1heFNpemU6IFwiTGEgdGFpbGxlIGR1IGZpY2hpZXIgbmUgZG9pdCBwYXMgZXhjXFx1MDBlOWRlciB7MH0uXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIk1lcmNpIGRlIHByXFx1MDBlOWNpc2VyIGxlIGNoYW1wICdBdXRyZScuXCJcclxuICAgIH1cclxuICAgIHN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZnJcIl0gPSBmcmVuY2hTdXJ2ZXlTdHJpbmdzO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy9zdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICB2YXIgZ2VybWFuU3VydmV5U3RyaW5ncyA9IHtcclxuICAgICAgICBwYWdlUHJldlRleHQ6IFwiWnVyw7xja1wiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCJXZWl0ZXJcIixcclxuICAgICAgICBjb21wbGV0ZVRleHQ6IFwiRmVydGlnXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlNlaXRlIHswfSB2b24gezF9XCIsXHJcbiAgICAgICAgZW1wdHlTdXJ2ZXk6IFwiRXMgZ2lidCBrZWluZSBzaWNodGJhcmUgRnJhZ2UuXCIsXHJcbiAgICAgICAgY29tcGxldGluZ1N1cnZleTogXCJWaWVsZW4gRGFuayBmw7xyIGRhcyBBdXNmw7xsbGVuIGRlcyBGcmFnZWJvZ2VucyFcIixcclxuICAgICAgICBsb2FkaW5nU3VydmV5OiBcIkRlciBGcmFnZWJvZ2VuIHdpcmQgdm9tIFNlcnZlciBnZWxhZGVuLi4uXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJCZW51dHplcmRlZmluaWVydGUgQW50d29ydC4uLlwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIlfDpGhsZW4uLi5cIixcclxuICAgICAgICByZXF1aXJlZEVycm9yOiBcIkJpdHRlIGFudHdvcnRlbiBTaWUgYXVmIGRpZSBGcmFnZS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiRGVyIFdlcnQgc29sbHRlIGVpbmUgWmFobCBzZWluLlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwiQml0dGUgZ2ViZW4gU2llIG1pbmRlc3RlbnMgezB9IFN5bWJvbGUuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwiQml0dGUgd8OkaGxlbiBTaWUgbWluZGVzdGVucyB7MH0gVmFyaWFudGVuLlwiLFxyXG4gICAgICAgIG1heFNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG5pY2h0IG1laHIgYWxzIHswfSBWYXJpYW50ZW4uXCIsXHJcbiAgICAgICAgbnVtZXJpY01pbk1heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBncsO2w59lciBzZWluIGFscyB7MX0gdW5kIGdsZWljaCBvZGVyIGtsZWluZXIgYWxzIHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgc29sdGUgZ2xlaWNoIG9kZXIgZ3LDtsOfZXIgc2VpbiBhbHMgezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBrbGVpbmVyIGFscyB7MX1cIixcclxuICAgICAgICBpbnZhbGlkRW1haWw6IFwiQml0dGUgZ2ViZW4gU2llIGVpbmUgZ8O8bHRpZ2UgRW1haWwtQWRyZXNzZSBlaW4uXCIsXHJcbiAgICAgICAgZXhjZWVkTWF4U2l6ZTogXCJEaWUgRGF0ZWlncsO2w59lIHNvbGwgbmljaHQgbWVociBhbHMgezB9LlwiLFxyXG4gICAgICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJCaXR0ZSBnZWJlbiBTaWUgZWluZW4gV2VydCBmw7xyIElocmUgYmVudXR6ZXJkZWZpbmllcnRlIEFudHdvcnQgZWluLlwiXHJcbiAgICB9XHJcbiAgICBzdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImRlXCJdID0gZ2VybWFuU3VydmV5U3RyaW5ncztcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIHZhciBydXNzaWFuU3VydmV5U3RyaW5ncyA9IHtcclxuICAgICAgICBwYWdlUHJldlRleHQ6IFwi0J3QsNC30LDQtFwiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCLQlNCw0LvQtdC1XCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcItCT0L7RgtC+0LLQvlwiLFxyXG4gICAgICAgIHByb2dyZXNzVGV4dDogXCLQodGC0YDQsNC90LjRhtCwIHswfSDQuNC3IHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcItCd0LXRgiDQvdC4INC+0LTQvdC+0LPQviDQstC+0L/RgNC+0YHQsC5cIixcclxuICAgICAgICBjb21wbGV0aW5nU3VydmV5OiBcItCR0LvQsNCz0L7QtNCw0YDQuNC8INCS0LDRgSDQt9CwINC30LDQv9C+0LvQvdC10L3QuNC1INCw0L3QutC10YLRiyFcIixcclxuICAgICAgICBsb2FkaW5nU3VydmV5OiBcItCX0LDQs9GA0YPQt9C60LAg0YEg0YHQtdGA0LLQtdGA0LAuLi5cIixcclxuICAgICAgICBvdGhlckl0ZW1UZXh0OiBcItCU0YDRg9Cz0L7QtSAo0L/QvtC20LDQu9GD0LnRgdGC0LAsINC+0L/QuNGI0LjRgtC1KVwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcItCS0YvQsdGA0LDRgtGMLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7RgtCy0LXRgtGM0YLQtSDQvdCwINCy0L7Qv9GA0L7RgS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwi0J7RgtCy0LXRgiDQtNC+0LvQttC10L0g0LHRi9GC0Ywg0YfQuNGB0LvQvtC8LlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INGF0L7RgtGPINCx0YsgezB9INGB0LjQvNCy0L7Qu9C+0LIuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0YvQsdC10YDQuNGC0LUg0YXQvtGC0Y8g0LHRiyB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgICAgIG1heFNlbGVjdEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstGL0LHQtdGA0LjRgtC1INC90LUg0LHQvtC70LXQtSB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9LCDQuCDRgNCw0LLQvdGL0Lwg0LjQu9C4INC80LXQvdGM0YjQtSwg0YfQtdC8IHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCInezB9JyDQtNC+0LvQttC90L4g0LHRi9GC0Ywg0YDQsNCy0L3Ri9C8INC40LvQuCDQvNC10L3RjNGI0LUsINGH0LXQvCB7MX1cIixcclxuICAgICAgICBpbnZhbGlkRW1haWw6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC00LXQudGB0YLQstC40YLQtdC70YzQvdGL0Lkg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YsuXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNCw0L3QvdGL0LUg0LIg0L/QvtC70LUgXFxcItCU0YDRg9Cz0L7QtVxcXCJcIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJydVwiXSA9IHJ1c3NpYW5TdXJ2ZXlTdHJpbmdzO1xyXG59IiwibW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgdmFyIGRlZmF1bHRCb290c3RyYXBDc3MgPSB7XHJcbiAgICAgICAgcm9vdDogXCJcIixcclxuICAgICAgICBoZWFkZXI6IFwicGFuZWwtaGVhZGluZ1wiLFxyXG4gICAgICAgIGJvZHk6IFwicGFuZWwtYm9keVwiLFxyXG4gICAgICAgIGZvb3RlcjogXCJwYW5lbC1mb290ZXJcIixcclxuICAgICAgICBuYXZpZ2F0aW9uQnV0dG9uOiBcIlwiLCBuYXZpZ2F0aW9uOiB7IGNvbXBsZXRlOiBcIlwiLCBwcmV2OiBcIlwiLCBuZXh0OiBcIlwiIH0sXHJcbiAgICAgICAgcHJvZ3Jlc3M6IFwicHJvZ3Jlc3MgY2VudGVyLWJsb2NrXCIsXHJcbiAgICAgICAgcGFnZVRpdGxlOiBcIlwiLFxyXG4gICAgICAgIHJvdzogXCJcIixcclxuICAgICAgICBxdWVzdGlvbjogeyByb290OiBcIlwiLCB0aXRsZTogXCJcIiwgY29tbWVudDogXCJmb3JtLWNvbnRyb2xcIiwgaW5kZW50OiAyMCB9LFxyXG4gICAgICAgIGVycm9yOiB7IHJvb3Q6IFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIsIGl0ZW06IFwiZ2x5cGhpY29uIGdseXBoaWNvbi1leGNsYW1hdGlvbi1zaWduXCIgfSxcclxuXHJcbiAgICAgICAgY2hlY2tib3g6IHsgcm9vdDogXCJmb3JtLWlubGluZVwiLCBpdGVtOiBcImNoZWNrYm94XCIsIG90aGVyOiBcIlwiIH0sXHJcbiAgICAgICAgY29tbWVudDogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgICAgICBkcm9wZG93bjogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgICAgICBtYXRyaXg6IHsgcm9vdDogXCJ0YWJsZVwiIH0sXHJcbiAgICAgICAgbWF0cml4ZHJvcGRvd246IHsgcm9vdDogXCJ0YWJsZVwiIH0sXHJcbiAgICAgICAgbWF0cml4ZHluYW1pYzogeyByb290OiBcInRhYmxlXCIsIGJ1dHRvbjogXCJidXR0b25cIiB9LFxyXG4gICAgICAgIG11bHRpcGxldGV4dDogeyByb290OiBcInRhYmxlXCIsIGl0ZW1UaXRsZTogXCJcIiwgaXRlbVZhbHVlOiBcImZvcm0tY29udHJvbFwiIH0sXHJcbiAgICAgICAgcmFkaW9ncm91cDogeyByb290OiBcImZvcm0taW5saW5lXCIsIGl0ZW06IFwicmFkaW9cIiwgb3RoZXI6IFwiXCIgfSxcclxuICAgICAgICByYXRpbmc6IHsgcm9vdDogXCJidG4tZ3JvdXBcIiwgaXRlbTogXCJidG4gYnRuLWRlZmF1bHRcIiB9LFxyXG4gICAgICAgIHRleHQ6IFwiZm9ybS1jb250cm9sXCJcclxuICAgIH07XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2NvbW1lbnQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbmNvbW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkNvbW1lbnRNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3NOYW1lPXt0aGlzLmNzc30gdHlwZT1cInRleHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9IGNvbHM9e3RoaXMucXVlc3Rpb24uY29sc30gcm93cz17dGhpcy5xdWVzdGlvbi5yb3dzfSAvPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uO1xyXG4gICAgcHJpdmF0ZSBjb21tZW50OiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMuY29tbWVudCB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkJsdXIgPSB0aGlzLmhhbmRsZU9uQmx1ci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLmNvbW1lbnQgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkJsdXIoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQgPSB0aGlzLmNvbW1lbnQ7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT17dGhpcy5jc3MucXVlc3Rpb24uY29tbWVudH0gdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSBvbkJsdXI9e3RoaXMuaGFuZGxlT25CbHVyfSAvPik7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleVN0cmluZ3MudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0UXVlc3Rpb25jb21tZW50LnRzeFwiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVJlYWN0U3VydmV5Q3JlYXRvciB7XHJcbiAgICAgICAgY3JlYXRlUXVlc3Rpb25FbGVtZW50KHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBKU1guRWxlbWVudDtcclxuICAgICAgICByZW5kZXJFcnJvcihrZXk6IHN0cmluZywgZXJyb3JUZXh0OiBzdHJpbmcpOiBKU1guRWxlbWVudDtcclxuICAgICAgICBxdWVzdGlvblRpdGxlTG9jYXRpb24oKTogc3RyaW5nO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZTtcclxuICAgIHByb3RlY3RlZCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9yOiBTdXJ2ZXkuSVJlYWN0U3VydmV5Q3JlYXRvcjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVzdGlvbihwcm9wcy5xdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gcHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVzdGlvbihuZXh0UHJvcHMucXVlc3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRRdWVzdGlvbihxdWVzdGlvbikge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25CYXNlID0gcXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uIGluc3RhbmNlb2YgU3VydmV5LlF1ZXN0aW9uID8gcXVlc3Rpb24gOiBudWxsO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucXVlc3Rpb24gPyB0aGlzLnF1ZXN0aW9uLnZhbHVlIDogbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2aXNpYmxlOiB0aGlzLnF1ZXN0aW9uQmFzZS52aXNpYmxlLCB2YWx1ZTogdmFsdWUsIGVycm9yOiAwLCByZW5kZXJXaWR0aDogMCB9O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlLnJlbmRlcldpZHRoID0gc2VsZi5zdGF0ZS5yZW5kZXJXaWR0aCArIDE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25CYXNlIHx8ICF0aGlzLmNyZWF0b3IpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25CYXNlW1wicmVhY3RcIl0gPSB0aGlzOyAvL1RPRE9cclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25CYXNlLnZpc2libGUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBcIlJlYWN0U3VydmV5UXVlc3Rpb25cIiArIHRoaXMucXVlc3Rpb25CYXNlLmdldFR5cGUoKTtcclxuICAgICAgICB2YXIgcXVlc3Rpb25SZW5kZXIgPSB0aGlzLmNyZWF0b3IuY3JlYXRlUXVlc3Rpb25FbGVtZW50KHRoaXMucXVlc3Rpb25CYXNlKTtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnF1ZXN0aW9uQmFzZS5oYXNUaXRsZSA/IHRoaXMucmVuZGVyVGl0bGUoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlVG9wID0gdGhpcy5jcmVhdG9yLnF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpID09IFwidG9wXCIgPyB0aXRsZSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlQm90dG9tID0gdGhpcy5jcmVhdG9yLnF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpID09IFwiYm90dG9tXCIgPyB0aXRsZSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGNvbW1lbnQgPSAodGhpcy5xdWVzdGlvbiAmJiB0aGlzLnF1ZXN0aW9uLmhhc0NvbW1lbnQpID8gdGhpcy5yZW5kZXJDb21tZW50KCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBlcnJvcnMgPSB0aGlzLnJlbmRlckVycm9ycygpO1xyXG4gICAgICAgIHZhciBtYXJnaW5MZWZ0ID0gKHRoaXMucXVlc3Rpb25CYXNlLmluZGVudCA+IDApID8gdGhpcy5xdWVzdGlvbkJhc2UuaW5kZW50ICogdGhpcy5jc3MucXVlc3Rpb24uaW5kZW50ICsgXCJweFwiIDogbnVsbDtcclxuICAgICAgICB2YXIgcGFkZGluZ1JpZ2h0ID0gKHRoaXMucXVlc3Rpb25CYXNlLnJpZ2h0SW5kZW50ID4gMCkgPyB0aGlzLnF1ZXN0aW9uQmFzZS5yaWdodEluZGVudCAqIHRoaXMuY3NzLnF1ZXN0aW9uLmluZGVudCArIFwicHhcIiA6IG51bGw7XHJcbiAgICAgICAgdmFyIHJvb3RTdHlsZSA9IHsgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHZlcnRpY2FsQWxpZ246ICd0b3AnIH07XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb24ucmVuZGVyV2lkdGgpIHJvb3RTdHlsZVtcIndpZHRoXCJdID0gdGhpcy5xdWVzdGlvbi5yZW5kZXJXaWR0aDtcclxuICAgICAgICBpZiAobWFyZ2luTGVmdCkgcm9vdFN0eWxlW1wibWFyZ2luTGVmdFwiXSA9IG1hcmdpbkxlZnQ7XHJcbiAgICAgICAgaWYgKHBhZGRpbmdSaWdodCkgcm9vdFN0eWxlW1wicGFkZGluZ1JpZ2h0XCJdID0gcGFkZGluZ1JpZ2h0O1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMucXVlc3Rpb25CYXNlLmlkfSBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLnJvb3R9IHN0eWxlPXtyb290U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAge3RpdGxlVG9wfVxyXG4gICAgICAgICAgICAgICAge2Vycm9yc31cclxuICAgICAgICAgICAgICAgIHtxdWVzdGlvblJlbmRlcn1cclxuICAgICAgICAgICAgICAgIHtjb21tZW50fVxyXG4gICAgICAgICAgICAgICAge3RpdGxlQm90dG9tfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclRpdGxlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgdGl0bGVUZXh0ID0gdGhpcy5xdWVzdGlvbi5mdWxsVGl0bGU7XHJcbiAgICAgICAgcmV0dXJuICg8aDUgY2xhc3NOYW1lPXt0aGlzLmNzcy5xdWVzdGlvbi50aXRsZX0+e3RpdGxlVGV4dH08L2g1Pik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQ29tbWVudCgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj57dGhpcy5xdWVzdGlvbi5jb21tZW50VGV4dH08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5xdWVzdGlvbi5jb21tZW50fT5cclxuICAgICAgICAgICAgICAgIDxSZWFjdFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufS8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJFcnJvcnMoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlRdWVzdGlvbkVycm9ycyBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gY3NzPXt0aGlzLmNzc30gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSAvPlxyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9uRXJyb3JzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbjtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogU3VydmV5LklSZWFjdFN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24ocHJvcHMucXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVzdGlvbihuZXh0UHJvcHMucXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IG5leHRQcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UXVlc3Rpb24ocXVlc3Rpb24pIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb24gaW5zdGFuY2VvZiBTdXJ2ZXkuUXVlc3Rpb24gPyBxdWVzdGlvbiA6IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uLmVycm9yc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3RhdGUuZXJyb3IgPSBzZWxmLnN0YXRlLmVycm9yICsgMTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgZXJyb3I6IDAgfTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uIHx8IHRoaXMucXVlc3Rpb24uZXJyb3JzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgZXJyb3JzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JUZXh0ID0gdGhpcy5xdWVzdGlvbi5lcnJvcnNbaV0uZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJlcnJvclwiICsgaTtcclxuICAgICAgICAgICAgZXJyb3JzLnB1c2godGhpcy5jcmVhdG9yLnJlbmRlckVycm9yKGtleSwgZXJyb3JUZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmVycm9yLnJvb3R9PntlcnJvcnN9PC9kaXY+KTtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0cXVlc3Rpb24udHN4XCIgLz5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlQYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHBhZ2U6IFN1cnZleS5QYWdlTW9kZWw7XHJcbiAgICBwcml2YXRlIHN1cnZleTogU3VydmV5LlN1cnZleU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9yOiBTdXJ2ZXkuSVJlYWN0U3VydmV5Q3JlYXRvcjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gcHJvcHMucGFnZTtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IHByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBwcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucGFnZSA9IG5leHRQcm9wcy5wYWdlO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gbmV4dFByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnBhZ2UgPT0gbnVsbCB8fCB0aGlzLnN1cnZleSA9PSBudWxsIHx8IHRoaXMuY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnJlbmRlclRpdGxlKCk7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICB2YXIgcXVlc3Rpb25Sb3dzID0gdGhpcy5wYWdlLnJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvblJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcm93cy5wdXNoKHRoaXMuY3JlYXRlUm93KHF1ZXN0aW9uUm93c1tpXSwgaSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJvdyhyb3c6IFN1cnZleS5RdWVzdGlvblJvd01vZGVsLCBpbmRleDogbnVtYmVyKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciByb3dOYW1lID0gXCJyb3dcIiArIChpbmRleCArIDEpO1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlSb3cga2V5PXtyb3dOYW1lfSByb3c9e3Jvd30gc3VydmV5PXt0aGlzLnN1cnZleX0gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSBjc3M9e3RoaXMuY3NzfSAvPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJUaXRsZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhZ2UudGl0bGUgfHwgIXRoaXMuc3VydmV5LnNob3dQYWdlVGl0bGVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGV4dCA9IHRoaXMucGFnZS5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICBpZiAodGhpcy5wYWdlLm51bSA+IDApIHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMucGFnZS5udW0gKyBcIi4gXCIgKyB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxoNCBjbGFzc05hbWU9e3RoaXMuY3NzLnBhZ2VUaXRsZX0+e3RleHR9PC9oND4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSByb3c6IFN1cnZleS5RdWVzdGlvblJvd01vZGVsO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXlNb2RlbDtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogU3VydmV5LklSZWFjdFN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFByb3BlcnRpZXMocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcHJvcHMucm93O1xyXG4gICAgICAgIGlmICh0aGlzLnJvdykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucm93LnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2V0U3RhdGUoeyB2aXNpYmxlOiBzZWxmLnJvdy52aXNpYmxlIH0pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gcHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnJvdyA9PSBudWxsIHx8IHRoaXMuc3VydmV5ID09IG51bGwgfHwgdGhpcy5jcmVhdG9yID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghdGhpcy5yb3cudmlzaWJsZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3cucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucm93LnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2godGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mucm93fT5cclxuICAgICAgICAgICAgICAgIHtxdWVzdGlvbnN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxSZWFjdFN1cnZleVF1ZXN0aW9uIGtleT17cXVlc3Rpb24ubmFtZX0gcXVlc3Rpb249e3F1ZXN0aW9ufSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IGNzcz17dGhpcy5jc3N9IC8+O1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9jaGVja2JveC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9uY2hlY2tib3ggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByb3RlY3RlZCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBwcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGNob2ljZXNDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5jaG9pY2VzQ2hhbmdlZCA9IHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBuZXh0UHJvcHMucm9vdENzcztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICB7dGhpcy5nZXRJdGVtcygpIH1cclxuICAgICAgICAgICAgICAgIDwvZm9ybT4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcIml0ZW1cIiArIGk7XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5yZW5kZXJJdGVtKGtleSwgaXRlbSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHRleHRTdHlsZSgpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckl0ZW0oa2V5OiBzdHJpbmcsIGl0ZW06IGFueSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPFJlYWN0U3VydmV5UXVlc3Rpb25jaGVja2JveEl0ZW0ga2V5PXtrZXl9IHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMuY3NzfSByb290Q3NzPXt0aGlzLnJvb3RDc3N9IGl0ZW09e2l0ZW19IHRleHRTdHlsZT17dGhpcy50ZXh0U3R5bGV9IC8+O1xyXG4gICAgfVxyXG59XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25jaGVja2JveEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByb3RlY3RlZCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hNb2RlbDtcclxuICAgIHByb3RlY3RlZCBpdGVtOiBTdXJ2ZXkuSXRlbVZhbHVlO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgcHJvdGVjdGVkIHJvb3RDc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCB0ZXh0U3R5bGU6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pdGVtID0gcHJvcHMuaXRlbTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gcHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLnRleHRTdHlsZSA9IHByb3BzLnRleHRTdHlsZTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IG5leHRQcm9wcy5pdGVtO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBuZXh0UHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLnRleHRTdHlsZSA9IG5leHRQcm9wcy50ZXh0U3R5bGU7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5xdWVzdGlvbi52YWx1ZTtcclxuICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbmRleCA9IG5ld1ZhbHVlLmluZGV4T2YodGhpcy5pdGVtLnZhbHVlKTtcclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUucHVzaCh0aGlzLml0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW0gfHwgIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBpdGVtV2lkdGggPSB0aGlzLnF1ZXN0aW9uLmNvbENvdW50ID4gMCA/ICgxMDAgLyB0aGlzLnF1ZXN0aW9uLmNvbENvdW50KSArIFwiJVwiIDogXCJcIjtcclxuICAgICAgICB2YXIgbWFyZ2luUmlnaHQgPSB0aGlzLnF1ZXN0aW9uLmNvbENvdW50ID09IDAgPyBcIjVweFwiIDogXCIwcHhcIjtcclxuICAgICAgICB2YXIgZGl2U3R5bGUgPSB7IG1hcmdpblJpZ2h0OiBtYXJnaW5SaWdodCB9O1xyXG4gICAgICAgIGlmIChpdGVtV2lkdGgpIHtcclxuICAgICAgICAgICAgZGl2U3R5bGVbXCJ3aWR0aFwiXSA9IGl0ZW1XaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IHRoaXMucXVlc3Rpb24udmFsdWUgJiYgdGhpcy5xdWVzdGlvbi52YWx1ZS5pbmRleE9mKHRoaXMuaXRlbS52YWx1ZSkgPiAtMTtcclxuICAgICAgICB2YXIgb3RoZXJJdGVtID0gKHRoaXMuaXRlbS52YWx1ZSA9PT0gdGhpcy5xdWVzdGlvbi5vdGhlckl0ZW0udmFsdWUgJiYgaXNDaGVja2VkKSA/IHRoaXMucmVuZGVyT3RoZXIoKSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ2hlY2tib3goaXNDaGVja2VkLCBkaXZTdHlsZSwgb3RoZXJJdGVtKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgaW5wdXRTdHlsZSgpOiBhbnkgeyByZXR1cm4geyBtYXJnaW5SaWdodDogXCIzcHhcIiB9OyB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQ2hlY2tib3goaXNDaGVja2VkOiBib29sZWFuLCBkaXZTdHlsZTogYW55LCBvdGhlckl0ZW06IEpTWC5FbGVtZW50KTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19IHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPXt0aGlzLmNzcy5pdGVtfT5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgc3R5bGU9e3RoaXMuaW5wdXRTdHlsZX0gIGNoZWNrZWQ9e2lzQ2hlY2tlZH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMuaXRlbS50ZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAge290aGVySXRlbX1cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJPdGhlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mub3RoZXJ9PjxSZWFjdFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30gLz48L2Rpdj4pO1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9kcm9wZG93bi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9uZHJvcGRvd24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkRyb3Bkb3duTW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgcm9vdENzczogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IHByb3BzLnJvb3RDc3M7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUsIGNob2ljZXNDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5jaG9pY2VzQ2hhbmdlZCA9IHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBuZXh0UHJvcHMucm9vdENzcztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcIml0ZW1cIiArIGk7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb24gPSA8b3B0aW9uIGtleT17a2V5fSB2YWx1ZT17aXRlbS52YWx1ZX0+e2l0ZW0udGV4dH08L29wdGlvbj47XHJcbiAgICAgICAgICAgIG9wdGlvbnMucHVzaChvcHRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29tbWVudCA9IHRoaXMucXVlc3Rpb24udmFsdWUgPT09IHRoaXMucXVlc3Rpb24ub3RoZXJJdGVtLnZhbHVlID8gdGhpcy5yZW5kZXJPdGhlcigpIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzTmFtZT17dGhpcy5jc3N9IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPnt0aGlzLnF1ZXN0aW9uLm9wdGlvbnNDYXB0aW9ufTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIHtvcHRpb25zfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAge2NvbW1lbnR9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyT3RoZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHsgbWFyZ2luVG9wOiBcIjNweFwiIH07XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT48UmVhY3RTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30vPjwvZGl2PjtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fZmlsZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9uZmlsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uRmlsZU1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgZmlsZUxvYWRlZDogMCB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHZhciBzcmMgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDsgXHJcbiAgICAgICAgaWYgKCF3aW5kb3dbXCJGaWxlUmVhZGVyXCJdKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCFzcmMgfHwgIXNyYy5maWxlcyB8fCBzcmMuZmlsZXMubGVuZ3RoIDwgMSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24ubG9hZEZpbGUoc3JjLmZpbGVzWzBdKVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlTG9hZGVkOiB0aGlzLnN0YXRlLmZpbGVMb2FkZWQgKyAxIH0pO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGltZyA9IHRoaXMucmVuZGVySW1hZ2UoKTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9Lz5cclxuICAgICAgICAgICAgICAgIHtpbWd9XHJcbiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJJbWFnZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uLnByZXZpZXdWYWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2PiAgPGltZyBzcmM9e3RoaXMucXVlc3Rpb24ucHJldmlld1ZhbHVlfSBoZWlnaHQ9e3RoaXMucXVlc3Rpb24uaW1hZ2VIZWlnaHR9IHdpZHRoPXt0aGlzLnF1ZXN0aW9uLmltYWdlV2lkdGh9IC8+PC9kaXY+KTtcclxuICAgIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2h0bWwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbmh0bWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkh0bWxNb2RlbDtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHByb3BzLnF1ZXN0aW9uO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbiB8fCAhdGhpcy5xdWVzdGlvbi5odG1sKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaHRtbFZhbHVlID0geyBfX2h0bWw6IHRoaXMucXVlc3Rpb24ucHJvY2Vzc2VkSHRtbCB9XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtodG1sVmFsdWV9IC8+ICk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9tYXRyaXgudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbm1hdHJpeCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uTWF0cml4TW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgZmlyc3RUSCA9IHRoaXMucXVlc3Rpb24uaGFzUm93cyA/IDx0aD48L3RoPiA6IG51bGw7XHJcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24uY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5xdWVzdGlvbi5jb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJjb2x1bW5cIiArIGk7XHJcbiAgICAgICAgICAgIGhlYWRlcnMucHVzaCg8dGgga2V5PXtrZXl9Pntjb2x1bW4udGV4dH08L3RoPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIHZpc2libGVSb3dzID0gdGhpcy5xdWVzdGlvbi52aXNpYmxlUm93cztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB2aXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwicm93XCIgKyBpO1xyXG4gICAgICAgICAgICByb3dzLnB1c2goPFJlYWN0U3VydmV5UXVlc3Rpb25tYXRyaXhSb3cga2V5PXtrZXl9IHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSByb3c9e3Jvd30gLz4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtmaXJzdFRIfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyc31cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICB7cm93c31cclxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9ubWF0cml4Um93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25NYXRyaXhNb2RlbDtcclxuICAgIHByaXZhdGUgcm93OiBTdXJ2ZXkuTWF0cml4Um93TW9kZWw7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLnJvdyA9IHByb3BzLnJvdztcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnJvdy52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucm93LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5yb3cgPSBuZXh0UHJvcHMucm93O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucm93KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgZmlyc3RURCA9IHRoaXMucXVlc3Rpb24uaGFzUm93cyA/IDx0ZD57dGhpcy5yb3cudGV4dH08L3RkPiA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi5jb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnF1ZXN0aW9uLmNvbHVtbnNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInZhbHVlXCIgKyBpO1xyXG4gICAgICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5yb3cudmFsdWUgPT0gY29sdW1uLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgdGQgPSA8dGQga2V5PXtrZXl9PjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPXt0aGlzLnJvdy5mdWxsTmFtZX0gdmFsdWU9e2NvbHVtbi52YWx1ZX0gY2hlY2tlZD17aXNDaGVja2VkfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0vPjwvdGQ+O1xyXG4gICAgICAgICAgICB0ZHMucHVzaCh0ZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPHRyPntmaXJzdFREfXt0ZHN9PC90cj4pO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbWF0cml4ZHJvcGRvd24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbm1hdHJpeGRyb3Bkb3duIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgcHJvdGVjdGVkIHJvb3RDc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCBjcmVhdG9yOiBTdXJ2ZXkuSVJlYWN0U3VydmV5Q3JlYXRvcjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHByb3BzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMobmV4dFByb3BzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UHJvcGVydGllcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IG5leHRQcm9wcy5jcmVhdG9yO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBoZWFkZXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMucXVlc3Rpb24uY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiY29sdW1uXCIgKyBpO1xyXG4gICAgICAgICAgICB2YXIgbWluV2lkdGggPSB0aGlzLnF1ZXN0aW9uLmdldENvbHVtbldpZHRoKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5TdHlsZSA9IG1pbldpZHRoID8geyBtaW5XaWR0aDogbWluV2lkdGggfSA6IHt9O1xyXG4gICAgICAgICAgICBoZWFkZXJzLnB1c2goPHRoIGtleT17a2V5fSBzdHlsZT17Y29sdW1uU3R5bGV9Pnt0aGlzLnF1ZXN0aW9uLmdldENvbHVtblRpdGxlKGNvbHVtbikgfTwvdGg+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICB2YXIgdmlzaWJsZVJvd3MgPSB0aGlzLnF1ZXN0aW9uLnZpc2libGVSb3dzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJyb3dcIiArIGk7XHJcbiAgICAgICAgICAgIHJvd3MucHVzaCg8UmVhY3RTdXJ2ZXlRdWVzdGlvbm1hdHJpeGRyb3Bkb3duUm93IGtleT17a2V5fSByb3c9e3Jvd30gY3NzPXt0aGlzLmNzc30gcm9vdENzcz17dGhpcy5yb290Q3NzfSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IC8+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRpdlN0eWxlID0gdGhpcy5xdWVzdGlvbi5ob3Jpem9udGFsU2Nyb2xsID8geyBvdmVyZmxvd1g6ICdzY3JvbGwnfSA6IHt9O1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgIHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9ubWF0cml4ZHJvcGRvd25Sb3cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcm93OiBTdXJ2ZXkuTWF0cml4RHJvcGRvd25Sb3dNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRvcjogU3VydmV5LklSZWFjdFN1cnZleUNyZWF0b3I7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFByb3BlcnRpZXMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnJvdyA9IG5leHRQcm9wcy5yb3c7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IG5leHRQcm9wcy5jcmVhdG9yO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucm93KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvdy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IHRoaXMucm93LmNlbGxzW2ldO1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gPFJlYWN0U3VydmV5UXVlc3Rpb25FcnJvcnMgcXVlc3Rpb249e2NlbGwucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IC8+XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0aGlzLnJlbmRlclNlbGVjdChjZWxsKTtcclxuICAgICAgICAgICAgdGRzLnB1c2goPHRkIGtleT17XCJyb3dcIiArIGl9PntlcnJvcnN9e3NlbGVjdH08L3RkPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPHRyPjx0ZD57dGhpcy5yb3cudGV4dH08L3RkPnt0ZHN9PC90cj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclNlbGVjdChjZWxsOiBTdXJ2ZXkuTWF0cml4RHJvcGRvd25DZWxsKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0b3IuY3JlYXRlUXVlc3Rpb25FbGVtZW50KGNlbGwucXVlc3Rpb24pO1xyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0cXVlc3Rpb24udHN4XCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tYXRyaXhkeW5hbWljIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgcm9vdENzczogYW55O1xyXG4gICAgcHJvdGVjdGVkIGNyZWF0b3I6IFN1cnZleS5JUmVhY3RTdXJ2ZXlDcmVhdG9yO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhuZXh0UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRQcm9wZXJ0aWVzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gbmV4dFByb3BzLnJvb3RDc3M7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHJvd0NvdW50ZXI6IDAgfTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnJvd0NvdW50Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlLnJvd0NvdW50ZXIgPSBzZWxmLnN0YXRlLnJvd0NvdW50ZXIgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmhhbmRsZU9uUm93QWRkQ2xpY2sgPSB0aGlzLmhhbmRsZU9uUm93QWRkQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uUm93QWRkQ2xpY2soZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmFkZFJvdygpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBoZWFkZXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMucXVlc3Rpb24uY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiY29sdW1uXCIgKyBpO1xyXG4gICAgICAgICAgICB2YXIgbWluV2lkdGggPSB0aGlzLnF1ZXN0aW9uLmdldENvbHVtbldpZHRoKGNvbHVtbik7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5TdHlsZSA9IG1pbldpZHRoID8geyBtaW5XaWR0aDogbWluV2lkdGggfSA6IHt9O1xyXG4gICAgICAgICAgICBoZWFkZXJzLnB1c2goPHRoIGtleT17a2V5fSBzdHlsZT17Y29sdW1uU3R5bGV9Pnt0aGlzLnF1ZXN0aW9uLmdldENvbHVtblRpdGxlKGNvbHVtbikgfTwvdGg+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICB2YXIgdmlzaWJsZVJvd3MgPSB0aGlzLnF1ZXN0aW9uLnZpc2libGVSb3dzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJyb3dcIiArIGk7XHJcbiAgICAgICAgICAgIHJvd3MucHVzaCg8UmVhY3RTdXJ2ZXlRdWVzdGlvbm1hdHJpeGR5bmFtaWNSb3cga2V5PXtrZXl9IHJvdz17cm93fSBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gaW5kZXg9e2l9IGNzcz17dGhpcy5jc3N9IHJvb3RDc3M9e3RoaXMucm9vdENzc30gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkaXZTdHlsZSA9IHRoaXMucXVlc3Rpb24uaG9yaXpvbnRhbFNjcm9sbCA/IHsgb3ZlcmZsb3dYOiAnc2Nyb2xsJyB9IDoge307XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgIHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJBZGRSb3dCdXR0b24oKSB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQWRkUm93QnV0dG9uKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPGlucHV0IGNsYXNzTmFtZT17dGhpcy5jc3MuYnV0dG9ufSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVPblJvd0FkZENsaWNrfSB2YWx1ZT17dGhpcy5xdWVzdGlvbi5hZGRSb3dUZXh0fSAvPjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbm1hdHJpeGR5bmFtaWNSb3cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcm93OiBTdXJ2ZXkuTWF0cml4RHluYW1pY1Jvd01vZGVsO1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsO1xyXG4gICAgcHJpdmF0ZSBpbmRleDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgcHJvdGVjdGVkIHJvb3RDc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCBjcmVhdG9yOiBTdXJ2ZXkuSVJlYWN0U3VydmV5Q3JlYXRvcjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHByb3BzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMobmV4dFByb3BzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UHJvcGVydGllcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucm93ID0gbmV4dFByb3BzLnJvdztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSBuZXh0UHJvcHMuaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IG5leHRQcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25Sb3dSZW1vdmVDbGljayA9IHRoaXMuaGFuZGxlT25Sb3dSZW1vdmVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25Sb3dSZW1vdmVDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24ucmVtb3ZlUm93KHRoaXMuaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucm93KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvdy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IHRoaXMucm93LmNlbGxzW2ldO1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gPFJlYWN0U3VydmV5UXVlc3Rpb25FcnJvcnMgcXVlc3Rpb249e2NlbGwucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IC8+XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0aGlzLnJlbmRlclF1ZXN0aW9uKGNlbGwpO1xyXG4gICAgICAgICAgICB0ZHMucHVzaCg8dGQga2V5PXtcInJvd1wiICsgaX0+e2Vycm9yc317c2VsZWN0fTwvdGQ+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlbW92ZUJ1dHRvbiA9IHRoaXMucmVuZGVyQnV0dG9uKCk7XHJcbiAgICAgICAgdGRzLnB1c2goPHRkIGtleT17XCJyb3dcIiArIHRoaXMucm93LmNlbGxzLmxlbmd0aCArIDF9PntyZW1vdmVCdXR0b259PC90ZD4pO1xyXG4gICAgICAgIHJldHVybiAoPHRyPnt0ZHN9PC90cj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclF1ZXN0aW9uKGNlbGw6IFN1cnZleS5NYXRyaXhEcm9wZG93bkNlbGwpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRvci5jcmVhdGVRdWVzdGlvbkVsZW1lbnQoY2VsbC5xdWVzdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQnV0dG9uKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPGlucHV0IGNsYXNzTmFtZT17dGhpcy5jc3MuYnV0dG9ufSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVPblJvd1JlbW92ZUNsaWNrfSB2YWx1ZT17dGhpcy5xdWVzdGlvbi5yZW1vdmVSb3dUZXh0fSAvPjtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tdWx0aXBsZXRleHQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhYmxlUm93cyA9IHRoaXMucXVlc3Rpb24uZ2V0Um93cygpO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcm93cy5wdXNoKHRoaXMucmVuZGVyUm93KFwiaXRlbVwiICsgaSwgdGFibGVSb3dzW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUm93KGtleTogc3RyaW5nLCBpdGVtczogQXJyYXk8U3VydmV5Lk11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4pIHtcclxuICAgICAgICB2YXIgdGRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICB0ZHMucHVzaCg8dGQga2V5PXtcImxhYmVsXCIgKyBpfT48c3BhbiBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW1UaXRsZX0+e2l0ZW0udGl0bGV9PC9zcGFuPjwvdGQ+KTtcclxuICAgICAgICAgICAgdGRzLnB1c2goPHRkIGtleT17XCJ2YWx1ZVwiICsgaX0+e3RoaXMucmVuZGVySXRlbShpdGVtKX08L3RkPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8dHIga2V5PXtrZXl9Pnt0ZHN9PC90cj47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySXRlbShpdGVtOiBTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbU1vZGVsKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlRdWVzdGlvbm11bHRpcGxldGV4dEl0ZW0gaXRlbT17aXRlbX0gY3NzPXt0aGlzLmNzc30gLz47XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25tdWx0aXBsZXRleHRJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIGl0ZW06IFN1cnZleS5NdWx0aXBsZVRleHRJdGVtTW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IHByb3BzLml0ZW07XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMuaXRlbS52YWx1ZSB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMuaXRlbS52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMuaXRlbS52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLml0ZW0gPSBuZXh0UHJvcHMuaXRlbTtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5pdGVtKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgc3R5bGUgPSB7IGZsb2F0OiBcImxlZnRcIiB9O1xyXG4gICAgICAgIHJldHVybiAoPGlucHV0ICBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW1WYWx1ZX0gc3R5bGU9e3N0eWxlfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBtYWluQ2xhc3NOYW1lKCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvaW5kZXguZC50c1wiIC8+XHJcbmNsYXNzIFJlYWN0U3VydmV5UXVlc3Rpb25yYWRpb2dyb3VwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvblJhZGlvZ3JvdXBNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBwcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGNob2ljZXNDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5jaG9pY2VzQ2hhbmdlZCA9IHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgIHt0aGlzLmdldEl0ZW1zKCkgfVxyXG4gICAgICAgICAgICA8L2Zvcm0+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRJdGVtcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXN0aW9uLnZpc2libGVDaG9pY2VzW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJpdGVtXCIgKyBpO1xyXG4gICAgICAgICAgICBpdGVtcy5wdXNoKHRoaXMucmVuZGVySXRlbShrZXksIGl0ZW0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCB0ZXh0U3R5bGUoKTogYW55IHsgcmV0dXJuIHsgbWFyZ2luTGVmdDogXCIzcHhcIiB9OyB9XHJcbiAgICBwcml2YXRlIHJlbmRlckl0ZW0oa2V5OiBzdHJpbmcsIGl0ZW06IFN1cnZleS5JdGVtVmFsdWUpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGl0ZW1XaWR0aCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPiAwID8gKDEwMCAvIHRoaXMucXVlc3Rpb24uY29sQ291bnQpICsgXCIlXCIgOiBcIlwiO1xyXG4gICAgICAgIHZhciBtYXJnaW5SaWdodCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFwiNXB4XCIgOiBcIjBweFwiO1xyXG4gICAgICAgIHZhciBkaXZTdHlsZSA9IHsgbWFyZ2luUmlnaHQ6IG1hcmdpblJpZ2h0IH07XHJcbiAgICAgICAgaWYgKGl0ZW1XaWR0aCkge1xyXG4gICAgICAgICAgICBkaXZTdHlsZVtcIndpZHRoXCJdID0gaXRlbVdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5xdWVzdGlvbi52YWx1ZSA9PSBpdGVtLnZhbHVlO1xyXG4gICAgICAgIHZhciBvdGhlckl0ZW0gPSAoaXNDaGVja2VkICYmIGl0ZW0udmFsdWUgPT09IHRoaXMucXVlc3Rpb24ub3RoZXJJdGVtLnZhbHVlKSA/IHRoaXMucmVuZGVyT3RoZXIoKSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUmFkaW8oa2V5LCBpdGVtLCBpc0NoZWNrZWQsIGRpdlN0eWxlLCBvdGhlckl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclJhZGlvKGtleTogc3RyaW5nLCBpdGVtOiBTdXJ2ZXkuSXRlbVZhbHVlLCBpc0NoZWNrZWQ6IGJvb2xlYW4sIGRpdlN0eWxlOiBhbnksIG90aGVySXRlbTogSlNYLkVsZW1lbnQpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGtleT17a2V5fSBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19IHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPXt0aGlzLmNzcy5pdGVtfT5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgIGNoZWNrZWQ9e2lzQ2hlY2tlZH0gdmFsdWU9e2l0ZW0udmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt0aGlzLnRleHRTdHlsZX0+e2l0ZW0udGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIHtvdGhlckl0ZW19XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyT3RoZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLm90aGVyfT48UmVhY3RTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtICBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gY3NzPXt0aGlzLnJvb3RDc3N9IC8+PC9kaXY+KTtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fdGV4dC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG5jbGFzcyBSZWFjdFN1cnZleVF1ZXN0aW9udGV4dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uVGV4dE1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPXt0aGlzLmNzc30gdHlwZT1cInRleHRcIiB2YWx1ZT17dGhpcy5xdWVzdGlvbi52YWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9IC8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9zdXJ2ZXkudHNcIiAvPlxyXG5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlNb2RlbCBleHRlbmRzIFN1cnZleS5TdXJ2ZXlNb2RlbCB7XHJcbiAgICByZW5kZXJDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcihqc29uT2JqKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJDYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBtZXJnZUNzcyhzcmM6IGFueSwgZGVzdDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5tZXJnZVZhbHVlcyhzcmMsIGRlc3QpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZFN1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxufVxyXG4iLCJjbGFzcyBSZWFjdFN1cnZleU5hdmlnYXRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgc3VydmV5OiBTdXJ2ZXkuU3VydmV5TW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gcHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUHJldkNsaWNrID0gdGhpcy5oYW5kbGVQcmV2Q2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU5leHRDbGljayA9IHRoaXMuaGFuZGxlTmV4dENsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVDb21wbGV0ZUNsaWNrID0gdGhpcy5oYW5kbGVDb21wbGV0ZUNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXh0UHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgIH1cclxuICAgIGhhbmRsZVByZXZDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnByZXZQYWdlKCk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVOZXh0Q2xpY2soZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN1cnZleS5uZXh0UGFnZSgpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlQ29tcGxldGVDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5LmNvbXBsZXRlTGFzdFBhZ2UoKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN1cnZleSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHByZXZCdXR0b24gPSAhdGhpcy5zdXJ2ZXkuaXNGaXJzdFBhZ2UgPyB0aGlzLnJlbmRlckJ1dHRvbih0aGlzLmhhbmRsZVByZXZDbGljaywgdGhpcy5zdXJ2ZXkucGFnZVByZXZUZXh0LCB0aGlzLmNzcy5uYXZpZ2F0aW9uLnByZXYpIDogbnVsbDtcclxuICAgICAgICB2YXIgbmV4dEJ1dHRvbiA9ICF0aGlzLnN1cnZleS5pc0xhc3RQYWdlID8gdGhpcy5yZW5kZXJCdXR0b24odGhpcy5oYW5kbGVOZXh0Q2xpY2ssIHRoaXMuc3VydmV5LnBhZ2VOZXh0VGV4dCwgdGhpcy5jc3MubmF2aWdhdGlvbi5uZXh0KSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGNvbXBsZXRlQnV0dG9uID0gdGhpcy5zdXJ2ZXkuaXNMYXN0UGFnZSA/IHRoaXMucmVuZGVyQnV0dG9uKHRoaXMuaGFuZGxlQ29tcGxldGVDbGljaywgdGhpcy5zdXJ2ZXkuY29tcGxldGVUZXh0LCB0aGlzLmNzcy5uYXZpZ2F0aW9uLmNvbXBsZXRlKSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmZvb3Rlcn0+XHJcbiAgICAgICAgICAgICAgICB7cHJldkJ1dHRvbn1cclxuICAgICAgICAgICAgICAgIHtuZXh0QnV0dG9ufVxyXG4gICAgICAgICAgICAgICAge2NvbXBsZXRlQnV0dG9ufVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJCdXR0b24oY2xpY2s6IGFueSwgdGV4dDogc3RyaW5nLCBidG5DbGFzc05hbWU6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGUgPSB7IG1hcmdpblJpZ2h0OiBcIjVweFwiIH07XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMuY3NzLm5hdmlnYXRpb25CdXR0b24gKyAoYnRuQ2xhc3NOYW1lID8gJyAnICsgYnRuQ2xhc3NOYW1lIDogXCJcIik7XHJcbiAgICAgICAgcmV0dXJuIDxpbnB1dCBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3N0eWxlfSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17Y2xpY2t9IHZhbHVlPXt0ZXh0fSAvPjtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0c3VydmV5bW9kZWwudHN4XCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0UGFnZS50c3hcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicmVhY3RRdWVzdGlvbi50c3hcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uLnRzeFwiIC8+XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleUJhc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IGltcGxlbWVudHMgU3VydmV5LklSZWFjdFN1cnZleUNyZWF0b3Ige1xyXG4gICAgcHJvdGVjdGVkIHN1cnZleTogUmVhY3RTdXJ2ZXlNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jc3MgPSB0aGlzLmNyZWF0ZUNzc09iamVjdCgpO1xyXG4gICAgICAgIGlmICghdGhpcy5jc3MpIHRocm93IFwiWW91IHNob3VsZCBub3QgcmV0dXJuIG51bGwgZm9yIGNyZWF0ZUNzc09iamVjdCgpIG1ldGhvZC5cIjtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN1cnZleShwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTdXJ2ZXkobmV4dFByb3BzKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5LnN0YXRlID09IFwiY29tcGxldGVkXCIpIHJldHVybiB0aGlzLnJlbmRlckNvbXBsZXRlZCgpO1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleS5zdGF0ZSA9PSBcImxvYWRpbmdcIikgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGluZygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1cnZleSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUNzc09iamVjdCgpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckNvbXBsZXRlZCgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGh0bWxWYWx1ZSA9IHsgX19odG1sOiB0aGlzLnN1cnZleS5wcm9jZXNzZWRDb21wbGV0ZWRIdG1sIH1cclxuICAgICAgICByZXR1cm4gKDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e2h0bWxWYWx1ZX0gLz4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckxvYWRpbmcoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBodG1sVmFsdWUgPSB7IF9faHRtbDogdGhpcy5zdXJ2ZXkucHJvY2Vzc2VkTG9hZGluZ0h0bWwgfVxyXG4gICAgICAgIHJldHVybiAoPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17aHRtbFZhbHVlfSAvPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyU3VydmV5KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnN1cnZleS50aXRsZSAmJiB0aGlzLnN1cnZleS5zaG93VGl0bGUgPyB0aGlzLnJlbmRlclRpdGxlKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBjdXJyZW50UGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlID8gdGhpcy5yZW5kZXJQYWdlKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciB0b3BQcm9ncmVzcyA9IHRoaXMuc3VydmV5LnNob3dQcm9ncmVzc0JhciA9PSBcInRvcFwiID8gdGhpcy5yZW5kZXJQcm9ncmVzcyh0cnVlKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGJvdHRvbVByb2dyZXNzID0gdGhpcy5zdXJ2ZXkuc2hvd1Byb2dyZXNzQmFyID09IFwiYm90dG9tXCIgPyB0aGlzLnJlbmRlclByb2dyZXNzKGZhbHNlKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSAoY3VycmVudFBhZ2UgJiYgdGhpcy5zdXJ2ZXkuc2hvd05hdmlnYXRpb25CdXR0b25zKSA/IHRoaXMucmVuZGVyTmF2aWdhdGlvbigpIDogbnVsbDtcclxuICAgICAgICBpZiAoIWN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlID0gdGhpcy5yZW5kZXJFbXB0eVN1cnZleSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICB7dGl0bGV9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3MuYm9keX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3RvcFByb2dyZXNzfVxyXG4gICAgICAgICAgICAgICAgICAgIHtjdXJyZW50UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICB7Ym90dG9tUHJvZ3Jlc3N9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHtidXR0b25zfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclRpdGxlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmhlYWRlcn0+PGgzPnt0aGlzLnN1cnZleS50aXRsZX08L2gzPjwvZGl2PjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJQYWdlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPFJlYWN0U3VydmV5UGFnZSBzdXJ2ZXk9e3RoaXMuc3VydmV5fSBwYWdlPXt0aGlzLnN1cnZleS5jdXJyZW50UGFnZX0gY3NzPXt0aGlzLmNzc30gY3JlYXRvcj17dGhpc30gLz47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvZ3Jlc3MoaXNUb3A6IGJvb2xlYW4pOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyTmF2aWdhdGlvbigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxSZWFjdFN1cnZleU5hdmlnYXRpb24gc3VydmV5ID0ge3RoaXMuc3VydmV5fSBjc3M9e3RoaXMuY3NzfS8+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckVtcHR5U3VydmV5KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxzcGFuPnt0aGlzLnN1cnZleS5lbXB0eVN1cnZleVRleHR9PC9zcGFuPik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN1cnZleShuZXdQcm9wczogYW55KSB7XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5tb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXdQcm9wcy5tb2RlbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdQcm9wcy5qc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXcgUmVhY3RTdXJ2ZXlNb2RlbChuZXdQcm9wcy5qc29uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3IFJlYWN0U3VydmV5TW9kZWwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5jbGllbnRJZCkgdGhpcy5zdXJ2ZXkuY2xpZW50SWQgPSBuZXdQcm9wcy5jbGllbnRJZDtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmRhdGEpIHRoaXMuc3VydmV5LmRhdGEgPSBuZXdQcm9wcy5kYXRhO1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMuY3NzKSB0aGlzLnN1cnZleS5tZXJnZUNzcyhuZXdQcm9wcy5jc3MsIHRoaXMuY3NzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vc2V0IHRoZSBmaXJzdCBwYWdlXHJcbiAgICAgICAgdmFyIGR1bW15ID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2U7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHBhZ2VJbmRleENoYW5nZTogMCwgaXNDb21wbGV0ZWQ6IGZhbHNlLCBtb2RlbENoYW5nZWQ6IDAgfTtcclxuICAgICAgICB0aGlzLnNldFN1cnZleUV2ZW50cyhuZXdQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0U3VydmV5RXZlbnRzKG5ld1Byb3BzOiBhbnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUubW9kZWxDaGFuZ2VkID0gc2VsZi5zdGF0ZS5tb2RlbENoYW5nZWQgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25Db21wbGV0ZS5hZGQoKHNlbmRlcikgPT4geyBzZWxmLnN0YXRlLmlzQ29tcGxldGVkID0gdHJ1ZTsgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTsgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25DdXJyZW50UGFnZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5wYWdlSW5kZXhDaGFuZ2UgPSBzZWxmLnN0YXRlLnBhZ2VJbmRleENoYW5nZSArIDE7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcyAmJiBuZXdQcm9wcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZCkgbmV3UHJvcHMub25DdXJyZW50UGFnZUNoYW5nZWQoc2VuZGVyLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleS5vblZpc2libGVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnF1ZXN0aW9uICYmIG9wdGlvbnMucXVlc3Rpb24ucmVhY3QpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IG9wdGlvbnMucXVlc3Rpb24ucmVhY3Quc3RhdGU7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS52aXNpYmxlID0gb3B0aW9ucy5xdWVzdGlvbi52aXNpYmxlO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5xdWVzdGlvbi5yZWFjdC5zZXRTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleS5vblZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5xdWVzdGlvbiAmJiBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0LnN0YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhdGUudmFsdWUgPSBvcHRpb25zLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5xdWVzdGlvbi5yZWFjdC5zZXRTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoIW5ld1Byb3BzKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25WYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmRhdGEpIG5ld1Byb3BzLmRhdGFbb3B0aW9ucy5uYW1lXSA9IG9wdGlvbnMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5vblZhbHVlQ2hhbmdlZCkgbmV3UHJvcHMub25WYWx1ZUNoYW5nZWQoc2VuZGVyLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAobmV3UHJvcHMub25Db21wbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyKSA9PiB7IG5ld1Byb3BzLm9uQ29tcGxldGUoc2VuZGVyKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uUGFnZVZpc2libGVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IGlmIChuZXdQcm9wcy5vblBhZ2VWaXNpYmxlQ2hhbmdlZCkgbmV3UHJvcHMub25QYWdlVmlzaWJsZUNoYW5nZWQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uUXVlc3Rpb25BZGRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblF1ZXN0aW9uQWRkZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25RdWVzdGlvbkFkZGVkKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25RdWVzdGlvblJlbW92ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25RdWVzdGlvblJlbW92ZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25RdWVzdGlvblJlbW92ZWQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblZhbGlkYXRlUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25WYWxpZGF0ZVF1ZXN0aW9uLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uVmFsaWRhdGVRdWVzdGlvbihzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uU2VuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblNlbmRSZXN1bHQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25TZW5kUmVzdWx0KHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25HZXRSZXN1bHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25HZXRSZXN1bHQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25HZXRSZXN1bHQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblByb2Nlc3NIdG1sKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUHJvY2Vzc0h0bWwuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25Qcm9jZXNzSHRtbChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UmVhY3RRdWVzdGlvbkNsYXNzKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKTogYW55IHtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJSZWFjdFN1cnZleVF1ZXN0aW9uXCIgKyBxdWVzdGlvbi5nZXRUeXBlKCk7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1tjbGFzc05hbWVdO1xyXG4gICAgfVxyXG4gICAgLy9JUmVhY3RTdXJ2ZXlDcmVhdG9yXHJcbiAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb25FbGVtZW50KHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbkNzcyA9IHRoaXMuY3NzW3F1ZXN0aW9uLmdldFR5cGUoKV07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGhpcy5nZXRSZWFjdFF1ZXN0aW9uQ2xhc3MocXVlc3Rpb24pLCB7IHF1ZXN0aW9uOiBxdWVzdGlvbiwgY3NzOiBxdWVzdGlvbkNzcywgcm9vdENzczogdGhpcy5jc3MsIGNyZWF0b3I6IHRoaXMgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyRXJyb3Ioa2V5OiBzdHJpbmcsIGVycm9yVGV4dDogc3RyaW5nKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGtleT17a2V5fSBjbGFzc05hbWU9e3RoaXMuY3NzLmVycm9yLml0ZW19PntlcnJvclRleHR9PC9kaXY+O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZUxvY2F0aW9uOyB9XHJcbn1cclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxuXHJcbmNsYXNzIFJlYWN0U3VydmV5UHJvZ3Jlc3NCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHN1cnZleTogU3VydmV5LlN1cnZleU1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGlzVG9wOiBib29sZWFuO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IHByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLmlzVG9wID0gcHJvcHMuaXNUb3A7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXh0UHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLmlzVG9wID0gbmV4dFByb3BzLmlzVG9wO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9ncmVzcygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5zdXJ2ZXkuZ2V0UHJvZ3Jlc3MoKTsgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9ncmVzc1RleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3VydmV5LnByb2dyZXNzVGV4dDsgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9xdWVzdGlvbl9yYXRpbmcudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuY2xhc3MgUmVhY3RTdXJ2ZXlRdWVzdGlvbnJhdGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uUmF0aW5nTW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgcm9vdENzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gcHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBuZXh0UHJvcHMucm9vdENzcztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdmFsdWVzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLnZpc2libGVSYXRlVmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBtaW5UZXh0ID0gaSA9PSAwID8gdGhpcy5xdWVzdGlvbi5taW5pbnVtUmF0ZURlc2NyaXB0aW9uICsgXCIgXCIgOiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgbWF4VGV4dCA9IGkgPT0gdGhpcy5xdWVzdGlvbi52aXNpYmxlUmF0ZVZhbHVlcy5sZW5ndGggLSAxID8gXCIgXCIgKyB0aGlzLnF1ZXN0aW9uLm1heGltdW1SYXRlRGVzY3JpcHRpb24gOiBudWxsO1xyXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLnJlbmRlckl0ZW0oXCJ2YWx1ZVwiICsgaSwgdGhpcy5xdWVzdGlvbi52aXNpYmxlUmF0ZVZhbHVlc1tpXSwgbWluVGV4dCwgbWF4VGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29tbWVudCA9IHRoaXMucXVlc3Rpb24uaGFzT3RoZXIgPyB0aGlzLnJlbmRlck90aGVyKCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fSBkYXRhLXRvZ2dsZT1cImJ1dHRvbnNcIj5cclxuICAgICAgICAgICAgICAgIHt2YWx1ZXN9XHJcbiAgICAgICAgICAgICAgICB7Y29tbWVudH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJJdGVtKGtleTogc3RyaW5nLCBpdGVtOiBTdXJ2ZXkuSXRlbVZhbHVlLCBtaW5UZXh0OiBzdHJpbmcsIG1heFRleHQ6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5xdWVzdGlvbi52YWx1ZSA9PSBpdGVtLnZhbHVlO1xyXG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLmNzcy5pdGVtO1xyXG4gICAgICAgIGlmIChpc0NoZWNrZWQpIGNsYXNzTmFtZSArPSBcIiBhY3RpdmVcIjtcclxuICAgICAgICB2YXIgbWluID0gbWluVGV4dCA/IDxzcGFuPnttaW5UZXh0fTwvc3Bhbj4gOiBudWxsO1xyXG4gICAgICAgIHZhciBtYXggPSBtYXhUZXh0ID8gPHNwYW4+e21heFRleHR9PC9zcGFuPiA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIDxsYWJlbCBrZXk9e2tleX0gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT17dGhpcy5xdWVzdGlvbi5uYW1lfSB2YWx1ZT17aXRlbS52YWx1ZX0gY2hlY2tlZD17dGhpcy5xdWVzdGlvbi52YWx1ZSA9PSBpdGVtLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICAgICAge21pbn1cclxuICAgICAgICAgICAgPHNwYW4+e2l0ZW0udGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIHttYXh9XHJcbiAgICAgICAgICAgIDwvbGFiZWw+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlck90aGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5vdGhlcn0+PFJlYWN0U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSAgcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSAvPjwvZGl2Pik7XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3N1cnZleS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9yZWFjdFN1cnZleVByb2dyZXNzLnRzeFwiIC8+XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVByb2dyZXNzIGV4dGVuZHMgUmVhY3RTdXJ2ZXlQcm9ncmVzc0Jhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5pc1RvcCA/IHsgd2lkdGg6IFwiNjAlXCIgfSA6IHsgd2lkdGg6IFwiNjAlXCIsIG1hcmdpblRvcDogXCIxMHB4XCJ9O1xyXG4gICAgICAgIHZhciBwcm9ncmVzc1N0eWxlID0geyB3aWR0aDogdGhpcy5wcm9ncmVzcyArIFwiJVwiIH07XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3MucHJvZ3Jlc3N9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Byb2dyZXNzU3R5bGV9IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhclwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMucHJvZ3Jlc3NUZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vc3VydmV5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3JlYWN0U3VydmV5LnRzeFwiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJyZWFjdFN1cnZleVByb2dyZXNzQm9vdHN0cmFwLnRzeFwiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9kZWZhdWx0Q3NzL2Nzc2Jvb3RzdHJhcC50c1wiIC8+XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleSBleHRlbmRzIFJlYWN0U3VydmV5QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbmRlckVycm9yKGtleTogc3RyaW5nLCBlcnJvclRleHQ6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPGRpdiAga2V5PXtrZXl9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXt0aGlzLmNzcy5lcnJvci5pdGVtfSBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj4ge2Vycm9yVGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb2dyZXNzKGlzVG9wOiBCb29sZWFuKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8UmVhY3RTdXJ2ZXlQcm9ncmVzcyBzdXJ2ZXkgPSB7dGhpcy5zdXJ2ZXl9IGNzcz17dGhpcy5jc3N9IGlzVG9wID0ge2lzVG9wfSAvPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDc3NPYmplY3QoKTogYW55IHsgcmV0dXJuIFN1cnZleS5kZWZhdWx0Qm9vdHN0cmFwQ3NzOyB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vdHlwaW5ncy9pbmRleC5kLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInJlYWN0U3VydmV5Qm9vdHN0cmFwLnRzeFwiIC8+XHJcblxyXG5jbGFzcyBSZWFjdFN1cnZleVdpbmRvdyBleHRlbmRzIFJlYWN0U3VydmV5IHtcclxuICAgIHByaXZhdGUgdGl0bGU6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkV4cGFuZGVkID0gdGhpcy5oYW5kbGVPbkV4cGFuZGVkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkV4cGFuZGVkKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5leHBhbmRlZCA9ICF0aGlzLnN0YXRlLmV4cGFuZGVkO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhpZGRlbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMucmVuZGVySGVhZGVyKCk7XHJcbiAgICAgICAgdmFyIGJvZHkgPSB0aGlzLnN0YXRlLmV4cGFuZGVkID8gdGhpcy5yZW5kZXJCb2R5KCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHsgcG9zaXRpb246IFwiZml4ZWRcIiwgYm90dG9tOiBcIjNweFwiLCByaWdodDogXCIxMHB4XCIgfTtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1jb250ZW50XCIgc3R5bGU9e3N0eWxlfT5cclxuICAgICAgICAgICAge2hlYWRlcn1cclxuICAgICAgICAgICAge2JvZHl9XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJIZWFkZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBzdHlsZUEgPSB7IHdpZHRoOiBcIjEwMCVcIiB9O1xyXG4gICAgICAgIHZhciBzdHlsZVRpdGxlID0geyBwYWRkaW5nUmlnaHQ6IFwiMTBweFwiIH07XHJcbiAgICAgICAgdmFyIGdseXBoQ2xhc3NOYW1lID0gdGhpcy5zdGF0ZS5leHBhbmRlZCA/IFwiZ2x5cGhpY29uLWNoZXZyb24tZG93blwiIDogXCJnbHlwaGljb24tY2hldnJvbi11cFwiO1xyXG4gICAgICAgIGdseXBoQ2xhc3NOYW1lID0gXCJnbHlwaGljb24gcHVsbC1yaWdodCBcIiArIGdseXBoQ2xhc3NOYW1lO1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlciBwYW5lbC10aXRsZVwiPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlT25FeHBhbmRlZH0gc3R5bGU9e3N0eWxlQX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwdWxsLWxlZnRcIiBzdHlsZT17c3R5bGVUaXRsZX0+e3RoaXMudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtnbHlwaENsYXNzTmFtZX0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckJvZHkoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPlxyXG4gICAgICAgIHt0aGlzLnJlbmRlclN1cnZleSgpIH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlU3VydmV5KG5ld1Byb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVTdXJ2ZXkobmV3UHJvcHMpO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSBuZXdQcm9wcy50aXRsZSA/IG5ld1Byb3BzLnRpdGxlIDogdGhpcy5zdXJ2ZXkudGl0bGU7XHJcbiAgICAgICAgdmFyIGhhc0V4cGFuZGVkID0gbmV3UHJvcHNbXCJleHBhbmRlZFwiXSA/IG5ld1Byb3BzLmV4cGFuZGVkIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgZXhwYW5kZWQ6IGhhc0V4cGFuZGVkLCBoaWRkZW46IGZhbHNlIH07XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKGZ1bmN0aW9uIChzOiBTdXJ2ZXkuU3VydmV5TW9kZWwpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

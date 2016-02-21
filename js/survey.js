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
/// <reference path="dragdrophelper.ts" />
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
                this.dragOver = function (e) { self.doDragOver(e); };
                this.dragDrop = function (e) { self.doDragDrop(e); };
                this.dragStart = function (e) { self.startDragging(e); };
                var self = this;
                this.koIsSelected = ko.observable(false);
                this.koOnClick = function () {
                    if (self.data == null || !self.data.isDesignMode)
                        return;
                    self.data.selectedQuestion = this;
                };
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
        Question.prototype.onSelectedQuestionChanged = function () {
            if (this.data == null)
                return;
            this.koIsSelected(this.data.selectedQuestion == this);
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
        Object.defineProperty(Question.prototype, "dragDropHelper", {
            get: function () {
                if (this.dragDropHelperValue == null) {
                    this.dragDropHelperValue = new Survey.DragDropHelper(this.data);
                }
                return this.dragDropHelperValue;
            },
            enumerable: true,
            configurable: true
        });
        Question.prototype.startDragging = function (e) {
            this.dragDropHelper.startDragQuestion(e, this.name);
        };
        Question.prototype.doDragOver = function (e) {
            this.dragDropHelper.doDragDropOver(e, this);
        };
        Question.prototype.doDragDrop = function (e) {
            this.dragDropHelper.doDrop(e, this);
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
        ko.html = '<script type="text/html" id="survey-comment">  <input data-bind="value:$data.question.koComment, visible:$data.visible" /></script><div class="sv_main">    <h2 data-bind="visible: (title.length > 0) && showTitle, text: title"></h2>    <!-- ko if: koCurrentPage() -->    <div data-bind="template: { name: \'survey-page\', data: koCurrentPage }"></div>    <p />    <div class="sv_nav" data-bind="visible: showNavigationButtons && !isDesignMode">        <input type="button" data-bind="value: pagePrevText, click: prevPage, visible: !koIsFirstPage()" />  <input type="button" value="Next" data-bind="value: pageNextText, click: nextPage, visible: !koIsLastPage()" />  <input type="button" value="Submit" data-bind="value: completeText, click: completeLastPage, visible: koIsLastPage()" />    </div>    <!-- /ko -->    <!-- ko if: koCurrentPage() == null -->    There is no any visible page or visible question in the survey.    <!-- /ko --></div><script type="text/html" id="survey-page">    <div data-bind="event:{           dragenter:function(el, e){ dragEnter(e);},           dragleave:function(el, e){ dragLeave(e);},           dragover:function(el, e){ return false;},           drop:function(el, e){ dragDrop(e);}}     ">        <h3 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + title"></h3>        <!-- ko foreach: { data: questions, as: \'question\' } -->            <div class="sv_dragover" data-bind="visible:$parent.koDragging() == $index()"></div>            <!-- ko template: { name: \'survey-question\', data: question } -->            <!-- /ko -->        <!-- /ko -->        <div data-bind="visible:$root.isDesignMode && questions.length == 0" class="sv_page_empty">            <span class="sv_page_empty_content">Please drop a question here.</span>        </div>        <div class="sv_dragover" data-bind="visible:koDragging() == questions.length"></div>    </div></script><script type="text/html" id="survey-question-checkbox">    <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->    <div data-bind="css: question.koClass">        <div class="sv_q_checkbox">            <label>                <input type="checkbox"                       data-bind="value: item.value, checked: question.koValue" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="if:$index() == (question.visibleChoices.length-1), visible: question.hasOther">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>            </div>        </div>    </div>    <!-- /ko --></script><script type="text/html" id="survey-question-comment">    <textarea type="text" data-bind="attr: {cols: question.cols, rows: question.rows}, value:question.koValue" /></script><script type="text/html" id="survey-question-dropdown">    <select data-bind="options: question.visibleChoices, optionsText: \'text\', optionsValue: \'value\', value: question.koValue, optionsCaption: \'Choose...\'"></select>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-matrix">    <table class="sv_q_matrix">        <thead>            <tr>                <th data-bind="visible: question.hasRows"></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="visible: question.hasRows, text:row.text"></td>                <!-- ko foreach: question.columns -->                <td>                    <input type="radio" data-bind="attr: {name: row.fullName, value: $data.value}, checked: row.koValue"/>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-multipletext">    <table data-bind="foreach: { data:  question.items, as: \'item\' }">        <tr>            <td data-bind="text: item.title"></td>            <td><input type="text" data-bind="attr: {size: question.itemSize}, value: item.koValue" /></td>        </tr>    </table></script><script type="text/html" id="survey-question-radiogroup">    <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->    <div data-bind="css: question.koClass">        <div class="sv_q_radiogroup">            <label>                <input type="radio"                       data-bind="name: question.name, attr: {value: item.value}, checked: question.koValue" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="if:$index() == (question.visibleChoices.length-1), visible: question.hasOther">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>            </div>        </div>     </div>    <!-- /ko --></script><script type="text/html" id="survey-question-rating">    <table class="sv_q_rating">        <thead>            <tr>                <th></th>                <!-- ko foreach: question.koVisibleRateValues -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->                <th></th>            </tr>        </thead>        <tbody>            <tr>                <td data-bind="text:question.mininumRateDescription"></td>                <!-- ko foreach: question.koVisibleRateValues -->                <td>                    <input type="radio" data-bind="attr: {name: question.name, value: $data.value}, checked: question.koValue" />                </td>                <!-- /ko -->                <td data-bind="text:question.maximumRateDescription"></td>            </tr>        </tbody>    </table>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question } }"></div>    </div></script><script type="text/html" id="survey-question-text">    <input type="text" data-bind="attr: {size: question.size}, value:question.koValue"/></script><script type="text/html" id="survey-question">    <div class="sv_q" data-bind="attr : {draggable: $root.isDesignMode}, visible: question.koVisible() || $root.isDesignMode, click: $root.isDesignMode ? koOnClick: null, css: {sv_q_selected : koIsSelected},         event:{           dragstart:function(el, e){ dragStart(e); return true; },           dragover:function(el, e){ dragOver(e);},           drop:function(el, e){ dragDrop(e);}         }">        <div data-bind="css:{sv_q_design: $root.isDesignMode}">            <div style="color:red" data-bind="foreach: koErrors">                <div data-bind="text:$data.getText()"></div>            </div>            <h4 class="sv_q_h" data-bind="text: question.koNo() +  (question.isRequired ? question.data.requiredText : \'\') + question.title"></h4>            <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->            <!-- /ko -->            <div data-bind="visible: question.hasComment">                Other (please describe)                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>            </div>        </div>    </div></script>';
    })(ko = template.ko || (template.ko = {}));
})(template || (template = {}));

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
            this.selectedQuestionValue = null;
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
            this.onSelectedQuestionChanged = new Survey_1.Event();
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
        Object.defineProperty(Survey.prototype, "selectedQuestion", {
            get: function () { return this.selectedQuestionValue; },
            set: function (value) {
                if (value == this.selectedQuestion)
                    return;
                var oldValue = this.selectedQuestion;
                this.selectedQuestionValue = value;
                if (oldValue != null) {
                    oldValue.onSelectedQuestionChanged();
                }
                if (this.selectedQuestion != null) {
                    this.selectedQuestion.onSelectedQuestionChanged();
                }
                this.onSelectedQuestionChanged.fire(this, { 'oldSelectedQuestion': oldValue, 'newSelectedQuestion': value });
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

/// <reference path="base.ts" />
/// <reference path="question.ts" />
/// <reference path="survey.ts" />
var Survey;
(function (Survey) {
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
        DragDropHelper.prototype.doDragDropOver = function (event, question) {
            if (!question || !this.isSurveyDragging(event) || this.isSamePlace(event, question))
                return;
            var index = this.getQuestionIndex(event, question);
            this.survey.currentPage.koDragging(index);
        };
        DragDropHelper.prototype.doDrop = function (event, question) {
            if (question === void 0) { question = null; }
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            if (!this.isSurveyDragging(event))
                return;
            this.survey.currentPage.koDragging(-1);
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
            this.survey.render();
        };
        DragDropHelper.prototype.getQuestionIndex = function (event, question) {
            var page = this.survey.currentPage;
            if (!question)
                return page.questions.length;
            var index = page.questions.indexOf(question);
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
        DragDropHelper.prototype.isSurveyDragging = function (event) {
            if (!event)
                return false;
            var data = this.getData(event);
            return data && data.indexOf(DragDropHelper.dataStart) == 0;
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
    Survey.DragDropHelper = DragDropHelper;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dragdrophelper.ts" />
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
            this.dragEnterCounter = 0;
            var self = this;
            this.questions.push = function (value) {
                if (self.data != null) {
                    value.setData(self.data);
                }
                return Array.prototype.push.call(this, value);
            };
            if (this.isKO) {
                this.koNo = ko.observable("");
                this.koDragging = ko.observable(-1);
                this.koDragging.subscribe(function (newValue) { if (newValue < 0)
                    self.dragEnterCounter = 0; });
                this.dragEnter = function (e) { e.preventDefault(); self.dragEnterCounter++; if (self.koDragging() < 0)
                    self.koDragging(self.questions.length); };
                this.dragLeave = function (e) { self.dragEnterCounter--; if (self.dragEnterCounter === 0)
                    self.koDragging(-1); };
                this.dragDrop = function (e) { self.doDrop(e); };
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
        Page.prototype.doDrop = function (e) {
            new Survey.DragDropHelper(this.data).doDrop(e);
        };
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
                this.koClass = ko.computed(function () { self.dummyObservable(); return "sv_qcbc" + self.colCount; });
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
var Survey;
(function (Survey) {
    var SurveyWindow = (function (_super) {
        __extends(SurveyWindow, _super);
        function SurveyWindow(jsonObj) {
            _super.call(this);
            var self = this;
            this.surveyValue = new Survey.Survey(jsonObj);
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
            this.windowElement.innerHTML = template.window.ko.html;
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
            ko.html = '<div class="sv_window">    <div class="sv_window_title"><a href="#" data-bind="click:doExpand" style="width:100%"><span data-bind="text:title"></span></a></div>    <div data-bind="visible:koExpanded">        <div id="windowSurveyJS"></div>    </div></div>';
        })(ko = window.ko || (window.ko = {}));
    })(window = template.window || (template.window = {}));
})(template || (template = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudHMiLCJxdWVzdGlvbmZhY3RvcnkudHMiLCJlcnJvci50cyIsImpzb25vYmplY3QudHMiLCJ2YWxpZGF0b3IudHMiLCJxdWVzdGlvbi50cyIsInRyaWdnZXIudHMiLCJ0ZW1wbGF0ZS5rby5odG1sLnRzIiwiZHhTdXJ2ZXlTZXJ2aWNlLnRzIiwic3VydmV5LnRzIiwiZHJhZ0Ryb3BIZWxwZXIudHMiLCJwYWdlLnRzIiwicXVlc3Rpb25fYmFzZXNlbGVjdC50cyIsInF1ZXN0aW9uX2NoZWNrYm94LnRzIiwicXVlc3Rpb25fY29tbWVudC50cyIsInF1ZXN0aW9uX2Ryb3Bkb3duLnRzIiwicXVlc3Rpb25fbWF0cml4LnRzIiwicXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwicXVlc3Rpb25fcmFkaW9ncm91cC50cyIsInF1ZXN0aW9uX3JhdGluZy50cyIsInF1ZXN0aW9uX3RleHQudHMiLCJzdXJ2ZXlXaW5kb3cudHMiLCJ0ZW1wbGF0ZS53aW5kb3cua28uaHRtbC50cyJdLCJuYW1lcyI6WyJTdXJ2ZXkiLCJTdXJ2ZXkuSXRlbVZhbHVlIiwiU3VydmV5Lkl0ZW1WYWx1ZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5JdGVtVmFsdWUuc2V0RGF0YSIsIlN1cnZleS5JdGVtVmFsdWUuZ2V0RGF0YSIsIlN1cnZleS5JdGVtVmFsdWUuZ2V0VHlwZSIsIlN1cnZleS5JdGVtVmFsdWUudmFsdWUiLCJTdXJ2ZXkuSXRlbVZhbHVlLmhhc1RleHQiLCJTdXJ2ZXkuSXRlbVZhbHVlLnRleHQiLCJTdXJ2ZXkuQmFzZSIsIlN1cnZleS5CYXNlLmNvbnN0cnVjdG9yIiwiU3VydmV5LkJhc2UuZ2V0VHlwZSIsIlN1cnZleS5TdXJ2ZXlFcnJvciIsIlN1cnZleS5TdXJ2ZXlFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlFcnJvci5nZXRUZXh0IiwiU3VydmV5LkV2ZW50IiwiU3VydmV5LkV2ZW50LmNvbnN0cnVjdG9yIiwiU3VydmV5LkV2ZW50LmlzRW1wdHkiLCJTdXJ2ZXkuRXZlbnQuZmlyZSIsIlN1cnZleS5FdmVudC5hZGQiLCJTdXJ2ZXkuRXZlbnQucmVtb3ZlIiwiU3VydmV5LlF1ZXN0aW9uRmFjdG9yeSIsIlN1cnZleS5RdWVzdGlvbkZhY3RvcnkuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5LnJlZ2lzdGVyUXVlc3Rpb24iLCJTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5LmdldEFsbFR5cGVzIiwiU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5jcmVhdGVRdWVzdGlvbiIsIlN1cnZleS5BbnN3ZXJSZXF1aXJlZEVycm9yIiwiU3VydmV5LkFuc3dlclJlcXVpcmVkRXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuQW5zd2VyUmVxdWlyZWRFcnJvci5nZXRUZXh0IiwiU3VydmV5LlJlcXVyZU51bWVyaWNFcnJvciIsIlN1cnZleS5SZXF1cmVOdW1lcmljRXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUmVxdXJlTnVtZXJpY0Vycm9yLmdldFRleHQiLCJTdXJ2ZXkuQ3VzdG9tRXJyb3IiLCJTdXJ2ZXkuQ3VzdG9tRXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuQ3VzdG9tRXJyb3IuZ2V0VGV4dCIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS50eXBlIiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlIiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuZ2V0VmFsdWUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5Lmhhc1RvVXNlU2V0VmFsdWUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LnNldFZhbHVlIiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5nZXRPYmpUeXBlIiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5nZXRDbGFzc05hbWUiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3MiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3MuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3MuZmluZCIsIlN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcy5nZXRQcm9wZXJ0eU5hbWUiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uTWV0YWRhdGEuYWRkQ2xhc3MiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLnNldFByb3BlcnR5VmFsdWVzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5nZXRQcm9wZXJ0aWVzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5jcmVhdGVDbGFzcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5nZXRSZXF1aXJlZFByb3BlcnRpZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmZpbGxDaGlsZHJlbkNsYXNzZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmZpbmRDbGFzcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZmluZFByb3BlcnR5IiwiU3VydmV5Lkpzb25NZXRhZGF0YS5maWxsUHJvcGVydGllcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuYWRkUHJvcGVydHkiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMiLCJTdXJ2ZXkuSnNvbkVycm9yIiwiU3VydmV5Lkpzb25FcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uRXJyb3IuZ2V0RnVsbERlc2NyaXB0aW9uIiwiU3VydmV5Lkpzb25Vbmtub3duUHJvcGVydHlFcnJvciIsIlN1cnZleS5Kc29uVW5rbm93blByb3BlcnR5RXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIiwiU3VydmV5Lkpzb25NaXNzaW5nVHlwZUVycm9yQmFzZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uTWlzc2luZ1R5cGVFcnJvciIsIlN1cnZleS5Kc29uTWlzc2luZ1R5cGVFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uSW5jb3JyZWN0VHlwZUVycm9yIiwiU3VydmV5Lkpzb25JbmNvcnJlY3RUeXBlRXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvciIsIlN1cnZleS5Kc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25PYmplY3QiLCJTdXJ2ZXkuSnNvbk9iamVjdC5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhIiwiU3VydmV5Lkpzb25PYmplY3QudG9Kc29uT2JqZWN0IiwiU3VydmV5Lkpzb25PYmplY3QudG9PYmplY3QiLCJTdXJ2ZXkuSnNvbk9iamVjdC50b0pzb25PYmplY3RDb3JlIiwiU3VydmV5Lkpzb25PYmplY3QudmFsdWVUb0pzb24iLCJTdXJ2ZXkuSnNvbk9iamVjdC52YWx1ZVRvT2JqIiwiU3VydmV5Lkpzb25PYmplY3QuaXNWYWx1ZUFycmF5IiwiU3VydmV5Lkpzb25PYmplY3QuY3JlYXRlTmV3T2JqIiwiU3VydmV5Lkpzb25PYmplY3QuY2hlY2tOZXdPYmplY3RPbkVycm9ycyIsIlN1cnZleS5Kc29uT2JqZWN0LmFkZE5ld0Vycm9yIiwiU3VydmV5Lkpzb25PYmplY3QudmFsdWVUb0FycmF5IiwiU3VydmV5Lkpzb25PYmplY3QuZmluZFByb3BlcnR5IiwiU3VydmV5LlZhbGlkYXRvclJlc3VsdCIsIlN1cnZleS5WYWxpZGF0b3JSZXN1bHQuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5VmFsaWRhdG9yIiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlWYWxpZGF0b3IuZ2V0RXJyb3JUZXh0IiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci5nZXREZWZhdWx0RXJyb3JUZXh0IiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5WYWxpZGF0b3JSdW5uZXIiLCJTdXJ2ZXkuVmFsaWRhdG9yUnVubmVyLmNvbnN0cnVjdG9yIiwiU3VydmV5LlZhbGlkYXRvclJ1bm5lci5ydW4iLCJTdXJ2ZXkuTnVtZXJpY1ZhbGlkYXRvciIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lk51bWVyaWNWYWxpZGF0b3IuZ2V0VHlwZSIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLnZhbGlkYXRlIiwiU3VydmV5Lk51bWVyaWNWYWxpZGF0b3IuZ2V0RGVmYXVsdEVycm9yVGV4dCIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLmlzTnVtYmVyIiwiU3VydmV5LlRleHRWYWxpZGF0b3IiLCJTdXJ2ZXkuVGV4dFZhbGlkYXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5UZXh0VmFsaWRhdG9yLmdldFR5cGUiLCJTdXJ2ZXkuVGV4dFZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5UZXh0VmFsaWRhdG9yLmdldERlZmF1bHRFcnJvclRleHQiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IuZ2V0VHlwZSIsIlN1cnZleS5BbnN3ZXJDb3VudFZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5BbnN3ZXJDb3VudFZhbGlkYXRvci5nZXREZWZhdWx0RXJyb3JUZXh0IiwiU3VydmV5LlF1ZXN0aW9uIiwiU3VydmV5LlF1ZXN0aW9uLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uLmNyZWF0ZWtvVmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24uc2V0a29WYWx1ZSIsIlN1cnZleS5RdWVzdGlvbi50aXRsZSIsIlN1cnZleS5RdWVzdGlvbi5zdXBwb3J0Q29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5zdXBwb3J0T3RoZXIiLCJTdXJ2ZXkuUXVlc3Rpb24uaXNSZXF1aXJlZCIsIlN1cnZleS5RdWVzdGlvbi52aXNpYmxlIiwiU3VydmV5LlF1ZXN0aW9uLnZpc2libGVJbmRleCIsIlN1cnZleS5RdWVzdGlvbi5oYXNDb21tZW50IiwiU3VydmV5LlF1ZXN0aW9uLmhhc090aGVyIiwiU3VydmV5LlF1ZXN0aW9uLnNldERhdGEiLCJTdXJ2ZXkuUXVlc3Rpb24udmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24uY29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5pc0VtcHR5IiwiU3VydmV5LlF1ZXN0aW9uLmhhc0Vycm9ycyIsIlN1cnZleS5RdWVzdGlvbi5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkIiwiU3VydmV5LlF1ZXN0aW9uLmNoZWNrRm9yRXJyb3JzIiwiU3VydmV5LlF1ZXN0aW9uLm9uQ2hlY2tGb3JFcnJvcnMiLCJTdXJ2ZXkuUXVlc3Rpb24ucnVuVmFsaWRhdG9ycyIsIlN1cnZleS5RdWVzdGlvbi5zZXROZXdWYWx1ZSIsIlN1cnZleS5RdWVzdGlvbi5vblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5RdWVzdGlvbi5zZXROZXdDb21tZW50IiwiU3VydmV5LlF1ZXN0aW9uLmRyYWdEcm9wSGVscGVyIiwiU3VydmV5LlF1ZXN0aW9uLnN0YXJ0RHJhZ2dpbmciLCJTdXJ2ZXkuUXVlc3Rpb24uZG9EcmFnT3ZlciIsIlN1cnZleS5RdWVzdGlvbi5kb0RyYWdEcm9wIiwiU3VydmV5LlF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkIiwiU3VydmV5LlF1ZXN0aW9uLnNldFZpc2libGVJbmRleCIsIlN1cnZleS5RdWVzdGlvbi5nZXRWYWxpZGF0b3JUaXRsZSIsIlN1cnZleS5UcmlnZ2VyIiwiU3VydmV5LlRyaWdnZXIuY29uc3RydWN0b3IiLCJTdXJ2ZXkuVHJpZ2dlci5vcGVyYXRvcnMiLCJTdXJ2ZXkuVHJpZ2dlci5vcGVyYXRvciIsIlN1cnZleS5UcmlnZ2VyLmNoZWNrIiwiU3VydmV5LlRyaWdnZXIub25TdWNjZXNzIiwiU3VydmV5LlRyaWdnZXIub25GYWlsdXJlIiwiU3VydmV5LlN1cnZleVRyaWdnZXIiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyLnNldE93bmVyIiwiU3VydmV5LlN1cnZleVRyaWdnZXIub25TdWNjZXNzIiwiU3VydmV5LlN1cnZleVRyaWdnZXIub25GYWlsdXJlIiwiU3VydmV5LlN1cnZleVRyaWdnZXIub25UcmlnZ2VyIiwiU3VydmV5LlN1cnZleVRyaWdnZXIub25JdGVtU3VjY2VzcyIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyLm9uSXRlbUZhaWx1cmUiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUuZ2V0VHlwZSIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZS5vbkl0ZW1TdWNjZXNzIiwiU3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlLm9uSXRlbUZhaWx1cmUiLCJ0ZW1wbGF0ZSIsInRlbXBsYXRlLmtvIiwiU3VydmV5LmR4U3VydmV5U2VydmljZSIsIlN1cnZleS5keFN1cnZleVNlcnZpY2UuY29uc3RydWN0b3IiLCJTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlLmxvYWRTdXJ2ZXkiLCJTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlLnNlbmRSZXN1bHQiLCJTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlLmdldFJlc3VsdCIsIlN1cnZleS5keFN1cnZleVNlcnZpY2UuaXNDb21wbGV0ZWQiLCJTdXJ2ZXkuU3VydmV5IiwiU3VydmV5LlN1cnZleS5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXkuZ2V0VHlwZSIsIlN1cnZleS5TdXJ2ZXkuZGF0YSIsIlN1cnZleS5TdXJ2ZXkuY29tbWVudHMiLCJTdXJ2ZXkuU3VydmV5LnZpc2libGVQYWdlcyIsIlN1cnZleS5TdXJ2ZXkuaXNFbXB0eSIsIlN1cnZleS5TdXJ2ZXkuUGFnZUNvdW50IiwiU3VydmV5LlN1cnZleS52aXNpYmxlUGFnZUNvdW50IiwiU3VydmV5LlN1cnZleS5jdXJyZW50UGFnZSIsIlN1cnZleS5TdXJ2ZXkuaXNEZXNpZ25Nb2RlIiwiU3VydmV5LlN1cnZleS5zZWxlY3RlZFF1ZXN0aW9uIiwiU3VydmV5LlN1cnZleS51cGRhdGVLb0N1cnJlbnRQYWdlIiwiU3VydmV5LlN1cnZleS5uZXh0UGFnZSIsIlN1cnZleS5TdXJ2ZXkuaXNDdXJyZW50UGFnZUhhc0Vycm9ycyIsIlN1cnZleS5TdXJ2ZXkucHJldlBhZ2UiLCJTdXJ2ZXkuU3VydmV5LmNvbXBsZXRlTGFzdFBhZ2UiLCJTdXJ2ZXkuU3VydmV5LmlzRmlyc3RQYWdlIiwiU3VydmV5LlN1cnZleS5pc0xhc3RQYWdlIiwiU3VydmV5LlN1cnZleS5nZXRQYWdlIiwiU3VydmV5LlN1cnZleS5hZGRQYWdlIiwiU3VydmV5LlN1cnZleS5hZGROZXdQYWdlIiwiU3VydmV5LlN1cnZleS5yZW1vdmVQYWdlIiwiU3VydmV5LlN1cnZleS5nZXRRdWVzdGlvbkJ5TmFtZSIsIlN1cnZleS5TdXJ2ZXkuZ2V0UXVlc3Rpb25zQnlOYW1lcyIsIlN1cnZleS5TdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24iLCJTdXJ2ZXkuU3VydmV5LmdldFBhZ2VCeU5hbWUiLCJTdXJ2ZXkuU3VydmV5LmdldFBhZ2VzQnlOYW1lcyIsIlN1cnZleS5TdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zIiwiU3VydmV5LlN1cnZleS5ub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkIiwiU3VydmV5LlN1cnZleS5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5TdXJ2ZXkuY2hlY2tUcmlnZ2VycyIsIlN1cnZleS5TdXJ2ZXkucmVuZGVyIiwiU3VydmV5LlN1cnZleS5zZW5kUmVzdWx0IiwiU3VydmV5LlN1cnZleS5nZXRSZXN1bHQiLCJTdXJ2ZXkuU3VydmV5LmxvYWRTdXJ2ZXlGcm9tU2VydmljZSIsIlN1cnZleS5TdXJ2ZXkub25CZWZvcmVSZW5kZXIiLCJTdXJ2ZXkuU3VydmV5LmFwcGx5QmluZGluZyIsIlN1cnZleS5TdXJ2ZXkudXBkYXRlVmlzaWJsZUluZGV4ZXMiLCJTdXJ2ZXkuU3VydmV5LnVwZGF0ZVBhZ2VWaXNpYmxlSW5kZXhlcyIsIlN1cnZleS5TdXJ2ZXkudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyIsIlN1cnZleS5TdXJ2ZXkuc2V0SnNvbk9iamVjdCIsIlN1cnZleS5TdXJ2ZXkuZ2V0VmFsdWUiLCJTdXJ2ZXkuU3VydmV5LnNldFZhbHVlIiwiU3VydmV5LlN1cnZleS5nZXRDb21tZW50IiwiU3VydmV5LlN1cnZleS5zZXRDb21tZW50IiwiU3VydmV5LlN1cnZleS5xdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkIiwiU3VydmV5LlN1cnZleS5xdWVzdGlvbkFkZGVkIiwiU3VydmV5LlN1cnZleS5xdWVzdGlvblJlbW92ZWQiLCJTdXJ2ZXkuU3VydmV5LnZhbGlkYXRlUXVlc3Rpb24iLCJTdXJ2ZXkuU3VydmV5LmdldE9iamVjdHMiLCJTdXJ2ZXkuRHJhZ0Ryb3BIZWxwZXIiLCJTdXJ2ZXkuRHJhZ0Ryb3BIZWxwZXIuY29uc3RydWN0b3IiLCJTdXJ2ZXkuRHJhZ0Ryb3BIZWxwZXIuc3VydmV5IiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ05ld1F1ZXN0aW9uIiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ1F1ZXN0aW9uIiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLmRvRHJhZ0Ryb3BPdmVyIiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLmRvRHJvcCIsIlN1cnZleS5EcmFnRHJvcEhlbHBlci5nZXRRdWVzdGlvbkluZGV4IiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLmlzU2FtZVBsYWNlIiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLm1vdmVRdWVzdGlvblRvIiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLmdldERhdGFJbmZvIiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLmdldFkiLCJTdXJ2ZXkuRHJhZ0Ryb3BIZWxwZXIuaXNTdXJ2ZXlEcmFnZ2luZyIsIlN1cnZleS5EcmFnRHJvcEhlbHBlci5zZXREYXRhIiwiU3VydmV5LkRyYWdEcm9wSGVscGVyLmdldERhdGEiLCJTdXJ2ZXkuRHJhZ0Ryb3BIZWxwZXIuY2xlYXJEYXRhIiwiU3VydmV5LlBhZ2UiLCJTdXJ2ZXkuUGFnZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5QYWdlLm51bSIsIlN1cnZleS5QYWdlLmdldFR5cGUiLCJTdXJ2ZXkuUGFnZS5pc1Zpc2libGUiLCJTdXJ2ZXkuUGFnZS5hZGRRdWVzdGlvbiIsIlN1cnZleS5QYWdlLmFkZE5ld1F1ZXN0aW9uIiwiU3VydmV5LlBhZ2UucmVtb3ZlUXVlc3Rpb24iLCJTdXJ2ZXkuUGFnZS5oYXNFcnJvcnMiLCJTdXJ2ZXkuUGFnZS5hZGRRdWVzdGlvbnNUb0xpc3QiLCJTdXJ2ZXkuUGFnZS5kb0Ryb3AiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlIiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2UuaXNPdGhlclNlbGVjdGVkIiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5jaG9pY2VzIiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5jaG9pY2VzT3JkZXIiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLm90aGVyVGV4dCIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2UudmlzaWJsZUNob2ljZXMiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLnN1cHBvcnRDb21tZW50IiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5zdXBwb3J0T3RoZXIiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLm9uQ2hlY2tGb3JFcnJvcnMiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLnNvcnRWaXNpYmxlQ2hvaWNlcyIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uuc29ydEFycmF5IiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5yYW5kb21pemVBcnJheSIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94QmFzZSIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94QmFzZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94QmFzZS5jb2xDb3VudCIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94QmFzZS5rb0FmdGVyUmVuZGVyIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3giLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveC5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94LmNyZWF0ZWtvVmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveC5zZXRrb1ZhbHVlIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3guaXNPdGhlclNlbGVjdGVkIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3guZ2V0VHlwZSIsIlN1cnZleS5RdWVzdGlvbkNvbW1lbnQiLCJTdXJ2ZXkuUXVlc3Rpb25Db21tZW50LmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uQ29tbWVudC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uQ29tbWVudC5pc0VtcHR5IiwiU3VydmV5LlF1ZXN0aW9uRHJvcGRvd24iLCJTdXJ2ZXkuUXVlc3Rpb25Ecm9wZG93bi5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbkRyb3Bkb3duLmdldFR5cGUiLCJTdXJ2ZXkuTWF0cml4Um93IiwiU3VydmV5Lk1hdHJpeFJvdy5jb25zdHJ1Y3RvciIsIlN1cnZleS5NYXRyaXhSb3cudmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb25NYXRyaXgiLCJTdXJ2ZXkuUXVlc3Rpb25NYXRyaXguY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25NYXRyaXguZ2V0VHlwZSIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5oYXNSb3dzIiwiU3VydmV5LlF1ZXN0aW9uTWF0cml4LmNvbHVtbnMiLCJTdXJ2ZXkuUXVlc3Rpb25NYXRyaXgucm93cyIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC52aXNpYmxlUm93cyIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5vbk1hdHJpeFJvd0NoYW5nZWQiLCJTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbSIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtLmNvbnN0cnVjdG9yIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0uZ2V0VHlwZSIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtLnNldERhdGEiLCJTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbS50aXRsZSIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtLnZhbHVlIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0ub25WYWx1ZUNoYW5nZWQiLCJTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbS5nZXRWYWxpZGF0b3JUaXRsZSIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dCIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LkFkZEl0ZW0iLCJTdXJ2ZXkuUXVlc3Rpb25NdWx0aXBsZVRleHQub25WYWx1ZUNoYW5nZWQiLCJTdXJ2ZXkuUXVlc3Rpb25NdWx0aXBsZVRleHQuc2V0a29WYWx1ZSIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5vbkl0ZW1WYWx1ZUNoYW5nZWQiLCJTdXJ2ZXkuUXVlc3Rpb25NdWx0aXBsZVRleHQucnVuVmFsaWRhdG9ycyIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5nZXRNdWx0aXBsZVRleHRWYWx1ZSIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5zZXRNdWx0aXBsZVRleHRWYWx1ZSIsIlN1cnZleS5RdWVzdGlvblJhZGlvZ3JvdXAiLCJTdXJ2ZXkuUXVlc3Rpb25SYWRpb2dyb3VwLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uUmFkaW9ncm91cC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uUmF0aW5nIiwiU3VydmV5LlF1ZXN0aW9uUmF0aW5nLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uUmF0aW5nLnJhdGVWYWx1ZXMiLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcudmlzaWJsZVJhdGVWYWx1ZXMiLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcuZ2V0VHlwZSIsIlN1cnZleS5RdWVzdGlvblJhdGluZy5zdXBwb3J0Q29tbWVudCIsIlN1cnZleS5RdWVzdGlvblJhdGluZy5zdXBwb3J0T3RoZXIiLCJTdXJ2ZXkuUXVlc3Rpb25UZXh0IiwiU3VydmV5LlF1ZXN0aW9uVGV4dC5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvblRleHQuZ2V0VHlwZSIsIlN1cnZleS5RdWVzdGlvblRleHQuaXNFbXB0eSIsIlN1cnZleS5TdXJ2ZXlXaW5kb3ciLCJTdXJ2ZXkuU3VydmV5V2luZG93LmNvbnN0cnVjdG9yIiwiU3VydmV5LlN1cnZleVdpbmRvdy5nZXRUeXBlIiwiU3VydmV5LlN1cnZleVdpbmRvdy5zdXJ2ZXkiLCJTdXJ2ZXkuU3VydmV5V2luZG93LmlzU2hvd2luZyIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuaXNFeHBhbmRlZCIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cudGl0bGUiLCJTdXJ2ZXkuU3VydmV5V2luZG93LnNob3ciLCJTdXJ2ZXkuU3VydmV5V2luZG93LmhpZGUiLCJTdXJ2ZXkuU3VydmV5V2luZG93LmV4cGFuZCIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuY29sbGFwc2UiLCJTdXJ2ZXkuU3VydmV5V2luZG93LmV4cGFuZGNvbGxhcHNlIiwiU3VydmV5LlN1cnZleVdpbmRvdy5jaGFuZ2VFeHBhbmRlZCIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cub25Db21wbGV0ZSIsInRlbXBsYXRlLndpbmRvdyIsInRlbXBsYXRlLndpbmRvdy5rbyJdLCJtYXBwaW5ncyI6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Q0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxQkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7Z0JBQ2pDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkNBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDUkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDYkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLENBQUNBO1FBQ0xBLENBQUNBO1FBQ1NsQixtQ0FBZ0JBLEdBQTFCQSxVQUEyQkEsTUFBMEJBO1lBQ2pEbUIsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xC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Q0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ3hDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTt3QkFBQ0EsUUFBUUEsQ0FBQ0E7b0JBQ2xDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxFQUFFQSxFQUFFQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEpBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDckJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEVBQUVBLEVBQUVBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvREEsQ0FBQ0E7Z0JBQ0RBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1lBQ2xCQSxDQUFDQTs7O1dBQUFOO1FBQ0RBLGFBQWFBO1FBQ2JBLDJDQUFrQkEsR0FBbEJB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QSxFQUExUkQsRUFBRUEsR0FBRkEsU0FBRUEsS0FBRkEsU0FBRUEsUUFBd1JBO0lBQURBLENBQUNBLEVBQWpTN0ssTUFBTUEsR0FBTkEsZUFBTUEsS0FBTkEsZUFBTUEsUUFBMlJBO0FBQURBLENBQUNBLEVBQTFTLFFBQVEsS0FBUixRQUFRLFFBQWtTIiwiZmlsZSI6InN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBIYXNoVGFibGU8VD4ge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IFQ7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdXJ2ZXkge1xyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueTtcclxuICAgICAgICBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKTtcclxuICAgICAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKTtcclxuICAgICAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpO1xyXG4gICAgICAgIHF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogSVF1ZXN0aW9uKTtcclxuICAgICAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yO1xyXG4gICAgICAgIGlzRGVzaWduTW9kZTogYm9vbGVhbjtcclxuICAgICAgICBzZWxlY3RlZFF1ZXN0aW9uOiBRdWVzdGlvbjtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVF1ZXN0aW9uIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgICAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcik7XHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEl0ZW1WYWx1ZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTZXBhcmF0b3IgPSAnfCc7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWx1ZXM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgaXRlbXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IEl0ZW1WYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlLnZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB2YWx1ZVtcInRleHRcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlW1widmFsdWVcIl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaGFzVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgdmFsdWU6IGl0ZW0udmFsdWUsIHRleHQ6IGl0ZW0udGV4dCB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIGl0ZW1UZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgdGV4dDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIml0ZW12YWx1ZVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5pdGVtVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RyOiBzdHJpbmcgPSB0aGlzLml0ZW1WYWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzdHIuaW5kZXhPZihJdGVtVmFsdWUuU2VwYXJhdG9yKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gc3RyLnNsaWNlKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHN0ci5zbGljZShpbmRleCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVGV4dCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXRlbVRleHQgPyB0cnVlIDogZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzVGV4dCkgcmV0dXJuIHRoaXMuaXRlbVRleHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlKSByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KG5ld1RleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1UZXh0ID0gbmV3VGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2Uge1xyXG4gICAgICAgIGlzS08gPSB0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnO1xyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50PFQgZXh0ZW5kcyBGdW5jdGlvbiwgT3B0aW9ucz4gIHtcclxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrczogQXJyYXk8VD47XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5jYWxsYmFja3MgPT0gbnVsbCB8fCB0aGlzLmNhbGxiYWNrcy5sZW5ndGggPT0gMDsgfVxyXG4gICAgICAgIHB1YmxpYyBmaXJlKHNlbmRlcjogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja3MubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbFJlc3VsdCA9IHRoaXMuY2FsbGJhY2tzW2ldKHNlbmRlciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGQoZnVuYzogVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgQXJyYXk8VD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlKGZ1bmM6IFQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jYWxsYmFja3MuaW5kZXhPZihmdW5jLCAwKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25GYWN0b3J5IHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBRdWVzdGlvbkZhY3RvcnkgPSBuZXcgUXVlc3Rpb25GYWN0b3J5KCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBEZWZhdWx0Q2hvaWNlcyA9IFtcIm9uZVwiLCBcInR3b3xzZWNvbmQgdmFsdWVcIiwgeyB2YWx1ZTogMywgdGV4dDogXCJ0aGlyZCB2YWx1ZVwiIH1dO1xyXG4gICAgICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbj4gPSB7fTtcclxuXHJcbiAgICAgICAgcHVibGljIHJlZ2lzdGVyUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uQ3JlYXRvcjogKG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdID0gcXVlc3Rpb25DcmVhdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0QWxsVHlwZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uIHtcclxuICAgICAgICAgICAgdmFyIGNyZWF0b3IgPSB0aGlzLmNyZWF0b3JIYXNoW3F1ZXN0aW9uVHlwZV07XHJcbiAgICAgICAgICAgIGlmIChjcmVhdG9yID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRvcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIEFuc3dlclJlcXVpcmVkRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSAge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJZb3Ugc2hvdWxkIGFuc3dlciB0aGUgcXVlc3Rpb24uXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFJlcXVyZU51bWVyaWNFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiVGhlIHZhbHVlIHNob3VsZCBiZSBhIG51bWVyaWMuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEN1c3RvbUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgcHJpdmF0ZSB0eXBlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lUGFydDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjaG9pY2VzOiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgb25HZXRWYWx1ZTogKG9iajogYW55KSA9PiBhbnkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBvblNldFZhbHVlOiAob2JqOiBhbnksIHZhbHVlOiBhbnksIGpzb25Db252OiBKc29uT2JqZWN0KSA9PiBhbnlcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudHlwZVZhbHVlID8gdGhpcy50eXBlVmFsdWUgOiBcInN0cmluZ1wiOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50eXBlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVG9Vc2VHZXRWYWx1ZSgpIHsgcmV0dXJuIHRoaXMub25HZXRWYWx1ZTsgfSBcclxuICAgICAgICBwdWJsaWMgaXNEZWZhdWx0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuZGVmYXVsdFZhbHVlKSA/ICh0aGlzLmRlZmF1bHRWYWx1ZSA9PSB2YWx1ZSkgOiAhKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFZhbHVlKG9iajogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25HZXRWYWx1ZSkgcmV0dXJuIHRoaXMub25HZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUb1VzZVNldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vblNldFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldFZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2V0VmFsdWUob2JqLCB2YWx1ZSwganNvbkNvbnYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRPYmpUeXBlKG9ialR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2xhc3NOYW1lUGFydCkgcmV0dXJuIG9ialR5cGU7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmpUeXBlLnJlcGxhY2UodGhpcy5jbGFzc05hbWVQYXJ0LCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5jbGFzc05hbWVQYXJ0ICYmIGNsYXNzTmFtZS5pbmRleE9mKHRoaXMuY2xhc3NOYW1lUGFydCkgPCAwKSA/IGNsYXNzTmFtZSArIHRoaXMuY2xhc3NOYW1lUGFydCA6IGNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgIHN0YXRpYyByZXF1aXJlZFN5bWJvbCA9ICchJztcclxuICAgICAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgICAgICBwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+ID0gbnVsbDtcclxuICAgICAgICByZXF1aXJlZFByb3BlcnRpZXM6IEFycmF5PHN0cmluZz4gPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgcHVibGljIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydGllc05hbWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZUluZGV4ID0gcHJvcGVydHlOYW1lLmluZGV4T2YoSnNvbk1ldGFkYXRhQ2xhc3MudHlwZVN5bWJvbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKHR5cGVJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHJpbmcoMCwgdHlwZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBuZXcgSnNvbk9iamVjdFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUubGVuZ3RoID09IDAgfHwgcHJvcGVydHlOYW1lWzBdICE9IEpzb25NZXRhZGF0YUNsYXNzLnJlcXVpcmVkU3ltYm9sKSByZXR1cm4gcHJvcGVydHlOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NZXRhZGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc2VzOiBIYXNoVGFibGU8SnNvbk1ldGFkYXRhQ2xhc3M+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc1Byb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NSZXF1aXJlZFByb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxzdHJpbmc+PiA9IHt9O1xyXG4gICAgICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllc05hbWVzLCBjcmVhdG9yLCBwYXJlbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0UHJvcGVydHlWYWx1ZXMobmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHJvcGVydHlDbGFzc05hbWU6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsLCBvbkdldFZhbHVlOiAob2JqOiBhbnkpID0+IGFueSA9IG51bGwsIG9uU2V0VmFsdWU6IChvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpID0+IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkobmFtZSwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5jbGFzc05hbWUgPSBwcm9wZXJ0eUNsYXNzTmFtZTtcclxuICAgICAgICAgICAgcHJvcGVydHkuZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5vbkdldFZhbHVlID0gb25HZXRWYWx1ZTtcclxuICAgICAgICAgICAgcHJvcGVydHkub25TZXRWYWx1ZSA9IG9uU2V0VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRQcm9wZXJ0eUNob2ljZXMobmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgY2hvaWNlczogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmNob2ljZXMgPSBjaG9pY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0UHJvcGVydHlDbGFzc0luZm8obmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgYmFzZUNsYXNzTmFtZTogc3RyaW5nLCBjbGFzc05hbWVQYXJ0OiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KG5hbWUsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHJldHVybjtcclxuICAgICAgICAgICAgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSA9IGJhc2VDbGFzc05hbWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmNsYXNzTmFtZVBhcnQgPSBjbGFzc05hbWVQYXJ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjcmVhdGVDbGFzcyhuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcy5jcmVhdG9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiwgcmVzdWx0OiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4pIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbkNsYXNzZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjYW5CZUNyZWF0ZWQgfHwgY2hpbGRyZW5baV0uY3JlYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhjaGlsZHJlbltpXS5uYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaW5kQ2xhc3MobmFtZTogc3RyaW5nKTogSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2VzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MgPyBtZXRhRGF0YUNsYXNzLmZpbmQocHJvcGVydHlOYW1lKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUHJvcGVydHkobWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzW2ldLCBsaXN0LCBsaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eShwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBlbmRJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuZEluZGV4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0W2ldLm5hbWUgPT0gcHJvcGVydHkubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHByb3BlcnR5KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpbmRleF0gPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxzdHJpbmc+KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGxpc3QsIG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgYXQ6IE51bWJlciA9IC0xO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEZ1bGxEZXNjcmlwdGlvbigpIDogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZSArICh0aGlzLmRlc2NyaXB0aW9uID8gXCJcXG5cIiArIHRoaXMuZGVzY3JpcHRpb24gOiBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcInVua25vd25wcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInIGlzIHVua25vd24uXCIpO1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGxpc3Qgb2YgYXZhaWxhYmxlIHByb3BlcnRpZXMgYXJlOiBcIjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID4gMCkgdGhpcy5kZXNjcmlwdGlvbiArPSBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBwcm9wZXJ0aWVzW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9ICcuJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2UgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIodHlwZSwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBmb2xsb3dpbmcgdHlwZXMgYXJlIGF2YWlsYWJsZTogXCI7XHJcbiAgICAgICAgICAgIHZhciB0eXBlcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKGJhc2VDbGFzc05hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIidcIiArIHR5cGVzW2ldLm5hbWUgKyBcIidcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwibWlzc2luZ3R5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIG1pc3NpbmcgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uSW5jb3JyZWN0VHlwZUVycm9yIGV4dGVuZHMgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoYmFzZUNsYXNzTmFtZSwgXCJpbmNvcnJlY3R0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBpbmNvcnJlY3QgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcInJlcXVpcmVkcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGlzIHJlcXVpcmVkIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uT2JqZWN0IHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB0eXBlUHJvcGVydHlOYW1lID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcG9zaXRpb25Qcm9wZXJ0eU5hbWUgPSBcInBvc1wiO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1ldGFEYXRhVmFsdWUgPSBuZXcgSnNvbk1ldGFkYXRhKCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXQgbWV0YURhdGEoKSB7IHJldHVybiBKc29uT2JqZWN0Lm1ldGFEYXRhVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZXJyb3JzID0gbmV3IEFycmF5PEpzb25FcnJvcj4oKTtcclxuICAgICAgICBwdWJsaWMgdG9Kc29uT2JqZWN0KG9iajogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9Kc29uT2JqZWN0Q29yZShvYmosIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdG9PYmplY3QoanNvbk9iajogYW55LCBvYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAob2JqLmdldFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGpzb25PYmpba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KHByb3BlcnRpZXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihuZXcgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yKGtleS50b1N0cmluZygpLCBvYmouZ2V0VHlwZSgpKSwganNvbk9iaik7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvT2JqKGpzb25PYmpba2V5XSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdG9Kc29uT2JqZWN0Q29yZShvYmo6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghb2JqLmdldFR5cGUpIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgKCFwcm9wZXJ0eS5jbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXSA9IHByb3BlcnR5LmdldE9ialR5cGUob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9Kc29uKG9iaiwgcmVzdWx0LCBwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0pzb24ob2JqOiBhbnksIHJlc3VsdDogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHByb3BlcnR5LmdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG9ialtwcm9wZXJ0eS5uYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaXNEZWZhdWx0VmFsdWUodmFsdWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnJWYWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyclZhbHVlLnB1c2godGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlW2ldLCBwcm9wZXJ0eSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBhcnJWYWx1ZS5sZW5ndGggPiAwID8gYXJyVmFsdWUgOiBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnRvSnNvbk9iamVjdENvcmUodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BlcnR5Lm5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9PYmoodmFsdWU6IGFueSwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5Lmhhc1RvVXNlU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5LnNldFZhbHVlKG9iaiwgdmFsdWUsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb0FycmF5KHZhbHVlLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB2YXIgbmV3T2JqID0gdGhpcy5jcmVhdGVOZXdPYmoodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgaWYgKG5ld09iai5uZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWUsIG5ld09iai5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBuZXdPYmoubmV3T2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbmV3T2JqLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZUFycmF5KHZhbHVlOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkuaW5kZXhPZihcIkFycmF5XCIpID4gLTE7IH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZU5ld09iaih2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgbmV3T2JqOiBudWxsLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gdmFsdWVbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjbGFzc05hbWUgJiYgcHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5nZXRDbGFzc05hbWUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgcmVzdWx0Lm5ld09iaiA9IChjbGFzc05hbWUpID8gSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyhjbGFzc05hbWUpIDogbnVsbDtcclxuICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gdGhpcy5jaGVja05ld09iamVjdE9uRXJyb3JzKHJlc3VsdC5uZXdPYmosIHZhbHVlLCBwcm9wZXJ0eSwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja05ld09iamVjdE9uRXJyb3JzKG5ld09iajogYW55LCB2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBjbGFzc05hbWU6IHN0cmluZyk6IEpzb25FcnJvciB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChuZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlZFByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFJlcXVpcmVkUHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVxdWlyZWRQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVbcmVxdWlyZWRQcm9wZXJ0aWVzW2ldXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvcihyZXF1aXJlZFByb3BlcnRpZXNbaV0sIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbk1pc3NpbmdUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbkluY29ycmVjdFR5cGVFcnJvcihwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZE5ld0Vycm9yKGVycm9yLCB2YWx1ZSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGROZXdFcnJvcihlcnJvcjogSnNvbkVycm9yLCBqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKGpzb25PYmogJiYganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuYXQgPSBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdLnN0YXJ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZhbHVlVG9BcnJheSh2YWx1ZTogQXJyYXk8YW55Piwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ZhbHVlQXJyYXkob2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlW2ldLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaChuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWVbaV0sIG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaCh2YWx1ZVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmluZFByb3BlcnR5KHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGtleTogYW55KTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IGtleSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXJyb3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBhbnksIHB1YmxpYyBlcnJvcjogU3VydmV5RXJyb3IgPSBudWxsKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmFsaWRhdG9yIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRFcnJvclRleHQobmFtZTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHQpIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRFcnJvclRleHQobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+O1xyXG4gICAgICAgIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJ1bm5lciB7XHJcbiAgICAgICAgcHVibGljIHJ1bihvd25lcjogSVZhbGlkYXRvck93bmVyKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG93bmVyLnZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3JSZXN1bHQgPSBvd25lci52YWxpZGF0b3JzW2ldLnZhbGlkYXRlKG93bmVyLnZhbHVlLCBvd25lci5nZXRWYWxpZGF0b3JUaXRsZSgpKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQuZXJyb3IpIHJldHVybiB2YWxpZGF0b3JSZXN1bHQuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lci52YWx1ZSA9IHZhbGlkYXRvclJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBOdW1lcmljVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluVmFsdWU6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1lcmljdmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgIXRoaXMuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgUmVxdXJlTnVtZXJpY0Vycm9yKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgVmFsaWRhdG9yUmVzdWx0KHBhcnNlRmxvYXQodmFsdWUpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5taW5WYWx1ZSA+IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4VmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSA8IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSA/IG51bGwgOiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgdk5hbWUgPSBuYW1lID8gbmFtZSA6IFwidmFsdWVcIjtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiVGhlICdcIiArIHZOYW1lICsgXCInIHNob3VsZCBiZSBcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcImVxdWFsIG9yIG1vcmUgdGhhbiBcIiArIHRoaXMubWluVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiIGFuZCBcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIiBlcXVhbCBvciBsZXNzIHRoYW4gXCIgKyB0aGlzLm1heFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNOdW1iZXIodmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSkgJiYgaXNGaW5pdGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pbkxlbmd0aDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0ZXh0dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbkxlbmd0aCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgXCIgKyB0aGlzLm1pbkxlbmd0aCArIFwiIHN5bWJsb3MuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBbnN3ZXJDb3VudFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pbkNvdW50OiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4Q291bnQ6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIjsgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUuY29uc3RydWN0b3IgIT0gQXJyYXkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbkNvdW50ICYmIGNvdW50IDwgdGhpcy5taW5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KFwiUGxlYXNlIHNlbGVjdCBhdCBsZWFzdCBcIiArIHRoaXMubWluQ291bnQgKyBcIiB2YXJpYW50cy5cIikpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXhDb3VudCAmJiBjb3VudCA+IHRoaXMubWF4Q291bnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChcIlBsZWFzZSBzZWxlY3Qgbm90IG1vcmUgdGhhbiBcIiArIHRoaXMubWF4Q291bnQgKyBcIiB2YXJpYW50cy5cIikpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXZhbGlkYXRvclwiLCBbXCJ0ZXh0XCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJudW1lcmljdmFsaWRhdG9yXCIsIFtcIm1pblZhbHVlOm51bWJlclwiLCBcIm1heFZhbHVlOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE51bWVyaWNWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidGV4dHZhbGlkYXRvclwiLCBbXCJtaW5MZW5ndGg6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgVGV4dFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJhbnN3ZXJjb3VudHZhbGlkYXRvclwiLCBbXCJtaW5Db3VudDpudW1iZXJcIiwgXCJtYXhDb3VudDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBbnN3ZXJDb3VudFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuIFxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJlcnJvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ2YWxpZGF0b3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkcmFnZHJvcGhlbHBlci50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElRdWVzdGlvbiwgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICBwcm90ZWN0ZWQgZGF0YTogSVN1cnZleTtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1JlcXVpcmVkVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc0NvbW1lbnRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgaGFzT3RoZXJWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVJbmRleFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBwcml2YXRlIGRyYWdEcm9wSGVscGVyVmFsdWU6IERyYWdEcm9wSGVscGVyO1xyXG4gICAgICAgIGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+ID0gW107XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcbiAgICAgICAgcHVibGljIHdpZHRoOiBzdHJpbmcgPSBcIjEwMCVcIjtcclxuICAgICAgICBrb1ZhbHVlOiBhbnk7IGtvQ29tbWVudDogYW55OyBrb0Vycm9yczogYW55OyBrb1Zpc2libGU6IGFueTsga29ObzogYW55OyBkdW1teU9ic2VydmFibGU6IGFueTtcclxuICAgICAgICBrb09uQ2xpY2s6IGFueTsga29Jc1NlbGVjdGVkOiBhbnk7IFxyXG4gICAgICAgIGRyYWdEcm9wOiBhbnk7IGRyYWdPdmVyOiBhbnk7IGRyYWdTdGFydDogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IHRoaXMuY3JlYXRla29WYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQgPSBrby5vYnNlcnZhYmxlKHRoaXMuY29tbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvRXJyb3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KHRoaXMuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29WaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi52aXNpYmxlVmFsdWU7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb05vID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi52aXNpYmxlSW5kZXhWYWx1ZSA+IC0xID8gc2VsZi52aXNpYmxlSW5kZXhWYWx1ZSArIDEgKyBcIi4gXCIgOiBcIlwiOyB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Db21tZW50LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kb0RyYWdPdmVyKGUpOyB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kb0RyYWdEcm9wKGUpOyB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuc3RhcnREcmFnZ2luZyhlKTsgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0lzU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29PbkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmRhdGEgPT0gbnVsbCB8fCAhc2VsZi5kYXRhLmlzRGVzaWduTW9kZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGF0YS5zZWxlY3RlZFF1ZXN0aW9uID0gdGhpcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRla29WYWx1ZSgpOiBhbnkgeyByZXR1cm4ga28ub2JzZXJ2YWJsZSh0aGlzLnZhbHVlKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRrb1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpIHsgcmV0dXJuICh0aGlzLnRpdGxlVmFsdWUpID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZShuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBnZXQgaXNSZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZFZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGlzUmVxdWlyZWQodmFsOiBib29sZWFuKSB7IHRoaXMuaXNSZXF1aXJlZFZhbHVlID0gdmFsOyB9XHJcbiAgICAgICAgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgICAgIHNldCB2aXNpYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5xdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKDxJUXVlc3Rpb24+dGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnZpc2libGVJbmRleFZhbHVlOyB9XHJcbiAgICAgICAgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0NvbW1lbnRWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBoYXNDb21tZW50KHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydENvbW1lbnQoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NvbW1lbnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29tbWVudCkgdGhpcy5oYXNPdGhlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaGFzT3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc090aGVyVmFsdWU7IH1cclxuICAgICAgICBzZXQgaGFzT3RoZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0T3RoZXIoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc090aGVyVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB0aGlzLmhhc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShuZXdWYWx1ZTogSVN1cnZleSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkgcmV0dXJuIHRoaXMuZGF0YS5nZXRWYWx1ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvblZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRrb1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjb21tZW50KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRDb21tZW50KHRoaXMubmFtZSkgOiBcIlwiOyB9XHJcbiAgICAgICAgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvQ29tbWVudCh0aGlzLmNvbW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZhbHVlID09IG51bGw7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yRXJyb3JzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMua29Jc1NlbGVjdGVkKHRoaXMuZGF0YS5zZWxlY3RlZFF1ZXN0aW9uID09IHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrRm9yRXJyb3JzKCkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hlY2tGb3JFcnJvcnModGhpcy5lcnJvcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMucnVuVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAmJiB0aGlzLmVycm9ycy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5kYXRhLnZhbGlkYXRlUXVlc3Rpb24odGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgdGhpcy5rb0Vycm9ycyh0aGlzLmVycm9ycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQW5zd2VyUmVxdWlyZWRFcnJvcigpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJ1bm5lcigpLnJ1bih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBzZXROZXdWYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0VmFsdWUodGhpcy5uYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge31cclxuICAgICAgICBwcml2YXRlIHNldE5ld0NvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRDb21tZW50KHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0IGRyYWdEcm9wSGVscGVyKCk6IERyYWdEcm9wSGVscGVyIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ0Ryb3BIZWxwZXJWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBuZXcgRHJhZ0Ryb3BIZWxwZXIodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHN0YXJ0RHJhZ2dpbmcoZSkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ1F1ZXN0aW9uKGUsIHRoaXMubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZG9EcmFnT3ZlcihlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Ryb3BIZWxwZXIuZG9EcmFnRHJvcE92ZXIoZSwgdGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZG9EcmFnRHJvcChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Ryb3BIZWxwZXIuZG9Ecm9wKGUsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lRdWVzdGlvblxyXG4gICAgICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSh0aGlzLmR1bW15T2JzZXJ2YWJsZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JVmFsaWRhdG9yT3duZXJcclxuICAgICAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gbnVsbDsgfVxyXG4gICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicXVlc3Rpb25cIiwgW1wiIW5hbWVcIiwgXCJ0aXRsZVwiLCBcImlzUmVxdWlyZWQ6Ym9vbGVhblwiLCBcInZpc2libGU6Ym9vbGVhblwiLCBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiLCBcIndpZHRoXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJxdWVzdGlvblwiLCBcInZpc2libGVcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicXVlc3Rpb25cIiwgXCJ0aXRsZVwiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInF1ZXN0aW9uXCIsIFwid2lkdGhcIiwgbnVsbCwgXCIxMDAlXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcInF1ZXN0aW9uXCIsIFwidmFsaWRhdG9yc1wiLCBcInN1cnZleXZhbGlkYXRvclwiLCBcInZhbGlkYXRvclwiKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUcmlnZ2VyIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgc3RhdGljIG9wZXJhdG9yc1ZhbHVlOiBIYXNoVGFibGU8RnVuY3Rpb24+ID0gbnVsbDtcclxuICAgICAgICBzdGF0aWMgZ2V0IG9wZXJhdG9ycygpIHtcclxuICAgICAgICAgICAgaWYgKFRyaWdnZXIub3BlcmF0b3JzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIFRyaWdnZXIub3BlcmF0b3JzVmFsdWU7XHJcbiAgICAgICAgICAgIFRyaWdnZXIub3BlcmF0b3JzVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiAhdmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBub3RlbXB0eTogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiAhKCF2YWx1ZSk7IH0sXHJcbiAgICAgICAgICAgICAgICBlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA9PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgIT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPiBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPD0gZXhwZWN0ZWRWYWx1ZTsgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFUcmlnZ2VyLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGVjayh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25GYWlsdXJlKCkgeyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyIGV4dGVuZHMgVHJpZ2dlciB7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgcGFnZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgcHVibGljIHF1ZXN0aW9uczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldE93bmVyKG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1TdWNjZXNzKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgICAgICBvblRyaWdnZXIoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvYmplY3RzID0gdGhpcy5vd25lci5nZXRPYmplY3RzKHRoaXMucGFnZXMsIHRoaXMucXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jKG9iamVjdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbUZhaWx1cmUoaXRlbTogYW55KSB7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlclZpc2libGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidmlzaWJsZXRyaWdnZXJcIjsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyBpdGVtLnZpc2libGUgPSB0cnVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbUZhaWx1cmUoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRyaWdnZXJcIiwgW1wib3BlcmF0b3JcIiwgXCIhdmFsdWVcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIiwgXCJwYWdlc1wiLCBcInF1ZXN0aW9uc1wiXSwgbnVsbCwgXCJ0cmlnZ2VyXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInZpc2libGV0cmlnZ2VyXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlclZpc2libGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG59IiwibW9kdWxlIHRlbXBsYXRlLmtvIHsgZXhwb3J0IHZhciBodG1sID0gJzxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LWNvbW1lbnRcIj4gIDxpbnB1dCBkYXRhLWJpbmQ9XCJ2YWx1ZTokZGF0YS5xdWVzdGlvbi5rb0NvbW1lbnQsIHZpc2libGU6JGRhdGEudmlzaWJsZVwiIC8+PC9zY3JpcHQ+PGRpdiBjbGFzcz1cInN2X21haW5cIj4gICAgPGgyIGRhdGEtYmluZD1cInZpc2libGU6ICh0aXRsZS5sZW5ndGggPiAwKSAmJiBzaG93VGl0bGUsIHRleHQ6IHRpdGxlXCI+PC9oMj4gICAgPCEtLSBrbyBpZjoga29DdXJyZW50UGFnZSgpIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1wYWdlXFwnLCBkYXRhOiBrb0N1cnJlbnRQYWdlIH1cIj48L2Rpdj4gICAgPHAgLz4gICAgPGRpdiBjbGFzcz1cInN2X25hdlwiIGRhdGEtYmluZD1cInZpc2libGU6IHNob3dOYXZpZ2F0aW9uQnV0dG9ucyAmJiAhaXNEZXNpZ25Nb2RlXCI+ICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cInZhbHVlOiBwYWdlUHJldlRleHQsIGNsaWNrOiBwcmV2UGFnZSwgdmlzaWJsZTogIWtvSXNGaXJzdFBhZ2UoKVwiIC8+ICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiTmV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBwYWdlTmV4dFRleHQsIGNsaWNrOiBuZXh0UGFnZSwgdmlzaWJsZTogIWtvSXNMYXN0UGFnZSgpXCIgLz4gIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJTdWJtaXRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogY29tcGxldGVUZXh0LCBjbGljazogY29tcGxldGVMYXN0UGFnZSwgdmlzaWJsZToga29Jc0xhc3RQYWdlKClcIiAvPiAgICA8L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDwhLS0ga28gaWY6IGtvQ3VycmVudFBhZ2UoKSA9PSBudWxsIC0tPiAgICBUaGVyZSBpcyBubyBhbnkgdmlzaWJsZSBwYWdlIG9yIHZpc2libGUgcXVlc3Rpb24gaW4gdGhlIHN1cnZleS4gICAgPCEtLSAva28gLS0+PC9kaXY+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcGFnZVwiPiAgICA8ZGl2IGRhdGEtYmluZD1cImV2ZW50OnsgICAgICAgICAgIGRyYWdlbnRlcjpmdW5jdGlvbihlbCwgZSl7IGRyYWdFbnRlcihlKTt9LCAgICAgICAgICAgZHJhZ2xlYXZlOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0xlYXZlKGUpO30sICAgICAgICAgICBkcmFnb3ZlcjpmdW5jdGlvbihlbCwgZSl7IHJldHVybiBmYWxzZTt9LCAgICAgICAgICAgZHJvcDpmdW5jdGlvbihlbCwgZSl7IGRyYWdEcm9wKGUpO319ICAgICBcIj4gICAgICAgIDxoMyBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAodGl0bGUubGVuZ3RoID4gMCkgJiYgZGF0YS5zaG93UGFnZVRpdGxlcywgdGV4dDoga29ObygpICsgdGl0bGVcIj48L2gzPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnIH0gLS0+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN2X2RyYWdvdmVyXCIgZGF0YS1iaW5kPVwidmlzaWJsZTokcGFyZW50LmtvRHJhZ2dpbmcoKSA9PSAkaW5kZXgoKVwiPjwvZGl2PiAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6JHJvb3QuaXNEZXNpZ25Nb2RlICYmIHF1ZXN0aW9ucy5sZW5ndGggPT0gMFwiIGNsYXNzPVwic3ZfcGFnZV9lbXB0eVwiPiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3ZfcGFnZV9lbXB0eV9jb250ZW50XCI+UGxlYXNlIGRyb3AgYSBxdWVzdGlvbiBoZXJlLjwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cInN2X2RyYWdvdmVyXCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb0RyYWdnaW5nKCkgPT0gcXVlc3Rpb25zLmxlbmd0aFwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1jaGVja2JveFwiPiAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb24udmlzaWJsZUNob2ljZXMsIGFzOiBcXCdpdGVtXFwnLCBhZnRlclJlbmRlcjogcXVlc3Rpb24ua29BZnRlclJlbmRlcn0gIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cImNzczogcXVlc3Rpb24ua29DbGFzc1wiPiAgICAgICAgPGRpdiBjbGFzcz1cInN2X3FfY2hlY2tib3hcIj4gICAgICAgICAgICA8bGFiZWw+ICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAgICAgICAgICAgICAgICAgICAgICAgZGF0YS1iaW5kPVwidmFsdWU6IGl0ZW0udmFsdWUsIGNoZWNrZWQ6IHF1ZXN0aW9uLmtvVmFsdWVcIiAvPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRleHRcIj48L3NwYW4+ICAgICAgICAgICAgPC9sYWJlbD4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cImlmOiRpbmRleCgpID09IChxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMSksIHZpc2libGU6IHF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PiAgICA8IS0tIC9rbyAtLT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1jb21tZW50XCI+ICAgIDx0ZXh0YXJlYSB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cImF0dHI6IHtjb2xzOiBxdWVzdGlvbi5jb2xzLCByb3dzOiBxdWVzdGlvbi5yb3dzfSwgdmFsdWU6cXVlc3Rpb24ua29WYWx1ZVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tZHJvcGRvd25cIj4gICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIG9wdGlvbnNWYWx1ZTogXFwndmFsdWVcXCcsIHZhbHVlOiBxdWVzdGlvbi5rb1ZhbHVlLCBvcHRpb25zQ2FwdGlvbjogXFwnQ2hvb3NlLi4uXFwnXCI+PC9zZWxlY3Q+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tYXRyaXhcIj4gICAgPHRhYmxlIGNsYXNzPVwic3ZfcV9tYXRyaXhcIj4gICAgICAgIDx0aGVhZD4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNSb3dzXCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDokZGF0YS50ZXh0XCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGhlYWQ+ICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVSb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzUm93cywgdGV4dDpyb3cudGV4dFwiPjwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiByb3cuZnVsbE5hbWUsIHZhbHVlOiAkZGF0YS52YWx1ZX0sIGNoZWNrZWQ6IHJvdy5rb1ZhbHVlXCIvPiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tdWx0aXBsZXRleHRcIj4gICAgPHRhYmxlIGRhdGEtYmluZD1cImZvcmVhY2g6IHsgZGF0YTogIHF1ZXN0aW9uLml0ZW1zLCBhczogXFwnaXRlbVxcJyB9XCI+ICAgICAgICA8dHI+ICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGl0bGVcIj48L3RkPiAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7c2l6ZTogcXVlc3Rpb24uaXRlbVNpemV9LCB2YWx1ZTogaXRlbS5rb1ZhbHVlXCIgLz48L3RkPiAgICAgICAgPC90cj4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYWRpb2dyb3VwXCI+ICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgYXM6IFxcJ2l0ZW1cXCcsIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb0FmdGVyUmVuZGVyfSAgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOiBxdWVzdGlvbi5rb0NsYXNzXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwic3ZfcV9yYWRpb2dyb3VwXCI+ICAgICAgICAgICAgPGxhYmVsPiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgICAgICAgICAgICAgICAgICAgICAgIGRhdGEtYmluZD1cIm5hbWU6IHF1ZXN0aW9uLm5hbWUsIGF0dHI6IHt2YWx1ZTogaXRlbS52YWx1ZX0sIGNoZWNrZWQ6IHF1ZXN0aW9uLmtvVmFsdWVcIiAvPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRleHRcIj48L3NwYW4+ICAgICAgICAgICAgPC9sYWJlbD4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cImlmOiRpbmRleCgpID09IChxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcy5sZW5ndGgtMSksIHZpc2libGU6IHF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgICA8L2Rpdj4gICAgPCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tcmF0aW5nXCI+ICAgIDx0YWJsZSBjbGFzcz1cInN2X3FfcmF0aW5nXCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5rb1Zpc2libGVSYXRlVmFsdWVzIC0tPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDokZGF0YS50ZXh0XCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3RoZWFkPiAgICAgICAgPHRib2R5PiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6cXVlc3Rpb24ubWluaW51bVJhdGVEZXNjcmlwdGlvblwiPjwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24ua29WaXNpYmxlUmF0ZVZhbHVlcyAtLT4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiBxdWVzdGlvbi5uYW1lLCB2YWx1ZTogJGRhdGEudmFsdWV9LCBjaGVja2VkOiBxdWVzdGlvbi5rb1ZhbHVlXCIgLz4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OnF1ZXN0aW9uLm1heGltdW1SYXRlRGVzY3JpcHRpb25cIj48L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3Rib2R5PiAgICA8L3RhYmxlPiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi10ZXh0XCI+ICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cImF0dHI6IHtzaXplOiBxdWVzdGlvbi5zaXplfSwgdmFsdWU6cXVlc3Rpb24ua29WYWx1ZVwiLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvblwiPiAgICA8ZGl2IGNsYXNzPVwic3ZfcVwiIGRhdGEtYmluZD1cImF0dHIgOiB7ZHJhZ2dhYmxlOiAkcm9vdC5pc0Rlc2lnbk1vZGV9LCB2aXNpYmxlOiBxdWVzdGlvbi5rb1Zpc2libGUoKSB8fCAkcm9vdC5pc0Rlc2lnbk1vZGUsIGNsaWNrOiAkcm9vdC5pc0Rlc2lnbk1vZGUgPyBrb09uQ2xpY2s6IG51bGwsIGNzczoge3N2X3Ffc2VsZWN0ZWQgOiBrb0lzU2VsZWN0ZWR9LCAgICAgICAgIGV2ZW50OnsgICAgICAgICAgIGRyYWdzdGFydDpmdW5jdGlvbihlbCwgZSl7IGRyYWdTdGFydChlKTsgcmV0dXJuIHRydWU7IH0sICAgICAgICAgICBkcmFnb3ZlcjpmdW5jdGlvbihlbCwgZSl7IGRyYWdPdmVyKGUpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fSAgICAgICAgIH1cIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOntzdl9xX2Rlc2lnbjogJHJvb3QuaXNEZXNpZ25Nb2RlfVwiPiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJjb2xvcjpyZWRcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBrb0Vycm9yc1wiPiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRleHQ6JGRhdGEuZ2V0VGV4dCgpXCI+PC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGg0IGNsYXNzPVwic3ZfcV9oXCIgZGF0YS1iaW5kPVwidGV4dDogcXVlc3Rpb24ua29ObygpICsgIChxdWVzdGlvbi5pc1JlcXVpcmVkID8gcXVlc3Rpb24uZGF0YS5yZXF1aXJlZFRleHQgOiBcXCdcXCcpICsgcXVlc3Rpb24udGl0bGVcIj48L2g0PiAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArIHF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogcXVlc3Rpb24gfSAtLT4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc0NvbW1lbnRcIj4gICAgICAgICAgICAgICAgT3RoZXIgKHBsZWFzZSBkZXNjcmliZSkgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogdHJ1ZSB9IH1cIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD4nO30iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBkeFN1cnZleVNlcnZpY2Uge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwczovL2R4c3VydmV5LmF6dXJld2Vic2l0ZXMubmV0L2FwaS9TdXJ2ZXlcIjtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwOi8vbG9jYWxob3N0OjQ5ODkxL2FwaS9TdXJ2ZXlcIjtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXkoc3VydmV5SWQ6IHN0cmluZywgb25Mb2FkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFN1cnZleT9zdXJ2ZXlJZD0nICsgc3VydmV5SWQpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIG9uTG9hZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZywgcmVzdWx0OiBKU09OLCBvblNlbmRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KT0+IHZvaWQsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL3Bvc3QvJyk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHsgcG9zdElkOiBwb3N0SWQsIHN1cnZleVJlc3VsdDogSlNPTi5zdHJpbmdpZnkocmVzdWx0KSB9O1xyXG4gICAgICAgICAgICBpZiAoY2xpZW50SWQpIGRhdGFbJ2NsaWVudElkJ10gPSBjbGllbnRJZDtcclxuICAgICAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCkgZGF0YVsnaXNQYXJ0aWFsQ29tcGxldGVkJ10gPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgZGF0YVN0cmluZ2lmeTogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGRhdGFTdHJpbmdpZnkubGVuZ3RoLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBvblNlbmRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKGRhdGFTdHJpbmdpZnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVzdWx0KHJlc3VsdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgb25HZXRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBBcnJheTxhbnk+LCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZuYW1lPScgKyBuYW1lO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFJlc3VsdD8nICsgZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzdWx0LlF1ZXN0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHsgbmFtZToga2V5LCB2YWx1ZTogcmVzdWx0LlF1ZXN0aW9uUmVzdWx0W2tleV0gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvbkdldFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCBsaXN0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNDb21wbGV0ZWQocmVzdWx0SWQ6IHN0cmluZywgY2xpZW50SWQ6IHN0cmluZywgb25Jc0NvbXBsZXRlZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZjbGllbnRJZD0nICsgY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvaXNDb21wbGV0ZWQ/JyArIGRhdGEpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9uSXNDb21wbGV0ZWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0cmlnZ2VyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidGVtcGxhdGUua28uaHRtbC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkeFN1cnZleVNlcnZpY2UudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5IGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElTdXJ2ZXksIElTdXJ2ZXlUcmlnZ2VyT3duZXIge1xyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdE9uUGFnZU5leHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIGNvbW1lbnRQcmVmaXg6IHN0cmluZyA9IFwiLUNvbW1lbnRcIjtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dOYXZpZ2F0aW9uQnV0dG9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dUaXRsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dQYWdlVGl0bGVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgc2hvd1BhZ2VOdW1iZXJzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHNob3dRdWVzdGlvbk51bWJlcnM6IHN0cmluZyA9IFwib25cIjtcclxuICAgICAgICBwdWJsaWMgcmVxdWlyZWRUZXh0OiBzdHJpbmcgPSBcIiogXCI7XHJcbiAgICAgICAgcHVibGljIHBhZ2VQcmV2VGV4dDogc3RyaW5nID0gXCJQcmV2aW91c1wiO1xyXG4gICAgICAgIHB1YmxpYyBwYWdlTmV4dFRleHQ6IHN0cmluZyA9IFwiTmV4dFwiO1xyXG4gICAgICAgIHB1YmxpYyBjb21wbGV0ZVRleHQ6IHN0cmluZyA9IFwiQ29tcGxldGVcIjtcclxuICAgICAgICAvL3B1YmxpYyBzaG93UHJvZ3Jlc3NCYXI6IGJvb2xlYW4gPSBmYWxzZTsgVE9ET1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogQXJyYXk8UGFnZT4gPSBuZXcgQXJyYXk8UGFnZT4oKTtcclxuICAgICAgICBwdWJsaWMgdHJpZ2dlcnM6IEFycmF5PFN1cnZleVRyaWdnZXI+ID0gbmV3IEFycmF5PFN1cnZleVRyaWdnZXI+KCk7XHJcbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50UGFnZVZhbHVlOiBQYWdlID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHZhbHVlc0hhc2g6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHByaXZhdGUgc2VsZWN0ZWRRdWVzdGlvblZhbHVlOiBRdWVzdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNvbXBsZXRlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblJlbmRlcmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvbkN1cnJlbnRQYWdlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uVmFsdWVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUXVlc3Rpb25BZGRlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUXVlc3Rpb25SZW1vdmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWxpZGF0ZVF1ZXN0aW9uOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25TZW5kUmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25HZXRSZXN1bHQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMganNvbkVycm9yczogQXJyYXk8SnNvbkVycm9yPiA9IG51bGw7XHJcblxyXG4gICAgICAgIHB1YmxpYyBtb2RlOiBzdHJpbmcgPSBcIm5vcm1hbFwiO1xyXG5cclxuICAgICAgICBrb0N1cnJlbnRQYWdlOiBhbnk7IGtvSXNGaXJzdFBhZ2U6IGFueTsga29Jc0xhc3RQYWdlOiBhbnk7IGR1bW15T2JzZXJ2YWJsZTogYW55OyBcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCwgcmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5wYWdlcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5kYXRhID0gc2VsZjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2Vycy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5zZXRPd25lcihzZWxmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGtvKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvQ3VycmVudFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmN1cnJlbnRQYWdlOyB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Jc0ZpcnN0UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuaXNGaXJzdFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0lzTGFzdFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmlzTGFzdFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEpzb25PYmplY3QoanNvbk9iaik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZFN1cnZleUZyb21TZXJ2aWNlKHRoaXMuc3VydmV5SWQsIHJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIocmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwic3VydmV5XCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgZGF0YShkYXRhOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoID0ge307XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtrZXldID0gZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhrZXksIGRhdGFba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbW1lbnRzKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkuZW5kc1dpdGggPT09ICdmdW5jdGlvbicgJiYga2V5LmVuZHNXaXRoKHRoaXMuY29tbWVudFByZWZpeCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiB0aGlzLnBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFBhZ2U+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0uaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5wYWdlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICAgICAgZ2V0IFBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUGFnZUNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2libGVQYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjdXJyZW50UGFnZSgpOiBQYWdlIHtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gbnVsbCAmJiB2UGFnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZVZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2UGFnZXMuaW5kZXhPZih2YWx1ZSkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSB0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy5jdXJyZW50UGFnZVZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25DdXJyZW50UGFnZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRDdXJyZW50UGFnZSc6IG9sZFZhbHVlLCAnbmV3Q3VycmVudFBhZ2UnOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0Rlc2lnbk1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT0gXCJkZXNpZ25lclwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBzZWxlY3RlZFF1ZXN0aW9uKCk6IFF1ZXN0aW9uIHsgcmV0dXJuIHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBzZWxlY3RlZFF1ZXN0aW9uKHZhbHVlOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gdGhpcy5zZWxlY3RlZFF1ZXN0aW9uKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuc2VsZWN0ZWRRdWVzdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKG9sZFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG9sZFZhbHVlLm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFF1ZXN0aW9uICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRRdWVzdGlvbi5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkLmZpcmUodGhpcywgeyAnb2xkU2VsZWN0ZWRRdWVzdGlvbic6IG9sZFZhbHVlLCAnbmV3U2VsZWN0ZWRRdWVzdGlvbic6IHZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZUtvQ3VycmVudFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMYXN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbmRSZXN1bHRPblBhZ2VOZXh0ICYmIHRoaXMuY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCh0aGlzLnN1cnZleVBvc3RJZCwgdGhpcy5jbGllbnRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCArIDFdO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlzQ3VycmVudFBhZ2VIYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZS5oYXNFcnJvcnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJldlBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRmlyc3RQYWdlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbaW5kZXggLSAxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcGxldGVMYXN0UGFnZSgpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBpc0ZpcnN0UGFnZSgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBpc0xhc3RQYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICByZXR1cm4gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgPT0gdlBhZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFBhZ2UoaW5kZXg6IG51bWJlcik6IFBhZ2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlc1tpbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZFBhZ2UocGFnZTogUGFnZSkge1xyXG4gICAgICAgICAgICBpZiAocGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMucHVzaChwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSBuZXcgUGFnZShuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVtb3ZlUGFnZShwYWdlOiBQYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucGFnZXMuaW5kZXhPZihwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoID4gMCA/IHRoaXMucGFnZXNbMF0gOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRRdWVzdGlvbkJ5TmFtZShuYW1lOiBzdHJpbmcpOiBJUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYocXVlc3Rpb25zW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdKTogSVF1ZXN0aW9uW10ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWVzW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbikgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbjogSVF1ZXN0aW9uKTogUGFnZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMucGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5xdWVzdGlvbnMuaW5kZXhPZig8UXVlc3Rpb24+cXVlc3Rpb24pID4gLTEpIHJldHVybiBwYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZUJ5TmFtZShuYW1lOiBzdHJpbmcpOiBQYWdlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRoaXMucGFnZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdKTogUGFnZVtde1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZ2V0UGFnZUJ5TmFtZShuYW1lc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZSkgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEFsbFF1ZXN0aW9ucyh2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SVF1ZXN0aW9uPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8SVF1ZXN0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5hZGRRdWVzdGlvbnNUb0xpc3QocmVzdWx0LCB2aXNpYmxlT25seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5uYW1lICE9IG5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkLmZpcmUodGhpcywgeyAnbmFtZSc6IG5hbWUsICd2YWx1ZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5VmFsdWVDaGFuZ2VkKHRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrVHJpZ2dlcnMobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnRyaWdnZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlnZ2Vyc1tpXS5uYW1lID09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJzW2ldLmNoZWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQgfHwgdGhpcy5pc0VtcHR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVSZW5kZXIoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5rby5odG1sO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hcHBseUJpbmRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLm9uUmVuZGVyZWQuZmlyZShzZWxmLCB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nID0gbnVsbCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmIChwb3N0SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5UG9zdElkID0gcG9zdElkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjbGllbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbmV3IGR4U3VydmV5U2VydmljZSgpLnNlbmRSZXN1bHQodGhpcy5zdXJ2ZXlQb3N0SWQsIHRoaXMuZGF0YSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25TZW5kUmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCByZXNwb25zZTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuZ2V0UmVzdWx0KHJlc3VsdElkLCBuYW1lLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogYW55W10sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25HZXRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGE6IGRhdGEsIGRhdGFMaXN0OiBkYXRhTGlzdCwgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCwgZWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5SWQgPSBzdXJ2ZXlJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5sb2FkU3VydmV5KHRoaXMuc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRKc29uT2JqZWN0KHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW5kZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvbkJlZm9yZVJlbmRlcigpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFwcGx5QmluZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzS08gfHwgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVmlzaWJsZUluZGV4ZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHRoaXMuc2hvd1BhZ2VOdW1iZXJzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uUGFnZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlzUGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzUGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXModmlzUGFnZXNbaV0ucXVlc3Rpb25zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSksIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0udmlzaWJsZUluZGV4ID0gdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gKGluZGV4KyspIDogLTE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLm51bSA9IHNob3dJbmRleCAmJiB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyB0aGlzLnBhZ2VzW2ldLnZpc2libGVJbmRleCArIDEgOiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXMocXVlc3Rpb25zOiBJUXVlc3Rpb25bXSwgc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbnNbaV0uc2V0VmlzaWJsZUluZGV4KHNob3dJbmRleCAmJiBxdWVzdGlvbnNbaV0udmlzaWJsZSA/IChpbmRleCsrKSA6IC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEpzb25PYmplY3QoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIganNvbkNvbnZlcnRlciA9IG5ldyBKc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoanNvbk9iaiwgdGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChqc29uQ29udmVydGVyLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBqc29uQ29udmVydGVyLmVycm9ycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lTdXJ2ZXkgZGF0YVxyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmRhdGFbbmFtZSArIHRoaXMuY29tbWVudFByZWZpeF07XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXg7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXN0aW9uQWRkZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICdpbmRleCc6IGluZGV4IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlc3Rpb25SZW1vdmVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5pc0VtcHR5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7IG5hbWU6IG5hbWUsIHZhbHVlOiB0aGlzLmdldFZhbHVlKG5hbWUpLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgICAgICB0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5lcnJvciA/IG5ldyBDdXN0b21FcnJvcihvcHRpb25zLmVycm9yKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVN1cnZleVRyaWdnZXJPd25lclxyXG4gICAgICAgIGdldE9iamVjdHMocGFnZXM6IHN0cmluZ1tdLCBxdWVzdGlvbnM6IHN0cmluZ1tdKTogYW55W117XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFBhZ2VzQnlOYW1lcyhwYWdlcykpO1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UXVlc3Rpb25zQnlOYW1lcyhxdWVzdGlvbnMpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleVwiLCBbXCJ0aXRsZVwiLCBcInBhZ2VzXCIsIFwicXVlc3Rpb25zXCIsIFwidHJpZ2dlcnM6dHJpZ2dlcnNcIiwgXCJzdXJ2ZXlJZFwiLCBcInN1cnZleVBvc3RJZFwiLCBcInNlbmRSZXN1bHRPblBhZ2VOZXh0OmJvb2xlYW5cIixcclxuICAgICAgICBcInNob3dOYXZpZ2F0aW9uQnV0dG9uczpib29sZWFuXCIsIFwic2hvd1RpdGxlOmJvb2xlYW5cIiwgXCJzaG93UGFnZVRpdGxlczpib29sZWFuXCIsIFwic2hvd1BhZ2VOdW1iZXJzOmJvb2xlYW5cIiwgXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsXHJcbiAgICAgICAgXCJyZXF1aXJlZFRleHRcIiwgXCJwYWdlUHJldlRleHRcIiwgXCJwYWdlTmV4dFRleHRcIiwgXCJjb21wbGV0ZVRleHRcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInBhZ2VzXCIsIFwicGFnZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJxdWVzdGlvbnNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBudWxsOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmosIHZhbHVlLCBqc29uQ29udmVydGVyKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gb2JqLmFkZE5ld1BhZ2UoXCJcIik7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoeyBxdWVzdGlvbnM6IHZhbHVlIH0sIHBhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInNob3dOYXZpZ2F0aW9uQnV0dG9uc1wiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJzaG93VGl0bGVcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1BhZ2VUaXRsZXNcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBudWxsLCBcIm9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJzdXJ2ZXlcIiwgXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJyZXF1aXJlZFRleHRcIiwgbnVsbCwgXCIqIFwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJwYWdlUHJldlRleHRcIiwgbnVsbCwgXCJQcmV2aW91c1wiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJwYWdlTmV4dFRleHRcIiwgbnVsbCwgXCJOZXh0XCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcImNvbXBsZXRlVGV4dFwiLCBudWxsLCBcIkNvbXBsZXRlXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcInN1cnZleVwiLCBcInRyaWdnZXJzXCIsIFwic3VydmV5dHJpZ2dlclwiLCBcInRyaWdnZXJcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwic3VydmV5XCIsIFwicXVlc3Rpb25zXCIsIFwicXVlc3Rpb25cIik7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXkudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgRHJhZ0Ryb3BIZWxwZXIge1xyXG4gICAgICAgIHN0YXRpYyBkYXRhU3RhcnQ6IHN0cmluZyA9IFwic3VydmV5anMsXCI7XHJcbiAgICAgICAgc3RhdGljIGRyYWdEYXRhOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHN0YXRpYyBwcmV2RXZlbnQgPSB7IHF1ZXN0aW9uOiBudWxsLCB4OiAtMSwgeTogLTEgfTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGRhdGE6IElTdXJ2ZXkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5IHsgcmV0dXJuIDxTdXJ2ZXk+dGhpcy5kYXRhOyB9XHJcbiAgICAgICAgcHVibGljIHN0YXJ0RHJhZ05ld1F1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbk5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZXZlbnQsIERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCArIFwicXVlc3Rpb250eXBlOlwiICsgcXVlc3Rpb25UeXBlICsgXCIscXVlc3Rpb25uYW1lOlwiICsgcXVlc3Rpb25OYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXJ0RHJhZ1F1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShldmVudCwgRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0ICsgXCJxdWVzdGlvbm5hbWU6XCIgKyBxdWVzdGlvbk5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZG9EcmFnRHJvcE92ZXIoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmICghcXVlc3Rpb24gfHwgIXRoaXMuaXNTdXJ2ZXlEcmFnZ2luZyhldmVudCkgfHwgdGhpcy5pc1NhbWVQbGFjZShldmVudCwgcXVlc3Rpb24pKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UXVlc3Rpb25JbmRleChldmVudCwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5rb0RyYWdnaW5nKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRvRHJvcChldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogUXVlc3Rpb24gPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTdXJ2ZXlEcmFnZ2luZyhldmVudCkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2Uua29EcmFnZ2luZygtMSk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UXVlc3Rpb25JbmRleChldmVudCwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgZGF0YUluZm8gPSB0aGlzLmdldERhdGFJbmZvKGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEoKTtcclxuICAgICAgICAgICAgaWYgKCFkYXRhSW5mbykgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0UXVlc3Rpb24gPSA8UXVlc3Rpb24+dGhpcy5zdXJ2ZXkuZ2V0UXVlc3Rpb25CeU5hbWUoZGF0YUluZm9bXCJxdWVzdGlvbm5hbWVcIl0pO1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldFF1ZXN0aW9uICYmIGRhdGFJbmZvW1wicXVlc3Rpb250eXBlXCJdKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVzdGlvbiA9IFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihkYXRhSW5mb1tcInF1ZXN0aW9udHlwZVwiXSwgZGF0YUluZm9bXCJxdWVzdGlvbm5hbWVcIl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0UXVlc3Rpb24pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUXVlc3Rpb25Ubyh0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRRdWVzdGlvbkluZGV4KGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uKSByZXR1cm4gcGFnZS5xdWVzdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIGhlaWdodCA9IDxudW1iZXI+ZXZlbnQuY3VycmVudFRhcmdldFtcImNsaWVudEhlaWdodFwiXTtcclxuICAgICAgICAgICAgdmFyIHkgPSBldmVudC5vZmZzZXRZO1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ2xheWVyWCcpKSB7XHJcbiAgICAgICAgICAgICAgICB5ID0gZXZlbnQubGF5ZXJZIC0gPG51bWJlcj5ldmVudC5jdXJyZW50VGFyZ2V0W1wib2Zmc2V0VG9wXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh5ID4gaGVpZ2h0IC8gMikgaW5kZXgrK1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNTYW1lUGxhY2UoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFF1ZXN0aW9uKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBwcmV2ID0gRHJhZ0Ryb3BIZWxwZXIucHJldkV2ZW50O1xyXG4gICAgICAgICAgICBpZiAocHJldi5xdWVzdGlvbiAhPSBxdWVzdGlvbiB8fCBNYXRoLmFicyhldmVudC5jbGllbnRYIC0gcHJldi54KSA+IDUgfHwgTWF0aC5hYnMoZXZlbnQuY2xpZW50WSAtIHByZXYueSkgPiA1KSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2LnF1ZXN0aW9uID0gcXVlc3Rpb247XHJcbiAgICAgICAgICAgICAgICBwcmV2LnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgICAgICAgICAgcHJldi55ID0gZXZlbnQuY2xpZW50WTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBtb3ZlUXVlc3Rpb25Ubyh0YXJnZXRRdWVzdGlvbjogUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0YXJnZXRRdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnJlbW92ZVF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5hZGRRdWVzdGlvbih0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldERhdGFJbmZvKGV2ZW50OiBEcmFnRXZlbnQpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YShldmVudCk7XHJcbiAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cihEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQubGVuZ3RoKTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gZGF0YS5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYXJyYXlbaV0uc3BsaXQoJzonKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtWzBdXSA9IGl0ZW1bMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRZKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IChlbGVtZW50Lm9mZnNldFRvcCAtIGVsZW1lbnQuc2Nyb2xsVG9wICsgZWxlbWVudC5jbGllbnRUb3ApO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IDxIVE1MRWxlbWVudD5lbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzU3VydmV5RHJhZ2dpbmcoZXZlbnQ6IERyYWdFdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKGV2ZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEgJiYgZGF0YS5pbmRleE9mKERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCkgPT0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZXREYXRhKGV2ZW50OiBEcmFnRXZlbnQsIGRhdGE6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcIlRleHRcIiwgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldERhdGEoZXZlbnQ6IERyYWdFdmVudCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJUZXh0XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhID8gZGF0YSA6IERyYWdEcm9wSGVscGVyLmRyYWdEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNsZWFyRGF0YSgpIHtcclxuICAgICAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgcHJldiA9IERyYWdEcm9wSGVscGVyLnByZXZFdmVudDtcclxuICAgICAgICAgICAgcHJldi5xdWVzdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHByZXYueCA9IC0xO1xyXG4gICAgICAgICAgICBwcmV2LnkgPSAtMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZHJhZ2Ryb3BoZWxwZXIudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgcXVlc3Rpb25zOiBBcnJheTxRdWVzdGlvbj4gPSBuZXcgQXJyYXk8UXVlc3Rpb24+KCk7XHJcbiAgICAgICAgcHVibGljIGRhdGE6IElTdXJ2ZXkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyB2aXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBudW1WYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAga29ObzogYW55OyBrb0RyYWdnaW5nOiBhbnk7XHJcbiAgICAgICAgZHJhZ0VudGVyOiBhbnk7IGRyYWdMZWF2ZTogYW55OyBkcmFnRHJvcDogYW55O1xyXG4gICAgICAgIHByaXZhdGUgZHJhZ0VudGVyQ291bnRlcjogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZyA9IFwiXCIpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29ObyA9IGtvLm9ic2VydmFibGUoXCJcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKC0xKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29EcmFnZ2luZy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IGlmIChuZXdWYWx1ZSA8IDApIHNlbGYuZHJhZ0VudGVyQ291bnRlciA9IDA7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnRW50ZXIgPSBmdW5jdGlvbiAoZSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHNlbGYuZHJhZ0VudGVyQ291bnRlcisrOyBpZiAoc2VsZi5rb0RyYWdnaW5nKCkgPCAwKSBzZWxmLmtvRHJhZ2dpbmcoc2VsZi5xdWVzdGlvbnMubGVuZ3RoKTsgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ0xlYXZlID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRW50ZXJDb3VudGVyLS07IGlmIChzZWxmLmRyYWdFbnRlckNvdW50ZXIgPT09IDApIHNlbGYua29EcmFnZ2luZygtMSk7IH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kb0Ryb3AoZSk7IH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBudW0oKSB7IHJldHVybiB0aGlzLm51bVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBudW0odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5udW1WYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm51bVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Obyh0aGlzLm51bVZhbHVlID4gMCA/IHRoaXMubnVtVmFsdWUgKyBcIi4gXCIgOiBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJwYWdlXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb24sIGluZGV4OiBudW1iZXIgPSAtMSkge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24gPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucXVlc3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDAsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnNldERhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5xdWVzdGlvbkFkZGVkKHF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZE5ld1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucXVlc3Rpb25zLmluZGV4T2YocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkgdGhpcy5kYXRhLnF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUgJiYgdGhpcy5xdWVzdGlvbnNbaV0uaGFzRXJyb3JzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbnNUb0xpc3QobGlzdDogQXJyYXk8SVF1ZXN0aW9uPiwgdmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlT25seSAmJiAhdGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5xdWVzdGlvbnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZG9Ecm9wKGUpIHtcclxuICAgICAgICAgICAgbmV3IERyYWdEcm9wSGVscGVyKHRoaXMuZGF0YSkuZG9Ecm9wKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJwYWdlXCIsIFtcIm5hbWVcIiwgXCJxdWVzdGlvbnNcIiwgXCJ2aXNpYmxlOmJvb2xlYW5cIiwgXCJ0aXRsZVwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFBhZ2UoKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicGFnZVwiLCBcInZpc2libGVcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwicGFnZVwiLCBcInF1ZXN0aW9uc1wiLCBcInF1ZXN0aW9uXCIpO1xyXG4gfSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblNlbGVjdEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgc3RhdGljIG90aGVySXRlbVRleHQ6IHN0cmluZyA9IFwiT3RoZXIgKGRlc2NyaWJlKVwiO1xyXG4gICAgICAgIG90aGVySXRlbTogSXRlbVZhbHVlID0gbmV3IEl0ZW1WYWx1ZShcIm90aGVyXCIsIFF1ZXN0aW9uU2VsZWN0QmFzZS5vdGhlckl0ZW1UZXh0KTtcclxuICAgICAgICBwdWJsaWMgY2hvaWNlc1ZhbHVlczogQXJyYXk8SXRlbVZhbHVlPiA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICAgICAgcHVibGljIG90aGVyRXJyb3JUZXh0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIGNob2ljZXNPcmRlclZhbHVlOiBzdHJpbmcgPSBcIm5vbmVcIjtcclxuICAgICAgICBrb090aGVyVmlzaWJsZTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb090aGVyVmlzaWJsZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5rb1ZhbHVlKCk7IHJldHVybiBzZWxmLmlzT3RoZXJTZWxlY3RlZCgpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaXNPdGhlclNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9PSB0aGlzLm90aGVySXRlbS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZXM7IH1cclxuICAgICAgICBzZXQgY2hvaWNlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGNob2ljZXNPcmRlcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBjaG9pY2VzT3JkZXIobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXNPcmRlclZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBvdGhlclRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3RoZXJJdGVtLnRleHQ7IH1cclxuICAgICAgICBzZXQgb3RoZXJUZXh0KHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vdGhlckl0ZW0udGV4dCA9IHZhbHVlOyB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVDaG9pY2VzKCk6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzT3RoZXIgJiYgdGhpcy5jaG9pY2VzT3JkZXIgPT0gXCJub25lXCIpIHJldHVybiB0aGlzLmNob2ljZXM7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLnNvcnRWaXNpYmxlQ2hvaWNlcyh0aGlzLmNob2ljZXMuc2xpY2UoKSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLm90aGVySXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNPdGhlclNlbGVjdGVkKCkgfHwgdGhpcy5jb21tZW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gdGhpcy5vdGhlckVycm9yVGV4dDtcclxuICAgICAgICAgICAgaWYgKCF0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gXCJQbGVhc2UgZW50ZXIgdGhlIG90aGVycyB2YWx1ZS5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3IodGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzb3J0VmlzaWJsZUNob2ljZXMoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgdmFyIG9yZGVyID0gdGhpcy5jaG9pY2VzT3JkZXIudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwiYXNjXCIpIHJldHVybiB0aGlzLnNvcnRBcnJheShhcnJheSwgMSk7XHJcbiAgICAgICAgICAgIGlmIChvcmRlciA9PSBcImRlc2NcIikgcmV0dXJuIHRoaXMuc29ydEFycmF5KGFycmF5LCAtMSk7XHJcbiAgICAgICAgICAgIGlmIChvcmRlciA9PSBcInJhbmRvbVwiKSByZXR1cm4gdGhpcy5yYW5kb21pemVBcnJheShhcnJheSk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc29ydEFycmF5KGFycmF5OiBBcnJheTxJdGVtVmFsdWU+LCBtdWx0OiBudW1iZXIpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhLnRleHQgPCBiLnRleHQpIHJldHVybiAtMSAqIG11bHQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS50ZXh0ID4gYi50ZXh0KSByZXR1cm4gMSAqIG11bHQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJhbmRvbWl6ZUFycmF5KGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBhcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgICAgICBhcnJheVtqXSA9IHRlbXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveEJhc2UgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gMTtcclxuICAgICAgICBrb0NsYXNzOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NsYXNzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gXCJzdl9xY2JjXCIgKyBzZWxmLmNvbENvdW50OyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBrb0FmdGVyUmVuZGVyKGVsLCBjb24pIHtcclxuICAgICAgICAgICAgdmFyIHRFbCA9IGVsWzBdO1xyXG4gICAgICAgICAgICBpZiAodEVsLm5vZGVOYW1lID09IFwiI3RleHRcIikgdEVsLmRhdGEgPSBcIlwiO1xyXG4gICAgICAgICAgICB0RWwgPSBlbFtlbC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgaWYgKHRFbC5ub2RlTmFtZSA9PSBcIiN0ZXh0XCIpIHRFbC5kYXRhID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic2VsZWN0YmFzZVwiLCBbXCJoYXNDb21tZW50OmJvb2xlYW5cIiwgXCJoYXNPdGhlcjpib29sZWFuXCIsIFwiIWNob2ljZXM6aXRlbXZhbHVlc1wiLCBcImNob2ljZXNPcmRlclwiLCBcIm90aGVyVGV4dFwiLCBcIm90aGVyRXJyb3JUZXh0XCJdLCBudWxsLCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInNlbGVjdGJhc2VcIiwgXCJjaG9pY2VzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IEl0ZW1WYWx1ZS5zZXREYXRhKG9iai5jaG9pY2VzLCB2YWx1ZSk7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInNlbGVjdGJhc2VcIiwgXCJjaG9pY2VzT3JkZXJcIiwgbnVsbCwgXCJub25lXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJzZWxlY3RiYXNlXCIsIFwiY2hvaWNlc09yZGVyXCIsIFtcIm5vbmVcIiwgXCJhc2NcIiwgXCJkZXNjXCIsIFwicmFuZG9tXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzZWxlY3RiYXNlXCIsIFwib3RoZXJUZXh0XCIsIG51bGwsIFF1ZXN0aW9uU2VsZWN0QmFzZS5vdGhlckl0ZW1UZXh0KTtcclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hiYXNlXCIsIFtcImNvbENvdW50Om51bWJlclwiXSwgbnVsbCwgXCJzZWxlY3RiYXNlXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcImNoZWNrYm94YmFzZVwiLCBcImNvbENvdW50XCIsIG51bGwsIDEpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJjaGVja2JveGJhc2VcIiwgXCJjb2xDb3VudFwiLCBbMCwgMSwgMiwgMywgNF0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRla29WYWx1ZSgpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA/IGtvLm9ic2VydmFibGVBcnJheSh0aGlzLnZhbHVlKSA6IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0a29WYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKFtdLmNvbmNhdChuZXdWYWx1ZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKFtdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaXNPdGhlclNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUuaW5kZXhPZih0aGlzLm90aGVySXRlbS52YWx1ZSkgPj0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNoZWNrYm94XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94XCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25DaGVja2JveChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImNoZWNrYm94XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uQ2hlY2tib3gobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNvbW1lbnQgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHVibGljIHJvd3M6IG51bWJlciA9IDQ7XHJcbiAgICAgICAgcHVibGljIGNvbHM6IG51bWJlciA9IDUwO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNvbW1lbnRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNvbW1lbnRcIiwgW1wiY29sczpudW1iZXJcIiwgXCJyb3dzOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJjb21tZW50XCIsIFwiY29sc1wiLCBudWxsLCA1MCk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwiY29tbWVudFwiLCBcInJvd3NcIiwgbnVsbCwgNCk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImNvbW1lbnRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNvbW1lbnQobmFtZSk7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fc2VsZWN0YmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRHJvcGRvd24gZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImRyb3Bkb3duXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImRyb3Bkb3duXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Ecm9wZG93bihcIlwiKTsgfSwgXCJzZWxlY3RiYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkRyb3Bkb3duKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElNYXRyaXhEYXRhIHtcclxuICAgICAgICBvbk1hdHJpeFJvd0NoYW5nZWQocm93OiBNYXRyaXhSb3cpO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeFJvdyBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIGRhdGE6IElNYXRyaXhEYXRhO1xyXG4gICAgICAgIHByb3RlY3RlZCByb3dWYWx1ZTogYW55O1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgcHVibGljIGZ1bGxOYW1lOiBzdHJpbmcsIGRhdGE6IElNYXRyaXhEYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnJvd1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpIHsgcmV0dXJuIHRoaXMucm93VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB0aGlzLmRhdGEub25NYXRyaXhSb3dDaGFuZ2VkKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU1hdHJpeERhdGEge1xyXG4gICAgICAgIHB1YmxpYyBjb2x1bW5zVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHVibGljIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtYXRyaXhcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNSb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb3dzVmFsdWUubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGNvbHVtbnMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNvbHVtbnNWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBjb2x1bW5zKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY29sdW1uc1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCByb3dzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5yb3dzVmFsdWU7IH1cclxuICAgICAgICBzZXQgcm93cyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJvd3NWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhSb3c+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhSb3c+KCk7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucm93c1tpXS52YWx1ZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXcgTWF0cml4Um93KHRoaXMucm93c1tpXS52YWx1ZSwgdGhpcy5yb3dzW2ldLnRleHQsIHRoaXMubmFtZSArICdfJyArIHRoaXMucm93c1tpXS52YWx1ZS50b1N0cmluZygpLCB0aGlzLCB2YWxbdGhpcy5yb3dzW2ldLnZhbHVlXSkpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChuZXcgTWF0cml4Um93KG51bGwsIFwiXCIsIHRoaXMubmFtZSwgdGhpcywgdmFsKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JTWF0cml4RGF0YVxyXG4gICAgICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvdykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzUm93cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHJvdy52YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVbcm93Lm5hbWVdID0gcm93LnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4XCIsIFtcImNvbHVtbnM6aXRlbXZhbHVlc1wiLCBcInJvd3M6aXRlbXZhbHVlc1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4KFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeFwiLCBcImNvbHVtbnNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jb2x1bW5zKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgSXRlbVZhbHVlLnNldERhdGEob2JqLmNvbHVtbnMsIHZhbHVlKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4XCIsIFwicm93c1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBJdGVtVmFsdWUuc2V0RGF0YShvYmoucm93cywgdmFsdWUpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4KG5hbWUpOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmNvbHVtbnMgPSBbXCJDb2x1bW4gMVwiLCBcIkNvbHVtbiAyXCIsIFwiQ29sdW1uIDNcIl07IHJldHVybiBxOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElNdWx0aXBsZVRleHREYXRhIHtcclxuICAgICAgICBnZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbiAgICAgICAgc2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgTXVsdGlwbGVUZXh0SXRlbSBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU11bHRpcGxlVGV4dERhdGE7XHJcbiAgICAgICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBpc0tPVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTtcclxuICAgICAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+ID0gbmV3IEFycmF5PFN1cnZleVZhbGlkYXRvcj4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSA9IG51bGwsIHRpdGxlOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmlzS09WYWx1ZVVwZGF0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtdWx0aXBsZXRleHRpdGVtXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldERhdGEoZGF0YTogSU11bHRpcGxlVGV4dERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKG5ld1RleHQ6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSBuZXdUZXh0OyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSA/IHRoaXMuZGF0YS5nZXRNdWx0aXBsZVRleHRWYWx1ZSh0aGlzLm5hbWUpIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9uVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0tPVmFsdWVVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0tPVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGU7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHQgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNdWx0aXBsZVRleHREYXRhIHtcclxuICAgICAgICBwdWJsaWMgaXRlbVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIHB1YmxpYyBpdGVtczogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbT4gPSBuZXcgQXJyYXk8TXVsdGlwbGVUZXh0SXRlbT4oKTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibXVsdGlwbGV0ZXh0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBBZGRJdGVtKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpOiBNdWx0aXBsZVRleHRJdGVtIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgTXVsdGlwbGVUZXh0SXRlbShuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBzdXBlci5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uSXRlbVZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0a29WYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLnNldGtvVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLm9uSXRlbVZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICYmICh0aGlzLml0ZW1zW2ldLm5hbWUgaW4gdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSB0aGlzLnZhbHVlW3RoaXMuaXRlbXNbaV0ubmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zW2ldLm9uVmFsdWVDaGFuZ2VkKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBzdXBlci5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAvL0lNdWx0aXBsZVRleHREYXRhXHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dGl0ZW1cIiwgW1wibmFtZVwiLCBcInRpdGxlXCIsIFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbShcIlwiKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBcInZhbGlkYXRvcnNcIiwgXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgXCJ2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBcInRpdGxlXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSk7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dFwiLCBbXCIhaXRlbXM6dGV4dGl0ZW1zXCIsIFwiaXRlbVNpemU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHQoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibXVsdGlwbGV0ZXh0XCIsIFwiaXRlbXNcIiwgXCJtdWx0aXBsZXRleHRpdGVtXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm11bHRpcGxldGV4dFwiLCBcIml0ZW1TaXplXCIsIG51bGwsIDI1KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibXVsdGlwbGV0ZXh0XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTXVsdGlwbGVUZXh0KG5hbWUpOyBxLkFkZEl0ZW0oXCJ0ZXh0MVwiKTsgcS5BZGRJdGVtKFwidGV4dDJcIik7IHJldHVybiBxOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fYmFzZXNlbGVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmFkaW9ncm91cCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYWRpb2dyb3VwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhZGlvZ3JvdXBcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXAoXCJcIik7IH0sIFwiY2hlY2tib3hiYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYWRpb2dyb3VwXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTt9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25SYXRpbmcgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRSYXRlVmFsdWVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgcmF0ZXM6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHVibGljIG1pbmludW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG1heGltdW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgIGtvVmlzaWJsZVJhdGVWYWx1ZXM6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1Zpc2libGVSYXRlVmFsdWVzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYudmlzaWJsZVJhdGVWYWx1ZXM7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgcmF0ZVZhbHVlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucmF0ZXM7IH1cclxuICAgICAgICBzZXQgcmF0ZVZhbHVlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJhdGVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZVJhdGVWYWx1ZXMoKTogSXRlbVZhbHVlW10ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yYXRlVmFsdWVzLmxlbmd0aCA+IDApIHJldHVybiB0aGlzLnJhdGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBRdWVzdGlvblJhdGluZy5kZWZhdWx0UmF0ZVZhbHVlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmF0aW5nXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH0gXHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIH1cclxuICAgIEl0ZW1WYWx1ZS5zZXREYXRhKFF1ZXN0aW9uUmF0aW5nLmRlZmF1bHRSYXRlVmFsdWVzLCBbMSwgMiwgMywgNCwgNV0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhdGluZ1wiLCBbXCJoYXNDb21tZW50OmJvb2xlYW5cIiwgXCJyYXRlVmFsdWVzOml0ZW12YWx1ZXNcIiwgXCJtaW5pbnVtUmF0ZURlc2NyaXB0aW9uXCIsIFwibWF4aW11bVJhdGVEZXNjcmlwdGlvblwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInJhdGluZ1wiLCBcInJhdGVWYWx1ZXNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yYXRlVmFsdWVzKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgSXRlbVZhbHVlLnNldERhdGEob2JqLnJhdGVWYWx1ZXMsIHZhbHVlKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhdGluZ1wiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nKG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25UZXh0IGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHB1YmxpYyBzaXplOiBudW1iZXIgPSAyNTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ0ZXh0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5pc0VtcHR5KCkgfHwgdGhpcy52YWx1ZSA9PSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0XCIsIFtcInNpemU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0KFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInRleHRcIiwgXCJzaXplXCIsIG51bGwsIDI1KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dChuYW1lKTsgfSk7XHJcbn0iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlXaW5kb3cgZXh0ZW5kcyBCYXNlICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdXJ2ZXlFbGVtZW50TmFtZSA9IFwid2luZG93U3VydmV5SlNcIjtcclxuICAgICAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5O1xyXG4gICAgICAgIHdpbmRvd0VsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICAgIGlzU2hvd2luZ1ZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIGlzRXhwYW5kZWRWYWx1ZTogYm9vbGVhbjtcclxuICAgICAgICB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAga29FeHBhbmRlZDogYW55O1xyXG4gICAgICAgIGRvRXhwYW5kOiBhbnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkoanNvbk9iaik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXI6IFN1cnZleSkgPT4geyBzZWxmLm9uQ29tcGxldGUoKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvRXhwYW5kZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9FeHBhbmQgPSBmdW5jdGlvbiAoKSB7IHNlbGYuY2hhbmdlRXhwYW5kZWQoKTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCkgOiBzdHJpbmcgeyByZXR1cm4gXCJ3aW5kb3dcIiB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzU2hvd2luZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNTaG93aW5nVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzRXhwYW5kZWRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMuc3VydmV5LnRpdGxlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZS53aW5kb3cua28uaHRtbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd0VsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoU3VydmV5V2luZG93LnN1cnZleUVsZW1lbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3dpbmdWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBoaWRlKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd2luZ1ZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBleHBhbmQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjb2xsYXBzZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZXhwYW5kY29sbGFwc2UodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc0V4cGFuZGVkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0V4cGFuZGVkKHRoaXMuaXNFeHBhbmRlZFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoYW5nZUV4cGFuZGVkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKCF0aGlzLmlzRXhwYW5kZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uQ29tcGxldGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSB0ZW1wbGF0ZS53aW5kb3cua28geyBleHBvcnQgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cInN2X3dpbmRvd1wiPiAgICA8ZGl2IGNsYXNzPVwic3Zfd2luZG93X3RpdGxlXCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpkb0V4cGFuZFwiIHN0eWxlPVwid2lkdGg6MTAwJVwiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6dGl0bGVcIj48L3NwYW4+PC9hPjwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6a29FeHBhbmRlZFwiPiAgICAgICAgPGRpdiBpZD1cIndpbmRvd1N1cnZleUpTXCI+PC9kaXY+ICAgIDwvZGl2PjwvZGl2Pic7fSJdLCJzb3VyY2VSb290Ijoic3JjIn0=
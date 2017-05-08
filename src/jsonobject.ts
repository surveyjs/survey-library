import {HashTable} from './base';

export class JsonObjectProperty {
    private typeValue: string = null;
    private choicesValue: Array<any> = null;
    private choicesfunc: () => Array<any> = null;
    public className: string = null;
    public alternativeName: string = null;
    public classNamePart: string = null;
    public baseClassName: string = null;
    public defaultValue: any = null;
    public readOnly: boolean = false;
    public visible: boolean = true;
    public isLocalizable: boolean = false;
    public serializationProperty: string = null;
    public onGetValue: (obj: any) => any = null;
    public onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;

    constructor(public name: string) {
    }
    public get type(): string { return this.typeValue ? this.typeValue : "string"; }
    public set type(value: string) { this.typeValue = value; }
    public get hasToUseGetValue() { return this.onGetValue || this.serializationProperty; }
    public isDefaultValue(value: any): boolean {
        return (this.defaultValue) ? (this.defaultValue == value) : !(value);
    }
    public getValue(obj: any): any {
        if (this.onGetValue) return this.onGetValue(obj);
        if(this.serializationProperty) return obj[this.serializationProperty].getJson();
        return obj[this.name];
    }
    public getPropertyValue(obj: any): any {
        if(this.isLocalizable) return obj[this.serializationProperty].text;
        return this.getValue(obj);
    }
    public get hasToUseSetValue() { return this.onSetValue || this.serializationProperty; }
    public setValue(obj: any, value: any, jsonConv: JsonObject) {
        if (this.onSetValue) {
            this.onSetValue(obj, value, jsonConv);
        } else {
            if(this.serializationProperty)
                obj[this.serializationProperty].setJson(value);
            else obj[this.name] = value;
        }
    }
    public getObjType(objType: string) {
        if (!this.classNamePart) return objType;
        return objType.replace(this.classNamePart, "");
    }
    public getClassName(className: string): string {
        return (this.classNamePart && className.indexOf(this.classNamePart) < 0) ? className + this.classNamePart : className;
    }
    public get choices(): Array<any> {
        if (this.choicesValue != null) return this.choicesValue;
        if (this.choicesfunc != null) return this.choicesfunc();
        return null;
    }
    public setChoices(value: Array<any>, valueFunc: () => Array<any>) {
        this.choicesValue = value;
        this.choicesfunc = valueFunc;
    }
}
export class JsonMetadataClass {
    static requiredSymbol = '!';
    static typeSymbol = ':';
    properties: Array<JsonObjectProperty> = null;
    requiredProperties: Array<string> = null;
    constructor(public name: string, properties: Array<any>, public creator: () => any = null, public parentName: string = null) {
        this.properties = new Array<JsonObjectProperty>();
        for (var i = 0; i < properties.length; i++) {
            var prop = this.createProperty(properties[i]);
            if (prop) {
                this.properties.push(prop);
            }
        }
    }
    public find(name: string): JsonObjectProperty {
        for (var i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name == name) return this.properties[i];
        }
        return null;
    }
    public createProperty(propInfo: any): JsonObjectProperty {
        var propertyName = typeof propInfo === "string" ? propInfo : propInfo.name;
        if (!propertyName) return;
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
            if(propInfo.visible === false) {
                prop.visible = false;
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
            if(propInfo.serializationProperty) {
                prop.serializationProperty = propInfo.serializationProperty;
                var s: string;
                if(prop.serializationProperty && prop.serializationProperty.indexOf("loc") == 0) {
                    prop.isLocalizable = true;
                }
            }
            if(propInfo.isLocalizable) {
                prop.isLocalizable = propInfo.isLocalizable;
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
            if(propInfo.alternativeName) {
                prop.alternativeName = propInfo.alternativeName;
            }
        }
        return prop;
    }
    private getPropertyName(propertyName: string): string {
        if (propertyName.length == 0 || propertyName[0] != JsonMetadataClass.requiredSymbol) return propertyName;
        propertyName = propertyName.slice(1);
        this.makePropertyRequired(propertyName);
        return propertyName;
    }
    private makePropertyRequired(propertyName: string) {
        if (!this.requiredProperties) {
            this.requiredProperties = new Array<string>();
        }
        this.requiredProperties.push(propertyName);
    }
}
export class JsonMetadata {
    private classes: HashTable<JsonMetadataClass> = {};
    private childrenClasses: HashTable<Array<JsonMetadataClass>> = {};
    private classProperties: HashTable<Array<JsonObjectProperty>> = {};
    private classRequiredProperties: HashTable<Array<string>> = {};
    public addClass(name: string, properties: Array<any>, creator: () => any = null, parentName: string = null): JsonMetadataClass {
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
    }
    public overrideClassCreatore(name: string, creator: () => any) {
        var metaDataClass = this.findClass(name);
        if (metaDataClass) {
            metaDataClass.creator = creator;
        }
    }
    public getProperties(className: string): Array<JsonObjectProperty> {
        var properties = this.classProperties[className];
        if (!properties) {
            properties = new Array<JsonObjectProperty>();
            this.fillProperties(className, properties);
            this.classProperties[className] = properties;
        }
        return properties;
    }
    public findProperty(className: string, propertyName: string) : JsonObjectProperty {
        var properties = this.getProperties(className);
        for(var i = 0; i < properties.length; i ++) {
            if(properties[i].name == propertyName) return properties[i];
        }
        return null;
    }
    public createClass(name: string): any {
        var metaDataClass = this.findClass(name);
        if (!metaDataClass) return null;
        return metaDataClass.creator();
    }
    public getChildrenClasses(name: string, canBeCreated: boolean = false): Array<JsonMetadataClass> {
        var result = [];
        this.fillChildrenClasses(name, canBeCreated, result);
        return result;
    }
    public getRequiredProperties(name: string): Array<string> {
        var properties = this.classRequiredProperties[name];
        if (!properties) {
            properties = new Array<string>();
            this.fillRequiredProperties(name, properties);
            this.classRequiredProperties[name] = properties;
        }
        return properties;
    }
    public addProperty(className: string, propertyInfo: any) {
        var metaDataClass = this.findClass(className);
        if (!metaDataClass) return;
        var property = metaDataClass.createProperty(propertyInfo);
        if (property) {
            this.addPropertyToClass(metaDataClass, property);
            this.emptyClassPropertiesHash(metaDataClass);
        }
    }
    public removeProperty(className: string, propertyName: string) {
        var metaDataClass = this.findClass(className);
        if (!metaDataClass) return false;
        var property = metaDataClass.find(propertyName);
        if (property) {
            this.removePropertyFromClass(metaDataClass, property);
            this.emptyClassPropertiesHash(metaDataClass);
        }
    }
    private addPropertyToClass(metaDataClass: JsonMetadataClass, property: JsonObjectProperty) {
        if (metaDataClass.find(property.name) != null) return;
        metaDataClass.properties.push(property);
    }
    private removePropertyFromClass(metaDataClass: JsonMetadataClass, property: JsonObjectProperty) {
        var index = metaDataClass.properties.indexOf(property);
        if (index < 0) return;
        metaDataClass.properties.splice(index, 1);
        if (metaDataClass.requiredProperties) {
            index = metaDataClass.requiredProperties.indexOf(property.name);
            if (index >= 0) {
                metaDataClass.requiredProperties.splice(index, 1);
            }
        }
    }
    private emptyClassPropertiesHash(metaDataClass: JsonMetadataClass) {
        this.classProperties[metaDataClass.name] = null;
        var childClasses = this.getChildrenClasses(metaDataClass.name);
        for (var i = 0; i < childClasses.length; i++) {
            this.classProperties[childClasses[i].name] = null;
        }
    }
    private fillChildrenClasses(name: string, canBeCreated: boolean, result: Array<JsonMetadataClass>) {
        var children = this.childrenClasses[name];
        if (!children) return;
        for (var i = 0; i < children.length; i++) {
            if (!canBeCreated || children[i].creator) {
                result.push(children[i]);
            }
            this.fillChildrenClasses(children[i].name, canBeCreated, result);
        }
    }
    public findClass(name: string): JsonMetadataClass {
        return this.classes[name];
    }
    private fillProperties(name: string, list: Array<JsonObjectProperty>) {
        var metaDataClass = this.findClass(name);
        if (!metaDataClass) return;
        if (metaDataClass.parentName) {
            this.fillProperties(metaDataClass.parentName, list);
        }
        for (var i = 0; i < metaDataClass.properties.length; i++) {
            this.addPropertyCore(metaDataClass.properties[i], list, list.length);
        }
    }
    private addPropertyCore(property: JsonObjectProperty, list: Array<JsonObjectProperty>, endIndex: number) {
        var index = -1;
        for (var i = 0; i < endIndex; i++) {
            if (list[i].name == property.name) {
                index = i;
                break;
            }
        }
        if (index < 0) {
            list.push(property)
        } else {
            list[index] = property;
        }
    }
    private fillRequiredProperties(name: string, list: Array<string>) {
        var metaDataClass = this.findClass(name);
        if (!metaDataClass) return;
        if (metaDataClass.requiredProperties) {
            Array.prototype.push.apply(list, metaDataClass.requiredProperties);
        }
        if (metaDataClass.parentName) {
            this.fillRequiredProperties(metaDataClass.parentName, list);
        }
    }
}
export class JsonError {
    public description: string = "";
    public at: Number = -1;
    constructor(public type: string, public message: string) {
    }
    public getFullDescription() : string {
        return this.message + (this.description ? "\n" + this.description : "");
    }
}
export class JsonUnknownPropertyError extends JsonError {
    constructor(public propertyName: string, public className: string) {
        super("unknownproperty", "The property '" + propertyName + "' in class '" + className + "' is unknown.");
        var properties = JsonObject.metaData.getProperties(className);
        if (properties) {
            this.description = "The list of available properties are: ";
            for (var i = 0; i < properties.length; i++) {
                if (i > 0) this.description += ", ";
                this.description += properties[i].name;
            }
            this.description += '.';
        }
    }
}
export class JsonMissingTypeErrorBase extends JsonError {
    constructor(public baseClassName: string, public type: string, public message: string) {
        super(type, message);
        this.description = "The following types are available: ";
        var types = JsonObject.metaData.getChildrenClasses(baseClassName, true);
        for (var i = 0; i < types.length; i++) {
            if (i > 0) this.description += ", ";
            this.description += "'" + types[i].name + "'";
        }
        this.description += ".";
    }
}
export class JsonMissingTypeError extends JsonMissingTypeErrorBase {
    constructor(public propertyName: string, public baseClassName: string) {
        super(baseClassName, "missingtypeproperty", "The property type is missing in the object. Please take a look at property: '" + propertyName + "'.");
    }
}
export class JsonIncorrectTypeError extends JsonMissingTypeErrorBase {
    constructor(public propertyName: string, public baseClassName: string) {
        super(baseClassName, "incorrecttypeproperty", "The property type is incorrect in the object. Please take a look at property: '" + propertyName + "'.");
    }
}
export class JsonRequiredPropertyError extends JsonError {
    constructor(public propertyName: string, public className: string) {
        super("requiredproperty", "The property '" + propertyName + "' is required in class '" + className + "'.");
    }
}

export class JsonObject {
    private static typePropertyName = "type";
    private static positionPropertyName = "pos";
    private static metaDataValue = new JsonMetadata();
    public static get metaData() { return JsonObject.metaDataValue; }
    public errors = new Array<JsonError>();
    public toJsonObject(obj: any): any {
        return this.toJsonObjectCore(obj, null);
    }
    public toObject(jsonObj: any, obj: any) {
        if (!jsonObj) return;
        var properties = null;
        if (obj.getType) {
            properties = JsonObject.metaData.getProperties(obj.getType());
        }
        if (!properties) return;
        for (var key in jsonObj) {
            if (key == JsonObject.typePropertyName) continue;
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
    }
    protected toJsonObjectCore(obj: any, property: JsonObjectProperty): any {
        if (!obj.getType) return obj;
        var result = {};
        if (property != null && (!property.className)) {
            result[JsonObject.typePropertyName] = property.getObjType(obj.getType());
        }
        var properties = JsonObject.metaData.getProperties(obj.getType());
        for (var i: number = 0; i < properties.length; i++) {
            this.valueToJson(obj, result, properties[i]);
        }
        return result;
    }
    protected valueToJson(obj: any, result: any, property: JsonObjectProperty) {
        var value = property.getValue(obj);
        if (value === undefined || value === null) return;
        if (property.isDefaultValue(value)) return;
        if (this.isValueArray(value)) {
            var arrValue = [];
            for (var i = 0; i < value.length; i++) {
                arrValue.push(this.toJsonObjectCore(value[i], property));
            }
            value = arrValue.length > 0 ? arrValue : null;
        } else {
            value = this.toJsonObjectCore(value, property);
        }
        if (!property.isDefaultValue(value)) {
            result[property.name] = value;
        }
    }
    protected valueToObj(value: any, obj: any, key: any, property: JsonObjectProperty) {
        if (value == null) return;
        if (property != null && property.hasToUseSetValue) {
            property.setValue(obj, value, this);
            return;
        }
        if (this.isValueArray(value)) {
            this.valueToArray(value, obj, property.name, property);
            return;
        }
        var newObj = this.createNewObj(value, property);
        if (newObj.newObj) {
            this.toObject(value, newObj.newObj);
            value = newObj.newObj;
        }
        if (!newObj.error) {
            obj[property.name] = value;
        }
    }
    private isValueArray(value: any): boolean { return value && Array.isArray(value); }
    private createNewObj(value: any, property: JsonObjectProperty): any {
        var result = { newObj: null, error: null };
        var className = value[JsonObject.typePropertyName];
        if (!className && property != null && property.className) {
            className = property.className;
        }
        className = property.getClassName(className);
        result.newObj = (className) ? JsonObject.metaData.createClass(className) : null;
        result.error = this.checkNewObjectOnErrors(result.newObj, value, property, className);
        return result;
    }
    private checkNewObjectOnErrors(newObj: any, value: any, property: JsonObjectProperty, className: string): JsonError {
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
        } else {
            if (property.baseClassName) {
                if (!className) {
                    error = new JsonMissingTypeError(property.name, property.baseClassName);
                } else {
                    error = new JsonIncorrectTypeError(property.name, property.baseClassName);
                }
            }
        }
        if (error) {
            this.addNewError(error, value);
        }
        return error;
    }
    private addNewError(error: JsonError, jsonObj: any) {
        if (jsonObj && jsonObj[JsonObject.positionPropertyName]) {
            error.at = jsonObj[JsonObject.positionPropertyName].start;
        }
        this.errors.push(error);
    }
    private valueToArray(value: Array<any>, obj: any, key: any, property: JsonObjectProperty) {
        if(obj[key] && value.length > 0) obj[key].splice(0, obj[key].length);
        for (var i = 0; i < value.length; i++) {
            var newValue = this.createNewObj(value[i], property);
            if (newValue.newObj) {
                obj[key].push(newValue.newObj);
                this.toObject(value[i], newValue.newObj);
            } else {
                if (!newValue.error) {
                    obj[key].push(value[i]);
                }
            }
        }
    }
    private findProperty(properties: Array<JsonObjectProperty>, key: any): JsonObjectProperty {
        if (!properties) return null;
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];
            if (prop.name == key || prop.alternativeName == key) return prop;
        }
        return null;
    }
}

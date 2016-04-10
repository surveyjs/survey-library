/// <reference path="base.ts" />
module Survey {

    export class JsonObjectProperty {
        private typeValue: string = null;
        public className: string = null;
        public classNamePart: string = null;
        public baseClassName: string = null;
        public defaultValue: any = null;
        public choices: Array<any> = null;
        public onGetValue: (obj: any) => any = null;
        public onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any

        constructor(public name: string) {
        }
        public get type(): string { return this.typeValue ? this.typeValue : "string"; }
        public set type(value: string) { this.typeValue = value; }
        public get hasToUseGetValue() { return this.onGetValue; } 
        public isDefaultValue(value: any): boolean {
            return (this.defaultValue) ? (this.defaultValue == value) : !(value);
        }
        public getValue(obj: any): any {
            if (this.onGetValue) return this.onGetValue(obj);
            return null;
        }
        public get hasToUseSetValue() { return this.onSetValue; }
        public setValue(obj: any, value: any, jsonConv: JsonObject) {
            if (this.onSetValue) {
                this.onSetValue(obj, value, jsonConv);
            }
        }
        public getObjType(objType: string) {
            if (!this.classNamePart) return objType;
            return objType.replace(this.classNamePart, "");
        }
        public getClassName(className: string): string {
            return (this.classNamePart && className.indexOf(this.classNamePart) < 0) ? className + this.classNamePart : className;
        }
    }
    export class JsonMetadataClass {
        static requiredSymbol = '!';
        static typeSymbol = ':';
        properties: Array<JsonObjectProperty> = null;
        requiredProperties: Array<string> = null;
        constructor(public name: string, propertiesNames: Array<string>, public creator: () => any = null, public parentName: string = null) {
            this.properties = new Array<JsonObjectProperty>();
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
        public find(name: string): JsonObjectProperty {
            for (var i = 0; i < this.properties.length; i++) {
                if (this.properties[i].name == name) return this.properties[i];
            }
            return null;
        }
        private getPropertyName(propertyName: string): string {
            if (propertyName.length == 0 || propertyName[0] != JsonMetadataClass.requiredSymbol) return propertyName;
            propertyName = propertyName.slice(1);
            if (!this.requiredProperties) {
                this.requiredProperties = new Array<string>();
            }
            this.requiredProperties.push(propertyName);
            return propertyName;
        }
    }
    export class JsonMetadata {
        private classes: HashTable<JsonMetadataClass> = {};
        private childrenClasses: HashTable<Array<JsonMetadataClass>> = {};
        private classProperties: HashTable<Array<JsonObjectProperty>> = {};
        private classRequiredProperties: HashTable<Array<string>> = {};
        public addClass(name: string, propertiesNames: Array<string>, creator: () => any = null, parentName: string = null): JsonMetadataClass {
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
        }
        public overrideClassCreatore(name: string, creator: () => any) {
            var metaDataClass = this.findClass(name);
            if (metaDataClass) {
                metaDataClass.creator = creator;
            }
        }
        public setPropertyValues(name: string, propertyName: string, propertyClassName: string, defaultValue: any = null, onGetValue: (obj: any) => any = null, onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any = null) {
            var property = this.findProperty(name, propertyName);
            if (!property) return;
            property.className = propertyClassName;
            property.defaultValue = defaultValue;
            property.onGetValue = onGetValue;
            property.onSetValue = onSetValue;
        }
        public setPropertyChoices(name: string, propertyName: string, choices: Array<any>) {
            var property = this.findProperty(name, propertyName);
            if (!property) return;
            property.choices = choices;
        }
        public setPropertyClassInfo(name: string, propertyName: string, baseClassName: string, classNamePart: string = null) {
            var property = this.findProperty(name, propertyName);
            if (!property) return;
            property.baseClassName = baseClassName;
            property.classNamePart = classNamePart;
        }
        public getProperties(name: string): Array<JsonObjectProperty> {
            var properties = this.classProperties[name];
            if (!properties) {
                properties = new Array<JsonObjectProperty>();
                this.fillProperties(name, properties);
                this.classProperties[name] = properties;
            }
            return properties;
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
        private findClass(name: string): JsonMetadataClass {
            return this.classes[name];
        }
        private findProperty(name: string, propertyName: string): JsonObjectProperty {
            var metaDataClass = this.findClass(name);
            return metaDataClass ? metaDataClass.find(propertyName) : null;
        }
        private fillProperties(name: string, list: Array<JsonObjectProperty>) {
            var metaDataClass = this.findClass(name);
            if (!metaDataClass) return;
            if (metaDataClass.parentName) {
                this.fillProperties(metaDataClass.parentName, list);
            }
            for (var i = 0; i < metaDataClass.properties.length; i++) {
                this.addProperty(metaDataClass.properties[i], list, list.length);
            }
        }
        private addProperty(property: JsonObjectProperty, list: Array<JsonObjectProperty>, endIndex: number) {
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
            var value = null;
            if (property.hasToUseGetValue) {
                value = property.getValue(obj);
            } else {
                value = obj[property.name];
            }
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
        }
        private isValueArray(value: any): boolean { return value.constructor.toString().indexOf("Array") > -1; }
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
            if (!this.isValueArray(obj[key])) {
                obj[key] = [];
            }
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
                if (properties[i].name == key) return properties[i];
            }
            return null;
        }
    }
}
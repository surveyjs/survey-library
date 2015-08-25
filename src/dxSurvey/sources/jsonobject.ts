/// <reference path="base.ts" />
module dxSurvey {
    export class JsonObjectProperty {
        public onGetValue: (obj: any) => any = null;
        public onCreateObj: (jsonValue: any) => any = null;

        constructor(public name: string) {
        }
        public get hasToUseGetValue() { return this.onGetValue; }
        public getValue(obj: any): any {
            if (this.onGetValue) return this.onGetValue(obj);
            return null;
        }
        public createObj(jsonValue: any): any {
            if (this.onCreateObj) return this.createObj(jsonValue);
            return null;
        }
    }
    class JsonMetadataClass {
        properties: Array<JsonObjectProperty> = null;
        constructor(public name: string, propertiesNames: Array<string>, public creator: () => any = null, public parentName: string = null) {
            this.properties = new Array<JsonObjectProperty>();
            for (var i = 0; i < propertiesNames.length; i++) {
                this.properties.push(new JsonObjectProperty(propertiesNames[i]));
            }
        }
        public find(name: string): JsonObjectProperty {
            for (var i = 0; i < this.properties.length; i++) {
                if (this.properties[i].name == name) return this.properties[i];
            }
            return null;
        }

    }
    export class JsonMetadata {
        private classes: HashTable<JsonMetadataClass> = {};
        private classProperties: HashTable<Array<JsonObjectProperty>> = {};
        public addClass(name: string, propertiesNames: Array<string>, creator: () => any = null, parentName: string = null): JsonMetadataClass {
            var metaDataClass = new JsonMetadataClass(name, propertiesNames, creator, parentName);
            this.classes[name] = metaDataClass;
            return metaDataClass;
        }
        public setonGetValue(name: string, propertyName: string, onGetValue: (obj: any) => any) {
            var property = this.findProperty(name, propertyName);
            if (!property) return;
            property.onGetValue = onGetValue;
        }
        public setCreator(name: string, creator: () => any) {
            var metaDataClass = this.classes[name];
            if (!metaDataClass) return;
            metaDataClass.creator = creator;
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
            var metaDataClass = this.classes[name];
            if (!metaDataClass) return null;
            return metaDataClass.creator();
        }
        private findProperty(name: string, propertyName: string): JsonObjectProperty {
            var metaDataClass = this.classes[name];
            return metaDataClass ? metaDataClass.find(propertyName) : null;
        }
        private fillProperties(name: string, list: Array<JsonObjectProperty>) {
            var metaDataClass = this.classes[name];
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
    }
    export class JsonObject {
        private static metaDataValue = new JsonMetadata();
        public static get metaData() { return JsonObject.metaDataValue; }
        public toJsonObject(obj: any): any {
            if (!obj.getType) return obj;
            var result = {};
            var properties = JsonObject.metaData.getProperties(obj.getType());
            for (var i: number = 0; i < properties.length; i++) {
                this.valueToJson(obj, result, properties[i]);
            }
            return result;
        }
        public toObject(jsonObj: any, obj: any) {
            if (!jsonObj) return;
            for (var key in jsonObj) {
                this.valueToObj(jsonObj[key], obj, key);
            }
        }
        protected valueToJson(obj: any, result: any, property: JsonObjectProperty) {
            var value = null;
            if (property.hasToUseGetValue) {
                value = property.getValue(obj);
            } else {
                value = obj[property.name];
            }
            if (!value) return;
            if (this.isValueArray(value)) {
                var arrValue = [];
                for (var i = 0; i < value.length; i++) {
                    arrValue.push(this.toJsonObject(value[i]));
                }
                value = arrValue.length > 0 ? arrValue : null;
            } else {
                value = this.toJsonObject(value);
            }
            if (value) {
                result[property.name] = value;
            }
        }
        protected valueToObj(value: any, obj: any, key: any) {
            if (this.isValueArray(value)) {
                this.valueToArray(value, obj, key);
            } else {
                var newObj = this.createNewObj(value);
                if (newObj) {
                    obj[key] = newObj;
                    this.toObject(value, newObj);
                } else {
                    obj[key] = value;
                }
            }
        }
        isValueArray(value: any): boolean { return value.constructor.toString().indexOf("Array") > -1; }
        createNewObj(value: any): any {
            //TODO remove 'type' make it constant or deal wiht it somehow.
            var className = value['type'];
            if (!className) return null;
            delete value['type'];
            return JsonObject.metaData.createClass(className);
        }
        valueToArray(value: Array<any>, obj: any, key: any) {
            var arrValue = [];
            for (var i = 0; i < value.length; i++) {
                var newValue = this.createNewObj(value[i]);
                if (newValue) {
                    this.toObject(value[i], newValue);
                } else {
                    newValue = value[i];
                }
                arrValue.push(newValue);
            }
            obj[key] = arrValue;
        } 
    }
}
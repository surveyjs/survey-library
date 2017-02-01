// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

export declare class JsonObjectProperty {
    name: string;
    private typeValue;
    private choicesValue;
    private choicesfunc;
    className: string;
    classNamePart: string;
    baseClassName: string;
    defaultValue: any;
    onGetValue: (obj: any) => any;
    onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;
    constructor(name: string);
    type: string;
    hasToUseGetValue: (obj: any) => any;
    isDefaultValue(value: any): boolean;
    getValue(obj: any): any;
    hasToUseSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;
    setValue(obj: any, value: any, jsonConv: JsonObject): void;
    getObjType(objType: string): string;
    getClassName(className: string): string;
    choices: Array<any>;
    setChoices(value: Array<any>, valueFunc: () => Array<any>): void;
}
export declare class JsonMetadataClass {
    name: string;
    creator: () => any;
    parentName: string;
    static requiredSymbol: string;
    static typeSymbol: string;
    properties: Array<JsonObjectProperty>;
    requiredProperties: Array<string>;
    constructor(name: string, properties: Array<any>, creator?: () => any, parentName?: string);
    find(name: string): JsonObjectProperty;
    createProperty(propInfo: any): JsonObjectProperty;
    private getPropertyName(propertyName);
    private makePropertyRequired(propertyName);
}
export declare class JsonMetadata {
    private classes;
    private childrenClasses;
    private classProperties;
    private classRequiredProperties;
    addClass(name: string, properties: Array<any>, creator?: () => any, parentName?: string): JsonMetadataClass;
    overrideClassCreatore(name: string, creator: () => any): void;
    getProperties(name: string): Array<JsonObjectProperty>;
    createClass(name: string): any;
    getChildrenClasses(name: string, canBeCreated?: boolean): Array<JsonMetadataClass>;
    getRequiredProperties(name: string): Array<string>;
    addProperty(className: string, propertyInfo: any): void;
    removeProperty(className: string, propertyName: string): boolean;
    private addPropertyToClass(metaDataClass, property);
    private removePropertyFromClass(metaDataClass, property);
    private emptyClassPropertiesHash(metaDataClass);
    private fillChildrenClasses(name, canBeCreated, result);
    findClass(name: string): JsonMetadataClass;
    private fillProperties(name, list);
    private addPropertyCore(property, list, endIndex);
    private fillRequiredProperties(name, list);
}
export declare class JsonError {
    type: string;
    message: string;
    description: string;
    at: Number;
    constructor(type: string, message: string);
    getFullDescription(): string;
}
export declare class JsonUnknownPropertyError extends JsonError {
    propertyName: string;
    className: string;
    constructor(propertyName: string, className: string);
}
export declare class JsonMissingTypeErrorBase extends JsonError {
    baseClassName: string;
    type: string;
    message: string;
    constructor(baseClassName: string, type: string, message: string);
}
export declare class JsonMissingTypeError extends JsonMissingTypeErrorBase {
    propertyName: string;
    baseClassName: string;
    constructor(propertyName: string, baseClassName: string);
}
export declare class JsonIncorrectTypeError extends JsonMissingTypeErrorBase {
    propertyName: string;
    baseClassName: string;
    constructor(propertyName: string, baseClassName: string);
}
export declare class JsonRequiredPropertyError extends JsonError {
    propertyName: string;
    className: string;
    constructor(propertyName: string, className: string);
}
export declare class JsonObject {
    private static typePropertyName;
    private static positionPropertyName;
    private static metaDataValue;
    static metaData: JsonMetadata;
    errors: JsonError[];
    toJsonObject(obj: any): any;
    toObject(jsonObj: any, obj: any): void;
    protected toJsonObjectCore(obj: any, property: JsonObjectProperty): any;
    protected valueToJson(obj: any, result: any, property: JsonObjectProperty): void;
    protected valueToObj(value: any, obj: any, key: any, property: JsonObjectProperty): void;
    private isValueArray(value);
    private createNewObj(value, property);
    private checkNewObjectOnErrors(newObj, value, property, className);
    private addNewError(error, jsonObj);
    private valueToArray(value, obj, key, property);
    private findProperty(properties, key);
}

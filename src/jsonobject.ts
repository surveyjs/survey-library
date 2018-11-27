import { Helpers, HashTable } from "./helpers";

export interface IObject {
  [key: string]: any;
}

export class JsonObjectProperty implements IObject {
  public static getItemValuesDefaultValue: (val: any) => any;
  [key: string]: any;
  private static mergableValues = [
    "typeValue",
    "choicesValue",
    "readOnlyValue",
    "visibleValue",
    "isSerializable",
    "isDynamicChoices",
    "isLocalizableValue",
    "className",
    "alternativeName",
    "classNamePart",
    "baseClassName",
    "defaultValue",
    "serializationProperty",
    "onGetValue",
    "onSetValue"
  ];
  private typeValue: string = null;
  private choicesValue: Array<any> = null;
  private isRequiredValue: boolean = false;
  private readOnlyValue: boolean | null = null;
  private visibleValue: boolean | null = null;
  private isLocalizableValue: boolean | null = null;
  private choicesfunc: (obj: any) => Array<any> = null;
  public isSerializable: boolean = true;
  public isDynamicChoices: boolean = false;
  public className: string = null;
  public alternativeName: string = null;
  public classNamePart: string = null;
  public baseClassName: string = null;
  public defaultValueValue: any = null;
  public serializationProperty: string = null;
  public onGetValue: (obj: any) => any = null;
  public onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any = null;

  constructor(public name: string, isRequired: boolean = false) {
    this.isRequiredValue = isRequired;
  }
  public get type(): string {
    return this.typeValue ? this.typeValue : "string";
  }
  public set type(value: string) {
    if (value === "itemvalues") value = "itemvalue[]";
    this.typeValue = value;
    if (this.typeValue.indexOf("[]") === this.typeValue.length - 2) {
      this.isArray = true;
      this.className = this.typeValue.substr(0, this.typeValue.length - 2);
    }
  }
  public isArray = false;
  public get isRequired() {
    return this.isRequiredValue;
  }
  public set isRequired(val: boolean) {
    this.isRequiredValue = val;
  }
  public get hasToUseGetValue() {
    return this.onGetValue || this.serializationProperty;
  }
  public get defaultValue() {
    var result: any = this.defaultValueValue;
    if (
      !!JsonObjectProperty.getItemValuesDefaultValue &&
      JsonObject.metaData.isDescendantOf(this.className, "itemvalue")
    ) {
      result = JsonObjectProperty.getItemValuesDefaultValue(
        this.defaultValueValue || []
      );
    }
    return result;
  }
  public set defaultValue(newValue) {
    this.defaultValueValue = newValue;
  }
  public isDefaultValue(value: any): boolean {
    if (!Helpers.isValueEmpty(this.defaultValue))
      return this.defaultValue == value;
    return (
      (value === false && this.type == "boolean") ||
      value === "" ||
      Helpers.isValueEmpty(value)
    );
  }
  public getValue(obj: any): any {
    if (this.onGetValue) return this.onGetValue(obj);
    if (this.serializationProperty)
      return obj[this.serializationProperty].getJson();
    return obj[this.name];
  }
  public getPropertyValue(obj: any): any {
    if (this.isLocalizable) return obj[this.serializationProperty].text;
    return this.getValue(obj);
  }
  public get hasToUseSetValue() {
    return this.onSetValue || this.serializationProperty;
  }
  public setValue(obj: any, value: any, jsonConv: JsonObject) {
    if (this.onSetValue) {
      this.onSetValue(obj, value, jsonConv);
    } else {
      if (this.serializationProperty)
        obj[this.serializationProperty].setJson(value);
      else {
        if (value && typeof value === "string") {
          if (this.type == "number") {
            value = parseInt(value);
          }
          if (this.type == "boolean") {
            value = value.toLowerCase() === "true";
          }
        }
        obj[this.name] = value;
      }
    }
  }
  public getObjType(objType: string) {
    if (!this.classNamePart) return objType;
    return objType.replace(this.classNamePart, "");
  }
  public getClassName(className: string): string {
    if (className) className = className.toLowerCase();
    return this.classNamePart && className.indexOf(this.classNamePart) < 0
      ? className + this.classNamePart
      : className;
  }
  public get choices(): Array<any> {
    return this.getChoices(null);
  }
  public getChoices(obj: any): Array<any> {
    if (this.choicesValue != null) return this.choicesValue;
    if (this.choicesfunc != null) return this.choicesfunc(obj);
    return null;
  }
  public setChoices(value: Array<any>, valueFunc: () => Array<any>) {
    this.choicesValue = value;
    this.choicesfunc = valueFunc;
  }
  public get readOnly(): boolean {
    return this.readOnlyValue != null ? this.readOnlyValue : false;
  }
  public set readOnly(val: boolean) {
    this.readOnlyValue = val;
  }
  public get visible(): boolean {
    return this.visibleValue != null ? this.visibleValue : true;
  }
  public set visible(val: boolean) {
    this.visibleValue = val;
  }
  public get isLocalizable(): boolean {
    return this.isLocalizableValue != null ? this.isLocalizableValue : false;
  }
  public set isLocalizable(val: boolean) {
    this.isLocalizableValue = val;
  }
  public mergeWith(prop: JsonObjectProperty) {
    var valuesNames = JsonObjectProperty.mergableValues;
    for (var i = 0; i < valuesNames.length; i++) {
      this.mergeValue(prop, valuesNames[i]);
    }
  }
  private mergeValue(prop: JsonObjectProperty, valueName: string) {
    if (this[valueName] == null && prop[valueName] != null) {
      this[valueName] = prop[valueName];
    }
  }
}
export class CustomPropertiesCollection {
  private static properties: IObject = {};
  private static parentClasses: { [key: string]: string } = {};
  public static addProperty(className: string, property: any) {
    className = className.toLowerCase();
    var props = CustomPropertiesCollection.properties;
    if (!props[className]) {
      props[className] = [];
    }
    props[className].push(property);
  }
  public static removeProperty(className: string, propertyName: string) {
    className = className.toLowerCase();
    var props = CustomPropertiesCollection.properties;
    if (!props[className]) return;
    var properties = props[className];
    for (var i = 0; i < properties.length; i++) {
      if (properties[i].name == propertyName) {
        props[className].splice(i, 1);
        break;
      }
    }
  }
  public static addClass(className: string, parentClassName: string) {
    className = className.toLowerCase();
    if (parentClassName) {
      parentClassName = parentClassName.toLowerCase();
    }
    CustomPropertiesCollection.parentClasses[className] = parentClassName;
  }
  public static getProperties(className: string): Array<any> {
    className = className.toLowerCase();
    var res = [];
    var props = CustomPropertiesCollection.properties;
    while (className) {
      var properties = props[className];
      if (properties) {
        for (var i = 0; i < properties.length; i++) {
          res.push(properties[i]);
        }
      }
      className = CustomPropertiesCollection.parentClasses[className];
    }
    return res;
  }
  public static createProperties(obj: any) {
    if (!obj || !obj.getType) return;
    CustomPropertiesCollection.createPropertiesCore(obj, obj.getType());
  }
  private static createPropertiesCore(obj: any, className: string) {
    var props = CustomPropertiesCollection.properties;
    if (props[className]) {
      CustomPropertiesCollection.createPropertiesInObj(obj, props[className]);
    }
    var parentClass = CustomPropertiesCollection.parentClasses[className];
    if (parentClass) {
      CustomPropertiesCollection.createPropertiesCore(obj, parentClass);
    }
  }
  private static createPropertiesInObj(obj: any, properties: any[]) {
    for (var i = 0; i < properties.length; i++) {
      CustomPropertiesCollection.createPropertyInObj(obj, properties[i]);
    }
  }
  private static createPropertyInObj(obj: any, prop: JsonObjectProperty) {
    if (obj[prop.name] || obj.hasOwnProperty(prop.name)) return;
    if (
      prop.isLocalizable &&
      prop.serializationProperty &&
      !obj[prop.serializationProperty] &&
      obj.createCustomLocalizableObj
    ) {
      obj.createCustomLocalizableObj(prop.name);
      var locDesc = {
        get: function() {
          return obj.getLocalizableString(prop.name);
        }
      };
      Object.defineProperty(obj, prop.serializationProperty, locDesc);
      var desc = {
        get: function() {
          return obj.getLocalizableStringText(prop.name, prop.defaultValue);
        },
        set: function(v: any) {
          obj.setLocalizableStringText(prop.name, v);
        }
      };
      Object.defineProperty(obj, prop.name, desc);
    } else {
      var defaultValue = prop.defaultValue;
      if (
        JsonObject.metaData.isDescendantOf(prop.className, "itemvalue") &&
        typeof obj.createNewArray === "function"
      ) {
        obj.createNewArray(prop.name, function(item: any) {
          item.locOwner = obj;
        });
        obj.setPropertyValue(prop.name, defaultValue);
        defaultValue = null;
      }
      if (!!obj.getPropertyValue && !!obj.setPropertyValue) {
        var desc = {
          get: () => {
            return obj.getPropertyValue(prop.name, defaultValue);
          },
          set: function(v: any) {
            obj.setPropertyValue(prop.name, v);
          }
        };
        Object.defineProperty(obj, prop.name, desc);
      }
    }
  }
}

export class JsonMetadataClass {
  static requiredSymbol = "!";
  static typeSymbol = ":";
  properties: Array<JsonObjectProperty> = null;
  constructor(
    public name: string,
    properties: Array<any>,
    public creator: (json?: any) => any = null,
    public parentName: string = null
  ) {
    name = name.toLowerCase();
    if (parentName) {
      parentName = parentName.toLowerCase();
      CustomPropertiesCollection.addClass(name, parentName);
    }
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
    var isRequired = this.getIsPropertyNameRequired(propertyName);
    propertyName = this.getPropertyName(propertyName);
    var prop = new JsonObjectProperty(propertyName, isRequired);
    if (propertyType) {
      prop.type = propertyType;
    }
    if (typeof propInfo === "object") {
      if (propInfo.type) {
        prop.type = propInfo.type;
      }
      if (!Helpers.isValueEmpty(propInfo.default)) {
        prop.defaultValue = propInfo.default;
      }
      if (!Helpers.isValueEmpty(propInfo.isSerializable)) {
        prop.isSerializable = propInfo.isSerializable;
      }
      if (!Helpers.isValueEmpty(propInfo.isDynamicChoices)) {
        prop.isDynamicChoices = propInfo.isDynamicChoices;
      }
      if (propInfo.visible === false) {
        prop.visible = false;
      }
      if (propInfo.choices) {
        var choicesFunc =
          typeof propInfo.choices === "function" ? propInfo.choices : null;
        var choicesValue =
          typeof propInfo.choices !== "function" ? propInfo.choices : null;
        prop.setChoices(choicesValue, choicesFunc);
      }
      if (propInfo.onGetValue) {
        prop.onGetValue = propInfo.onGetValue;
      }
      if (propInfo.onSetValue) {
        prop.onSetValue = propInfo.onSetValue;
      }
      if (propInfo.isLocalizable) {
        propInfo.serializationProperty = "loc" + propInfo.name;
      }
      if (propInfo.serializationProperty) {
        prop.serializationProperty = propInfo.serializationProperty;
        var s: string;
        if (
          prop.serializationProperty &&
          prop.serializationProperty.indexOf("loc") == 0
        ) {
          prop.isLocalizable = true;
        }
      }
      if (propInfo.isLocalizable) {
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
      if (propInfo.alternativeName) {
        prop.alternativeName = propInfo.alternativeName;
      }
    }
    return prop;
  }
  private getIsPropertyNameRequired(propertyName: string): boolean {
    return (
      propertyName.length > 0 &&
      propertyName[0] == JsonMetadataClass.requiredSymbol
    );
  }
  private getPropertyName(propertyName: string): string {
    if (!this.getIsPropertyNameRequired(propertyName)) return propertyName;
    propertyName = propertyName.slice(1);
    return propertyName;
  }
}
export class JsonMetadata {
  private classes: HashTable<JsonMetadataClass> = {};
  private alternativeNames: HashTable<string> = {};
  private childrenClasses: HashTable<Array<JsonMetadataClass>> = {};
  private classProperties: HashTable<Array<JsonObjectProperty>> = {};
  public addClass(
    name: string,
    properties: Array<any>,
    creator: (json?: any) => any = null,
    parentName: string = null
  ): JsonMetadataClass {
    name = name.toLowerCase();
    var metaDataClass = new JsonMetadataClass(
      name,
      properties,
      creator,
      parentName
    );
    this.classes[name] = metaDataClass;
    if (parentName) {
      parentName = parentName.toLowerCase();
      var children = this.childrenClasses[parentName];
      if (!children) {
        this.childrenClasses[parentName] = [];
      }
      this.childrenClasses[parentName].push(metaDataClass);
    }
    return metaDataClass;
  }
  public overrideClassCreatore(name: string, creator: () => any) {
    name = name.toLowerCase();
    var metaDataClass = this.findClass(name);
    if (metaDataClass) {
      metaDataClass.creator = creator;
    }
  }
  public getProperties(className: string): Array<JsonObjectProperty> {
    var metaClass = this.findClass(className);
    if (!metaClass) return [];
    var properties = this.classProperties[metaClass.name];
    if (!properties) {
      properties = new Array<JsonObjectProperty>();
      this.fillProperties(metaClass.name, properties);
      this.classProperties[metaClass.name] = properties;
    }
    return properties;
  }
  private getDynamicProperties(obj: any): Array<JsonObjectProperty> {
    if (obj.getDynamicProperties && obj.getDynamicType) {
      var names = obj.getDynamicProperties();
      return JsonObject.metaData.findProperties(obj.getDynamicType(), names);
    }
    return [];
  }
  public getPropertiesByObj(obj: any): Array<JsonObjectProperty> {
    if (!obj || !obj.getType) return [];
    var res = [];
    var props = this.getProperties(obj.getType());
    for (var i = 0; i < props.length; i++) {
      res.push(props[i]);
    }
    var dynamicProps = this.getDynamicProperties(obj);
    if (dynamicProps && dynamicProps.length > 0) {
      for (var i = 0; i < dynamicProps.length; i++) {
        res.push(dynamicProps[i]);
      }
    }
    return res;
  }

  public findProperty(
    className: string,
    propertyName: string
  ): JsonObjectProperty {
    className = className.toLowerCase();
    return this.findPropertyCore(this.getProperties(className), propertyName);
  }
  public findProperties(
    className: string,
    propertyNames: Array<string>
  ): Array<JsonObjectProperty> {
    className = className.toLowerCase();
    var result = [];
    var properties = this.getProperties(className);
    for (var i = 0; i < propertyNames.length; i++) {
      var prop = this.findPropertyCore(properties, propertyNames[i]);
      if (prop) {
        result.push(prop);
      }
    }
    return result;
  }
  private findPropertyCore(
    properties: Array<JsonObjectProperty>,
    propertyName: string
  ): JsonObjectProperty {
    for (var i = 0; i < properties.length; i++) {
      if (properties[i].name == propertyName) return properties[i];
    }
    return null;
  }
  public createClass(name: string, json: any = undefined): any {
    name = name.toLowerCase();
    var metaDataClass = this.findClass(name);
    if (!metaDataClass) return null;
    if (metaDataClass.creator) return metaDataClass.creator(json);
    var parentName = metaDataClass.parentName;
    while (parentName) {
      metaDataClass = this.findClass(parentName);
      if (!metaDataClass) return null;
      parentName = metaDataClass.parentName;
      if (metaDataClass.creator)
        return this.createCustomType(name, metaDataClass.creator, json);
    }
    return null;
  }
  private createCustomType(
    name: string,
    creator: any,
    json: any = undefined
  ): any {
    name = name.toLowerCase();
    var res = creator(json);
    var customTypeName = name;
    var customTemplateName = res.getTemplate
      ? res.getTemplate()
      : res.getType();
    res.getType = function() {
      return customTypeName;
    };
    res.getTemplate = function() {
      return customTemplateName;
    };
    CustomPropertiesCollection.createProperties(res);
    return res;
  }
  public getChildrenClasses(
    name: string,
    canBeCreated: boolean = false
  ): Array<JsonMetadataClass> {
    name = name.toLowerCase();
    var result: Array<JsonMetadataClass> = [];
    this.fillChildrenClasses(name, canBeCreated, result);
    return result;
  }
  public getRequiredProperties(name: string): Array<string> {
    var properties = this.getProperties(name);
    var res = [];
    for (var i = 0; i < properties.length; i++) {
      if (properties[i].isRequired) {
        res.push(properties[i].name);
      }
    }
    return res;
  }
  public addProperties(className: string, propertiesInfos: Array<any>) {
    className = className.toLowerCase();
    var metaDataClass = this.findClass(className);
    for (var i = 0; i < propertiesInfos.length; i++) {
      this.addCustomPropertyCore(metaDataClass, propertiesInfos[i]);
    }
  }
  public addProperty(className: string, propertyInfo: any) {
    this.addCustomPropertyCore(this.findClass(className), propertyInfo);
  }
  private addCustomPropertyCore(
    metaDataClass: JsonMetadataClass,
    propertyInfo: any
  ) {
    if (!metaDataClass) return;
    var property = metaDataClass.createProperty(propertyInfo);
    if (property) {
      this.addPropertyToClass(metaDataClass, property);
      this.emptyClassPropertiesHash(metaDataClass);
      CustomPropertiesCollection.addProperty(metaDataClass.name, property);
    }
  }
  public removeProperty(className: string, propertyName: string) {
    var metaDataClass = this.findClass(className);
    if (!metaDataClass) return false;
    var property = metaDataClass.find(propertyName);
    if (property) {
      this.removePropertyFromClass(metaDataClass, property);
      this.emptyClassPropertiesHash(metaDataClass);
      CustomPropertiesCollection.removeProperty(
        metaDataClass.name,
        propertyName
      );
    }
  }
  private addPropertyToClass(
    metaDataClass: JsonMetadataClass,
    property: JsonObjectProperty
  ) {
    if (metaDataClass.find(property.name) != null) return;
    metaDataClass.properties.push(property);
  }
  private removePropertyFromClass(
    metaDataClass: JsonMetadataClass,
    property: JsonObjectProperty
  ) {
    var index = metaDataClass.properties.indexOf(property);
    if (index < 0) return;
    metaDataClass.properties.splice(index, 1);
  }
  private emptyClassPropertiesHash(metaDataClass: JsonMetadataClass) {
    this.classProperties[metaDataClass.name] = null;
    var childClasses = this.getChildrenClasses(metaDataClass.name);
    for (var i = 0; i < childClasses.length; i++) {
      this.classProperties[childClasses[i].name] = null;
    }
  }
  private fillChildrenClasses(
    name: string,
    canBeCreated: boolean,
    result: Array<JsonMetadataClass>
  ) {
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
    name = name.toLowerCase();
    var res = this.classes[name];
    if (!res) {
      var newName = this.alternativeNames[name];
      if (!!newName && newName != name) return this.findClass(newName);
    }
    return res;
  }
  public isDescendantOf(className: string, ancestorClassName: string) {
    if (!className || !ancestorClassName) {
      return false;
    }
    className = className.toLowerCase();
    ancestorClassName = ancestorClassName.toLowerCase();
    var class_ = this.findClass(className);
    if (!class_) {
      return false;
    }
    var parentClass = class_;
    do {
      if (parentClass.name === ancestorClassName) {
        return true;
      }
      parentClass = this.classes[parentClass.parentName];
    } while (!!parentClass);
    return false;
  }
  public addAlterNativeClassName(name: string, alternativeName: string) {
    this.alternativeNames[alternativeName.toLowerCase()] = name.toLowerCase();
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
  private addPropertyCore(
    property: JsonObjectProperty,
    list: Array<JsonObjectProperty>,
    endIndex: number
  ) {
    var index = -1;
    for (var i = 0; i < endIndex; i++) {
      if (list[i].name == property.name) {
        index = i;
        break;
      }
    }
    if (index < 0) {
      list.push(property);
    } else {
      property.mergeWith(list[index]);
      list[index] = property;
    }
  }
}
export class JsonError {
  public description: string = "";
  public at: Number = -1;
  constructor(public type: string, public message: string) {}
  public getFullDescription(): string {
    return this.message + (this.description ? "\n" + this.description : "");
  }
}
export class JsonUnknownPropertyError extends JsonError {
  constructor(public propertyName: string, public className: string) {
    super(
      "unknownproperty",
      "The property '" +
        propertyName +
        "' in class '" +
        className +
        "' is unknown."
    );
    var properties = JsonObject.metaData.getProperties(className);
    if (properties) {
      this.description = "The list of available properties are: ";
      for (var i = 0; i < properties.length; i++) {
        if (i > 0) this.description += ", ";
        this.description += properties[i].name;
      }
      this.description += ".";
    }
  }
}
export class JsonMissingTypeErrorBase extends JsonError {
  constructor(
    public baseClassName: string,
    public type: string,
    public message: string
  ) {
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
    super(
      baseClassName,
      "missingtypeproperty",
      "The property type is missing in the object. Please take a look at property: '" +
        propertyName +
        "'."
    );
  }
}
export class JsonIncorrectTypeError extends JsonMissingTypeErrorBase {
  constructor(public propertyName: string, public baseClassName: string) {
    super(
      baseClassName,
      "incorrecttypeproperty",
      "The property type is incorrect in the object. Please take a look at property: '" +
        propertyName +
        "'."
    );
  }
}
export class JsonRequiredPropertyError extends JsonError {
  constructor(public propertyName: string, public className: string) {
    super(
      "requiredproperty",
      "The property '" +
        propertyName +
        "' is required in class '" +
        className +
        "'."
    );
  }
}

export class JsonObject {
  private static typePropertyName = "type";
  private static positionPropertyName = "pos";
  private static metaDataValue = new JsonMetadata();
  public static get metaData() {
    return JsonObject.metaDataValue;
  }
  public errors = new Array<JsonError>();
  public toJsonObject(obj: any, storeDefaults = false): any {
    return this.toJsonObjectCore(obj, null, storeDefaults);
  }
  public toObject(jsonObj: any, obj: any) {
    if (!jsonObj) return;
    var properties = null;
    var objType = undefined;
    var needAddErrors = true;
    if (obj.getType) {
      objType = obj.getType();
      properties = JsonObject.metaData.getProperties(objType);
      needAddErrors =
        !!objType && !JsonObject.metaData.isDescendantOf(objType, "itemvalue");
    }
    if (!properties) return;
    if (obj.startLoadingFromJson) {
      obj.startLoadingFromJson();
    }
    properties = this.addDynamicProperties(obj, jsonObj, properties);
    for (var key in jsonObj) {
      if (key === JsonObject.typePropertyName) continue;
      if (key === JsonObject.positionPropertyName) {
        obj[key] = jsonObj[key];
        continue;
      }
      var property = this.findProperty(properties, key);
      if (!property) {
        if (needAddErrors) {
          this.addNewError(
            new JsonUnknownPropertyError(key.toString(), objType),
            jsonObj
          );
        }
        continue;
      }
      this.valueToObj(jsonObj[key], obj, property);
    }
    if (obj.endLoadingFromJson) {
      obj.endLoadingFromJson();
    }
  }
  protected toJsonObjectCore(
    obj: any,
    property: JsonObjectProperty,
    storeDefaults = false
  ): any {
    if (!obj || !obj.getType) return obj;
    if (typeof obj.getData === "function") return obj.getData();
    var result = {};
    if (property != null && !property.className) {
      (<any>result)[JsonObject.typePropertyName] = property.getObjType(
        obj.getType()
      );
    }
    this.propertiesToJson(
      obj,
      JsonObject.metaData.getProperties(obj.getType()),
      result,
      storeDefaults
    );
    this.propertiesToJson(
      obj,
      this.getDynamicProperties(obj),
      result,
      storeDefaults
    );
    return result;
  }
  private getDynamicProperties(obj: any): Array<JsonObjectProperty> {
    if (obj.getDynamicProperties && obj.getDynamicType) {
      var names = obj.getDynamicProperties();
      return JsonObject.metaData.findProperties(obj.getDynamicType(), names);
    }
    return [];
  }
  private addDynamicProperties(
    obj: any,
    jsonObj: any,
    properties: Array<JsonObjectProperty>
  ): Array<JsonObjectProperty> {
    if (!obj.getDynamicPropertyName) return properties;
    var dynamicPropName = obj.getDynamicPropertyName();
    if (!dynamicPropName) return properties;
    if (jsonObj[dynamicPropName]) {
      obj[dynamicPropName] = jsonObj[dynamicPropName];
    }
    var dynamicProperties = this.getDynamicProperties(obj);
    var res = [];
    for (var i = 0; i < properties.length; i++) {
      res.push(properties[i]);
    }
    for (var i = 0; i < dynamicProperties.length; i++) {
      res.push(dynamicProperties[i]);
    }
    return res;
  }
  private propertiesToJson(
    obj: any,
    properties: Array<JsonObjectProperty>,
    json: any,
    storeDefaults = false
  ) {
    for (var i: number = 0; i < properties.length; i++) {
      this.valueToJson(obj, json, properties[i], storeDefaults);
    }
  }
  public valueToJson(
    obj: any,
    result: any,
    property: JsonObjectProperty,
    storeDefaults = false
  ) {
    if (property.isSerializable === false) return;
    var value = property.getValue(obj);
    if (!storeDefaults && property.isDefaultValue(value)) return;
    if (this.isValueArray(value)) {
      var arrValue = [];
      for (var i = 0; i < value.length; i++) {
        arrValue.push(this.toJsonObjectCore(value[i], property, storeDefaults));
      }
      value = arrValue.length > 0 ? arrValue : null;
    } else {
      value = this.toJsonObjectCore(value, property, storeDefaults);
    }
    var hasValue =
      typeof obj["getPropertyValue"] === "function" &&
      obj["getPropertyValue"](property.name, null) !== null;
    if ((storeDefaults && hasValue) || !property.isDefaultValue(value)) {
      result[property.name] = value;
    }
  }
  protected valueToObj(value: any, obj: any, property: JsonObjectProperty) {
    if (value == null) return;
    this.removePos(property, value);
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
      if (property != null) {
        property.setValue(obj, value, this);
      } else {
        obj[property.name] = value;
      }
    }
  }
  private removePos(property: JsonObjectProperty, value: any) {
    if (!property || !property.type || property.type.indexOf("value") < 0)
      return;
    this.removePosFromObj(value);
  }
  private removePosFromObj(obj: any) {
    if (!obj) return;
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        this.removePosFromObj(obj[i]);
      }
    }
    if (!!obj[JsonObject.positionPropertyName]) {
      delete obj[JsonObject.positionPropertyName];
    }
  }
  private isValueArray(value: any): boolean {
    return value && Array.isArray(value);
  }
  private createNewObj(value: any, property: JsonObjectProperty): any {
    var result: any = { newObj: null, error: null };
    var className = value[JsonObject.typePropertyName];
    if (!className && property != null && property.className) {
      className = property.className;
    }
    className = property.getClassName(className);
    result.newObj = className
      ? JsonObject.metaData.createClass(className, value)
      : null;
    result.error = this.checkNewObjectOnErrors(
      result.newObj,
      value,
      property,
      className
    );
    return result;
  }
  private checkNewObjectOnErrors(
    newObj: any,
    value: any,
    property: JsonObjectProperty,
    className: string
  ): JsonError {
    var error = null;
    if (newObj) {
      var requiredProperties = JsonObject.metaData.getRequiredProperties(
        className
      );
      if (requiredProperties) {
        for (var i = 0; i < requiredProperties.length; i++) {
          if (!value[requiredProperties[i]]) {
            error = new JsonRequiredPropertyError(
              requiredProperties[i],
              className
            );
            break;
          }
        }
      }
    } else {
      if (property.baseClassName) {
        if (!className) {
          error = new JsonMissingTypeError(
            property.name,
            property.baseClassName
          );
        } else {
          error = new JsonIncorrectTypeError(
            property.name,
            property.baseClassName
          );
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
  private valueToArray(
    value: Array<any>,
    obj: any,
    key: any,
    property: JsonObjectProperty
  ) {
    if (obj[key] && value.length > 0) obj[key].splice(0, obj[key].length);
    if (!obj[key]) obj[key] = [];
    for (var i = 0; i < value.length; i++) {
      var newValue = this.createNewObj(value[i], property);
      if (newValue.newObj) {
        if (!!value[i].name) {
          newValue.newObj.name = value[i].name;
        }
        obj[key].push(newValue.newObj);
        this.toObject(value[i], newValue.newObj);
      } else {
        if (!newValue.error) {
          obj[key].push(value[i]);
        }
      }
    }
  }
  private findProperty(
    properties: Array<JsonObjectProperty>,
    key: any
  ): JsonObjectProperty {
    if (!properties) return null;
    for (var i = 0; i < properties.length; i++) {
      var prop = properties[i];
      if (prop.name == key || prop.alternativeName == key) return prop;
    }
    return null;
  }
}

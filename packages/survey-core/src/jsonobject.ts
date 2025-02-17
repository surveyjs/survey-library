import { getLocaleString } from "./surveyStrings";
import { Base, ComputedUpdater } from "./base";
import { Helpers, HashTable } from "./helpers";
import { ILoadFromJSONOptions, ISaveToJSONOptions } from "./base-interfaces";

export interface IPropertyDecoratorOptions<T = any> {
  defaultValue?: T;
  defaultSource?: string;
  getDefaultValue?: (objectInstance?: any) => T;
  localizable?:
  | { name?: string, onGetTextCallback?: (str: string) => string, defaultStr?: string }
  | boolean;
  onSet?: (val: T, objectInstance: any, prevVal?: T) => void;
}

function ensureLocString(
  target: any,
  options: IPropertyDecoratorOptions,
  key: string
) {
  let locString = target.getLocalizableString(key);
  if (!locString) {
    let defaultStr: string;
    if (typeof options.localizable === "object" && options.localizable.defaultStr) {
      defaultStr = options.localizable.defaultStr;
    }
    locString = target.createLocalizableString(key, target, true, defaultStr);
    if (
      typeof options.localizable === "object" &&
      typeof options.localizable.onGetTextCallback === "function"
    ) {
      locString.onGetTextCallback = options.localizable.onGetTextCallback;
    }
  }
}
function getLocStringValue(
  target: any,
  options: IPropertyDecoratorOptions,
  key: string
) {
  ensureLocString(target, options, key);
  let res = target.getLocalizableStringText(key);
  if (!!res) return res;
  if (typeof options.localizable === "object" && options.localizable.defaultStr) {
    const loc = !!target.getLocale ? target.getLocale() : "";
    return getLocaleString(options.localizable.defaultStr, loc);
  }
  return "";
}

export function property(options: IPropertyDecoratorOptions = {}) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function (target: any, key: string): void {
    let processComputedUpdater = (obj: any, val: any) => {
      if (!!val && typeof val === "object" && val.type === ComputedUpdater.ComputedUpdaterType) {
        Base.startCollectDependencies(() => obj[key] = val.updater(), obj, key);
        const result = val.updater();
        const dependencies = Base.finishCollectDependencies();
        val.setDependencies(dependencies);
        if (obj.dependencies[key]) {
          obj.dependencies[key].dispose();
        }
        obj.dependencies[key] = val;
        return result;
      }
      return val;
    };
    if (!options || !options.localizable) {
      Object.defineProperty(target, key, {
        get: function () {
          // const serializationProperty = Serializer.getProperty(target.getType(), key);
          // if(!!serializationProperty && options.defaultValue !== undefined) {
          //   ConsoleWarnings.error("remove defaultValue from @property for class " + target.getType() + " property name is " + key);
          // }
          let defaultVal = null;
          if (!!options) {
            if (typeof options.getDefaultValue === "function") {
              defaultVal = options.getDefaultValue(this);
            }
            if (options.defaultValue !== undefined) {
              defaultVal = options.defaultValue;
            }
          }
          return this.getPropertyValue(key, defaultVal);
        },
        set: function (val: any) {
          const newValue = processComputedUpdater(this, val);
          const prevValue = this.getPropertyValue(key);
          if(newValue !== prevValue) {
            this.setPropertyValue(key, newValue);
            if (!!options && options.onSet) {
              options.onSet(newValue, this, prevValue);
            }
          }
        },
      });
    } else {
      Object.defineProperty(target, key, {
        get: function () {
          return getLocStringValue(this, options, key);
        },
        set: function (val: any) {
          ensureLocString(this, options, key);
          const newValue = processComputedUpdater(this, val);
          this.setLocalizableStringText(key, newValue);
          if (!!options && options.onSet) {
            options.onSet(newValue, this);
          }
        },
      });
      Object.defineProperty(
        target,
        typeof options.localizable === "object" && !!options.localizable.name ?
          options.localizable.name : "loc" + key.charAt(0).toUpperCase() + key.slice(1),
        {
          get: function () {
            ensureLocString(this, options, key);
            return this.getLocalizableString(key);
          },
        }
      );
    }
  };
}

export interface IArrayPropertyDecoratorOptions {
  onPush?: any;
  onRemove?: any;
  onSet?: (val: any, target: any) => void;
}

function ensureArray(
  target: any,
  options: IArrayPropertyDecoratorOptions,
  key: string
) {
  target.ensureArray(
    key,
    (item: any, index: number) => {
      const handler = !!options ? options.onPush : null;
      handler && handler(item, index, target);
    },
    (item: any, index: number) => {
      const handler = !!options ? options.onRemove : null;
      handler && handler(item, index, target);
    },
  );
}

export function propertyArray(options?: IArrayPropertyDecoratorOptions) {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      get: function () {
        ensureArray(this, options, key);
        return this.getPropertyValue(key);
      },
      set: function (val: any) {
        ensureArray(this, options, key);
        const arr = this.getPropertyValue(key);
        if (val === arr) {
          return;
        }
        if (arr) {
          arr.splice(0, arr.length, ...(val || []));
        } else {
          this.setPropertyValue(key, val);
        }
        if (!!options && options.onSet) {
          options.onSet(val, this);
        }
      },
    });
  };
}

export interface IObject {
  [key: string]: any;
}

export interface IJsonPropertyInfo {
  name: string;
  type?: string;
  className?: string;
  classNamePart?: string;
  baseClassName?: string;
  isRequired?: boolean;
  isUnique?: boolean;
  //uniquePropertyName
  uniqueProperty?: string;
  choices?: any;
  visible?: boolean;
  alternativeName?: string;
  oldName?: string;
  version?: string;
  dataList?: Array<string>;
  isLocalizable?: boolean;
  isSerializable?: boolean;
  isSerializableFunc?: (obj: any) => boolean;
  isLightSerializable?: boolean;
  readOnly?: boolean;
  availableInMatrixColumn?: boolean;
  serializationProperty?: string;
  dependsOn?: Array<string> | string;

  isBindable?: boolean;
  isArray?: boolean;
  layout?: string;
  default?: any;
  defaultFunc?: (obj: Base) => any;
  baseValue?: any;
  onSerializeValue?: (obj: any) => any;
  onGetValue?: (obj: any) => any;
  onSettingValue?: (obj: any, value: any) => any;
  onSetValue?: (obj: any, value: any, jsonConv: JsonObject) => any;
  visibleIf?: (obj: any) => boolean;
  enableIf?: (obj: any) => boolean;
  onExecuteExpression?: (obj: any, res: any) => any;
  onPropertyEditorUpdate?: (obj: any, propEditor: any) => any;

  displayName?: string;
  category?: string;
  categoryIndex?: number;
  visibleIndex?: number;
  nextToProperty?: string;
  overridingProperty?: string;
  showMode?: string;
  locationInTable?: string;
  maxLength?: number;
  maxValue?: any;
  minValue?: any;
}
/**
 * Contains information about a property of a survey element (page, panel, questions, and etc).
 * @see addProperty
 * @see removeProperty
 * @see [Add Properties](https://surveyjs.io/Documentation/Survey-Creator#addproperties)
 * @see [Remove Properties](https://surveyjs.io/Documentation/Survey-Creator#removeproperties)
 */
export class JsonObjectProperty implements IObject, IJsonPropertyInfo {
  public static getItemValuesDefaultValue: (val: any, type: string) => any;
  [key: string]: any;
  private static Index = 1;
  private static mergableValues = [
    "typeValue",
    "choicesValue",
    "baseValue",
    "readOnlyValue",
    "visibleValue",
    "isSerializable",
    "isLightSerializable",
    "isCustom",
    "isBindable",
    "isUnique",
    "uniquePropertyName",
    "isDynamicChoices",
    "isLocalizableValue",
    "className",
    "alternativeName",
    "oldName",
    "layout",
    "version",
    "classNamePart",
    "baseClassName",
    "defaultValue",
    "defaultValueFunc",
    "serializationProperty",
    "onGetValue",
    "onSetValue",
    "onSettingValue",
    "displayName",
    "category",
    "categoryIndex",
    "visibleIndex",
    "nextToProperty",
    "overridingProperty",
    "locationInTable",
    "dependedProperties",
    "visibleIf",
    "enableIf",
    "onExecuteExpression",
    "onPropertyEditorUpdate",
    "maxLength",
    "maxValue",
    "minValue",
    "dataListValue",
  ];
  private idValue: number;
  private classInfoValue: JsonMetadataClass;
  private typeValue: string;
  private choicesValue: Array<any>;
  public baseValue: any;
  private isRequiredValue: boolean = false;
  private isUniqueValue: boolean = false;
  private uniquePropertyValue: string
  private readOnlyValue: boolean | null;
  private visibleValue: boolean | null;
  private isLocalizableValue: boolean | null;
  private choicesfunc: (obj: any, choicesCallback: any) => Array<any>;
  private dependedProperties: Array<string>;
  public isSerializable: boolean = true;
  public isSerializableFunc: (obj: any) => boolean;
  public isLightSerializable: boolean = true;
  public isCustom: boolean = false;
  public isDynamicChoices: boolean = false; //TODO obsolete, use dependsOn attribute
  public isBindable: boolean = false;
  public className: string;
  public alternativeName: string;
  public oldName: string;
  public classNamePart: string;
  public baseClassName: string;
  public defaultValueValue: any;
  public defaultValueFunc: (obj: Base) => any;
  public serializationProperty: string;
  public displayName: string;
  public category: string = "";
  public categoryIndex: number = -1;
  public visibleIndex: number = -1;
  public nextToProperty: string;
  public overridingProperty: string;
  public availableInMatrixColumn: boolean;
  public maxLength: number = -1;
  public maxValue: any;
  public minValue: any;
  private dataListValue: Array<string>;
  private locationInTableValue: string;
  public layout: string;
  public version: string;
  public onSerializeValue: (obj: any) => any;
  public onGetValue: (obj: any) => any;
  public onSettingValue: (obj: any, value: any) => any;
  public onSetValue: (obj: any, value: any, jsonConv: JsonObject) => any;
  public visibleIf: (obj: any) => boolean;
  public enableIf: (obj: any) => boolean;
  public onExecuteExpression: (obj: any, res: any) => any;
  public onPropertyEditorUpdate: (obj: any, propEditor: any) => any;

  constructor(
    classInfo: JsonMetadataClass,
    public name: string,
    isRequired: boolean = false
  ) {
    this.classInfoValue = classInfo;
    this.isRequiredValue = isRequired;
    this.idValue = JsonObjectProperty.Index++;
  }
  uniqueProperty?: string;
  dependsOn?: string | Array<string>;
  default?: any;
  defaultFunc?: (obj: Base) => any;
  public get id(): number {
    return this.idValue;
  }
  public get classInfo(): JsonMetadataClass {
    return this.classInfoValue;
  }
  public get type(): string {
    return this.typeValue ? this.typeValue : "string";
  }
  public set type(value: string) {
    if (value === "itemvalues") value = "itemvalue[]";
    if (value === "textitems") value = "textitem[]";
    this.typeValue = value;
    if (this.typeValue.indexOf("[]") === this.typeValue.length - 2) {
      this.isArray = true;
      this.className = this.typeValue.substring(0, this.typeValue.length - 2);
    }
  }
  public get locationInTable(): string {
    const res = this.locationInTableValue;
    return !!res ? res : "both";
  }
  public set locationInTable(val: string) {
    if(val === "both") val = undefined;
    this.locationInTableValue = val;
  }
  public get showMode(): string {
    const res = this.locationInTable;
    return res === "detail" ? "form" : (res === "column" ? "list" : "");
  }
  public set showMode(val: string) {
    this.locationInTable = val === "form" ? "detail" : (val === "list" ? "column" : undefined);
  }
  public isArray = false;
  public get isRequired(): boolean {
    return this.isRequiredValue;
  }
  public set isRequired(val: boolean) {
    if (val !== this.isRequired) {
      this.isRequiredValue = val;
      if (!!this.classInfo) {
        this.classInfo.resetAllProperties();
      }
    }
  }
  public get isUnique(): boolean {
    return this.isUniqueValue;
  }
  public set isUnique(val: boolean) {
    this.isUniqueValue = val;
  }
  public get uniquePropertyName(): string {
    return this.uniquePropertyValue;
  }
  public set uniquePropertyName(val: string) {
    this.uniquePropertyValue = val;
  }
  public isPropertySerializable(obj: any): boolean {
    if(this.isSerializableFunc) return this.isSerializableFunc(obj);
    return this.isSerializable;
  }
  public getDefaultValue(obj: Base): any {
    let result: any = !!this.defaultValueFunc ? this.defaultValueFunc(obj) : this.defaultValueValue;
    if (
      !!JsonObjectProperty.getItemValuesDefaultValue &&
      Serializer.isDescendantOf(this.className, "itemvalue")
    ) {
      result = JsonObjectProperty.getItemValuesDefaultValue(this.defaultValueValue || [], this.className);
    }
    return result;
  }
  public get defaultValue(): any {
    return this.getDefaultValue(undefined);
  }
  public set defaultValue(newValue: any) {
    this.defaultValueValue = newValue;
  }
  public isDefaultValue(value: any): boolean {
    return this.isDefaultValueByObj(undefined, value);
  }
  public isDefaultValueByObj(obj: Base, value: any): boolean {
    if (this.isLocalizable) return value === null || value === undefined;
    const dValue = this.getDefaultValue(obj);
    if (!Helpers.isValueEmpty(dValue)) {
      return Helpers.isTwoValueEquals(value, dValue, false, true, false);
    }
    return (
      (value === false && (this.type == "boolean" || this.type == "switch") && !this.defaultValueFunc) ||
      value === "" || Helpers.isValueEmpty(value)
    );
  }
  public getSerializableValue(obj: any, storeDefaults?: boolean): any {
    if (!!this.onSerializeValue) return this.onSerializeValue(obj);
    const value = this.getValue(obj);
    if (value === undefined || value === null) return undefined;
    if (!storeDefaults && this.isDefaultValueByObj(obj, value)) return undefined;
    return value;
  }
  public getValue(obj: any): any {
    if (this.onGetValue) {
      obj = this.getOriginalObj(obj);
      return this.onGetValue(obj);
    }
    if (this.serializationProperty && !!obj[this.serializationProperty])
      return obj[this.serializationProperty].getJson();
    return obj[this.name];
  }
  public getPropertyValue(obj: any): any {
    if (this.isLocalizable) {
      return !!obj[this.serializationProperty]
        ? obj[this.serializationProperty].text
        : null;
    }
    return this.getValue(obj);
  }
  public get hasToUseSetValue() {
    return this.onSetValue || this.serializationProperty;
  }
  public settingValue(obj: any, value: any): any {
    if (!this.onSettingValue || obj.isLoadingFromJson) return value;
    return this.onSettingValue(obj, value);
  }
  public setValue(obj: any, value: any, jsonConv: JsonObject): void {
    if (this.onSetValue) {
      obj = this.getOriginalObj(obj);
      this.onSetValue(obj, value, jsonConv);
    } else {
      if (this.serializationProperty && !!obj[this.serializationProperty])
        obj[this.serializationProperty].setJson(value, true);
      else {
        if (value && typeof value === "string") {
          if (this.type == "number") {
            value = parseInt(value);
          }
          if (this.type == "boolean" || this.type == "switch") {
            value = value.toLowerCase() === "true";
          }
        }
        obj[this.name] = value;
      }
    }
  }
  public validateValue(value: any): boolean {
    const choices = this.choices;
    if (!Array.isArray(choices) || choices.length === 0) return true;
    return choices.indexOf(value) > -1;
  }
  public getObjType(objType: string) {
    if (!this.classNamePart) return objType;
    return objType.replace(this.classNamePart, "");
  }
  /**
   * Depricated, please use getChoices
   */
  public get choices(): Array<any> {
    return this.getChoices(null);
  }
  public get hasChoices(): boolean {
    return !!this.choicesValue || !!this.choicesfunc;
  }
  public getChoices(obj: any, choicesCallback: any = null): Array<any> {
    if (this.choicesValue != null) return this.choicesValue;
    if (this.choicesfunc != null) return this.choicesfunc(obj, choicesCallback);
    return null;
  }
  public setChoices(
    value: Array<any>,
    valueFunc: (obj: any) => Array<any> = null
  ) {
    this.choicesValue = value;
    this.choicesfunc = valueFunc;
  }
  public getBaseValue(): string {
    if (!this.baseValue) return "";
    if (typeof this.baseValue == "function") return this.baseValue();
    return this.baseValue;
  }
  public setBaseValue(val: any) {
    this.baseValue = val;
  }
  public get readOnly(): boolean {
    return this.readOnlyValue != null ? this.readOnlyValue : false;
  }
  public set readOnly(val: boolean) {
    this.readOnlyValue = val;
  }
  public isEnable(obj: any): boolean {
    if (this.readOnly) return false;
    if (!obj || !this.enableIf) return true;
    return this.enableIf(this.getOriginalObj(obj));
  }
  public isVisible(layout: string, obj: any = null): boolean {
    let isLayout = !this.layout || !layout || this.layout === layout;
    if (!this.visible || !isLayout) return false;
    if (!!this.visibleIf && !!obj) {
      return this.visibleIf(this.getOriginalObj(obj));
    }
    return true;
  }
  private getOriginalObj(obj: any): any {
    if (obj && obj.getOriginalObj) {
      const orjObj = obj.getOriginalObj();
      if (orjObj && Serializer.findProperty(orjObj.getType(), this.name)) {
        return orjObj;
      }
    }
    return obj;
  }
  public get visible(): boolean {
    return this.visibleValue != null ? this.visibleValue : true;
  }
  public set visible(val: boolean) {
    this.visibleValue = val;
  }
  public isAvailableInVersion(ver: string): boolean {
    if (!!this.alternativeName || this.oldName) return true;
    return this.isAvailableInVersionCore(ver);
  }
  public getSerializedName(ver: string): string {
    if (!this.alternativeName) return this.name;
    return this.isAvailableInVersionCore(ver) ? this.name : this.alternativeName || this.oldName;
  }
  public getSerializedProperty(obj: any, ver: string): JsonObjectProperty {
    if (!this.oldName || this.isAvailableInVersionCore(ver)) return this;
    if (!obj || !obj.getType) return null;
    return Serializer.findProperty(obj.getType(), this.oldName);
  }
  private isAvailableInVersionCore(ver: string): boolean {
    if (!ver || !this.version) return true;
    return Helpers.compareVerions(this.version, ver) <= 0;
  }
  public get isLocalizable(): boolean {
    return this.isLocalizableValue != null ? this.isLocalizableValue : false;
  }
  public set isLocalizable(val: boolean) {
    this.isLocalizableValue = val;
  }
  public get dataList(): Array<string> {
    return Array.isArray(this.dataListValue) ? this.dataListValue : [];
  }
  public set dataList(val: Array<string>) {
    this.dataListValue = val;
  }
  public mergeWith(prop: JsonObjectProperty) {
    var valuesNames = JsonObjectProperty.mergableValues;
    for (var i = 0; i < valuesNames.length; i++) {
      this.mergeValue(prop, valuesNames[i]);
    }
  }
  public addDependedProperty(name: string) {
    if (!this.dependedProperties) {
      this.dependedProperties = [];
    }
    if (this.dependedProperties.indexOf(name) < 0) {
      this.dependedProperties.push(name);
    }
  }
  public getDependedProperties(): Array<string> {
    return !!this.dependedProperties ? this.dependedProperties : [];
  }
  public schemaType(): string {
    if (this.className === "choicesByUrl") return undefined;
    if (this.className === "string") return this.className;
    if (!!this.className) return "array";
    if (!!this.baseClassName) return "array";
    if (this.type == "switch") return "boolean";
    if (this.type == "boolean" || this.type == "number") return this.type;
    return "string";
  }
  public schemaRef(): string {
    if (!!this.className) return this.className;
    return undefined;
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
  public static removeAllProperties(className: string): void {
    className = className.toLowerCase();
    delete CustomPropertiesCollection.properties[className];
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
    if (CustomPropertiesCollection.checkIsPropertyExists(obj, prop.name)) return;
    if (!!prop.serializationProperty && CustomPropertiesCollection.checkIsPropertyExists(obj, prop.serializationProperty)) return;
    if (
      prop.isLocalizable &&
      prop.serializationProperty &&
      obj.createCustomLocalizableObj
    ) {
      const locStr = obj.createCustomLocalizableObj(prop.name);
      locStr.defaultValue = prop.getDefaultValue(obj);
      var locDesc = {
        get: function () {
          return obj.getLocalizableString(prop.name);
        },
      };
      Object.defineProperty(obj, prop.serializationProperty, locDesc);
      var desc = {
        get: function () {
          return obj.getLocalizableStringText(prop.name);
        },
        set: function (v: any) {
          obj.setLocalizableStringText(prop.name, v);
        },
      };
      Object.defineProperty(obj, prop.name, desc);
    } else {
      var isArrayProp = prop.isArray || prop.type === "multiplevalues";
      if (typeof obj.createNewArray === "function") {
        if (Serializer.isDescendantOf(prop.className, "itemvalue")) {
          obj.createNewArray(prop.name, function (item: any) {
            item.locOwner = obj;
            item.ownerPropertyName = prop.name;
          });
          isArrayProp = true;
        } else {
          //It is a simple array property
          if (isArrayProp) {
            obj.createNewArray(prop.name);
          }
        }
        if (isArrayProp) {
          const defaultValue = prop.getDefaultValue(obj);
          if (Array.isArray(defaultValue)) {
            obj.setPropertyValue(prop.name, defaultValue);
          }
        }
      }
      if (!!obj.getPropertyValue && !!obj.setPropertyValue) {
        var desc = {
          get: () => {
            if (!!prop.onGetValue) {
              return prop.onGetValue(obj);
            }
            return obj.getPropertyValue(prop.name, undefined);
          },
          set: function (v: any) {
            if (!!prop.onSetValue) {
              prop.onSetValue(obj, v, null);
            } else {
              obj.setPropertyValue(prop.name, v);
            }
          },
        };
        Object.defineProperty(obj, prop.name, desc);
      }
    }
    if (prop.type === "condition" || prop.type === "expression") {
      if (!!prop.onExecuteExpression) {
        obj.addExpressionProperty(prop.name, prop.onExecuteExpression);
      }
    }
  }
  private static checkIsPropertyExists(obj: any, name: string): boolean {
    return obj.hasOwnProperty(name) || obj[name];
  }
}

export class JsonMetadataClass {
  static requiredSymbol = "!";
  static typeSymbol = ":";
  properties: Array<JsonObjectProperty>;
  private isCustomValue: boolean;
  private allProperties: Array<JsonObjectProperty>;
  private requiredProperties: Array<JsonObjectProperty>;
  private hashProperties: HashTable<JsonObjectProperty>;
  constructor(
    public name: string,
    properties: Array<any>,
    public creator: (json?: any) => any = null,
    public parentName: string = null
  ) {
    name = name.toLowerCase();
    this.isCustomValue = !creator && name !== "survey";
    if (this.parentName) {
      this.parentName = this.parentName.toLowerCase();
      CustomPropertiesCollection.addClass(name, this.parentName);
      if (!!creator) {
        this.makeParentRegularClass();
      }
    }
    this.properties = new Array<JsonObjectProperty>();
    for (var i = 0; i < properties.length; i++) {
      this.createProperty(properties[i], this.isCustom);
    }
  }
  //Obsolete
  public find(name: string): JsonObjectProperty {
    for (var i = 0; i < this.properties.length; i++) {
      if (this.properties[i].name == name) return this.properties[i];
    }
    return null;
  }
  public findProperty(name: string): JsonObjectProperty {
    this.fillAllProperties();
    return this.hashProperties[name];
  }
  public getAllProperties(): Array<JsonObjectProperty> {
    this.fillAllProperties();
    return this.allProperties;
  }
  public getRequiredProperties(): Array<JsonObjectProperty> {
    if (!!this.requiredProperties) return this.requiredProperties;
    this.requiredProperties = [];
    const props = this.getAllProperties();
    for (let i = 0; i < props.length; i++) {
      if (props[i].isRequired) this.requiredProperties.push(props[i]);
    }
    return this.requiredProperties;
  }
  public resetAllProperties(): void {
    this.allProperties = undefined;
    this.requiredProperties = undefined;
    this.hashProperties = undefined;
    var childClasses = Serializer.getChildrenClasses(this.name);
    for (var i = 0; i < childClasses.length; i++) {
      childClasses[i].resetAllProperties();
    }
  }
  public get isCustom(): boolean { return this.isCustomValue; }
  private fillAllProperties(): void {
    if (!!this.allProperties) return;
    this.allProperties = [];
    this.hashProperties = {};
    const localProperties: HashTable<JsonObjectProperty> = {};
    this.properties.forEach(prop => localProperties[prop.name] = prop);
    const parentClass = !!this.parentName ? Serializer.findClass(this.parentName) : null;
    if (!!parentClass) {
      const parentProperties = parentClass.getAllProperties();
      parentProperties.forEach(prop => {
        const overridedProp = localProperties[prop.name];
        if (!!overridedProp) {
          overridedProp.mergeWith(prop);
          this.addPropCore(overridedProp);
        } else {
          this.addPropCore(prop);
        }
      });
    }
    this.properties.forEach(prop => {
      if (!this.hashProperties[prop.name]) {
        this.addPropCore(prop);
      }
    });
  }
  private addPropCore(prop: JsonObjectProperty): void {
    this.allProperties.push(prop);
    this.hashProperties[prop.name] = prop;
    if (!!prop.alternativeName) {
      this.hashProperties[prop.alternativeName] = prop;
    }
  }
  private isOverridedProp(propName: string): boolean {
    return !!this.parentName && !!Serializer.findProperty(this.parentName, propName);
  }
  private hasRegularChildClass(): void {
    if (!this.isCustom) return;
    this.isCustomValue = false;
    for (var i = 0; i < this.properties.length; i++) {
      this.properties[i].isCustom = false;
    }
    CustomPropertiesCollection.removeAllProperties(this.name);
    this.makeParentRegularClass();
  }
  private makeParentRegularClass(): void {
    if (!this.parentName) return;
    const parent = Serializer.findClass(this.parentName);
    if (!!parent) {
      parent.hasRegularChildClass();
    }
  }
  public createProperty(propInfo: any, isCustom: boolean = false): JsonObjectProperty {
    var propertyName = typeof propInfo === "string" ? propInfo : propInfo.name;
    if (!propertyName) return;
    var propertyType = null;
    var typeIndex = propertyName.indexOf(JsonMetadataClass.typeSymbol);
    if (typeIndex > -1) {
      propertyType = propertyName.substring(typeIndex + 1);
      propertyName = propertyName.substring(0, typeIndex);
    }
    var isRequired =
      this.getIsPropertyNameRequired(propertyName) || !!propInfo.isRequired;
    propertyName = this.getPropertyName(propertyName);
    var prop = new JsonObjectProperty(this, propertyName, isRequired);
    if (propertyType) {
      prop.type = propertyType;
    }
    if (typeof propInfo === "object") {
      if (propInfo.type) {
        prop.type = propInfo.type;
      }
      if (propInfo.default !== undefined) {
        prop.defaultValue = propInfo.default;
      }
      if (propInfo.defaultFunc !== undefined) {
        prop.defaultValueFunc = propInfo.defaultFunc;
      }
      if (!Helpers.isValueEmpty(propInfo.isSerializable)) {
        prop.isSerializable = propInfo.isSerializable;
      }
      if (!Helpers.isValueEmpty(propInfo.isSerializableFunc)) {
        prop.isSerializableFunc = propInfo.isSerializableFunc;
      }
      if (!Helpers.isValueEmpty(propInfo.isLightSerializable)) {
        prop.isLightSerializable = propInfo.isLightSerializable;
      }
      if (!Helpers.isValueEmpty(propInfo.maxLength)) {
        prop.maxLength = propInfo.maxLength;
      }
      if (propInfo.displayName !== undefined) {
        prop.displayName = propInfo.displayName;
      }
      if (!Helpers.isValueEmpty(propInfo.category)) {
        prop.category = propInfo.category;
      }
      if (!Helpers.isValueEmpty(propInfo.categoryIndex)) {
        prop.categoryIndex = propInfo.categoryIndex;
      }
      if (!Helpers.isValueEmpty(propInfo.nextToProperty)) {
        prop.nextToProperty = propInfo.nextToProperty;
      }
      if (!Helpers.isValueEmpty(propInfo.overridingProperty)) {
        prop.overridingProperty = propInfo.overridingProperty;
      }
      if (!Helpers.isValueEmpty(propInfo.visibleIndex)) {
        prop.visibleIndex = propInfo.visibleIndex;
      }
      if (!Helpers.isValueEmpty(propInfo.showMode)) {
        prop.showMode = propInfo.showMode;
      }
      if (!Helpers.isValueEmpty(propInfo.locationInTable)) {
        prop.locationInTable = propInfo.locationInTable;
      }
      if (!Helpers.isValueEmpty(propInfo.maxValue)) {
        prop.maxValue = propInfo.maxValue;
      }
      if (!Helpers.isValueEmpty(propInfo.minValue)) {
        prop.minValue = propInfo.minValue;
      }
      if (!Helpers.isValueEmpty(propInfo.dataList)) {
        prop.dataList = propInfo.dataList;
      }
      if (!Helpers.isValueEmpty(propInfo.isDynamicChoices)) {
        prop.isDynamicChoices = propInfo.isDynamicChoices;
      }
      if (!Helpers.isValueEmpty(propInfo.isBindable)) {
        prop.isBindable = propInfo.isBindable;
      }
      if (!Helpers.isValueEmpty(propInfo.isUnique)) {
        prop.isUnique = propInfo.isUnique;
      }
      if (!Helpers.isValueEmpty(propInfo.uniqueProperty)) {
        prop.uniquePropertyName = propInfo.uniqueProperty;
      }
      if (!Helpers.isValueEmpty(propInfo.isArray)) {
        prop.isArray = propInfo.isArray;
      }
      if (propInfo.visible === true || propInfo.visible === false) {
        prop.visible = propInfo.visible;
      }
      if (!!propInfo.visibleIf) {
        prop.visibleIf = propInfo.visibleIf;
      }
      if (!!propInfo.enableIf) {
        prop.enableIf = propInfo.enableIf;
      }
      if (!!propInfo.onExecuteExpression) {
        prop.onExecuteExpression = propInfo.onExecuteExpression;
      }
      if (!!propInfo.onPropertyEditorUpdate) {
        prop.onPropertyEditorUpdate = propInfo.onPropertyEditorUpdate;
      }
      if (propInfo.readOnly === true) {
        prop.readOnly = true;
      }
      if (propInfo.availableInMatrixColumn === true) {
        prop.availableInMatrixColumn = true;
      }
      if (propInfo.choices) {
        var choicesFunc =
          typeof propInfo.choices === "function" ? propInfo.choices : null;
        var choicesValue =
          typeof propInfo.choices !== "function" ? propInfo.choices : null;
        prop.setChoices(choicesValue, choicesFunc);
      }
      if (!!propInfo.baseValue) {
        prop.setBaseValue(propInfo.baseValue);
      }
      if (propInfo.onSerializeValue) {
        prop.onSerializeValue = propInfo.onSerializeValue;
      }
      if (propInfo.onGetValue) {
        prop.onGetValue = propInfo.onGetValue;
      }
      if (propInfo.onSetValue) {
        prop.onSetValue = propInfo.onSetValue;
      }
      if (propInfo.onSettingValue) {
        prop.onSettingValue = propInfo.onSettingValue;
      }
      if (propInfo.isLocalizable) {
        propInfo.serializationProperty = "loc" + prop.name;
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
        prop.isArray = true;
      }
      if (prop.isArray === true) {
        prop.isArray = true;
      }
      if (propInfo.classNamePart) {
        prop.classNamePart = propInfo.classNamePart;
      }
      if (propInfo.alternativeName) {
        prop.alternativeName = propInfo.alternativeName;
      }
      if (propInfo.oldName) {
        prop.oldName = propInfo.oldName;
      }
      if (propInfo.layout) {
        prop.layout = propInfo.layout;
      }
      if (propInfo.version) {
        prop.version = propInfo.version;
      }
      if (propInfo.dependsOn) {
        this.addDependsOnProperties(prop, propInfo.dependsOn);
      }
    }
    this.properties.push(prop);
    if (isCustom && !this.isOverridedProp(prop.name)) {
      prop.isCustom = true;
      CustomPropertiesCollection.addProperty(this.name, prop);
    }
    return prop;
  }
  private addDependsOnProperties(prop: JsonObjectProperty, dependsOn: any) {
    const dArray = Array.isArray(dependsOn) ? dependsOn : [dependsOn];
    prop.dependsOn = dArray;
    for (var i = 0; i < dArray.length; i++) {
      this.addDependsOnProperty(prop, dArray[i]);
    }
  }
  private addDependsOnProperty(prop: JsonObjectProperty, dependsOn: string) {
    var property = this.find(dependsOn);
    if (!property) {
      property = Serializer.findProperty(this.parentName, dependsOn);
    }
    if (!property) return;
    property.addDependedProperty(prop.name);
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

/**
 * The metadata object. It contains object properties' runtime information and allows you to modify it.
 */
export class JsonMetadata {
  private classes: HashTable<JsonMetadataClass> = {};
  private alternativeNames: HashTable<string> = {};
  private childrenClasses: HashTable<Array<JsonMetadataClass>> = {};
  private dynamicPropsCache: HashTable<Array<JsonObjectProperty>> = {};
  public onSerializingProperty: ((obj: Base, prop: JsonObjectProperty, value: any, json: any) => boolean) | undefined;
  public getObjPropertyValue(obj: any, name: string): any {
    if (this.isObjWrapper(obj) && this.isNeedUseObjWrapper(obj, name)) {
      const orignalObj = obj.getOriginalObj();
      const prop = Serializer.findProperty(orignalObj.getType(), name);
      if (!!prop) return this.getObjPropertyValueCore(orignalObj, prop);
    }
    const prop = Serializer.findProperty(obj.getType(), name);
    if (!prop) return obj[name];
    return this.getObjPropertyValueCore(obj, prop);
  }
  public setObjPropertyValue(obj: any, name: string, val: any) {
    if (obj[name] === val) return;
    if (!!obj[name] && !!obj[name].setJson) {
      obj[name].setJson(val, true);
    } else {
      if (Array.isArray(val)) {
        const newVal = [];
        for (var i = 0; i < val.length; i++) newVal.push(val[i]);
        val = newVal;
      }
      obj[name] = val;
    }
  }
  private getObjPropertyValueCore(obj: any, prop: JsonObjectProperty): any {
    if (!prop.isPropertySerializable(obj)) return obj[prop.name];
    if (prop.isLocalizable) {
      if (prop.isArray) return obj[prop.name];
      if (!!prop.serializationProperty)
        return obj[prop.serializationProperty].text;
    }
    return obj.getPropertyValue(prop.name);
  }
  private isObjWrapper(obj: any): boolean {
    return !!obj.getOriginalObj && !!obj.getOriginalObj();
  }
  private isNeedUseObjWrapper(obj: any, name: string): boolean {
    if (!obj.getDynamicProperties) return true;
    const props = obj.getDynamicProperties();
    if (!Array.isArray(props)) return false;
    for (let i = 0; i < props.length; i++) {
      if (props[i].name === name) return true;
    }
    return false;
  }
  public addClass(
    name: string,
    properties: Array<IJsonPropertyInfo | string>,
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
  public removeClass(name: string) {
    var metaClass = this.findClass(name);
    if (!metaClass) return;
    delete this.classes[metaClass.name];
    if (!!metaClass.parentName) {
      var index = this.childrenClasses[metaClass.parentName].indexOf(metaClass);
      if (index > -1) {
        this.childrenClasses[metaClass.parentName].splice(index, 1);
      }
    }
  }
  public overrideClassCreatore(name: string, creator: () => any) {
    this.overrideClassCreator(name, creator);
  }
  public overrideClassCreator(name: string, creator: () => any) {
    name = name.toLowerCase();
    var metaDataClass = this.findClass(name);
    if (metaDataClass) {
      metaDataClass.creator = creator;
    }
  }
  public getProperties(className: string): Array<JsonObjectProperty> {
    var metaClass = this.findClass(className);
    if (!metaClass) return [];
    return metaClass.getAllProperties();
  }
  public getPropertiesByObj(obj: any): Array<JsonObjectProperty> {
    const type = !!obj && !!obj.getType ? obj.getType() : undefined;
    if (!type) return [];
    const props = this.getProperties(type);
    const dynamicProps = this.getDynamicPropertiesByObj(obj);
    for (let i = dynamicProps.length - 1; i >= 0; i--) {
      if (this.findProperty(type, dynamicProps[i].name)) {
        dynamicProps.splice(i, 1);
      }
    }
    if (dynamicProps.length === 0) return props;

    return [].concat(props).concat(dynamicProps);
  }
  public addDynamicPropertiesIntoObj(dest: any, src: any, props: Array<JsonObjectProperty>): void {
    props.forEach(prop => {
      this.addDynamicPropertyIntoObj(dest, src, prop.name, false);
      if (prop.serializationProperty) {
        this.addDynamicPropertyIntoObj(dest, src, prop.serializationProperty, true);
      }
      if (prop.alternativeName) {
        this.addDynamicPropertyIntoObj(dest, src, prop.alternativeName, false);
      }
    });
  }
  private addDynamicPropertyIntoObj(dest: any, src: any, propName: string, isReadOnly: boolean): void {
    var desc = {
      configurable: true,
      get: function () {
        return src[propName];
      },
    };
    if (!isReadOnly) {
      (<any>desc)["set"] = function (v: any) {
        src[propName] = v;
      };
    }
    Object.defineProperty(dest, propName, desc);
  }
  public getDynamicPropertiesByObj(obj: any, dynamicType: string = null): Array<JsonObjectProperty> {
    if (!obj || !obj.getType) return [];
    if (!!obj.getDynamicProperties) return obj.getDynamicProperties();
    if (!obj.getDynamicType && !dynamicType) return [];
    const dType = !!dynamicType ? dynamicType : obj.getDynamicType();
    return this.getDynamicPropertiesByTypes(obj.getType(), dType);
  }
  public getDynamicPropertiesByTypes(objType: string, dynamicType: string, invalidNames?: Array<string>): Array<JsonObjectProperty> {
    if (!dynamicType) return [];
    const cacheType = dynamicType + "-" + objType;
    if (this.dynamicPropsCache[cacheType]) return this.dynamicPropsCache[cacheType];
    var dynamicProps = this.getProperties(dynamicType);
    if (!dynamicProps || dynamicProps.length == 0) return [];
    const hash: any = {};
    const props = this.getProperties(objType);
    for (var i = 0; i < props.length; i++) {
      hash[props[i].name] = props[i];
    }
    const res = [];
    if (!invalidNames) invalidNames = [];
    for (let i = 0; i < dynamicProps.length; i++) {
      const dProp = dynamicProps[i];
      if (invalidNames.indexOf(dProp.name) < 0 && this.canAddDybamicProp(dProp, hash[dProp.name])) {
        res.push(dProp);
      }
    }
    this.dynamicPropsCache[cacheType] = res;
    return res;
  }
  private canAddDybamicProp(dProp: JsonObjectProperty, orgProp: JsonObjectProperty): boolean {
    if (!orgProp) return true;
    if (dProp === orgProp) return false;
    let classInfo = dProp.classInfo;
    while (classInfo && classInfo.parentName) {
      dProp = this.findProperty(classInfo.parentName, dProp.name);
      if (dProp && dProp === orgProp) return true;
      classInfo = !!dProp ? dProp.classInfo : undefined;
    }
    return false;
  }
  public hasOriginalProperty(obj: Base, propName: string): boolean {
    return !!this.getOriginalProperty(obj, propName);
  }
  public getOriginalProperty(obj: Base, propName: string): JsonObjectProperty {
    var res = this.findProperty(obj.getType(), propName);
    if (!!res) return res;
    if (this.isObjWrapper(obj))
      return this.findProperty((<any>obj).getOriginalObj().getType(), propName);
    return null;
  }
  public getProperty(
    className: string,
    propertyName: string
  ): JsonObjectProperty {
    const prop = this.findProperty(className, propertyName);
    if (!prop) return prop;
    const classInfo = this.findClass(className);
    if (prop.classInfo === classInfo) return prop;
    const newProp = new JsonObjectProperty(classInfo, prop.name, prop.isRequired);
    newProp.mergeWith(prop);
    newProp.isArray = prop.isArray;
    classInfo.properties.push(newProp);
    classInfo.resetAllProperties();
    return newProp;
  }
  public findProperty(
    className: string,
    propertyName: string
  ): JsonObjectProperty {
    const cl = this.findClass(className);
    return !!cl ? cl.findProperty(propertyName) : null;
  }
  public findProperties(
    className: string,
    propertyNames: Array<string>
  ): Array<JsonObjectProperty> {
    var result = new Array<JsonObjectProperty>();
    const cl = this.findClass(className);
    if (!cl) return result;
    for (var i = 0; i < propertyNames.length; i++) {
      var prop = cl.findProperty(propertyNames[i]);
      if (prop) {
        result.push(prop);
      }
    }
    return result;
  }
  public getAllPropertiesByName(
    propertyName: string
  ): Array<JsonObjectProperty> {
    var res = new Array<JsonObjectProperty>();
    var classes = this.getAllClasses();
    for (var i = 0; i < classes.length; i++) {
      var classInfo = this.findClass(classes[i]);
      for (var j = 0; j < classInfo.properties.length; j++) {
        if (classInfo.properties[j].name == propertyName) {
          res.push(classInfo.properties[j]);
          break;
        }
      }
    }
    return res;
  }
  public getAllClasses(): Array<string> {
    var res = new Array<string>();
    for (var name in this.classes) {
      res.push(name);
    }
    return res;
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
    res.getType = function () {
      return customTypeName;
    };
    res.getTemplate = function () {
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
    const metaClass = this.findClass(name);
    if (!metaClass) return [];
    const props = metaClass.getRequiredProperties();
    var res = [];
    for (var i = 0; i < props.length; i++) {
      res.push(props[i].name);
    }
    return res;
  }
  public addProperties(className: string, propertiesInfos: Array<IJsonPropertyInfo | string>): void {
    className = className.toLowerCase();
    var metaDataClass = this.findClass(className);
    for (var i = 0; i < propertiesInfos.length; i++) {
      this.addCustomPropertyCore(metaDataClass, propertiesInfos[i]);
    }
  }
  public addProperty(className: string, propertyInfo: IJsonPropertyInfo | string): JsonObjectProperty {
    return this.addCustomPropertyCore(this.findClass(className), propertyInfo);
  }
  private addCustomPropertyCore(
    metaDataClass: JsonMetadataClass,
    propertyInfo: any
  ): JsonObjectProperty {
    if (!metaDataClass) return null;
    var property = metaDataClass.createProperty(propertyInfo, true);
    if (property) {
      this.clearDynamicPropsCache(metaDataClass);
      metaDataClass.resetAllProperties();
    }
    return property;
  }
  public removeProperty(className: string, propertyName: string) {
    var metaDataClass = this.findClass(className);
    if (!metaDataClass) return false;
    var property = metaDataClass.find(propertyName);
    if (property) {
      this.clearDynamicPropsCache(metaDataClass);
      this.removePropertyFromClass(metaDataClass, property);
      metaDataClass.resetAllProperties();
      CustomPropertiesCollection.removeProperty(
        metaDataClass.name,
        propertyName
      );
    }
  }
  private clearDynamicPropsCache(metaDataClass: JsonMetadataClass): void {
    this.dynamicPropsCache = {};
  }
  private removePropertyFromClass(
    metaDataClass: JsonMetadataClass,
    property: JsonObjectProperty
  ) {
    var index = metaDataClass.properties.indexOf(property);
    if (index < 0) return;
    metaDataClass.properties.splice(index, 1);
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
  public generateSchema(className: string = undefined): any {
    if (!className) className = "survey";
    var classInfo = this.findClass(className);
    if (!classInfo) return null;
    var res = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: "SurveyJS Library json schema",
      type: "object",
      properties: {},
      definitions: { locstring: this.generateLocStrClass() },
    };
    this.generateSchemaProperties(classInfo, res, res.definitions, true);
    return res;
  }
  private generateLocStrClass(): any {
    const props: any = {};
    const locProp = Serializer.findProperty("survey", "locale");
    if (!!locProp) {
      const choices = locProp.getChoices(null);
      if (Array.isArray(choices)) {
        if (choices.indexOf("en") < 0) {
          choices.splice(0, 0, "en");
        }
        choices.splice(0, 0, "default");
        choices.forEach(l => { if (!!l) { props[l] = { type: "string" }; } });
      }
    }
    return {
      $id: "locstring",
      type: "object",
      properties: props
    };
  }
  private generateSchemaProperties(classInfo: JsonMetadataClass, classSchema: any, schemaDef: any, isRoot: boolean): void {
    if (!classInfo) return;
    const schemaProperties = classSchema.properties;
    const requiredProps = [];
    if (classInfo.name === "question") {
      schemaProperties.type = { type: "string" };
      requiredProps.push("type");
    }
    for (let i = 0; i < classInfo.properties.length; i++) {
      const prop = classInfo.properties[i];
      if(prop.isSerializable === false) continue;
      if (!!classInfo.parentName && !!Serializer.findProperty(classInfo.parentName, prop.name)) continue;
      schemaProperties[prop.name] = this.generateSchemaProperty(prop, schemaDef, isRoot);
      if (prop.isRequired) requiredProps.push(prop.name);
    }
    if (requiredProps.length > 0) {
      classSchema.required = requiredProps;
    }
  }
  private generateSchemaProperty(prop: JsonObjectProperty, schemaDef: any, isRoot: boolean): any {
    if (prop.isLocalizable) {
      return {
        oneOf: [
          { "type": "string" },
          { "$ref": this.getChemeRefName("locstring", isRoot) }
        ]
      };
    }
    const propType = prop.schemaType();
    const refType = prop.schemaRef();
    var res: any = {};
    if (!!propType) {
      res.type = propType;
    }
    if (prop.hasChoices) {
      const enumRes = prop.getChoices(null);
      if (Array.isArray(enumRes) && enumRes.length > 0) {
        res.enum = this.getChoicesValues(enumRes);
      }
    }
    if (!!refType) {
      if (propType === "array") {
        if (prop.className === "string") {
          res.items = { type: prop.className };
        } else {
          res.items = { $ref: this.getChemeRefName(prop.className, isRoot) };
        }
      } else {
        res["$ref"] = this.getChemeRefName(refType, isRoot);
      }
      this.generateChemaClass(prop.className, schemaDef, false);
    }
    if (!!prop.baseClassName) {
      var usedClasses = this.getChildrenClasses(prop.baseClassName, true);
      if (prop.baseClassName == "question") {
        usedClasses.push(this.findClass("panel"));
      }
      res.items = { anyOf: [] };
      for (var i = 0; i < usedClasses.length; i++) {
        var className = usedClasses[i].name;
        res.items.anyOf.push({ $ref: this.getChemeRefName(className, isRoot) });
        this.generateChemaClass(className, schemaDef, false);
      }
    }
    return res;
  }
  private getChemeRefName(className: string, isRoot: boolean): string {
    //Fix for #6486, according to https://niem.github.io/json/reference/json-schema/references/#:~:text=In%20a%20JSON%20schema%2C%20a,%2C%20an%20in%2Dschema%20reference
    //Checked by https://www.jsonschemavalidator.net/
    return isRoot ? "#/definitions/" + className : className;
  }
  private generateChemaClass(className: string, schemaDef: any, isRoot: boolean) {
    if (!!schemaDef[className]) return;
    var classInfo = this.findClass(className);
    if (!classInfo) return;
    var hasParent = !!classInfo.parentName && classInfo.parentName != "base";
    if (hasParent) {
      this.generateChemaClass(classInfo.parentName, schemaDef, isRoot);
    }
    const res: any = { type: "object", $id: className };
    schemaDef[className] = res;
    const chemaProps: any = { properties: {} };
    this.generateSchemaProperties(classInfo, chemaProps, schemaDef, isRoot);
    if (hasParent) {
      res.allOf = [
        { $ref: this.getChemeRefName(classInfo.parentName, isRoot) },
        { properties: chemaProps.properties },
      ];
    } else {
      res.properties = chemaProps.properties;
    }
    if (Array.isArray(chemaProps.required)) {
      res.required = chemaProps.required;
    }
  }
  private getChoicesValues(enumRes: Array<any>): Array<any> {
    const res = new Array<any>();
    enumRes.forEach(item => {
      if (typeof item === "object" && item.value !== undefined) {
        res.push(item.value);
      } else {
        res.push(item);
      }
    });
    return res;
  }
}
export class JsonError {
  public description: string = "";
  public at: number = -1;
  public end: number = -1;
  public jsonObj: any;
  public element: Base;
  constructor(public type: string, public message: string) { }
  public getFullDescription(): string {
    return this.message + (this.description ? "\n" + this.description : "");
  }
}
export class JsonUnknownPropertyError extends JsonError {
  constructor(public propertyName: string, public className: string) {
    super("unknownproperty", "Unknown property in class '" + className + "': '" + propertyName + "'.");
  }
}
export class JsonMissingTypeErrorBase extends JsonError {
  constructor(
    public baseClassName: string,
    public type: string,
    public message: string
  ) {
    super(type, message);
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
export class JsonRequiredArrayPropertyError extends JsonError {
  constructor(public propertyName: string, public className: string) {
    super("arrayproperty", "The property '" + propertyName + "' should be an array in '" + className + "'.");
  }
}

export class JsonIncorrectPropertyValueError extends JsonError {
  constructor(public property: JsonObjectProperty, public value: any) {
    super("incorrectvalue", "The property value: '" + value + "' is incorrect for property '" + property.name + "'.");
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
  public lightSerializing: boolean = false;
  public options: ILoadFromJSONOptions;
  public toJsonObject(obj: any, options?: ISaveToJSONOptions | boolean): any {
    return this.toJsonObjectCore(obj, null, options);
  }
  public toObject(jsonObj: any, obj: any, options?: ILoadFromJSONOptions): void {
    this.toObjectCore(jsonObj, obj, options);
    var error = this.getRequiredError(obj, jsonObj);
    if (!!error) {
      this.addNewError(error, jsonObj, obj);
    }
  }
  public toObjectCore(jsonObj: any, obj: any, options?: ILoadFromJSONOptions): void {
    if (!jsonObj) return;
    var properties = null;
    var objType = undefined;
    var needAddErrors = true;
    if (obj.getType) {
      objType = obj.getType();
      properties = Serializer.getProperties(objType);
      needAddErrors =
        !!objType && !Serializer.isDescendantOf(objType, "itemvalue");
    }
    if (!properties) return;
    if (obj.startLoadingFromJson) {
      obj.startLoadingFromJson(jsonObj);
    }
    properties = this.addDynamicProperties(obj, jsonObj, properties);
    this.options = options;
    const processedProps: any = {};
    processedProps[JsonObject.typePropertyName] = true;
    const parentProps = {};
    for (var key in jsonObj) {
      this.setPropertyValueToObj(jsonObj, obj, key, properties, processedProps, parentProps, objType, needAddErrors, options);
    }
    this.options = undefined;
    if (obj.endLoadingFromJson) {
      obj.endLoadingFromJson();
    }
  }
  private setPropertyValueToObj(jsonObj: any, obj: any, key: string, properties: Array<JsonObjectProperty>, processedProps: any, parentProps: any,
    objType: string, needAddErrors: boolean, options: ILoadFromJSONOptions): void {
    if (processedProps[key]) return;
    if (key === JsonObject.positionPropertyName) {
      obj[key] = jsonObj[key];
      return;
    }
    const property = this.findProperty(properties, key);
    if (!property && needAddErrors) {
      this.addNewError(new JsonUnknownPropertyError(key.toString(), objType), jsonObj, obj);
    }
    if (property) {
      const dProps = property.dependsOn;
      if (Array.isArray(dProps)) {
        parentProps[key] = true;
        dProps.forEach(propKey => {
          if (!parentProps[propKey]) {
            this.setPropertyValueToObj(jsonObj, obj, propKey, properties, processedProps, parentProps, objType, false, options);
          }
        });
      }
      this.valueToObj(jsonObj[key], obj, property, jsonObj, options);
      processedProps[key] = true;
    }
  }
  public toJsonObjectCore(
    obj: any,
    property: JsonObjectProperty,
    options?: ISaveToJSONOptions | boolean
  ): any {
    if (!obj || !obj.getType) return obj;
    if (!obj.isSurvey && typeof obj.getData === "function") return obj.getData();
    var result = {};
    if (property != null && !property.className) {
      (<any>result)[JsonObject.typePropertyName] = property.getObjType(
        obj.getType()
      );
    }
    const storeDefaults = options === true;
    if (!options || options === true) {
      options = {};
    }
    if (storeDefaults) {
      options.storeDefaults = storeDefaults;
    }
    this.propertiesToJson(
      obj,
      Serializer.getProperties(obj.getType()),
      result,
      options
    );
    this.propertiesToJson(
      obj,
      this.getDynamicProperties(obj),
      result,
      options
    );
    return result;
  }
  private getDynamicProperties(obj: any): Array<JsonObjectProperty> {
    return Serializer.getDynamicPropertiesByObj(obj);
  }
  private addDynamicProperties(
    obj: any,
    jsonObj: any,
    props: Array<JsonObjectProperty>
  ): Array<JsonObjectProperty> {
    if (!obj.getDynamicPropertyName && !obj.getDynamicProperties) return props;
    if (obj.getDynamicPropertyName) {
      const dynamicPropName = obj.getDynamicPropertyName();
      if (!dynamicPropName) return props;
      if (dynamicPropName && jsonObj[dynamicPropName]) {
        obj[dynamicPropName] = jsonObj[dynamicPropName];
      }
    }
    const dynamicProps = this.getDynamicProperties(obj);
    return dynamicProps.length === 0 ? props : [].concat(props).concat(dynamicProps);
  }
  private propertiesToJson(
    obj: any,
    properties: Array<JsonObjectProperty>,
    json: any,
    options: ISaveToJSONOptions
  ) {
    for (var i: number = 0; i < properties.length; i++) {
      this.valueToJson(obj, json, properties[i], options);
    }
  }
  public valueToJson(obj: any, result: any, prop: JsonObjectProperty, options?: ISaveToJSONOptions): void {
    if (!options) options = {};
    if (!prop.isPropertySerializable(obj) || (prop.isLightSerializable === false && this.lightSerializing)) return;
    if (options.version && !prop.isAvailableInVersion(options.version)) return;
    this.valueToJsonCore(obj, result, prop, options);
  }
  private valueToJsonCore(obj: any, result: any, prop: JsonObjectProperty, options?: ISaveToJSONOptions): void {
    const serProp = prop.getSerializedProperty(obj, options.version);
    if (serProp && serProp !== prop) {
      this.valueToJsonCore(obj, result, serProp, options);
      return;
    }
    var value = prop.getSerializableValue(obj, options.storeDefaults);
    if (value === undefined) return;
    if (this.isValueArray(value)) {
      var arrValue = [];
      for (var i = 0; i < value.length; i++) {
        arrValue.push(this.toJsonObjectCore(value[i], prop, options));
      }
      value = arrValue.length > 0 ? arrValue : null;
    } else {
      value = this.toJsonObjectCore(value, prop, options);
    }
    if (value === undefined || value === null) return;
    const name = prop.getSerializedName(options.version);
    var hasValue =
      typeof obj["getPropertyValue"] === "function" &&
      obj["getPropertyValue"](name, null) !== null;
    if ((options.storeDefaults && hasValue) || !prop.isDefaultValueByObj(obj, value)) {
      if (!Serializer.onSerializingProperty || !Serializer.onSerializingProperty(obj, prop, value, result)) {
        result[name] = this.removePosOnValueToJson(prop, value);
      }
    }
  }
  public valueToObj(value: any, obj: any, property: JsonObjectProperty, jsonObj?: any, options?: ILoadFromJSONOptions): void {
    if (value === null || value === undefined) return;
    this.removePos(property, value);
    if (property != null && property.hasToUseSetValue) {
      property.setValue(obj, value, this);
      return;
    }
    if (property.isArray && !Array.isArray(value) && !!value) {
      value = [value];
      const propName = !!jsonObj && property.alternativeName && !!jsonObj[property.alternativeName] ? property.alternativeName : property.name;
      this.addNewError(new JsonRequiredArrayPropertyError(propName, obj.getType()), !!jsonObj ? jsonObj : value, obj);
    }
    if (this.isValueArray(value)) {
      this.valueToArray(value, obj, property.name, property, options);
      return;
    }
    var newObj = this.createNewObj(value, property);
    if (newObj.newObj) {
      this.toObjectCore(value, newObj.newObj, options);
      value = newObj.newObj;
    }
    if (!newObj.error) {
      if (property != null) {
        property.setValue(obj, value, this);
        if (!!options && options.validatePropertyValues) {
          if (!property.validateValue(value)) {
            this.addNewError(new JsonIncorrectPropertyValueError(property, value), jsonObj, obj);
          }
        }
      } else {
        obj[property.name] = value;
      }
    }
  }
  private removePosOnValueToJson(property: JsonObjectProperty, value: any): any {
    if (!property.isCustom || !value) return value;
    this.removePosFromObj(value);
    return value;
  }
  private removePos(property: JsonObjectProperty, value: any): void {
    if (!property || !property.type || property.type.indexOf("value") < 0)
      return;
    this.removePosFromObj(value);
  }
  private removePosFromObj(obj: any) {
    if (!obj || typeof obj.getType === "function") return;
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        this.removePosFromObj(obj[i]);
      }
    }
    if (typeof obj !== "object") return;
    if (!!obj[JsonObject.positionPropertyName]) {
      delete obj[JsonObject.positionPropertyName];
    }
    for (let key in obj) {
      this.removePosFromObj(obj[key]);
    }
  }
  private isValueArray(value: any): boolean {
    return value && Array.isArray(value);
  }
  private createNewObj(value: any, property: JsonObjectProperty): any {
    var result: any = { newObj: null, error: null };
    const className = this.getClassNameForNewObj(value, property);
    result.newObj = className
      ? Serializer.createClass(className, value)
      : null;
    result.error = this.checkNewObjectOnErrors(
      result.newObj,
      value,
      property,
      className
    );
    return result;
  }
  private getClassNameForNewObj(value: any, property: JsonObjectProperty): string {
    var res = property != null && property.className ? property.className : undefined;
    if (!res) {
      res = value[JsonObject.typePropertyName];
    }
    if (!res) return res;
    res = res.toLowerCase();
    const classNamePart = property.classNamePart;
    if (classNamePart && res.indexOf(classNamePart) < 0) {
      res += classNamePart;
    }
    return res;
  }
  private checkNewObjectOnErrors(
    newObj: any,
    value: any,
    property: JsonObjectProperty,
    className: string
  ): JsonError {
    var error = null;
    if (newObj) {
      error = this.getRequiredError(newObj, value);
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
      this.addNewError(error, value, newObj);
    }
    return error;
  }
  private getRequiredError(obj: any, jsonValue: any): JsonError {
    if (!obj.getType || typeof obj.getData === "function") return null;
    const metaClass = Serializer.findClass(obj.getType());
    if (!metaClass) return null;
    const props = metaClass.getRequiredProperties();
    if (!Array.isArray(props)) return null;
    for (var i = 0; i < props.length; i++) {
      const prop = props[i];
      if (!Helpers.isValueEmpty(prop.defaultValue)) continue;
      if (!jsonValue[prop.name]) {
        return new JsonRequiredPropertyError(prop.name, obj.getType());
      }
    }
    return null;
  }
  private addNewError(error: JsonError, jsonObj: any, element?: Base) {
    error.jsonObj = jsonObj;
    error.element = element;
    this.errors.push(error);
    if (!jsonObj) return;
    const posObj = jsonObj[JsonObject.positionPropertyName];
    if (!posObj) return;
    error.at = posObj.start;
    error.end = posObj.end;
  }
  private valueToArray(
    value: Array<any>,
    obj: any,
    key: any,
    property: JsonObjectProperty,
    options?: ILoadFromJSONOptions
  ) {
    if (obj[key] && !this.isValueArray(obj[key]))
      return;
    if (obj[key] && value.length > 0) obj[key].splice(0, obj[key].length);
    var valueRes = obj[key] ? obj[key] : [];
    this.addValuesIntoArray(value, valueRes, property, options);
    if (!obj[key]) obj[key] = valueRes;
  }
  private addValuesIntoArray(
    value: Array<any>,
    result: Array<any>,
    property: JsonObjectProperty,
    options?: ILoadFromJSONOptions
  ) {
    for (var i = 0; i < value.length; i++) {
      var newValue = this.createNewObj(value[i], property);
      if (newValue.newObj) {
        if (!!value[i].name) {
          newValue.newObj.name = value[i].name;
        }
        if (!!value[i].valueName) {
          newValue.newObj.valueName = value[i].valueName.toString();
        }
        result.push(newValue.newObj);
        this.toObjectCore(value[i], newValue.newObj, options);
      } else {
        if (!newValue.error) {
          result.push(value[i]);
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

/**
 * An alias for the metadata object. It contains object properties' runtime information and allows you to modify it.
 * @see JsonMetadata
 */
export var Serializer = JsonObject.metaData;

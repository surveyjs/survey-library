import { Serializer } from "./jsonobject";
import { ConsoleWarnings } from "./console-warnings";
import { propertyDefaultNotSet } from "./survey-property-defaults-state";
import type { Base } from "./base";

export type PropertyDefaultValue = string | number | boolean | null;
export interface IPropertyDefaults {
  // A class name maps to property names and their default values in this survey. An entry on a parent class
  // reaches its descendants, unless a nearer class in the chain has an entry for the same property.
  [className: string]: { [propertyName: string]: PropertyDefaultValue | undefined } | undefined;
}

function isPlainObject(v: any): boolean {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}
function isPrimitive(v: any): boolean {
  return v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean";
}

// One survey's own property defaults (the propertyDefaults option of the SurveyModel constructor). They are read at
// read time, over the global metadata: nothing is copied into the objects or into the metadata.
// The counters live in survey-property-defaults-state.ts.
export class PropertyDefaultsLayer {
  // resolve() returns it when the layer does not set the property
  public static readonly notCovered: any = propertyDefaultNotSet;

  private classes: { [className: string]: { [propertyName: string]: PropertyDefaultValue } } = {};
  private hasClasses: boolean = false;
  // className -> the values the class and its ancestors set, nearest class first. Built lazily, reset by clear().
  private resolved: Map<string, Map<string, PropertyDefaultValue>>;

  // The values are set once, here. An `undefined` class or property value is not a default.
  constructor(value: IPropertyDefaults) {
    this.setClasses(value);
    this.hasClasses = Object.keys(this.classes).length > 0;
  }
  public get hasValues(): boolean {
    return this.hasClasses;
  }
  // Removes every value (SurveyModel.releasePropertyDefaults)
  public clear(): void {
    this.classes = {};
    this.hasClasses = false;
    this.resolved = undefined;
  }
  // The value of the entry for obj's class or its nearest ancestor, or PropertyDefaultsLayer.notCovered
  public resolve(obj: Base, name: string): any {
    if (!this.hasClasses) return PropertyDefaultsLayer.notCovered;
    const values = this.getClassValues(obj.getType());
    return !!values && values.has(name) ? values.get(name) : PropertyDefaultsLayer.notCovered;
  }
  private getClassValues(className: string): Map<string, PropertyDefaultValue> {
    if (!className) return undefined;
    if (!this.resolved) {
      this.resolved = new Map<string, Map<string, PropertyDefaultValue>>();
    }
    if (this.resolved.has(className)) return this.resolved.get(className);
    const res = new Map<string, PropertyDefaultValue>();
    let name = className.toLowerCase();
    const visited: { [name: string]: boolean } = {};
    while(!!name && !visited[name]) {
      visited[name] = true;
      const entry = this.classes[name];
      if (!!entry) {
        Object.keys(entry).forEach((propName: string) => {
          if (!res.has(propName)) res.set(propName, entry[propName]);
        });
      }
      const classInfo = Serializer.findClass(name);
      name = !!classInfo ? classInfo.parentName : undefined;
    }
    const result = res.size > 0 ? res : undefined;
    this.resolved.set(className, result);
    return result;
  }
  private setClasses(classes: IPropertyDefaults): void {
    if (!isPlainObject(classes)) return;
    const names = Object.keys(classes);
    for (let i = 0; i < names.length; i++) {
      const className = names[i].toLowerCase();
      if (!Serializer.findClass(className)) {
        this.warn(names[i]);
        continue;
      }
      const entry = classes[names[i]];
      if (!isPlainObject(entry)) continue;
      const propNames = Object.keys(entry);
      for (let j = 0; j < propNames.length; j++) {
        this.setValue(className, names[i], propNames[j], entry[propNames[j]]);
      }
    }
  }
  private setValue(className: string, path: string, propName: string, val: any): void {
    const prop = Serializer.findProperty(className, propName);
    if (!prop || prop.isLocalizable) {
      this.warn(path + "." + propName);
      return;
    }
    if (val === undefined) return;
    // Arrays are never a metadata default, and an object would be shared by every object of the survey
    if (!isPrimitive(val)) {
      ConsoleWarnings.warn("The property default \"" + path + "." + propName + "\" must be a string, a number, a boolean or null. It is ignored.");
      return;
    }
    let values = this.classes[className];
    if (!values) {
      values = {};
      this.classes[className] = values;
    }
    values[propName] = val;
  }
  private warn(path: string): void {
    ConsoleWarnings.warn("The property default \"" + path + "\" is unknown or cannot be set per survey. It is ignored.");
  }
}

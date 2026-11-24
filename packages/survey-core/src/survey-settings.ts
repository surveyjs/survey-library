import { settings } from "./settings";
import type { ISurvey } from "./interfaces/survey-interfaces";
import type { SurveyModel } from "./survey";
import { Event } from "./event";
import { ConsoleWarnings } from "./console-warnings";
import type { IPropertyDefaults } from "./survey-property-defaults";

// settings.comparator.normalizeTextCallback stays global only: no converter needs it per survey (decisions.md, C3)
export interface ISurveyRuntimeSettingsComparator {
  trimStrings?: boolean;
  caseSensitive?: boolean;
  // A text that reads as a number is compared as a text with another text (decisions.md, C4)
  numericTextAsText?: boolean;
  // The expression operators compare without loose equality, so true = 1 is false (decisions.md, C5)
  strictEquality?: boolean;
}
export interface ISurveyRuntimeSettings {
  comparator?: ISurveyRuntimeSettingsComparator;
  keepEmptyValues?: boolean;
}
// The names of SurveyModel's events, read from its member types, so a new event needs no change here.
// An event is a public member whose type is an Event and whose name starts with "on"; the run-time check in
// addEventHandlersFromOptions uses the same rule. `any` members are excluded: `any extends Event` matches.
// The key remapping (`as`) visits the declared members one by one; SurveyModel's `[index: string]: any`
// would otherwise turn keyof SurveyModel into `string`. The index signature's key, `string`, is dropped.
type IsAny<T> = 0 extends (1 & T) ? true : false;
type SurveyEventKey<K, T> = K extends `on${string}` ? IsAny<T> extends true ? never : T extends Event<any, any, any> ? K : never : never;
// onElementRerendered is a Base getter, not an event field: it returns the protected _onElementRerendered only
// when a UI renderer enables it, and undefined otherwise. A type cannot tell a getter from a field, so it is excluded by name.
type SurveyEventName = Exclude<keyof { [K in keyof SurveyModel as SurveyEventKey<K, SurveyModel[K]>]: true }, "onElementRerendered">;
// The callback type of the event: (sender: SurveyModel, options: TOptions) => any for EventBase<SurveyModel, TOptions>.
type SurveyEventHandler<K extends SurveyEventName> = SurveyModel[K] extends Event<infer F, any, any> ? F : never;
export type SurveyEventHandlers = {
  [K in SurveyEventName]?: SurveyEventHandler<K> | Array<SurveyEventHandler<K>>;
};
// The options of the SurveyModel constructor. Each is read once, before the JSON loads; none can change later.
export interface ISurveyOptions {
  runtimeSettings?: ISurveyRuntimeSettings;
  events?: SurveyEventHandlers;
  // Not a settings group: it does not mirror the global settings (decisions.md, S2)
  propertyDefaults?: IPropertyDefaults;
}

// The global settings every survey value falls back to (the same object, not a copy).
// Every key of ISurveyRuntimeSettings is optional, so typing it as ISurveyRuntimeSettings would still compile after a key
// is renamed in settings.ts. The deep-required type makes such a rename break the build.
type DeepRequired<T> = { [K in keyof T]-?: T[K] extends Function ? T[K] : T[K] extends object ? DeepRequired<T[K]> : T[K] };
const globalSettings: DeepRequired<ISurveyRuntimeSettings> = settings;

// A settings group is an object of keys (comparator); a top-level setting holds a value itself (keepEmptyValues).
type RuntimeSettingsGroup = { [G in keyof ISurveyRuntimeSettings]-?: NonNullable<ISurveyRuntimeSettings[G]> extends object ? G : never }[keyof ISurveyRuntimeSettings];
type RuntimeSettingsKeys = {
  [N in keyof ISurveyRuntimeSettings]-?: N extends RuntimeSettingsGroup ? { [K in keyof NonNullable<ISurveyRuntimeSettings[N]>]-?: true } : true
};
// The groups with their keys, and the top-level settings (true), a survey can set for itself. The type makes
// the build fail when the interface gets a key this list misses.
const runtimeSettingsKeys: RuntimeSettingsKeys = {
  comparator: { trimStrings: true, caseSensitive: true, numericTextAsText: true, strictEquality: true },
  keepEmptyValues: true
};
function isTopLevelSetting(name: string): boolean {
  return (<any>runtimeSettingsKeys)[name] === true;
}
// The keys of ISurveyOptions. The type makes the build fail when the interface gets a key this list misses.
const surveyOptionKeys: { [K in keyof ISurveyOptions]-?: true } = { runtimeSettings: true, events: true, propertyDefaults: true };

function hasOwn(obj: any, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
// Not Helpers.isValueObject: a DOM element passes it in a browser.
export function isPlainObject(v: any): boolean {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}
// A survey's effective value of one key: the survey's own value when it has one, else the global one.
// runtimeSettings may be undefined (no survey: the global settings), the view of
// SurveyModel.runtimeSettings, or any object a caller passes in code.
export function getRuntimeSetting<G extends RuntimeSettingsGroup, K extends keyof NonNullable<ISurveyRuntimeSettings[G]>>(
  runtimeSettings: ISurveyRuntimeSettings, group: G, key: K): NonNullable<ISurveyRuntimeSettings[G]>[K] {
  const groupValue: any = !!runtimeSettings ? runtimeSettings[group] : undefined;
  const val = !!groupValue ? groupValue[key] : undefined;
  return val !== undefined ? val : globalSettings[group][key];
}

// Subscribes the handlers of the constructor's `events` option, in the order given. A JavaScript caller gets
// no type checking, so an unknown name, or a value that is not a function or an array of functions, is ignored
// with a warning. `undefined` means no handler (the type allows it); `events` that is not a plain object is
// ignored silently, as a settings group is.
export function addEventHandlersFromOptions(survey: SurveyModel, options: ISurveyOptions): void {
  if (!isPlainObject(options) || !isPlainObject(options.events)) return;
  const events: any = options.events;
  const names = Object.keys(events);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    // Events are own fields of the instance. hasOwn keeps prototype members (methods, getters) out without calling a getter.
    const event: any = name.indexOf("on") === 0 && hasOwn(survey, name) ? (<any>survey)[name] : undefined;
    if (!(event instanceof Event)) {
      ConsoleWarnings.warn("The survey event \"" + name + "\" in the constructor options is unknown. It is ignored.");
      continue;
    }
    const value = events[name];
    if (value === undefined) continue;
    const handlers: Array<any> = Array.isArray(value) ? value : [value];
    // An index loop, not some(): some() skips the holes of a sparse array, and the loop below would add them.
    let isValid = true;
    for (let j = 0; j < handlers.length; j++) {
      if (typeof handlers[j] !== "function") isValid = false;
    }
    if (!isValid) {
      ConsoleWarnings.warn("The handler of the survey event \"" + name + "\" in the constructor options is not a function or an array of functions. It is ignored.");
      continue;
    }
    for (let j = 0; j < handlers.length; j++) {
      event.add(handlers[j]);
    }
  }
}

// The settings a comparison passes on (ISurvey.getOwnRuntimeSettings): undefined when there is no survey, or the
// survey sets no key itself. Then the readers take the global settings directly, as before per-survey
// settings existed, so a survey without its own settings pays nothing for them.
export function getRuntimeSettingsOfSurvey(survey: ISurvey): ISurveyRuntimeSettings {
  return !!survey ? survey.getOwnRuntimeSettings() : undefined;
}

// Warns about every key of the constructor options that is not an option. A runtime setting given at the top level
// (the options of v3.2.5-v3.2.7) gets a hint: it belongs under runtimeSettings.
export function warnUnknownSurveyOptions(options: any): void {
  if (!isPlainObject(options)) return;
  const keys = Object.keys(options);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (hasOwn(surveyOptionKeys, key)) continue;
    const hint = hasOwn(runtimeSettingsKeys, key) ? " Set it in the runtimeSettings option." : " It is ignored.";
    ConsoleWarnings.warn("The survey option \"" + key + "\" is unknown." + hint);
  }
}

// One survey's own runtime settings, set once by the constructor. Reads fall back to the global settings per key,
// at read time.
export class SurveyRuntimeSettingsValues {
  // A group's own values are an object under the group name; a top-level setting's own value is stored by its name.
  private values: { [name: string]: any } = {};
  private viewValue: ISurveyRuntimeSettings;
  private hasOwnValuesValue: boolean = false;
  // True when the survey sets at least one key itself
  public get hasOwnValues(): boolean {
    return this.hasOwnValuesValue;
  }
  // key is omitted for a top-level setting.
  public getValue(name: string, key?: string): any {
    if (key === undefined) {
      const ownVal = this.values[name];
      return ownVal !== undefined ? ownVal : (<any>globalSettings)[name];
    }
    const groupValues = this.values[name];
    const val = !!groupValues ? groupValues[key] : undefined;
    return val !== undefined ? val : (<any>globalSettings)[name][key];
  }
  // The read-only view SurveyModel.runtimeSettings returns: own enumerable getters, so JSON.stringify,
  // spread and Object.keys see the effective values. It is frozen, so any write throws in strict mode.
  public get view(): ISurveyRuntimeSettings {
    if (!this.viewValue) {
      this.viewValue = this.createView();
    }
    return this.viewValue;
  }
  // Copies the own values from the constructor's runtimeSettings option. An undefined value is not an own value.
  public setValues(value: any): void {
    if (!isPlainObject(value)) return;
    this.warnUnknownKeys(value);
    // The names written below come from runtimeSettingsKeys, never from value: a "__proto__" key in value
    // cannot reach Object.prototype, and code scanning (CodeQL) sees that no key of value is copied.
    const groups = Object.keys(runtimeSettingsKeys);
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (!hasOwn(value, group)) continue;
      const groupValue = value[group];
      if (isTopLevelSetting(group)) {
        if (groupValue !== undefined) {
          this.values[group] = groupValue;
        }
        continue;
      }
      if (!isPlainObject(groupValue)) continue;
      const groupValues: { [key: string]: any } = {};
      const keys = Object.keys(runtimeSettingsKeys[group]);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (hasOwn(groupValue, key) && groupValue[key] !== undefined) groupValues[key] = groupValue[key];
      }
      if (Object.keys(groupValues).length > 0) {
        this.values[group] = groupValues;
      }
    }
    this.hasOwnValuesValue = Object.keys(this.values).length > 0;
  }
  // Warns, in the order of value, about every key setValues() skips. setValues() reads only the known keys itself.
  private warnUnknownKeys(value: any): void {
    const groups = Object.keys(value);
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (!hasOwn(runtimeSettingsKeys, group)) {
        this.warnUnknownKey(group);
        continue;
      }
      const groupValue = value[group];
      if (isTopLevelSetting(group) || !isPlainObject(groupValue)) continue;
      const knownKeys = runtimeSettingsKeys[group];
      const keys = Object.keys(groupValue);
      for (let j = 0; j < keys.length; j++) {
        if (!hasOwn(knownKeys, keys[j])) {
          this.warnUnknownKey(group + "." + keys[j]);
        }
      }
    }
  }
  private warnUnknownKey(path: string): void {
    ConsoleWarnings.warn("The survey runtime setting \"" + path + "\" is unknown or cannot be set per survey. It is ignored.");
  }
  private createView(): ISurveyRuntimeSettings {
    const res: any = {};
    const groups = Object.keys(runtimeSettingsKeys);
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (isTopLevelSetting(group)) {
        Object.defineProperty(res, group, { enumerable: true, get: () => this.getValue(group) });
        continue;
      }
      const groupView: any = {};
      const keys = Object.keys(runtimeSettingsKeys[group]);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        Object.defineProperty(groupView, key, { enumerable: true, get: () => this.getValue(group, key) });
      }
      Object.freeze(groupView);
      Object.defineProperty(res, group, { enumerable: true, get: () => groupView });
    }
    return Object.freeze(res);
  }
}

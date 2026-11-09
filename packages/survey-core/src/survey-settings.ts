import { settings } from "./settings";
import type { ISurvey } from "./interfaces/survey-interfaces";
import type { SurveyModel } from "./survey";
import { Event } from "./event";
import { ConsoleWarnings } from "./console-warnings";

// settings.comparator.normalizeTextCallback stays global only: no converter needs it per survey (decisions.md, C3)
export interface ISurveySettingsComparator {
  trimStrings?: boolean;
  caseSensitive?: boolean;
  // A text that reads as a number is compared as a text with another text (decisions.md, C4)
  numericTextAsText?: boolean;
}
export interface ISurveySettings {
  comparator?: ISurveySettingsComparator;
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
export interface ISurveyOptions extends ISurveySettings {
  events?: SurveyEventHandlers;
}

// The global settings every survey value falls back to (the same object, not a copy).
// Every key of ISurveySettings is optional, so typing it as ISurveySettings would still compile after a key
// is renamed in settings.ts. The deep-required type makes such a rename break the build.
type DeepRequired<T> = { [K in keyof T]-?: T[K] extends Function ? T[K] : T[K] extends object ? DeepRequired<T[K]> : T[K] };
const globalSettings: DeepRequired<ISurveySettings> = settings;

type SurveySettingsGroup = keyof ISurveySettings;
type SurveySettingsKeys = { [G in SurveySettingsGroup]-?: { [K in keyof NonNullable<ISurveySettings[G]>]-?: true } };
// The groups and keys a survey can set for itself. The type makes the build fail when the interface
// gets a key this list misses.
const surveySettingsKeys: SurveySettingsKeys = {
  comparator: { trimStrings: true, caseSensitive: true, numericTextAsText: true }
};
const reservedOptionKeys = ["events"];

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
// surveySettings may be undefined (no survey: the global settings), the view of
// SurveyModel.getSettings(), or any object a caller passes in code.
export function getSurveySetting<G extends SurveySettingsGroup, K extends keyof NonNullable<ISurveySettings[G]>>(
  surveySettings: ISurveySettings, group: G, key: K): NonNullable<ISurveySettings[G]>[K] {
  const groupValue: any = !!surveySettings ? surveySettings[group] : undefined;
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

// The settings a comparison passes on (ISurvey.getOwnSettings): undefined when there is no survey, or the
// survey sets no key itself. Then the readers take the global settings directly, as before per-survey
// settings existed, so a survey without its own settings pays nothing for them.
export function getSettingsOfSurvey(survey: ISurvey): ISurveySettings {
  return !!survey ? survey.getOwnSettings() : undefined;
}

// One survey's own settings values. Reads fall back to the global settings per key, at read time.
export class SurveySettingsValues {
  private values: { [group: string]: { [key: string]: any } } = {};
  private viewValue: ISurveySettings;
  private hasOwnValuesValue: boolean = false;
  // True when the survey sets at least one key itself; kept up to date by merge().
  public get hasOwnValues(): boolean {
    return this.hasOwnValuesValue;
  }
  public getValue(group: string, key: string): any {
    const groupValues = this.values[group];
    const val = !!groupValues ? groupValues[key] : undefined;
    return val !== undefined ? val : (<any>globalSettings)[group][key];
  }
  // The read-only view SurveyModel.getSettings() returns: own enumerable getters, so JSON.stringify,
  // spread and Object.keys see the effective values. It is frozen, so any write throws in strict mode.
  public get view(): ISurveySettings {
    if (!this.viewValue) {
      this.viewValue = this.createView();
    }
    return this.viewValue;
  }
  // Merges value into the own values; returns true when an own value changed (by reference).
  // isOptions: the value comes from the constructor, where the reserved option keys are not settings.
  public merge(value: any, isOptions: boolean): boolean {
    if (!isPlainObject(value)) return false;
    let changed = false;
    const groups = Object.keys(value);
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (reservedOptionKeys.indexOf(group) > -1) {
        if (!isOptions) {
          ConsoleWarnings.warn("survey.settings() does not take \"" + group + "\". Use survey.onX.add() to handle events after the survey is created.");
        }
        continue;
      }
      if (!hasOwn(surveySettingsKeys, group)) {
        this.warnUnknownKey(group);
        continue;
      }
      const groupValue = value[group];
      if (groupValue === undefined) {
        if (this.clearGroup(group)) changed = true;
        continue;
      }
      if (!isPlainObject(groupValue)) continue;
      const knownKeys = surveySettingsKeys[group];
      const keys = Object.keys(groupValue);
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (!hasOwn(knownKeys, key)) {
          this.warnUnknownKey(group + "." + key);
          continue;
        }
        if (this.setOwnValue(group, key, groupValue[key])) changed = true;
      }
    }
    if (changed) {
      this.hasOwnValuesValue = Object.keys(this.values).some((group: string): boolean => Object.keys(this.values[group]).length > 0);
    }
    return changed;
  }
  private warnUnknownKey(path: string): void {
    ConsoleWarnings.warn("The survey setting \"" + path + "\" is unknown or cannot be set per survey. It is ignored.");
  }
  private clearGroup(group: string): boolean {
    const groupValues = this.values[group];
    if (!groupValues) return false;
    delete this.values[group];
    return Object.keys(groupValues).length > 0;
  }
  private setOwnValue(group: string, key: string, val: any): boolean {
    let groupValues = this.values[group];
    if (val === undefined) {
      if (!groupValues || !hasOwn(groupValues, key)) return false;
      delete groupValues[key];
      return true;
    }
    if (!groupValues) {
      groupValues = {};
      this.values[group] = groupValues;
    }
    if (hasOwn(groupValues, key) && groupValues[key] === val) return false;
    groupValues[key] = val;
    return true;
  }
  private createView(): ISurveySettings {
    const res: any = {};
    const groups = Object.keys(surveySettingsKeys);
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const groupView: any = {};
      const keys = Object.keys(surveySettingsKeys[group]);
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

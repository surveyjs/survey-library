import { JsonObjectProperty } from "survey-core";
import { KnownKeys, LintMetadata } from "./metadata";
import { ISurveyLintOptions } from "./types";
import { ILintResolvedSettings } from "./lint-settings";

// One walk of the raw JSON that mirrors the deserializer: which key belongs to which class,
// which value is walked further, which key belongs to nothing. Three rules read the result -
// property/unknown, property/dead and property/invalid-value - so it is built once.
//
// The walk stops wherever the deserializer stops making a survey object out of the JSON: a
// value with no class behind it (defaultValue, bindings, a localized string) is data, not a
// nested object, and nothing inside it is a property of anything.

export interface PropertyOwner {
  name?: string;
  type?: string;
}

export interface PropertySite {
  className: string;
  key: string;
  prop: JsonObjectProperty;
  value: any;
  path: string;
  json: any;
  owner: PropertyOwner;
}

export interface UnknownKeySite {
  className: string;
  key: string;
  path: string;
  knownKeys: Array<string>;
  owner: PropertyOwner;
}

export interface AliasPairSite {
  className: string;
  key: string;
  aliasKey: string;
  // the key the deserializer applies last, which is the value that survives
  winner: string;
  path: string;
  aliasPath: string;
  owner: PropertyOwner;
}

export interface PropertyWalkResult {
  props: Array<PropertySite>;
  unknownKeys: Array<UnknownKeySite>;
  aliasPairs: Array<AliasPairSite>;
}

interface WalkState {
  metadata: LintMetadata;
  options: ISurveyLintOptions;
  settings: ILintResolvedSettings;
  visited: WeakSet<any>;
  result: PropertyWalkResult;
}

const SURVEY_CLASS = "survey";
const COLUMN_CLASS = "matrixdropdowncolumn";
// mask/mismatch resolves these against the sibling maskType and owns every finding about them
const MASK_SETTINGS_CLASS = "masksettings";
const TYPE_KEY = "type";
const POSITION_KEY = "pos";
const MAX_DEPTH = 30;

function isPlainObject(value: any): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function ownerOf(json: any, className: string, parentOwner: PropertyOwner): PropertyOwner {
  if (typeof json.name === "string" && !!json.name) {
    return { name: json.name, type: typeof json.type === "string" ? json.type : className };
  }
  return parentOwner;
}

// Serializer.getClassNameForNewObj: the property names the class, or the value's own "type"
// does, and the array's classNamePart completes a short name ("setvalue" -> "setvaluetrigger").
function resolveClassName(value: any, prop: JsonObjectProperty): string | undefined {
  let res: any = !!prop && !!prop.className ? prop.className : undefined;
  if (!res && isPlainObject(value)) res = value[TYPE_KEY];
  if (typeof res !== "string" || !res) return undefined;
  res = res.toLowerCase();
  const part = !!prop ? prop.classNamePart : undefined;
  if (!!part && res.indexOf(part) < 0) res += part;
  return res;
}

// The cell type a column's dynamic properties come from, defaulted the way the model defaults
// it (matrix cellType, then settings.matrix.defaultCellType).
function resolveCellType(columnJson: any, matrixJson: any, settings: ILintResolvedSettings): string {
  const fallback = ((matrixJson ? matrixJson.cellType : undefined) || settings.matrixDefaultCellType).toLowerCase();
  const own = ((columnJson ? columnJson.cellType : undefined) || fallback).toLowerCase();
  return own === "default" ? fallback : own;
}

function getKnownKeys(state: WalkState, className: string, json: any, parentJson: any): KnownKeys {
  if (className === COLUMN_CLASS) {
    return state.metadata.getColumnKnownKeys(resolveCellType(json, parentJson, state.settings));
  }
  return state.metadata.getKnownKeys(className);
}

// A component decides for itself what its JSON carries: the core's property table describes
// the question it wraps, not the JSON an author writes for the component.
function isComponentClass(state: WalkState, className: string, json: any): boolean {
  const type = isPlainObject(json) && typeof json[TYPE_KEY] === "string" ? json[TYPE_KEY] : className;
  if (state.metadata.isComponentType(type)) return true;
  const components = state.options.components;
  return !!components && Object.keys(components).some(name => name.toLowerCase() === type.toLowerCase());
}

function addAliasPair(state: WalkState, json: any, prop: JsonObjectProperty, key: string,
  path: string, owner: PropertyOwner, className: string, seenKeys: Array<string>): void {
  const other = key === prop.name ? prop.alternativeName : prop.name;
  if (!other || seenKeys.indexOf(other) < 0) return;
  // "for key in" applies them in JSON order, so the later key wins
  const keys = Object.keys(json);
  const winner = keys.indexOf(key) > keys.indexOf(other) ? key : other;
  state.result.aliasPairs.push({
    className: className, key: key, aliasKey: other, winner: winner,
    path: path, aliasPath: pathOf(path, other), owner: owner,
  });
}

function pathOf(keyPath: string, key: string): string {
  const base = keyPath.substring(0, keyPath.lastIndexOf("."));
  return base ? base + "." + key : key;
}

function walkValue(state: WalkState, value: any, prop: JsonObjectProperty, path: string,
  parentJson: any, owner: PropertyOwner, depth: number): void {
  // a localizable value is a string or a per-locale object, never a nested survey object
  if (prop.isLocalizable || !!prop.serializationProperty) return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (!isPlainObject(item)) return;
      const className = resolveClassName(item, prop);
      if (!className) return;
      walkObject(state, item, className, path + "[" + i + "]", parentJson, owner, depth + 1);
    });
    return;
  }
  if (!isPlainObject(value)) return;
  const className = resolveClassName(value, prop);
  if (!className || className === MASK_SETTINGS_CLASS) return;
  walkObject(state, value, className, path, parentJson, owner, depth + 1);
}

function walkObject(state: WalkState, json: any, className: string, path: string,
  parentJson: any, parentOwner: PropertyOwner, depth: number): void {
  if (depth > MAX_DEPTH || state.visited.has(json)) return;
  state.visited.add(json);
  const known = getKnownKeys(state, className, json, parentJson);
  // an unregistered class carries no property table: element/unknown-type and the
  // */unknown-type rules own whatever the JSON says here
  if (!known) return;
  const owner = ownerOf(json, className, parentOwner);
  const reportUnknown = !isComponentClass(state, className, json);
  const keys = Object.keys(json);
  keys.forEach(key => {
    if (key === TYPE_KEY || key === POSITION_KEY) return;
    const keyPath = path ? path + "." + key : key;
    const prop = known.byKey.get(key);
    if (!prop) {
      if (reportUnknown) {
        state.result.unknownKeys.push({
          className: className, key: key, path: keyPath, knownKeys: known.names, owner: owner,
        });
      }
      return;
    }
    state.result.props.push({
      className: className, key: key, prop: prop, value: json[key],
      path: keyPath, json: json, owner: owner,
    });
    addAliasPair(state, json, prop, key, keyPath, owner, className, keys);
    walkValue(state, json[key], prop, keyPath, json, owner, depth);
  });
}

export function walkProperties(json: any, metadata: LintMetadata, options: ISurveyLintOptions,
  settings: ILintResolvedSettings): PropertyWalkResult {
  const state: WalkState = {
    metadata: metadata, options: options, settings: settings, visited: new WeakSet(),
    result: { props: [], unknownKeys: [], aliasPairs: [] },
  };
  walkObject(state, json, SURVEY_CLASS, "", undefined, {}, 0);
  return state.result;
}

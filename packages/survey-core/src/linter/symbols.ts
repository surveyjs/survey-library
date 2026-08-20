import { Operand } from "../expressions/expressions";
import { IComponentDef } from "./types";
import { ILintResolvedSettings } from "./lint-settings";

// Case-insensitive single-value map that preserves the original key casing.
// Backed by a native Map: element names come from user JSON, so keys like
// "constructor" or "__proto__" must not collide with Object.prototype.
export class CIMap<T> {
  private items = new Map<string, { name: string, value: T }>();
  public set(name: string, value: T): void {
    this.items.set(name.toLowerCase(), { name: name, value: value });
  }
  public get(name: string): T | undefined {
    const item = this.items.get((name || "").toLowerCase());
    return item ? item.value : undefined;
  }
  public has(name: string): boolean {
    return this.items.has((name || "").toLowerCase());
  }
  public get size(): number { return this.items.size; }
  public names(): Array<string> {
    const res: Array<string> = [];
    this.items.forEach(item => res.push(item.name));
    return res;
  }
  public forEach(callback: (value: T, name: string) => void): void {
    this.items.forEach(item => callback(item.value, item.name));
  }
}

// Case-insensitive multi-value map: keeps every record registered under a name.
export class CIMultiMap<T> {
  private items = new Map<string, { name: string, values: Array<T> }>();
  public add(name: string, value: T): void {
    const key = name.toLowerCase();
    let bucket = this.items.get(key);
    if (!bucket) {
      bucket = { name: name, values: [] };
      this.items.set(key, bucket);
    }
    bucket.values.push(value);
  }
  public get(name: string): Array<T> {
    const bucket = this.items.get((name || "").toLowerCase());
    return bucket ? bucket.values : [];
  }
  public has(name: string): boolean {
    return this.get(name).length > 0;
  }
  public first(name: string): T | undefined {
    const values = this.get(name);
    return values.length > 0 ? values[0] : undefined;
  }
  public names(): Array<string> {
    const res: Array<string> = [];
    this.items.forEach(bucket => res.push(bucket.name));
    return res;
  }
  public forEach(callback: (values: Array<T>, name: string) => void): void {
    this.items.forEach(bucket => callback(bucket.values, bucket.name));
  }
}

export type ElementKind = "question" | "panel" | "page" | "column" | "multipletextitem";

export interface ChoicesInfo {
  staticValues: Array<any>;
  hasChoicesByUrl: boolean;
  lazy: boolean;
  carryForwardFrom?: string;
  carryForwardValuesFrom?: string;
  carryForwardTextsFrom?: string;
  showOtherItem: boolean;
  showNoneItem: boolean;
  showRefuseItem: boolean;
  showDontKnowItem: boolean;
}

export type ValueShape = "scalar" | "array" | "object" | "none" | "unknown";
export type ScalarType = "number" | "string" | "boolean" | "date" | "any";

export interface ValueTypeInfo {
  shape: ValueShape;
  scalarType?: ScalarType;
}

export interface ScopeFramePanelDynamic {
  kind: "panelDynamic";
  owner: ElementRecord;
  templateNames: CIMultiMap<ElementRecord>;
}
export interface ScopeFrameMatrixRow {
  kind: "matrixRow";
  owner: ElementRecord;
  columns: CIMultiMap<ElementRecord>;
}
export interface ScopeFrameItemValue {
  kind: "itemValue";
  owner: ElementRecord;
}
export interface ScopeFrameComposite {
  kind: "composite";
  // unset when the frame comes from walking a component definition itself,
  // where no survey element hosts the expression
  owner?: ElementRecord;
  fieldNames: CIMap<boolean>;
}
export type ScopeFrame = ScopeFramePanelDynamic | ScopeFrameMatrixRow | ScopeFrameItemValue | ScopeFrameComposite;

export interface ElementRecord {
  name: string;
  valueName?: string;
  type: string;
  kind: ElementKind;
  path: string;
  json: any;
  parent?: ElementRecord;
  scope: Array<ScopeFrame>;
  isUnknownType: boolean;
  componentDef?: IComponentDef;
  componentFieldNames?: CIMap<boolean>;
  choicesInfo?: ChoicesInfo;
  valueType: ValueTypeInfo;
  // subpath-validation data per element type
  multipleTextItems?: CIMap<ElementRecord>;
  matrixRowValues?: Array<any>;
  matrixColumnValues?: Array<any>;
  templateNames?: CIMultiMap<ElementRecord>;
  matrixColumns?: CIMultiMap<ElementRecord>;
  // memoized descendant question names for static-panel {panel.x} resolution
  panelDescendantNames?: CIMap<ElementRecord>;
}

export interface ParsedRefSegment {
  name: string;
  index?: number;
}

export type RefStatus = "resolved" | "unknown" | "skipped" | "scoped-resolved" | "scoped-unknown";

export type ResolvedRefKind = "element" | "calculatedValue" | "page" | "knownVariable" | "scope" | "comment";

export interface ParsedRef {
  raw: string;
  segments: Array<ParsedRefSegment>;
  status: RefStatus;
  resolvedTo?: ElementRecord;
  resolvedKind?: ResolvedRefKind;
  unknownSegmentIndex?: number;
  scopePrefix?: string;
  scopeHint?: string;
  suggestion?: string;
}

export type ExpressionSiteKind = "condition" | "expression";

export interface ExpressionSite {
  text: string;
  kind: ExpressionSiteKind;
  path: string;
  prop: string;
  owner?: ElementRecord;
  scope: Array<ScopeFrame>;
  synthesized?: boolean;
  ast?: Operand;
  parseError?: { at?: number, message?: string };
  refs?: Array<ParsedRef>;
}

export type NameRefKind = "choicesByUrlVariable" | "binding";

export interface NameRef {
  name: string;
  path: string;
  owner?: ElementRecord;
  scope: Array<ScopeFrame>;
  kind: NameRefKind;
}

export interface TriggerTargetRef {
  prop: string;
  path: string;
  name: string;
  kind: "questionvalue" | "question" | "page";
}

export interface TriggerRecord {
  type: string;
  index: number;
  path: string;
  json: any;
  expressionSite?: ExpressionSite;
  setRoot?: string;
  setToName?: string;
  targets: Array<TriggerTargetRef>;
}

export interface CalculatedValueRecord {
  name: string;
  path: string;
  expression?: string;
  site?: ExpressionSite;
}

export interface ContainerRecord {
  kind: "page" | "panel" | "panelDynamicTemplate";
  record?: ElementRecord;
  name?: string;
  path: string;
  json: any;
  children: Array<ElementRecord>;
}

export interface Namespace {
  label: string;
  map: CIMultiMap<ElementRecord>;
}

export interface SurveyIndex {
  json: any;
  byName: CIMultiMap<ElementRecord>;
  byValueName: CIMultiMap<ElementRecord>;
  calculatedValues: CIMap<CalculatedValueRecord>;
  triggers: Array<TriggerRecord>;
  expressionSites: Array<ExpressionSite>;
  nameRefs: Array<NameRef>;
  allElements: Array<ElementRecord>;
  containers: Array<ContainerRecord>;
  namespaces: Array<Namespace>;
  // effective settings for this run: options.settings over this bundle's defaults
  settings: ILintResolvedSettings;
}

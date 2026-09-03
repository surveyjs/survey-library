import { TextPreProcessor, buildTriggerExpression } from "survey-core";
import { ISurveyLintOptions, IComponentDef } from "./types";
import {
  ITEMVALUE_SCOPED_PROPS, TEMPLATE_SCOPED_PROPS, TEXT_SCOPED_PROPS, TEXT_TEMPLATE_PROPS,
} from "./catalog";
import { ExpressionPropDef, LintMetadata, isMatrixDropdown, isPanel, isSelectBase } from "./metadata";
import { parseExpressionText, splitRefSegments } from "./expression-utils";
import { resolveLintSettings } from "./lint-settings";
import {
  CalculatedValueRecord, NameRefKind, CIMap, CIMultiMap, ContainerRecord, ElementRecord, ExpressionSite,
  ExpressionSiteKind, ScopeFrame, ScopeFrameComposite, ScopeFrameItemValue, ScopeFrameMatrixRow,
  ScopeFramePanelDynamic, SurveyIndex, TriggerRecord, TriggerTargetRef,
} from "./symbols";
import { getChoicesInfo, getStaticChoiceValues, getValueTypeInfo } from "./value-types";

const MAX_DEPTH = 128;

interface WalkState {
  index: SurveyIndex;
  options: ISurveyLintOptions;
  metadata: LintMetadata;
  visited: WeakSet<object>;
  depth: number;
  // one component definition is walked once, however many questions instantiate it
  componentFields: Map<IComponentDef, CIMap<boolean>>;
}

function joinPath(base: string, key: string): string {
  return base ? base + "." + key : key;
}

function isNonEmptyString(value: any): boolean {
  return typeof value === "string" && value.trim() !== "";
}

function itemValueFrame(owner: ElementRecord): ScopeFrameItemValue {
  return { kind: "itemValue", owner: owner };
}

function addSite(state: WalkState, text: string, kind: ExpressionSiteKind, path: string, prop: string,
  owner: ElementRecord, scope: Array<ScopeFrame>, synthesized?: boolean): ExpressionSite {
  const site: ExpressionSite = {
    text: text, kind: kind, path: path, prop: prop, owner: owner,
    scope: scope.slice(), synthesized: synthesized === true,
  };
  const outcome = parseExpressionText(text);
  if (outcome.ast) site.ast = outcome.ast;
  else site.parseError = outcome.error;
  state.index.expressionSites.push(site);
  return site;
}

// One site per non-empty expression property. A property whose condition runs against
// the owner's own items (choicesVisibleIf, rowsVisibleIf, ...) gets an extra itemValue
// frame; a property scoped to a dynamic-panel template is skipped unless the caller
// passes that scope, because it exists only inside walkQuestion.
function addSitesFromProps(state: WalkState, json: any, basePath: string, props: Array<ExpressionPropDef>,
  owner: ElementRecord, scope: Array<ScopeFrame>, templateScope?: Array<ScopeFrame>): void {
  let itemScope: Array<ScopeFrame> = undefined;
  props.forEach(def => {
    if (!isNonEmptyString(json[def.name])) return;
    const key = def.name.toLowerCase();
    let siteScope = scope;
    if (TEMPLATE_SCOPED_PROPS.has(key)) {
      if (!templateScope) return;
      siteScope = templateScope;
    } else if (ITEMVALUE_SCOPED_PROPS.has(key)) {
      if (!itemScope) itemScope = scope.concat([itemValueFrame(owner)]);
      siteScope = itemScope;
    }
    addSite(state, json[def.name], def.kind, joinPath(basePath, def.name), def.name, owner, siteScope);
  });
}

function addValidatorSites(state: WalkState, json: any, basePath: string, owner: ElementRecord,
  scope: Array<ScopeFrame>): void {
  if (!Array.isArray(json.validators)) return;
  json.validators.forEach((validator: any, i: number) => {
    if (!validator || typeof validator !== "object") return;
    const props = state.metadata.getValidatorExpressionProps(validator.type);
    const className = state.metadata.getValidatorClassName(validator.type);
    const locProps = state.metadata.getLocalizableProps(className);
    const validatorPath = basePath + ".validators[" + i + "]";
    addSitesFromProps(state, validator, validatorPath, props, owner, scope);
    addTextRefsFromProps(state, validator, validatorPath, locProps, owner, scope);
  });
}

// Walks an itemvalue-like array property; the item class - and so which conditions the
// items carry - comes from the array property's own metadata.
function addItemValueSites(state: WalkState, json: any, propName: string, ownerType: string,
  basePath: string, owner: ElementRecord, scope: Array<ScopeFrame>): void {
  const arr = json[propName];
  if (!Array.isArray(arr)) return;
  const props = state.metadata.getItemExpressionProps(ownerType, propName);
  const locProps = state.metadata.getItemLocalizableProps(ownerType, propName);
  if (props.length === 0 && locProps.length === 0) return;
  const itemScope = scope.concat([itemValueFrame(owner)]);
  arr.forEach((item: any, i: number) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return;
    const itemPath = basePath + "." + propName + "[" + i + "]";
    addSitesFromProps(state, item, itemPath, props, owner, itemScope);
    addTextRefsFromProps(state, item, itemPath, locProps, owner, itemScope);
  });
}

// The innermost scope frame that owns element names (dynamic-panel template or matrix row).
function getCapturingFrame(scope: Array<ScopeFrame>): ScopeFramePanelDynamic | ScopeFrameMatrixRow | undefined {
  for (let i = scope.length - 1; i >= 0; i--) {
    const frame = scope[i];
    if (frame.kind === "panelDynamic" || frame.kind === "matrixRow") return frame;
  }
  return undefined;
}

function registerRecord(state: WalkState, record: ElementRecord, ancestorPanels: Array<ElementRecord>): void {
  state.index.allElements.push(record);
  const frame = getCapturingFrame(record.scope);
  if (record.name) {
    if (frame) {
      const map = frame.kind === "panelDynamic" ? frame.templateNames : frame.columns;
      map.add(record.name, record);
    } else {
      state.index.byName.add(record.name, record);
      if (record.valueName) state.index.byValueName.add(record.valueName, record);
    }
  }
  if (record.kind === "question") {
    ancestorPanels.forEach(panel => {
      if (panel.panelDescendantNames && record.name) {
        panel.panelDescendantNames.set(record.name, record);
      }
    });
  }
}

// The field names a composite definition declares. Memoized per definition: the JSON is
// static, and a survey with many questions of one component type would otherwise walk it
// once per question.
function getComponentFieldNames(state: WalkState, def: IComponentDef): CIMap<boolean> {
  const cached = state.componentFields.get(def);
  if (cached) return cached;
  const res = new CIMap<boolean>();
  const elementsKeys = state.metadata.getElementsKeys();
  const templateKeys = state.metadata.getTemplateElementsKeys();
  const collect = (elements: any) => {
    if (!Array.isArray(elements)) return;
    elements.forEach((el: any) => {
      if (!el || typeof el !== "object") return;
      if (isNonEmptyString(el.name)) res.set(el.name, true);
      elementsKeys.forEach(key => collect(el[key]));
      templateKeys.forEach(key => collect(el[key]));
    });
  };
  collect(def.elementsJSON);
  state.componentFields.set(def, res);
  return res;
}

// Lints expressions inside composite component definitions (options.components).
// Definition elements are template-local: they get expression sites with a
// composite scope frame (so {composite.x} resolves against the field names) but
// are never registered under their names in the survey index. Nested containers
// inside a definition are not descended into: their panel/template scope
// semantics differ from the survey body and would produce false positives.
function walkComponentDefs(state: WalkState): void {
  const components = state.options.components;
  if (!components) return;
  Object.keys(components).forEach(typeName => {
    const def = components[typeName];
    if (!def || !Array.isArray(def.elementsJSON)) return;
    const frame: ScopeFrameComposite = {
      kind: "composite", fieldNames: getComponentFieldNames(state, def),
    };
    const scope: Array<ScopeFrame> = [frame];
    def.elementsJSON.forEach((el: any, i: number) => {
      if (!el || typeof el !== "object") return;
      const path = "components." + typeName + ".elementsJSON[" + i + "]";
      const type = (el.type || "").toLowerCase();
      const record: ElementRecord = {
        name: el.name || "", type: type, kind: "question", path: path, json: el,
        scope: scope.slice(), isUnknownType: false, valueType: getValueTypeInfo(type, el),
      };
      addSitesFromProps(state, el, path,
        state.metadata.getElementExpressionProps(type, "question"), record, scope);
      addValidatorSites(state, el, path, record, scope);
    });
  });
}

function guardEnter(state: WalkState, json: any): boolean {
  if (state.depth >= MAX_DEPTH) return false;
  if (state.visited.has(json)) return false;
  state.visited.add(json);
  state.depth++;
  return true;
}

function guardLeave(state: WalkState): void {
  state.depth--;
}

function getArrayByKeys(json: any, keys: Array<string>): { key: string, elements: Array<any> } | undefined {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (Array.isArray(json[key])) return { key: key, elements: json[key] };
  }
  return undefined;
}

function getElementsArray(state: WalkState, json: any): { key: string, elements: Array<any> } | undefined {
  return getArrayByKeys(json, state.metadata.getElementsKeys());
}

function walkElementsArray(state: WalkState, elements: Array<any>, basePath: string,
  parent: ElementRecord, scope: Array<ScopeFrame>, ancestorPanels: Array<ElementRecord>,
  container: ContainerRecord): void {
  elements.forEach((element: any, i: number) => {
    if (!element || typeof element !== "object" || Array.isArray(element)) return;
    const path = basePath + "[" + i + "]";
    const type = (element.type || "").toLowerCase();
    const record = isPanel(type)
      ? walkPanel(state, element, path, parent, scope, ancestorPanels)
      : walkQuestion(state, element, path, parent, scope, ancestorPanels);
    if (record && container) container.children.push(record);
  });
}

function walkPanel(state: WalkState, json: any, path: string, parent: ElementRecord,
  scope: Array<ScopeFrame>, ancestorPanels: Array<ElementRecord>): ElementRecord {
  if (!guardEnter(state, json)) return undefined;
  const record: ElementRecord = {
    name: json.name || "", type: (json.type || "").toLowerCase(), kind: "panel",
    path: path, json: json, parent: parent, scope: scope.slice(),
    isUnknownType: false, valueType: { shape: "none" },
    panelDescendantNames: new CIMap<ElementRecord>(),
  };
  registerRecord(state, record, ancestorPanels);
  addSitesFromProps(state, json, path,
    state.metadata.getElementExpressionProps(record.type, "panel"), record, scope);
  addTextRefsFromProps(state, json, path,
    state.metadata.getElementLocalizableProps(record.type, "panel"), record, scope);
  const container: ContainerRecord = {
    kind: "panel", record: record, name: record.name, path: path, children: [],
  };
  state.index.containers.push(container);
  const inner = getElementsArray(state, json);
  if (inner) {
    walkElementsArray(state, inner.elements, joinPath(path, inner.key), record, scope,
      ancestorPanels.concat([record]), container);
  }
  guardLeave(state);
  return record;
}

function walkMatrixColumns(state: WalkState, json: any, path: string, record: ElementRecord,
  scope: Array<ScopeFrame>): Array<ScopeFrame> {
  const frame: ScopeFrameMatrixRow = { kind: "matrixRow", owner: record, columns: new CIMultiMap<ElementRecord>() };
  record.matrixColumns = frame.columns;
  const rowScope = scope.concat([frame]);
  state.index.namespaces.push({
    label: "matrix \"" + (record.name || record.path) + "\"", map: frame.columns,
  });
  const defaultCellType = (json.cellType || state.index.settings.matrixDefaultCellType).toLowerCase();
  if (Array.isArray(json.columns)) {
    json.columns.forEach((column: any, i: number) => {
      if (!column || typeof column !== "object") return;
      const columnPath = path + ".columns[" + i + "]";
      const cellType = (column.cellType || defaultCellType).toLowerCase();
      const effectiveCellType = cellType === "default" ? defaultCellType : cellType;
      const columnJson = column;
      const columnRecord: ElementRecord = {
        name: column.name || "", type: "matrixdropdowncolumn", effectiveType: effectiveCellType, kind: "column",
        path: columnPath, json: columnJson, parent: record, scope: rowScope.slice(),
        isUnknownType: false,
        valueType: getValueTypeInfo(effectiveCellType, columnJson),
        choicesInfo: undefined,
      };
      // only select-base cells use choices; a text/comment/boolean/... cell
      // accepts any value, and the shared matrix "choices" do not apply to it
      const choicesInfo = isSelectBase(effectiveCellType)
        ? getChoicesInfo(columnJson, "matrixdropdowncolumn") : undefined;
      if (choicesInfo) {
        // a column without own choices uses the matrix-level shared "choices"
        if (choicesInfo.staticValues.length === 0 && Array.isArray(json.choices)) {
          choicesInfo.staticValues = getStaticChoiceValues(json.choices);
        }
        columnRecord.choicesInfo = choicesInfo;
      }
      state.index.allElements.push(columnRecord);
      if (columnRecord.name) frame.columns.add(columnRecord.name, columnRecord);
      addSitesFromProps(state, columnJson, columnPath,
        state.metadata.getCellExpressionProps(effectiveCellType), columnRecord, rowScope);
      addTextRefsFromProps(state, columnJson, columnPath,
        state.metadata.getCellLocalizableProps(effectiveCellType), columnRecord, rowScope);
      addValidatorSites(state, columnJson, columnPath, columnRecord, rowScope);
      addItemValueSites(state, columnJson, "choices", effectiveCellType, columnPath, columnRecord, rowScope);
    });
  }
  if (Array.isArray(json.detailElements)) {
    walkElementsArray(state, json.detailElements, path + ".detailElements", record, rowScope, [], undefined);
  }
  return rowScope;
}

function walkMultipleTextItems(state: WalkState, json: any, path: string, record: ElementRecord,
  scope: Array<ScopeFrame>): void {
  record.multipleTextItems = new CIMap<ElementRecord>();
  if (!Array.isArray(json.items)) return;
  const itemProps = state.metadata.getItemExpressionProps("multipletext", "items");
  const locProps = state.metadata.getLocalizableProps("multipletextitem");
  json.items.forEach((item: any, i: number) => {
    if (!item || typeof item !== "object") return;
    const itemPath = path + ".items[" + i + "]";
    const itemRecord: ElementRecord = {
      name: item.name || "", type: "multipletextitem", kind: "multipletextitem",
      path: itemPath, json: item, parent: record, scope: scope.slice(),
      isUnknownType: false, valueType: getValueTypeInfo("text", item),
    };
    state.index.allElements.push(itemRecord);
    if (itemRecord.name) record.multipleTextItems.set(itemRecord.name, itemRecord);
    addSitesFromProps(state, item, itemPath, itemProps, itemRecord, scope);
    addTextRefsFromProps(state, item, itemPath, locProps, itemRecord, scope);
    addValidatorSites(state, item, itemPath, itemRecord, scope);
  });
}

function walkQuestion(state: WalkState, json: any, path: string, parent: ElementRecord,
  scope: Array<ScopeFrame>, ancestorPanels: Array<ElementRecord>): ElementRecord {
  if (!guardEnter(state, json)) return undefined;
  const type = (json.type || "").toLowerCase();
  // components is a caller-supplied plain object: guard against inherited keys
  const components = state.options.components;
  const componentDef = components && Object.prototype.hasOwnProperty.call(components, type)
    ? components[type] : undefined;
  const record: ElementRecord = {
    name: json.name || "", valueName: isNonEmptyString(json.valueName) ? json.valueName : undefined,
    type: type, kind: "question", path: path, json: json, parent: parent, scope: scope.slice(),
    isUnknownType: !state.metadata.isKnownElementType(type) && !componentDef,
    componentDef: componentDef,
    valueType: getValueTypeInfo(type, json),
    choicesInfo: getChoicesInfo(json, type),
  };
  if (componentDef && componentDef.elementsJSON) {
    record.componentFieldNames = getComponentFieldNames(state, componentDef);
  }
  registerRecord(state, record, ancestorPanels);

  // the dynamic-panel template frame is built before the expression pass because
  // templateVisibleIf is evaluated inside it (see TEMPLATE_SCOPED_PROPS)
  let templateScope: Array<ScopeFrame> = undefined;
  let rowScope: Array<ScopeFrame> = undefined;
  if (type === "paneldynamic") {
    const frame: ScopeFramePanelDynamic = {
      kind: "panelDynamic", owner: record, templateNames: new CIMultiMap<ElementRecord>(),
    };
    record.templateNames = frame.templateNames;
    templateScope = scope.concat([frame]);
    state.index.namespaces.push({
      label: "dynamic panel \"" + (record.name || record.path) + "\"", map: frame.templateNames,
    });
  }

  addSitesFromProps(state, json, path, state.metadata.getElementExpressionProps(type, "question"),
    record, scope, templateScope);
  addValidatorSites(state, json, path, record, scope);

  if (isSelectBase(type)) {
    addItemValueSites(state, json, "choices", type, path, record, scope);
    // choiceitem.elements: full questions nested inside a choice
    if (Array.isArray(json.choices)) {
      json.choices.forEach((choice: any, i: number) => {
        if (!choice || typeof choice !== "object" || !Array.isArray(choice.elements)) return;
        walkElementsArray(state, choice.elements, path + ".choices[" + i + "].elements",
          record, scope, ancestorPanels, undefined);
      });
    }
    if (json.choicesByUrl && typeof json.choicesByUrl === "object") {
      // path is processed with the very same processor as url, and a name missing from
      // either of them blanks both, so the request never runs (ChoicesRestful.processedText)
      ["url", "path"].forEach(key => {
        collectTextRefs(state, json.choicesByUrl[key], path + ".choicesByUrl." + key,
          key, record, scope, "choicesByUrlVariable");
      });
    }
  }
  if (type === "matrix") {
    record.matrixRowValues = getStaticChoiceValues(json.rows);
    addItemValueSites(state, json, "rows", type, path, record, scope);
    addItemValueSites(state, json, "columns", type, path, record, scope);
  }
  if (isMatrixDropdown(type)) {
    if (type === "matrixdropdown") {
      record.matrixRowValues = getStaticChoiceValues(json.rows);
      addItemValueSites(state, json, "rows", type, path, record, scope);
    }
    rowScope = walkMatrixColumns(state, json, path, record, scope);
  }
  if (type === "rating") {
    addItemValueSites(state, json, "rateValues", type, path, record, scope);
  }
  if (type === "imagemap") {
    // imagemap areas extend itemvalue; their visibleIf/enableIf run at runtime
    addItemValueSites(state, json, "areas", type, path, record, scope);
  }
  if (type === "slider") {
    addItemValueSites(state, json, "customLabels", type, path, record, scope);
  }
  if (type === "multipletext") {
    walkMultipleTextItems(state, json, path, record, scope);
  }
  if (!!templateScope) {
    const template = getArrayByKeys(json, state.metadata.getTemplateElementsKeys());
    const container: ContainerRecord = {
      kind: "panelDynamicTemplate", record: record, name: record.name, path: path, children: [],
    };
    state.index.containers.push(container);
    if (template) {
      walkElementsArray(state, template.elements, joinPath(path, template.key), record,
        templateScope, [], container);
    }
  }
  // after the matrix/panel branches: a title template scoped to a row or a panel needs the
  // frame those branches build
  addTextRefsFromProps(state, json, path, state.metadata.getElementLocalizableProps(type, "question"),
    record, scope, { template: templateScope, row: rowScope });
  if (json.bindings && typeof json.bindings === "object") {
    Object.keys(json.bindings).forEach(key => {
      const target = json.bindings[key];
      if (isNonEmptyString(target)) {
        state.index.nameRefs.push({
          name: target, path: path + ".bindings." + key, owner: record, scope: scope.slice(), kind: "binding",
        });
      }
    });
  }
  guardLeave(state);
  return record;
}

// TextPreProcessor is a text utility, not a model object: it owns how the runtime finds
// {...} references in a string - the delimiters come from settings.expressionVariableDelimiters
// and "a:b" is not a reference - so a text is scanned with it instead of with a regex of
// our own. process() substitutes nothing while every value stays isExists: false, and it
// walks the items back to front, hence the reverse() to restore document order.
function collectTextRefs(state: WalkState, text: string, path: string, prop: string,
  owner: ElementRecord, scope: Array<ScopeFrame>, kind: NameRefKind): void {
  if (!isNonEmptyString(text)) return;
  // the runtime skips the whole processing for a text without a delimiter, and so do we:
  // a survey carries thousands of localizable strings and almost none of them pipes
  if (text.indexOf(state.index.settings.expressionVariableStartDelimiter) < 0) return;
  const names: Array<string> = [];
  const processor = new TextPreProcessor();
  processor.onProcess = (textValue: any) => {
    if (isNonEmptyString(textValue.name)) names.push(textValue.name);
  };
  processor.process(text);
  names.reverse().forEach(name => {
    // {0}/{1} are format placeholders: expression format, minErrorText, a column totalFormat
    if (/^[0-9]+$/.test(name)) return;
    state.index.nameRefs.push({
      name: name, path: path, prop: prop, owner: owner, scope: scope.slice(), kind: kind,
    });
  });
}

// One reference set per localizable property. A value is either a string or a per-locale
// object, and a property rendered inside a collection item (a dynamic-panel title, a matrix
// single-input title) is scanned in that item's scope, where {panel.q} and {rowIndex} live.
function addTextRefsFromProps(state: WalkState, json: any, basePath: string, props: Array<string>,
  owner: ElementRecord, scope: Array<ScopeFrame>, itemScopes?: { template?: Array<ScopeFrame>, row?: Array<ScopeFrame> }): void {
  props.forEach(prop => {
    const value = json[prop];
    if (!value || typeof value !== "object" && typeof value !== "string") return;
    if (TEXT_TEMPLATE_PROPS.has(prop.toLowerCase())) return;
    let siteScope = scope;
    const scoped = TEXT_SCOPED_PROPS.get(prop.toLowerCase());
    if (scoped) {
      const itemScope = itemScopes ? itemScopes[scoped] : undefined;
      if (!itemScope) return;
      siteScope = itemScope;
    }
    const path = joinPath(basePath, prop);
    if (typeof value === "string") {
      collectTextRefs(state, value, path, prop, owner, siteScope, "textPiping");
      return;
    }
    if (Array.isArray(value)) return;
    Object.keys(value).forEach(locale => {
      collectTextRefs(state, value[locale], joinPath(path, locale), prop, owner, siteScope, "textPiping");
    });
  });
}

function walkPage(state: WalkState, json: any, path: string): void {
  if (!guardEnter(state, json)) return;
  const record: ElementRecord = {
    name: json.name || "", type: "page", kind: "page", path: path, json: json,
    scope: [], isUnknownType: false, valueType: { shape: "none" },
  };
  registerRecord(state, record, []);
  addSitesFromProps(state, json, path, state.metadata.getExpressionProps("page"), record, []);
  addTextRefsFromProps(state, json, path, state.metadata.getLocalizableProps("page"), record, []);
  const container: ContainerRecord = {
    kind: "page", record: record, name: record.name, path: path, children: [],
  };
  state.index.containers.push(container);
  const inner = getElementsArray(state, json);
  if (inner) {
    walkElementsArray(state, inner.elements, joinPath(path, inner.key), record, [], [], container);
  }
  guardLeave(state);
}

function walkTrigger(state: WalkState, json: any, i: number): void {
  if (!json || typeof json !== "object") return;
  const path = "triggers[" + i + "]";
  const type = state.metadata.normalizeTriggerType(json.type);
  const def = state.metadata.getTriggerDef(type);
  const record: TriggerRecord = { type: type, index: i, path: path, json: json, targets: [] };
  if (isNonEmptyString(json.expression)) {
    record.expressionSite = addSite(state, json.expression, "condition",
      joinPath(path, "expression"), "expression", undefined, []);
  } else {
    const legacy = buildTriggerExpression(json.name, json.operator, json.value);
    if (legacy) {
      record.expressionSite = addSite(state, legacy, "condition", path, "expression", undefined, [], true);
    }
  }
  if (def) {
    def.targets.forEach(target => {
      if (target.isArray) {
        if (Array.isArray(json[target.prop])) {
          json[target.prop].forEach((name: any, j: number) => {
            if (isNonEmptyString(name)) {
              record.targets.push({
                prop: target.prop, path: path + "." + target.prop + "[" + j + "]",
                name: name, kind: target.kind,
              });
            }
          });
        }
      } else if (isNonEmptyString(json[target.prop])) {
        record.targets.push(<TriggerTargetRef>{
          prop: target.prop, path: joinPath(path, target.prop), name: json[target.prop], kind: target.kind,
        });
      }
    });
    if (def.setsValue && isNonEmptyString(json.setToName)) {
      record.setToName = json.setToName;
      // the runtime resolver owns value-path parsing, so take the root through it
      const root = splitRefSegments(json.setToName)[0];
      record.setRoot = root ? root.name : "";
    }
    if (def.extraExpressionProps) {
      const before = state.index.expressionSites.length;
      addSitesFromProps(state, json, path, def.extraExpressionProps, undefined, []);
      record.extraSites = state.index.expressionSites.slice(before);
    }
  }
  state.index.triggers.push(record);
}

export function buildIndex(json: any, options: ISurveyLintOptions, metadata: LintMetadata): SurveyIndex {
  const index: SurveyIndex = {
    json: json,
    byName: new CIMultiMap<ElementRecord>(),
    byValueName: new CIMultiMap<ElementRecord>(),
    calculatedValues: new CIMap(),
    calculatedValueList: [],
    triggers: [],
    expressionSites: [],
    nameRefs: [],
    allElements: [],
    containers: [],
    namespaces: [],
    settings: resolveLintSettings(),
    findByDataName(name: string): ElementRecord | undefined {
      return this.byName.first(name) || this.byValueName.first(name);
    },
  };
  index.namespaces.push({ label: "", map: index.byName });
  const state: WalkState = {
    index: index, options: options, metadata: metadata, visited: new WeakSet(), depth: 0,
    componentFields: new Map<IComponentDef, CIMap<boolean>>(),
  };

  if (Array.isArray(json.pages)) {
    json.pages.forEach((page: any, i: number) => {
      if (page && typeof page === "object") walkPage(state, page, "pages[" + i + "]");
    });
  } else {
    const inner = getElementsArray(state, json);
    if (inner) {
      const container: ContainerRecord = {
        kind: "page", path: inner.key, children: [],
      };
      index.containers.push(container);
      walkElementsArray(state, inner.elements, inner.key, undefined, [], [], container);
    }
  }

  // survey-level texts (completedHtml, questionTitleTemplate, the navigation captions)
  addTextRefsFromProps(state, json, "", metadata.getLocalizableProps("survey"), undefined, []);

  if (Array.isArray(json.calculatedValues)) {
    json.calculatedValues.forEach((cv: any, i: number) => {
      if (!cv || typeof cv !== "object" || typeof cv.name !== "string" || !cv.name) return;
      const path = "calculatedValues[" + i + "]";
      const record: CalculatedValueRecord = { name: cv.name, path: path };
      // the list records every declaration, the map only the first of a repeated name;
      // a name that is only whitespace addresses nothing, so it gets neither a site nor
      // a place in the map - name/duplicate still sees it in the list
      index.calculatedValueList.push(record);
      if (!isNonEmptyString(cv.name)) return;
      record.expression = isNonEmptyString(cv.expression) ? cv.expression : undefined;
      if (record.expression) {
        record.site = addSite(state, record.expression, "expression",
          joinPath(path, "expression"), "expression", undefined, []);
      }
      index.calculatedValues.set(cv.name, record);
    });
  }

  if (Array.isArray(json.triggers)) {
    json.triggers.forEach((trigger: any, i: number) => walkTrigger(state, trigger, i));
  }

  ["completedHtmlOnCondition", "navigateToUrlOnCondition"].forEach(prop => {
    if (!Array.isArray(json[prop])) return;
    json[prop].forEach((item: any, i: number) => {
      if (item && typeof item === "object" && isNonEmptyString(item.expression)) {
        addSite(state, item.expression, "condition", prop + "[" + i + "].expression",
          "expression", undefined, []);
      }
    });
  });

  walkComponentDefs(state);

  return index;
}

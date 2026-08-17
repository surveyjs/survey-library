import { OperandMaker } from "../expressions/expressions";
import { Helpers } from "../helpers";
import { ISurveyLintOptions, IComponentDef } from "./types";
import {
  ELEMENTS_ALIASES, ITEMVALUE_EXPRESSION_PROPS, MATRIXBASE_TYPES, MATRIXDROPDOWN_TYPES,
  MATRIX_COLUMN_EXPRESSION_PROPS, MULTIPLETEXT_ITEM_EXPRESSION_PROPS, PANELBASE_EXPRESSION_PROPS,
  PANEL_TYPES, QUESTION_EXPRESSION_PROPS, SELECTBASE_TYPES, TRIGGER_TYPES, TYPE_EXPRESSION_PROPS,
  isKnownQuestionType, ExpressionPropDef,
} from "./catalog";
import { parseExpressionText } from "./expression-utils";
import {
  CIMap, CIMultiMap, ContainerRecord, ElementRecord, ExpressionSite, ExpressionSiteKind,
  ScopeFrame, ScopeFrameItemValue, ScopeFrameMatrixRow, ScopeFramePanelDynamic, SurveyIndex,
  TriggerRecord, TriggerTargetRef,
} from "./symbols";
import { getChoicesInfo, getItemValueRaw, getValueTypeInfo } from "./value-types";

const MAX_DEPTH = 128;

interface WalkState {
  index: SurveyIndex;
  options: ISurveyLintOptions;
  visited: any;
  depth: number;
}

function joinPath(base: string, key: string): string {
  return base ? base + "." + key : key;
}

function isNonEmptyString(value: any): boolean {
  return typeof value === "string" && value.trim() !== "";
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

function addSitesFromProps(state: WalkState, json: any, basePath: string, props: Array<ExpressionPropDef>,
  owner: ElementRecord, scope: Array<ScopeFrame>): void {
  props.forEach(def => {
    if (isNonEmptyString(json[def.name])) {
      addSite(state, json[def.name], def.kind, joinPath(basePath, def.name), def.name, owner, scope);
    }
  });
}

function addValidatorSites(state: WalkState, json: any, basePath: string, owner: ElementRecord,
  scope: Array<ScopeFrame>): void {
  if (!Array.isArray(json.validators)) return;
  json.validators.forEach((validator: any, i: number) => {
    if (!validator || typeof validator !== "object") return;
    if ((validator.type || "").toLowerCase() !== "expression") return;
    if (isNonEmptyString(validator.expression)) {
      addSite(state, validator.expression, "condition",
        basePath + ".validators[" + i + "].expression", "expression", owner, scope);
    }
  });
}

function addItemValueSites(state: WalkState, arr: any, basePath: string, owner: ElementRecord,
  scope: Array<ScopeFrame>): void {
  if (!Array.isArray(arr)) return;
  const itemScope = scope.concat([<ScopeFrameItemValue>{ kind: "itemValue", owner: owner }]);
  arr.forEach((item: any, i: number) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return;
    addSitesFromProps(state, item, basePath + "[" + i + "]", ITEMVALUE_EXPRESSION_PROPS, owner, itemScope);
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

function getComponentFieldNames(def: IComponentDef): CIMap<boolean> {
  const res = new CIMap<boolean>();
  const collect = (elements: any) => {
    if (!Array.isArray(elements)) return;
    elements.forEach((el: any) => {
      if (!el || typeof el !== "object") return;
      if (isNonEmptyString(el.name)) res.set(el.name, true);
      ELEMENTS_ALIASES.forEach(alias => collect(el[alias]));
      collect(el.templateElements);
    });
  };
  collect(def.elementsJSON);
  return res;
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

function getElementsArray(json: any): { key: string, elements: Array<any> } | undefined {
  for (let i = 0; i < ELEMENTS_ALIASES.length; i++) {
    const key = ELEMENTS_ALIASES[i];
    if (Array.isArray(json[key])) return { key: key, elements: json[key] };
  }
  return undefined;
}

function walkElementsArray(state: WalkState, elements: Array<any>, basePath: string,
  parent: ElementRecord, scope: Array<ScopeFrame>, ancestorPanels: Array<ElementRecord>,
  container: ContainerRecord): void {
  elements.forEach((element: any, i: number) => {
    if (!element || typeof element !== "object" || Array.isArray(element)) return;
    const path = basePath + "[" + i + "]";
    const type = (element.type || "").toLowerCase();
    const record = PANEL_TYPES[type]
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
  addSitesFromProps(state, json, path, PANELBASE_EXPRESSION_PROPS, record, scope);
  const container: ContainerRecord = {
    kind: "panel", record: record, name: record.name, path: path, json: json, children: [],
  };
  state.index.containers.push(container);
  const inner = getElementsArray(json);
  if (inner) {
    walkElementsArray(state, inner.elements, joinPath(path, inner.key), record, scope,
      ancestorPanels.concat([record]), container);
  }
  guardLeave(state);
  return record;
}

function walkMatrixColumns(state: WalkState, json: any, path: string, record: ElementRecord,
  scope: Array<ScopeFrame>): void {
  const frame: ScopeFrameMatrixRow = { kind: "matrixRow", owner: record, columns: new CIMultiMap<ElementRecord>() };
  record.matrixColumns = frame.columns;
  const rowScope = scope.concat([frame]);
  state.index.namespaces.push({
    label: "matrix \"" + (record.name || record.path) + "\"", map: frame.columns,
  });
  const defaultCellType = (json.cellType || "dropdown").toLowerCase();
  if (Array.isArray(json.columns)) {
    json.columns.forEach((column: any, i: number) => {
      if (!column || typeof column !== "object") return;
      const columnPath = path + ".columns[" + i + "]";
      const cellType = (column.cellType || defaultCellType).toLowerCase();
      const columnJson = column;
      const columnRecord: ElementRecord = {
        name: column.name || "", type: "matrixdropdowncolumn", kind: "column",
        path: columnPath, json: columnJson, parent: record, scope: rowScope.slice(),
        isUnknownType: false,
        valueType: getValueTypeInfo(cellType === "default" ? defaultCellType : cellType, columnJson),
        choicesInfo: undefined,
      };
      const choicesInfo = getChoicesInfo(columnJson, "matrixdropdowncolumn");
      if (choicesInfo) {
        // a column without own choices uses the matrix-level shared "choices"
        if (choicesInfo.staticValues.length === 0 && Array.isArray(json.choices)) {
          choicesInfo.staticValues = json.choices.map((item: any) => getItemValueRaw(item)).filter((v: any) => v !== undefined && v !== null);
        }
        columnRecord.choicesInfo = choicesInfo;
      }
      state.index.allElements.push(columnRecord);
      if (columnRecord.name) frame.columns.add(columnRecord.name, columnRecord);
      addSitesFromProps(state, columnJson, columnPath, MATRIX_COLUMN_EXPRESSION_PROPS, columnRecord, rowScope);
      addValidatorSites(state, columnJson, columnPath, columnRecord, rowScope);
      addItemValueSites(state, columnJson.choices, columnPath + ".choices", columnRecord, rowScope);
    });
  }
  if (Array.isArray(json.detailElements)) {
    walkElementsArray(state, json.detailElements, path + ".detailElements", record, rowScope, [], undefined);
  }
}

function walkMultipleTextItems(state: WalkState, json: any, path: string, record: ElementRecord,
  scope: Array<ScopeFrame>): void {
  record.multipleTextItems = new CIMap<ElementRecord>();
  if (!Array.isArray(json.items)) return;
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
    addSitesFromProps(state, item, itemPath, MULTIPLETEXT_ITEM_EXPRESSION_PROPS, itemRecord, scope);
    addValidatorSites(state, item, itemPath, itemRecord, scope);
  });
}

function walkQuestion(state: WalkState, json: any, path: string, parent: ElementRecord,
  scope: Array<ScopeFrame>, ancestorPanels: Array<ElementRecord>): ElementRecord {
  if (!guardEnter(state, json)) return undefined;
  const type = (json.type || "").toLowerCase();
  const componentDef = state.options.components ? state.options.components[type] : undefined;
  const record: ElementRecord = {
    name: json.name || "", valueName: isNonEmptyString(json.valueName) ? json.valueName : undefined,
    type: type, kind: "question", path: path, json: json, parent: parent, scope: scope.slice(),
    isUnknownType: !isKnownQuestionType(type) && !componentDef,
    componentDef: componentDef,
    valueType: getValueTypeInfo(type, json),
    choicesInfo: getChoicesInfo(json, type),
  };
  if (componentDef && componentDef.elementsJSON) {
    record.componentFieldNames = getComponentFieldNames(componentDef);
  }
  registerRecord(state, record, ancestorPanels);

  addSitesFromProps(state, json, path, QUESTION_EXPRESSION_PROPS, record, scope);
  addValidatorSites(state, json, path, record, scope);

  if (SELECTBASE_TYPES[type]) {
    addSitesFromProps(state, json, path, TYPE_EXPRESSION_PROPS.selectbase, record,
      scope.concat([<ScopeFrameItemValue>{ kind: "itemValue", owner: record }]));
    addItemValueSites(state, json.choices, path + ".choices", record, scope);
    // choiceitem.elements: full questions nested inside a choice
    if (Array.isArray(json.choices)) {
      json.choices.forEach((choice: any, i: number) => {
        if (!choice || typeof choice !== "object" || !Array.isArray(choice.elements)) return;
        walkElementsArray(state, choice.elements, path + ".choices[" + i + "].elements",
          record, scope, ancestorPanels, undefined);
      });
    }
    if (json.choicesByUrl && isNonEmptyString(json.choicesByUrl.url)) {
      collectUrlRefs(state, json.choicesByUrl.url, path + ".choicesByUrl.url", record, scope);
    }
    if (record.choicesInfo) {
      record.choicesInfo.carryForwardPath = joinPath(path, "choicesFromQuestion");
      record.choicesInfo.carryForwardValuesPath = joinPath(path, "choiceValuesFromQuestion");
      record.choicesInfo.carryForwardTextsPath = joinPath(path, "choiceTextsFromQuestion");
    }
  }
  if (MATRIXBASE_TYPES[type]) {
    addSitesFromProps(state, json, path, TYPE_EXPRESSION_PROPS.matrixbase, record,
      scope.concat([<ScopeFrameItemValue>{ kind: "itemValue", owner: record }]));
  }
  if (type === "matrix") {
    record.matrixRowValues = Array.isArray(json.rows) ? json.rows.map(getItemValueRaw).filter((v: any) => v !== undefined && v !== null) : [];
    addItemValueSites(state, json.rows, path + ".rows", record, scope);
    addItemValueSites(state, json.columns, path + ".columns", record, scope);
  }
  if (MATRIXDROPDOWN_TYPES[type]) {
    if (type === "matrixdropdown") {
      record.matrixRowValues = Array.isArray(json.rows) ? json.rows.map(getItemValueRaw).filter((v: any) => v !== undefined && v !== null) : [];
      addItemValueSites(state, json.rows, path + ".rows", record, scope);
    }
    walkMatrixColumns(state, json, path, record, scope);
  }
  if (type === "rating") {
    addItemValueSites(state, json.rateValues, path + ".rateValues", record, scope);
  }
  if (type === "slider") {
    addSitesFromProps(state, json, path, TYPE_EXPRESSION_PROPS.slider, record, scope);
    addItemValueSites(state, json.customLabels, path + ".customLabels", record, scope);
  }
  if (type === "text") {
    addSitesFromProps(state, json, path, TYPE_EXPRESSION_PROPS.text, record, scope);
  }
  if (type === "expression") {
    addSitesFromProps(state, json, path, TYPE_EXPRESSION_PROPS.expression, record, scope);
  }
  if (type === "multipletext") {
    walkMultipleTextItems(state, json, path, record, scope);
  }
  if (type === "paneldynamic") {
    const frame: ScopeFramePanelDynamic = {
      kind: "panelDynamic", owner: record, templateNames: new CIMultiMap<ElementRecord>(),
    };
    record.templateNames = frame.templateNames;
    const templateScope = scope.concat([frame]);
    state.index.namespaces.push({
      label: "dynamic panel \"" + (record.name || record.path) + "\"", map: frame.templateNames,
    });
    if (isNonEmptyString(json.templateVisibleIf)) {
      addSite(state, json.templateVisibleIf, "condition", joinPath(path, "templateVisibleIf"),
        "templateVisibleIf", record, templateScope);
    }
    const template = Array.isArray(json.templateElements)
      ? { key: "templateElements", elements: json.templateElements }
      : (Array.isArray(json.questions) ? { key: "questions", elements: json.questions } : undefined);
    const container: ContainerRecord = {
      kind: "panelDynamicTemplate", record: record, name: record.name, path: path, json: json, children: [],
    };
    state.index.containers.push(container);
    if (template) {
      walkElementsArray(state, template.elements, joinPath(path, template.key), record,
        templateScope, [], container);
    }
  }
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

const URL_REF_REGEX = /\{([^{}]+)\}/g;

function collectUrlRefs(state: WalkState, url: string, path: string, owner: ElementRecord,
  scope: Array<ScopeFrame>): void {
  let match: RegExpExecArray;
  URL_REF_REGEX.lastIndex = 0;
  while((match = URL_REF_REGEX.exec(url)) !== null) {
    const name = match[1].trim();
    // names with ":" are not references (mirrors TextPreProcessor.isValidItemName)
    if (!name || name.indexOf(":") > -1) continue;
    state.index.nameRefs.push({
      name: name, path: path, owner: owner, scope: scope.slice(), kind: "choicesByUrlVariable",
    });
  }
}

function walkPage(state: WalkState, json: any, path: string): void {
  if (!guardEnter(state, json)) return;
  const record: ElementRecord = {
    name: json.name || "", type: "page", kind: "page", path: path, json: json,
    scope: [], isUnknownType: false, valueType: { shape: "none" },
  };
  registerRecord(state, record, []);
  addSitesFromProps(state, json, path, PANELBASE_EXPRESSION_PROPS, record, []);
  const container: ContainerRecord = {
    kind: "page", record: record, name: record.name, path: path, json: json, children: [],
  };
  state.index.containers.push(container);
  const inner = getElementsArray(json);
  if (inner) {
    walkElementsArray(state, inner.elements, joinPath(path, inner.key), record, [], [], container);
  }
  guardLeave(state);
}

function normalizeTriggerType(type: any): string {
  let res = (type || "").toLowerCase();
  if (res.endsWith("trigger")) res = res.substring(0, res.length - "trigger".length);
  return res;
}

// Mirrors Trigger.buildExpression for the legacy name/operator/value trigger form.
function buildLegacyTriggerExpression(json: any): string {
  if (!isNonEmptyString(json.name)) return "";
  const operator = isNonEmptyString(json.operator) ? json.operator.toLowerCase() : "equal";
  const requiresValue = operator !== "empty" && operator !== "notempty";
  if (Helpers.isValueEmpty(json.value) && requiresValue) return "";
  return "{" + json.name + "} " + operator + " " + OperandMaker.toOperandString(json.value);
}

function walkTrigger(state: WalkState, json: any, i: number): void {
  if (!json || typeof json !== "object") return;
  const path = "triggers[" + i + "]";
  const type = normalizeTriggerType(json.type);
  const def = TRIGGER_TYPES[type];
  const record: TriggerRecord = { type: type, index: i, path: path, json: json, targets: [] };
  if (isNonEmptyString(json.expression)) {
    record.expressionSite = addSite(state, json.expression, "condition",
      joinPath(path, "expression"), "expression", undefined, []);
  } else {
    const legacy = buildLegacyTriggerExpression(json);
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
      record.setRoot = json.setToName.split(".")[0].replace(/\[\d+\]$/, "");
    }
    if (def.extraExpressionProps) {
      addSitesFromProps(state, json, path, def.extraExpressionProps, undefined, []);
    }
  }
  state.index.triggers.push(record);
}

export function buildIndex(json: any, options: ISurveyLintOptions): SurveyIndex {
  const index: SurveyIndex = {
    json: json,
    byName: new CIMultiMap<ElementRecord>(),
    byValueName: new CIMultiMap<ElementRecord>(),
    calculatedValues: new CIMap(),
    triggers: [],
    expressionSites: [],
    nameRefs: [],
    allElements: [],
    containers: [],
    namespaces: [],
  };
  index.namespaces.push({ label: "", map: index.byName });
  const state: WalkState = { index: index, options: options, visited: new WeakSet(), depth: 0 };

  if (Array.isArray(json.pages)) {
    json.pages.forEach((page: any, i: number) => {
      if (page && typeof page === "object") walkPage(state, page, "pages[" + i + "]");
    });
  } else {
    const inner = getElementsArray(json);
    if (inner) {
      const container: ContainerRecord = {
        kind: "page", path: inner.key, json: json, children: [],
      };
      index.containers.push(container);
      walkElementsArray(state, inner.elements, inner.key, undefined, [], [], container);
    }
  }

  if (Array.isArray(json.calculatedValues)) {
    json.calculatedValues.forEach((cv: any, i: number) => {
      if (!cv || typeof cv !== "object" || !isNonEmptyString(cv.name)) return;
      const path = "calculatedValues[" + i + "]";
      const record = {
        name: cv.name, path: path,
        expression: isNonEmptyString(cv.expression) ? cv.expression : undefined,
        site: <ExpressionSite>undefined,
      };
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

  return index;
}

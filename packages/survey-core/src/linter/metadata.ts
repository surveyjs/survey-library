import { JsonObjectProperty, Serializer } from "survey-core";
import { PROP_KIND_OVERRIDES, TRIGGER_TARGET_KINDS } from "./catalog";
import { ExpressionSiteKind, TriggerTargetRef } from "./symbols";

export interface ExpressionPropDef {
  name: string;
  kind: ExpressionSiteKind;
}

export interface TriggerTargetDef {
  prop: string;
  kind: TriggerTargetRef["kind"];
  isArray?: boolean;
}

export interface TriggerTypeDef {
  targets: Array<TriggerTargetDef>;
  setsValue: boolean;
  extraExpressionProps: Array<ExpressionPropDef>;
}

const COLUMN_CLASS = "matrixdropdowncolumn";
const DEFAULT_ITEM_CLASS = "itemvalue";
// Fallbacks for the class-name suffixes and container array keys the walker needs.
// The serializer is the source (see getClassNamePart/buildArrayKeys); these only keep
// the linter working if a property is ever renamed out from under it.
const TRIGGER_SUFFIX = "trigger";
const VALIDATOR_SUFFIX = "validator";

// Element, cell, trigger and validator type names come straight from the linted JSON,
// so a type may be anything - including "" or a name the registry does not know.
function findMetaClass(name: string): any {
  return !!name ? Serializer.findClass(name) : undefined;
}

function findProperty(className: string, propName: string): JsonObjectProperty {
  const metaClass = findMetaClass(className);
  return metaClass ? metaClass.findProperty(propName) : undefined;
}

function buildArrayKeys(pairs: Array<Array<string>>): Array<string> {
  const names: Array<string> = [];
  const aliases: Array<string> = [];
  pairs.forEach(pair => {
    const prop = findProperty(pair[0], pair[1]);
    const name = !!prop && !!prop.name ? prop.name : pair[1];
    if (names.indexOf(name) < 0) names.push(name);
    if (!!prop && !!prop.alternativeName && aliases.indexOf(prop.alternativeName) < 0) {
      aliases.push(prop.alternativeName);
    }
  });
  return names.concat(aliases.filter(alias => names.indexOf(alias) < 0));
}

function toPropDef(prop: JsonObjectProperty): ExpressionPropDef {
  const override = PROP_KIND_OVERRIDES.get(prop.name.toLowerCase());
  return { name: prop.name, kind: override || <ExpressionSiteKind>prop.type };
}

function toPropDefs(props: Array<JsonObjectProperty>): Array<ExpressionPropDef> {
  const res: Array<ExpressionPropDef> = [];
  props.forEach(prop => {
    if (prop.isExpression) res.push(toPropDef(prop));
  });
  return res;
}

export function isDescendantOf(type: string, ancestor: string): boolean {
  return !!findMetaClass(type) && Serializer.isDescendantOf(type, ancestor);
}

export function isSelectBase(type: string): boolean {
  return isDescendantOf(type, "selectbase");
}
export function isMatrixDropdown(type: string): boolean {
  return isDescendantOf(type, "matrixdropdownbase");
}
export function isPanel(type: string): boolean {
  return isDescendantOf(type, "panel");
}

// Per-run view of the serializer registry. The registry is mutable at runtime
// (Serializer.addClass/addProperty, ComponentCollection.add), so the caches live for
// one lintSurvey call rather than for the module lifetime.
export class LintMetadata {
  private propsByClass = new Map<string, Array<ExpressionPropDef>>();
  private cellPropsByType = new Map<string, Array<ExpressionPropDef>>();
  private triggerDefs = new Map<string, TriggerTypeDef>();
  private elementTypes: Array<string>;
  private elementTypeSet: Set<string>;
  private triggerTypes: Array<string>;
  private classNameParts = new Map<string, string>();
  private elementsKeys: Array<string>;
  private templateElementsKeys: Array<string>;

  // "Append the suffix unless the type already carries it" is how the deserializer
  // resolves the class of a nested object (JsonMetadata.getClassNameForNewObj), and the
  // suffix itself is registered on the owning array property as classNamePart. Read it
  // from there instead of hardcoding "trigger"/"validator".
  public getClassNamePart(ownerType: string, propName: string, fallback: string): string {
    const key = ownerType + "." + propName;
    if (!this.classNameParts.has(key)) {
      const prop = findProperty(ownerType, propName);
      this.classNameParts.set(key, !!prop && !!prop.classNamePart ? prop.classNamePart : fallback);
    }
    return this.classNameParts.get(key);
  }

  // A validator "type" is accepted both as "expression" and as the full class name
  // "expressionvalidator".
  public getValidatorExpressionProps(type: string): Array<ExpressionPropDef> {
    const suffix = this.getClassNamePart("question", "validators", VALIDATOR_SUFFIX);
    const lower = (type || "").toLowerCase();
    return this.getExpressionProps(!lower || lower.indexOf(suffix) > -1 ? lower : lower + suffix);
  }

  // The JSON trigger type with the class-name suffix stripped, the way SurveyModel
  // resolves it back to a registered class.
  public normalizeTriggerType(type: any): string {
    const suffix = this.getTriggerSuffix();
    const res = (type || "").toLowerCase();
    if (!!suffix && res.endsWith(suffix)) return res.substring(0, res.length - suffix.length);
    return res;
  }

  // The keys a container uses for its child elements, straight from the serializer:
  // "elements" carries the legacy alternativeName "questions" on the survey and on
  // panelbase, "templateElements" carries it on paneldynamic. Property names come
  // before aliases - the walker takes the first key present in the JSON.
  public getElementsKeys(): Array<string> {
    if (!this.elementsKeys) {
      this.elementsKeys = buildArrayKeys([["panelbase", "elements"], ["survey", "elements"]]);
    }
    return this.elementsKeys;
  }

  public getTemplateElementsKeys(): Array<string> {
    if (!this.templateElementsKeys) {
      this.templateElementsKeys = buildArrayKeys([["paneldynamic", "templateElements"]]);
    }
    return this.templateElementsKeys;
  }

  private getTriggerSuffix(): string {
    return this.getClassNamePart("survey", "triggers", TRIGGER_SUFFIX);
  }

  public getExpressionProps(className: string): Array<ExpressionPropDef> {
    const key = (className || "").toLowerCase();
    let res = this.propsByClass.get(key);
    if (!res) {
      const metaClass = findMetaClass(key);
      res = metaClass ? toPropDefs(metaClass.getAllProperties()) : [];
      this.propsByClass.set(key, res);
    }
    return res;
  }

  // An element whose "type" is not a registered class - a typo, or a component the
  // linter was given through options.components instead of the Serializer - still
  // carries the conditions its base class has, so its visibleIf is analyzed instead
  // of silently skipped.
  public getElementExpressionProps(type: string, fallbackClass: string): Array<ExpressionPropDef> {
    return this.getExpressionProps(!!findMetaClass(type) ? type : fallbackClass);
  }

  // A matrix column carries its own expression properties plus those the cell question
  // type contributes: at runtime the column exposes them through getDynamicProperties,
  // and they are absent from the column class itself (min/maxValueExpression for a text
  // cell, choicesVisibleIf/choicesEnableIf for a select cell, ...).
  public getCellExpressionProps(cellType: string): Array<ExpressionPropDef> {
    const key = (cellType || "").toLowerCase();
    let res = this.cellPropsByType.get(key);
    if (!res) {
      res = this.getExpressionProps(COLUMN_CLASS).slice();
      if (!!findMetaClass(key)) {
        res = res.concat(toPropDefs(Serializer.getDynamicPropertiesByTypes(COLUMN_CLASS, key)));
      }
      this.cellPropsByType.set(key, res);
    }
    return res;
  }

  // Expression properties of the items in an itemvalue-like array ("choices:choiceitem[]",
  // "areas:imagemaparea[]", "customLabels:sliderlabel[]"): the item class comes from the
  // array property itself, so a subclass with extra conditions is scanned too.
  public getItemExpressionProps(ownerType: string, propName: string): Array<ExpressionPropDef> {
    const prop = findProperty(ownerType, propName);
    const className = !!prop && !!prop.className ? prop.className : DEFAULT_ITEM_CLASS;
    return this.getExpressionProps(className);
  }

  // Every type the deserializer can turn into an element: JsonObject builds elements
  // with Serializer.createClass, so a class with a creator anywhere up its parent
  // chain is accepted - including composite components, which ComponentCollection
  // registers as question descendants. ElementFactory is NOT the source here: it
  // holds only what the Creator toolbox offers (buttongroup, flowpanel and imagemap
  // are missing from it, yet all three deserialize).
  public getElementTypes(): Array<string> {
    if (!this.elementTypes) {
      const res: Array<string> = [];
      Serializer.getAllClasses().forEach(name => {
        if (!isElementClass(name)) return;
        res.push(name);
        const alias = Serializer.getAliasByType(name);
        if (!!alias) res.push(alias);
      });
      this.elementTypes = res;
      this.elementTypeSet = new Set<string>(res);
    }
    return this.elementTypes;
  }

  public isKnownElementType(type: string): boolean {
    if (!type) return false;
    this.getElementTypes();
    // findClass resolves aliases, so an aliased type is known even when the alias
    // itself is not a registered class
    return this.elementTypeSet.has(type.toLowerCase()) || isElementClass(type);
  }

  // type is the JSON trigger type with the "trigger" suffix already stripped.
  public getTriggerDef(type: string): TriggerTypeDef {
    const key = (type || "").toLowerCase();
    if (!key) return undefined;
    if (!this.triggerDefs.has(key)) {
      this.triggerDefs.set(key, buildTriggerDef(key, this.getTriggerSuffix()));
    }
    return this.triggerDefs.get(key);
  }

  public getTriggerTypes(): Array<string> {
    if (!this.triggerTypes) {
      this.triggerTypes = Serializer.getChildrenClasses("surveytrigger", true)
        .map(cls => this.normalizeTriggerType(cls.name));
    }
    return this.triggerTypes;
  }
}

// Mirrors Serializer.createClass: the creator may sit on an ancestor.
function isCreatableClass(type: string): boolean {
  let cls = findMetaClass(type);
  while(!!cls) {
    if (!!cls.creator) return true;
    cls = cls.parentName ? findMetaClass(cls.parentName) : undefined;
  }
  return false;
}

function isElementClass(type: string): boolean {
  return isCreatableClass(type) && (isDescendantOf(type, "question") || isDescendantOf(type, "panel"));
}

function buildTriggerDef(type: string, suffix: string): TriggerTypeDef {
  const className = type + suffix;
  if (!isDescendantOf(className, "surveytrigger")) return undefined;
  const targets: Array<TriggerTargetDef> = [];
  const extraExpressionProps: Array<ExpressionPropDef> = [];
  let setsValue = false;
  findMetaClass(className).getAllProperties().forEach((prop: JsonObjectProperty) => {
    const target = TRIGGER_TARGET_KINDS.get(prop.type);
    if (!!target) {
      targets.push({ prop: prop.name, kind: target.kind, isArray: target.isArray });
    }
    if (prop.name === "setToName") setsValue = true;
    // "expression" is the trigger's own guard condition, walked separately
    if (prop.isExpression && prop.name !== "expression") {
      extraExpressionProps.push(toPropDef(prop));
    }
  });
  return { targets: targets, setsValue: setsValue, extraExpressionProps: extraExpressionProps };
}

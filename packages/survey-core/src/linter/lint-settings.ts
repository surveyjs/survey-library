import { settings } from "../settings";
import { FunctionFactory } from "../functionsfactory";

/*
 * The published survey-core/linter is a standalone bundle with its own module
 * closure (deliberate isolation, see rollup.config.mjs), so its settings and
 * FunctionFactory instances differ from the ones the app customizes through
 * the main "survey-core" import. These options let the app hand its own
 * instances in. Structural interfaces only - no classes: an object created by
 * another copy of the module would fail identity/instanceof checks.
 */

export interface ILintFunctionsProvider {
  hasFunction(name: string): boolean;
  getAll(): Array<string>;
}

export interface ILintSettingsOverrides {
  expressionVariables?: Partial<typeof settings.expressionVariables>;
  expressionElementPropertyPrefix?: string;
  expressionDisableConversionChar?: string;
  noneItemValue?: string;
  refuseItemValue?: string;
  dontKnowItemValue?: string;
  commentSuffix?: string;
  matrix?: { totalsSuffix?: string, defaultCellType?: string };
}

export interface ILintResolvedSettings {
  expressionVariables: typeof settings.expressionVariables;
  expressionElementPropertyPrefix: string;
  expressionDisableConversionChar: string;
  noneItemValue: string;
  refuseItemValue: string;
  dontKnowItemValue: string;
  commentSuffix: string;
  matrixTotalsSuffix: string;
  matrixDefaultCellType: string;
}

function pick<T>(value: T | undefined, fallback: T): T {
  return value !== undefined ? value : fallback;
}

function mergeExpressionVariables(over?: Partial<typeof settings.expressionVariables>): typeof settings.expressionVariables {
  if (!over) return settings.expressionVariables;
  const res: any = {};
  const base: any = settings.expressionVariables;
  Object.keys(base).forEach(key => res[key] = base[key]);
  Object.keys(over).forEach(key => {
    const value = (<any>over)[key];
    if (value !== undefined) res[key] = value;
  });
  return res;
}

// Snapshot taken once per lint run; unset fields fall back to this bundle's settings.
export function resolveLintSettings(over?: ILintSettingsOverrides): ILintResolvedSettings {
  const o = over || {};
  const matrix = o.matrix || {};
  return {
    expressionVariables: mergeExpressionVariables(o.expressionVariables),
    expressionElementPropertyPrefix: pick(o.expressionElementPropertyPrefix, settings.expressionElementPropertyPrefix),
    expressionDisableConversionChar: pick(o.expressionDisableConversionChar, settings.expressionDisableConversionChar),
    noneItemValue: pick(o.noneItemValue, settings.noneItemValue),
    refuseItemValue: pick(o.refuseItemValue, settings.refuseItemValue),
    dontKnowItemValue: pick(o.dontKnowItemValue, settings.dontKnowItemValue),
    commentSuffix: pick(o.commentSuffix, settings.commentSuffix),
    matrixTotalsSuffix: pick(matrix.totalsSuffix, settings.matrix.totalsSuffix),
    matrixDefaultCellType: pick(matrix.defaultCellType, settings.matrix.defaultCellType),
  };
}

export function resolveLintFunctions(provider?: ILintFunctionsProvider): ILintFunctionsProvider {
  return provider || FunctionFactory.Instance;
}

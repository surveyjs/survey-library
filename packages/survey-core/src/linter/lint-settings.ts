import { settings } from "survey-core";

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

// A shallow copy, so the whole resolved object stays a snapshot: the nested
// settings.expressionVariables would otherwise stay live and change mid-run.
function copyExpressionVariables(): typeof settings.expressionVariables {
  const res: any = {};
  const base: any = settings.expressionVariables;
  Object.keys(base).forEach(key => res[key] = base[key]);
  return res;
}

// Snapshot taken once per lint run. The linter shares the application's module
// closure, so this reads the very settings object the app customizes.
export function resolveLintSettings(): ILintResolvedSettings {
  return {
    expressionVariables: copyExpressionVariables(),
    expressionElementPropertyPrefix: settings.expressionElementPropertyPrefix,
    expressionDisableConversionChar: settings.expressionDisableConversionChar,
    noneItemValue: settings.noneItemValue,
    refuseItemValue: settings.refuseItemValue,
    dontKnowItemValue: settings.dontKnowItemValue,
    commentSuffix: settings.commentSuffix,
    matrixTotalsSuffix: settings.matrix.totalsSuffix,
    matrixDefaultCellType: settings.matrix.defaultCellType,
  };
}

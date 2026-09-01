import { Helpers, settings } from "survey-core";

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
  ratingMaximumRateValueCount: number;
}

// Snapshot taken once per lint run. The linter shares the application's module
// closure, so this reads the very settings object the app customizes.
// expressionVariables is copied (Helpers.createCopy - a shallow copy, the same one
// the core uses), so the whole resolved object stays a snapshot: the nested object
// would otherwise stay live and change mid-run.
export function resolveLintSettings(): ILintResolvedSettings {
  return {
    expressionVariables: Helpers.createCopy(settings.expressionVariables),
    expressionElementPropertyPrefix: settings.expressionElementPropertyPrefix,
    expressionDisableConversionChar: settings.expressionDisableConversionChar,
    noneItemValue: settings.noneItemValue,
    refuseItemValue: settings.refuseItemValue,
    dontKnowItemValue: settings.dontKnowItemValue,
    commentSuffix: settings.commentSuffix,
    matrixTotalsSuffix: settings.matrix.totalsSuffix,
    matrixDefaultCellType: settings.matrix.defaultCellType,
    ratingMaximumRateValueCount: settings.ratingMaximumRateValueCount,
  };
}

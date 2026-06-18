import type { Base } from "../base";
import type { LocalizableString } from "../localizablestring";

export interface IValueItemCustomPropValues {
  propertyName: string;
  values: Array<any>;
}

export interface IFindElement {
  element: Base;
  str: LocalizableString;
}

export interface IPlainDataOptions {
  includeEmpty?: boolean;
  includeQuestionTypes?: boolean;
  includeValues?: boolean;
  calculations?: Array<{
    propertyName: string,
  }>;
}
export interface ILoadFromJSONOptions {
  validatePropertyValues?: boolean;
}
/**
 * An interface with configuration options that control how a `SurveyModel` instance is serialized by the [`toJSON()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#toJSON) method.
 */
export interface ISaveToJSONOptions {
  /**
   * Specifies whether the exported JSON schema should include properties whose values are equal to their defaults.
   *
   * Default value: `false`
   */
  storeDefaults?: boolean;
  version?: string;
  /**
   * Specifies how locale-specific strings are handled during JSON export.
   *
   * Possible values:
   *
   * - `true` (default)\
   * Export the full JSON schema, including all locale strings. Use the [`locales`](#locales) array to restrict the output to specific locales.
   * - `false`\
   * Export the JSON schema without any textual content.
   * - `"stringsOnly"`\
   * Export a JSON schema that contains only locale strings and the minimal set of properties required to identify survey elements. Use the [`locales`](#locales) array to restrict the output to specific locales. To apply a locale-strings-only schema to a survey model, call the [`mergeLocalizationJSON(json, locales)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#mergeLocalizationJSON) method.
   *
   * > As an alternative to calling `toJSON()` with `"stringsOnly"`, you can call the [`getLocalizationJSON(locales)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getLocalizationJSON) method, which is syntactic sugar.
   */
  storeLocaleStrings?: boolean | "stringsOnly";
  /**
   * Specifies the locales to include in the exported JSON schema. Applies only when [`storeLocaleStrings`](#storeLocaleStrings) is `true` or `"stringsOnly"`.
   */
  locales?: Array<string>;
}

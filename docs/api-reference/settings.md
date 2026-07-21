---
title: settings
product: Form Library
api-type: variable
description: Global settings that apply to all surveys on the page.
source: https://surveyjs.io/form-library/documentation/api-reference/settings
---

# `settings`

Global settings that apply to all surveys on the page. To specify one of the settings, use the code below:

```js
import { settings } from "survey-core";

settings.settingName = "value";
```

## Properties

### `acceptedFileCategories`

**Type**: `{ image: string[]; video: string[]; audio: string[]; document: string[]; archive: string[]; }`

Defines the file type categories used by the [`acceptedCategories`](https://surveyjs.io/form-library/documentation/api-reference/file-model#acceptedCategories) property of [File Upload](https://surveyjs.io/form-library/examples/file-upload/) questions.

This property is an object whose keys are category names and whose values are arrays of file extensions. The default structure is shown below:

```js
{
  image: [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".svg"],
  video: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm"],
  audio: [".mp3", ".wav", ".aac", ".ogg", ".wma", ".flac"],
  document: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".rtf", ".odt"],
  archive: [".zip", ".rar", ".7z", ".tar", ".gz"]
}
```

Available since: v2.3.16

### `animationEnabled`

**Type**: `boolean`

Specifies whether to animate survey elements.

Default value: `true`

### `autoAdvanceDelay`

**Type**: `number`

Specifies how many milliseconds a survey should wait before it automatically switches to the next page. Applies only when [auto-advance](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#autoAdvanceEnabled) is enabled.

Default value: 300

### `choicesSeparator`

**Type**: `string`

One or several characters used to separate choice options in a list.

Default value: `", "`

**Related APIs:** [`settings.itemValueSeparator`](https://surveyjs.io/form-library/documentation/api-reference/settings#itemValueSeparator)

### `commentSuffix`

**Type**: `string`

A suffix added to the name of the property that stores comments.

Default value: "-Comment"

You can specify this setting for an individual survey: [`commentSuffix`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#commentSuffix).

### `comparator`

**Type**: `{ trimStrings: boolean; caseSensitive: boolean; normalizeTextCallback: (str: string, reason: string) => string; }`

An object that configures string comparison.

Nested properties:

- `trimStrings`: `boolean`\
Specifies whether to remove whitespace from both ends of a string before the comparison. Default value: `true`.

- `caseSensitive`: `boolean`\
Specifies whether to differentiate between capital and lower-case letters. Default value: `false`.

### `confirmActionAsync`

**Type**: `(message: string, callback: (res: boolean) => void, options?: IConfirmDialogOptions) => void`

A function that activates a proprietary SurveyJS confirmation dialog.

Use the following code to execute this function:

```js
import { settings } from "survey-core";

settings.confirmActionAsync("Are you sure?", (confirmed) => {
  if (confirmed) {
    // ...
    // Proceed with the action
    // ...
  } else {
    // ...
    // Cancel the action
    // ...
  }
});
```

You can override the `confirmActionAsync` function if you want to display a custom dialog window asynchronously:

```js
import { settings } from "survey-core";

async function confirmDialog(message) {
  return new Promise((resolve) => {
    // Implement an async dialog window here
  });
}

settings.confirmActionAsync = (message, callback) => {
  confirmDialog(message).then((result) => {
    callback(result);
  });
};
```

### `confirmActionFunc`

**Type**: `(message: string) => boolean`

A function used to display a custom confirmation dialog.

This function is `undefined` by default. To enable a custom dialog, assign a function that returns `true` if the user confirms the action or `false` otherwise. For example, the following code uses the built-in `window.confirm()` method to open a confirmation dialog window:

```js
import { settings } from "survey-core";

settings.confirmActionAsync = (message) => {
  return window.confirm(message);
};
```

### `customIcons`

**Type**: `{}`

An object that specifies icon replacements. Object keys are built-in icon names. To use a custom icon, assign its name to the key of the icon you want to replace:

```js
import { settings } from "survey-core";

settings.customIcons["icon-redo"] = "custom-redo-icon";
```

For more information about icons in SurveyJS, refer to the following help topic: [UI Icons](https://surveyjs.io/form-library/documentation/icons).

### `designMode`

**Type**: `{ showEmptyDescriptions: boolean; showEmptyTitles: boolean; }`

An object that configures survey appearance when the survey is being designed in Survey Creator.

Nested properties:

- `showEmptyDescriptions`: `boolean`\
Specifies whether to display an empty description for pages and panels. Default value: `true`.

- `showEmptyTitles`: `boolean`\
Specifies whether to display an empty title for pages and panels. Default value: `true`.

### `dontKnowItemValue`

**Type**: `string`

A value to save in survey results when respondents select the "Don't know" choice item.

Default value: `"dontknow"`

### `dropdownSaveOnOutsideClick`

**Type**: `boolean`

Specifies whether [Single-](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/) and [Multi-Select Dropdown](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/) questions save the currently focused value when the user clicks outside the editor. Applies only in desktop environments.

Default value: `false`

If [custom choices are enabled](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#allowCustomChoices), and this property is set to `true`, clicking outside the editor also saves the entered custom value.

Available since: v2.5.10

### `dropdownSearchDelay`

**Type**: `number`

A time interval in milliseconds between the last entered character and the beginning of search in [Single-](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/) and [Multi-Select Dropdown](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/) questions. Applies only to questions with the [`choicesLazyLoadEnabled`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#choicesLazyLoadEnabled) property set to `true`.

Default value: 500

[View Demo](https://surveyjs.io/form-library/examples/lazy-loading-dropdown/ (linkStyle))

### `enterKeyAction`

**Type**: `"moveToNextEditor" | "loseFocus" | "default"`

Specifies an action to perform when users press the Enter key within a survey.

Possible values:

- `"moveToNextEditor"` - Moves focus to the next editor.
- `"loseFocus"` - Removes focus from the current editor.
- `"default"` - Behaves as a standard `<input>` element.

### `expressionElementPropertyPrefix`

**Type**: `string`

A prefix used to [access element property values](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#element-properties) in expressions and dynamic texts.

Default value: `"$"`

Available since: v2.5.15

### `expressionQuestionTrackDependencies`

**Type**: `boolean`

Specifies whether [Expression](https://surveyjs.io/form-library/documentation/api-reference/expression-model) questions recalculate only when their dependencies change.

- `false` (default) - Recalculate on every value change in the survey.
- `true` - Recalculate only on the initial run, when all expressions are re-evaluated, and when a dependent value or property changes. Expressions with parameterless functions or functions whose parameters do not reference survey values still recalculate on every value change.

Available since: v2.5.27

### `expressionVariableDelimiters`

**Type**: `{ start: string; end: string; }`

An object with `start` and `end` string properties that specify the delimiters for referencing variables in [expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) and [dynamic texts](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#dynamic-texts).

Default value: `{ start: "{", end: "}" }`

Examples:

```js
import { settings } from "survey-core";

// {{variableName}}
settings.expressionVariableDelimiters = { start: "{{", end: "}}" };
// {% variableName %}
settings.expressionVariableDelimiters = { start: "{% ", end: " %}" };
// %variableName%
settings.expressionVariableDelimiters = { start: "%", end: "%" };
```

Available since: v2.5.15

### `itemFlowDirection`

**Type**: `string`

Specifies the direction in which to lay out Checkbox and Radio Button Group items. This setting affects the resulting UI when items are arranged in [more than one column](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#colCount).

Possible values:

- `"column"` (default) - Items fill the current column, then move on to the next column.
- `"row"` - Items fill the current row, then move on to the next row.

Available since: v2.0.0

### `itemValueSeparator`

**Type**: `string`

A separator used in a shorthand notation that specifies a value and display text for an [`ItemValue`](https://surveyjs.io/form-library/documentation/api-reference/itemvalue) object: `"value|text"`.

Default value: `"|"`

**Related APIs:** [`settings.choicesSeparator`](https://surveyjs.io/form-library/documentation/api-reference/settings#choicesSeparator)

### `lazyRender`

**Type**: `{ enabled: boolean; firstBatchSize: number; }`

An object that configures lazy rendering.

Nested properties:

- `enabled`: `boolean`\
Specifies whether to add questions to the DOM only when they get into the viewport. Default value: `false`.

[View Demo](https://surveyjs.io/form-library/examples/survey-lazy/ (linkStyle))

**Related APIs:** [`SurveyModel.lazyRenderEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#lazyRenderEnabled)

### `localization`

**Type**: `{ useLocalTimeZone: boolean; storeDuplicatedTranslations: boolean; defaultLocaleName: string; }`

An object that contains properties related to localization.

Nested properties:

- `defaultLocaleName`: `string`\
A property key that stores a translation for the default locale. Default value: `"default"`.

- `storeDuplicatedTranslations`: `boolean`\
Specifies whether surveys should store translation strings that equal the translation strings in the default locale. Default value: `false`.

- `useLocalTimeZone`: `boolean`\
Obsolete. Use the [`storeUtcDates`](https://surveyjs.io/form-library/documentation/api-reference/settings#storeUtcDates) setting instead.

### `maskSettings`

**Type**: `{ patternPlaceholderChar: string; patternEscapeChar: string; patternDefinitions: { [key: string]: RegExp; }; }`

An object with properties that configure input masks.

Nested properties:

- `patternPlaceholderChar`: `string`\
A symbol used as a placeholder for characters to be entered in [pattern masks](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern). Default value: `"_"`.

- `patternEscapeChar`: `string`\
A symbol used to insert literal representations of special characters in [pattern masks](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern). Default value: `"\\"`.

- `patternDefinitions`: `<{ [key: string]: RegExp }>`\
An object that maps placeholder symbols to regular expressions in [pattern masks](https://surveyjs.io/form-library/documentation/api-reference/inputmaskpattern). Default value: `{ "9": /[0-9]/, "a": /[a-zA-Z]/, "#": /[a-zA-Z0-9]/ }`.

### `matrix`

**Type**: `{ defaultCellType: string; defaultRowName: string; totalsSuffix: string; maxRowCount: number; maxRowCountInCondition: number; renderRemoveAsIcon: boolean; columnWidthsByType: { [index: string]: { minWidth?: string; width?: string; }; }; rateSize: "small" | "normal"; }`

An object with properties that apply to [Single-Choice](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model), [Multiple-Choice](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list), and [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model) questions.

Nested properties:

- `defaultRowName`: `string`\
A property key that stores an object with default cell values. Default value: "default".

- `defaultCellType`: `string`\
The default type of matrix cells. Default value: `"dropdown"`.\
You can specify this setting for individual questions or matrix columns: [`cellType`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#cellType). Refer to the `cellType` property description for information on possible values.

- `totalsSuffix`: `string`\
A suffix added to the name of the property that stores total values. The resulting property name consists of the matrix name and the suffix. Default value: `"-total"`.

- `maxRowCount`: `number`\
A maximum number of rows in a Dynamic Matrix. Default value: 1000.\
You can specify this setting for an individual Dynamic Matrix: [`maxRowCount`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model#maxRowCount).

- `maxRowCountInCondition`: `number`\
A maximum number of matrix rows included in the Condition drop-down menu in Survey Creator. This menu is used to configure conditional survey logic. Default value: 1.\
If you set this property to 0, the Condition menu does not include any matrix rows. Users still can specify conditions that use matrix rows but only with Manual Entry.

- `renderRemoveAsIcon`: `boolean`\
Disable this property if you want to render the Remove action in Dynamic Matrix as a button. Otherwise, the action is rendered as an icon. Default value: `true`.

- `columnWidthsByType`: `object`\
An object that specifies fixed and minimum column width based on the column type.\
Example: `settings.matrix.columnWidthsByType = { "tagbox": { minWidth: "240px", width: "300px" } }`

- `rateSize`: `"small"` (default) | `"normal"`\
Specifies the size of rate values. Applies to [Rating Scale](https://surveyjs.io/form-library/examples/rating-scale/) questions within matrixes.

### `maxConditionRunCountOnValueChanged`

**Type**: `number`

Specifies how many times surveys can re-evaluate expressions when a question value changes. This limit helps avoid recursions in expressions.

Default value: 10

### `maxDate`

**Type**: `string`

Specifies a maximum date that users can enter into a [Text](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) question with [`inputType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#inputType) set to `"date"` or `"datetime-local"`. Set this property to a string with the folllowing format: `"yyyy-mm-dd"`.

### `maxWidth`

**Type**: `string`

A maximum width value for all survey elements.

Default value: `"100%"`

You can override this setting for individual elements: [`maxWidth`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement#maxWidth).

### `minDate`

**Type**: `string`

Specifies a minimum date that users can enter into a [Text](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) question with [`inputType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#inputType) set to `"date"` or `"datetime-local"`. Set this property to a string with the folllowing format: `"yyyy-mm-dd"`.

### `minWidth`

**Type**: `string`

A minimum width value for all survey elements.

Default value: `"300px"`

You can override this setting for individual elements: [`minWidth`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement#minWidth).

### `noneItemValue`

**Type**: `string`

A value to save in survey results when respondents select the "None" choice item.

Default value: `"none"`

### `notifications`

**Type**: `{ lifetime: number; }`

An object that configures notifications.

Nested properties:

- `lifetime`: `number`\
Specifies a time period during which a notification is displayed; measured in milliseconds. Default value: 2000.

### `numbering`

**Type**: `{ includeQuestionsWithHiddenNumber: boolean; includeQuestionsWithHiddenTitle: boolean; }`

An object with properties that configure question numbering.

Nested properties:

- `includeQuestionsWithHiddenNumber`: `boolean`\
Specifies whether to number questions whose [`showNumber`](https://surveyjs.io/form-library/documentation/api-reference/question#showNumber) property is disabled. Default value: `false`.

- `includeQuestionsWithHiddenTitle`: `boolean`\
Specifies whether to number questions whose [`titleLocation`](https://surveyjs.io/form-library/documentation/api-reference/question#titleLocation) property is set to `"hidden"`. Default value: `false`.

### `panel`

**Type**: `{ maxPanelCount: number; maxPanelCountInCondition: number; }`

An object with properties that apply to [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model) questions.

Nested properties:

- `maxPanelCount`: `number`\
A maximum number of panels in Dynamic Panel. Default value: 100.\
You can specify this setting for an individual Dynamic Panel: [`maxPanelCount`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#maxPanelCount).

- `maxPanelCountInCondition`: `number`\
A maximum number of Dynamic Panel panels included in the Condition drop-down menu in Survey Creator. This menu is used to configure conditional survey logic. Default value: 1.\
If you set this property to 0, the Condition menu does not include any panel questions. Users still can specify conditions that use panel questions but only with Manual Entry.

### `parseNumber`

**Type**: `(stringValue: any, numericValue: number) => number`

A function that allows you to define custom parsing rules for numbers represented as string values.

The following code shows a template that you can use to implement the `parseNumber` function:

```js
import { settings } from "survey-core";

settings.parseNumber = (stringValue, numericValue) => {
  if (typeof stringValue !== "string" || !stringValue)
    return numericValue;
  let parsedNumber = numericValue;
  // ...
  // Parsing the number according to custom parsing rules
  // ...
  return parsedNumber;
};
```

**Related APIs:** [`settings.serialization`](https://surveyjs.io/form-library/documentation/api-reference/settings#serialization)

### `rankingDragHandleArea`

**Type**: `string`

Specifies which part of a choice item responds to a drag gesture in Ranking questions.

Possible values:

- `"entireItem"` (default) - Users can use the entire choice item as a drag handle.
- `"icon"` - Users can only use the choice item icon as a drag handle.

### `ratingMaximumRateValueCount`

**Type**: `number`

A maximum number of rate values in a [Rating](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) question.

Default value: 20

### `readOnly`

**Type**: `{ enableValidation: boolean; commentRenderMode: string; textRenderMode: string; }`

An object with properties that configure questions in read-only mode.

Nested properties:

- `commentRenderMode`: `"textarea"` (default) | `"div"`\
Specifies how to render the input field of [Comment](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model) questions in [read-only](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model#readOnly) mode: as a disabled `<textarea>` element or as a `<div>` element with a non-editable question value within it.

- `textRenderMode`: `"input"` (default) | `"div"`\
Specifies how to render the input field of [Text](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model) questions in [read-only](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#readOnly) mode: as a disabled `<input>` element or as a `<div>` element with a non-editable question value within it.

### `refuseItemValue`

**Type**: `string`

A value to save in survey results when respondents select the "Refuse to answer" choice item.

Default value: `"refused"`

### `serialization`

**Type**: `{ itemValueSerializeAsObject: boolean; itemValueSerializeDisplayText: boolean; localizableStringSerializeAsObject: boolean; matrixDropdownColumnSerializeTitle: boolean; }`

An object that contains properties related to JSON serialization.

Nested properties:

- `itemValueSerializeAsObject`: `boolean`\
Enable this property if you want to serialize [`ItemValue`](https://surveyjs.io/form-library/documentation/api-reference/itemvalue) instances (choice options, matrix rows, columns in a [Single-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model)) as objects even when they include only the `value` property. Default value: `false`.

- `itemValueSerializeDisplayText`: `boolean`\
Enable this property if you want to serialize the `text` property of [`ItemValue`](https://surveyjs.io/form-library/documentation/api-reference/itemvalue) objects even when it is empty or equal to the `value` property. Default value: `false`.

- `localizableStringSerializeAsObject`: `boolean`\
Enable this property if you want to serialize [`LocalizableString`](https://surveyjs.io/form-library/documentation/api-reference/localizablestring) instances as objects even when they include only a translation string for the default locale. For example, `"Custom String"` will be serialized as `{ default: "Custom String" }`. Default value: `false`.

- `matrixDropdownColumnSerializeTitle`: `boolean`\
Enable this property if you want to serialize the `title` property of [`MatrixDropdownColumn`](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) objects even when it is empty or equal to the `name` property. Default value: `false`.

**Related APIs:** [`settings.parseNumber`](https://surveyjs.io/form-library/documentation/api-reference/settings#parseNumber)

### `showDialog`

**Type**: `(options: IDialogOptions, rootElement?: HTMLElement) => any`

A method that displays a modal dialog.

Parameters:

- `options`: [`IDialogOptions`](https://surveyjs.io/form-library/documentation/api-reference/idialogoptions)\
An object that configures the dialog's content and behavior.

- `rootElement?`: `HTMLElement`\
A DOM element where the dialog should be rendered. If not specified, the dialog is rendered into `document.body`.

[View Demo](https://surveyjs.io/survey-creator/examples/add-modal-property-editor-to-property-grid/ (linkStyle))

### `showMaxLengthIndicator`

**Type**: `boolean`

Allows you to hide the maximum length indicator in text input questions.

If you specify a question's [`maxLength`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maxLength) property or a survey's [`maxTextLength`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#maxTextLength) property, text input questions indicate the number of entered characters and the character limit. Assign `false` to the `settings.showMaxLengthIndicator` property if you want to hide this indicator.

Default value: `true`

### `specialChoicesOrder`

**Type**: `{ selectAllItem: number[]; noneItem: number[]; refuseItem: number[]; dontKnowItem: number[]; otherItem: number[]; }`

An object whose properties specify the order of the special choice items ("None", "Other", "Select All", "Refuse to answer", "Don't know") in select-based questions.

Default value: `{ selectAllItem: [-1], noneItem: [1], refuseItem: [2], dontKnowItem: [3], otherItem: [4] }`

Use this object to reorder special choices. Each property accepts an array of integer numbers. Negative numbers place a special choice item above regular choice items, positive numbers place it below them. For instance, the code below specifies the following order of choices: None, Select All, regular choices, Other.

```js
import { settings } from "survey-core";

settings.specialChoicesOrder.noneItem = [-2];
settings.specialChoicesOrder.selectAllItem = [-1];
settings.specialChoicesOrder.otherItem = [1];
```

If you want to duplicate a special choice item above and below other choices, add two numbers to the corresponding array:

```js
settings.specialChoicesOrder.selectAllItem = [-1, 3] // Displays Select All above and below other choices
```

### `storeUtcDates`

**Type**: `boolean`

Specifies whether to store date-time values in the following format: `"YYYY-MM-DDThh:mm:ss.sssZ"`. Applies only to form fields with [`inputType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#inputType) set to `"datetime-local"`.

Default value: `false`

If you enable this setting, date-time values are converted from local time to UTC when they are saved to the survey's [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) object, while the question values remain in local time. Therefore, when you specify default values using a question's [`defaultValue`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#defaultValue) property, you need to use local time, but if you specify them using the `data` object, use a UTC date-time value in the following format: `"YYYY-MM-DDThh:mm:ss.sssZ"`.

```js
const surveyJson = {
  "elements": [{
    "name": "datetime",
    "type": "text",
    "title": "Select a date and time",
    "inputType": "datetime-local",
    "defaultValue": "2024-07-16T12:15:00" // Local date-time value
  }]
}
```

```js
import { Model } from "survey-core";
const surveyJson = { ... }
const survey = new Model(surveyJson);

survey.data = {
  datetime: "2024-07-16T12:15:00.000Z" // UTC date-time value
}
```

### `supportedValidators`

**Type**: `{ question: string[]; comment: string[]; text: string[]; checkbox: string[]; imagepicker: string[]; }`

A list of supported validators by question type.

### `tagboxCloseOnSelect`

**Type**: `boolean`

Specifies whether to close the drop-down menu of a [Multi-Select Dropdown (Tag Box)](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/) question after a user selects a value.

This setting applies to all Multi-Select Dropdown questions on a web page. You can use the [`closeOnSelect`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model#closeOnSelect) property to specify the same setting for an individual Multi-Select Dropdown question.

### `titleTags`

**Type**: `{ survey: string; page: string; panel: string; question: string; }`

An object that specifies HTML tags to use when rendering survey, page, panel, and question titles.

Default value: `{ survey: "div", page: "div", panel: "div", question: "div" }`

[View Demo](https://surveyjs.io/form-library/examples/change-heading-levels/ (linkStyle))

If you want to modify HTML tags for individual titles, handle `SurveyModel`'s [`onGetTitleTagName`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onGetTitleTagName) event.

### `triggers`

**Type**: `{ changeNavigationButtonsOnComplete: boolean; executeCompleteOnValueChanged: boolean; executeSkipOnValueChanged: boolean; }`

An object that contains properties related to [triggers](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-survey-logic-triggers).

Nested properties:

- `changeNavigationButtonsOnComplete`: `boolean`\
Specifies whether to re-evaluate an expression associated with the [Complete trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete) immediately when a question value changes. If the expression evaluates to `true`, the trigger is executed. Default value: `false`.\
Keep this property set to `false` if you want to re-evaluate the Complete trigger's expression only when the respondents navigate to another page.

- `executeCompleteOnValueChanged`: `boolean`\
Specifies whether to replace the Next button with the Complete button when the [Complete trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete) is going to be executed. Default value: `true`.

- `executeSkipOnValueChanged`: `boolean`\
Specifies whether to re-evaluate an expression associated with the [Skip trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#skip) immediately when a question value changes. If the expression evaluates to `true`, the trigger is executed. Default value: `true`.\
Disable this property if you want to re-evaluate the Skip trigger's expression only when respondents navigate to another page.

### `web`

**Type**: `{ onBeforeRequestChoices: (sender: any, options: IBeforeRequestChoicesOptions) => void; encodeUrlParams: boolean; cacheLoadedChoices: boolean; disableQuestionWhileLoadingChoices: boolean; }`

An object with properties that configure surveys when they work with a web service.

Nested properties:

- `encodeUrlParams`: `boolean`\
Specifies whether to encode URL parameters when you access a web service. Default value: `true`.

- `cacheLoadedChoices`: `boolean`\
Specifies whether to cache [choices loaded from a web service](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase#choicesByUrl). Default value: `true`.

- `disableQuestionWhileLoadingChoices`: `boolean`\
Disables a question while its choices are being loaded from a web service. Default value: `false`.

- `surveyServiceUrl`: `string`\
Obsolete. Self-hosted Form Library [no longer supports integration with SurveyJS Demo Service](https://surveyjs.io/stay-updated/release-notes/v2.0.0#form-library-removes-apis-for-integration-with-surveyjs-demo-service).

- `onBeforeRequestChoices`: `(sender: ChoicesRestful, options: { url: string, request?: XMLHttpRequest, fetchOptions?: RequestInit })`\
An event that is raised before a request for choices is sent. Applies to questions with a specified [`choiceByUrl`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase#choicesByUrl) property. Use the `options` parameter to access and modify the request to be sent. The `options.fetchOptions` object is defined only when the Form Library is run on a Node.js server; `options.request` is defined in the rest of cases. The following example shows how you can add authentication headers to a request for choices:

    ```js
    import { settings } from "survey-core";

    settings.web.onBeforeRequestChoices = (_, options) => {
      if (options.request) {
        options.request.setRequestHeader("RequestVerificationToken", requestVerificationToken);
      }
      if (options.fetchOptions) {
        options.fetchOptions.headers.append("RequestVerificationToken", requestVerificationToken);
      }
    };
    ```

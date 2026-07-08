---
title: Question
product: Form Library
api-type: class
description: A base class for all questions.
source: 
---

# `Question`

A base class for all questions.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question`

## Properties

### `isCustomWidgetRequested`

**Type**: `boolean`

### `customWidgetValue`

**Type**: `QuestionCustomWidget`

### `customWidgetData`

**Type**: `{ isNeedRender: boolean; }`

### `afterRenderCallbacks`

**Type**: `ISurveyAfterRenderCallbacks`

### `validationCallbacks`

**Type**: `ISurveyValidation`

### `focusCallback`

**Type**: `() => void`

### `surveyLoadCallback`

**Type**: `() => void`

### `displayValueCallback`

**Type**: `(text: string) => string`

### `hasCssErrorCallback`

**Type**: `() => boolean`

### `triggersInfo`

**Type**: `ITriggerExpressionInfo[]`

### `isChangingViaDefaultValue`

**Type**: `boolean`

### `isValueChangedDirectly`

**Type**: `boolean`

### `valueChangedCallback`

**Type**: `() => void`

### `commentChangedCallback`

**Type**: `() => void`

### `localeChangedCallback`

**Type**: `() => void`

### `validateValueCallback`

**Type**: `() => SurveyError`

### `questionTitleTemplateCallback`

**Type**: `() => string`

### `afterRenderQuestionCallback`

**Type**: `(question: Question, element: any) => any`

### `valueFromDataCallback`

**Type**: `(val: any) => any`

### `valueToDataCallback`

**Type**: `(val: any) => any`

### `onUpdateCssClassesCallback`

**Type**: `(css: any) => void`

### `setValueChangedDirectlyCallback`

**Type**: `(val: boolean) => void`

### `onGetSurvey`

**Type**: `() => ISurvey`

### `locProcessedTitle`

**Type**: `LocalizableString`

### `isReadyValue`

**Type**: `boolean`

### `commentElements`

**Type**: `any[]`

### `dependedQuestions`

**Type**: `Question[]`

### `commentTextAreaModelValue`

**Type**: `TextAreaModel`

### `isMobile`

**Type**: `boolean`

### `_isMobile`

**Type**: `boolean`

### `forceIsInputReadOnly`

**Type**: `boolean`

### `ariaExpanded`

**Type**: `"true" | "false"`

### `commentTextAreaModel`

**Type**: `TextAreaModel`

### `valueName`

Specifies an object property that should store the question value.

Refer to the [Merge Question Values](https://surveyjs.io/form-library/documentation/design-survey-merge-question-values) help topic for more information.

**Type**: `string`

### `isReady`

**Type**: `boolean`

### `page`

Returns a page to which the question belongs and allows you to move this question to a different page.

**Type**: `IPage`

### `isFlowLayout`

**Type**: `boolean`

### `visible`

Gets or sets question visibility.

If you want to display or hide a question based on a condition, specify the [`visibleIf`](https://surveyjs.io/form-library/documentation/question#visibleIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `boolean`

### `useDisplayValuesInDynamicTexts`

Specifies whether to use display names for question values in placeholders.

Default value: `true`

This property applies to questions whose values are defined as objects with the `value` and `text` properties (for example, [choice items](https://surveyjs.io/form-library/documentation/questionradiogroupmodel#choices) in Radiogroup, Checkbox, and Dropdown questions).

You can use question values as placeholders in the following places:

- Survey element titles and descriptions
- The [`html`](https://surveyjs.io/form-library/documentation/questionhtmlmodel#html) property of the [HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel) question

To use a question value as a placeholder, specify the question `name` in curly brackets: `{questionName}`. Refer to the following help topic for more information: [Dynamic Texts - Question Values](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#question-values).

**Type**: `boolean`

### `visibleIf`

A Boolean expression. If it evaluates to `false`, this question becomes hidden.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

[View Demo](https://surveyjs.io/form-library/examples/implement-conditional-logic-to-change-question-visibility/ (linkStyle))

**Type**: `string`

### `isVisible`

Returns `true` if the question is visible or the survey is currently in design mode.

If you want to display or hide a question based on a condition, specify the [`visibleIf`](https://surveyjs.io/form-library/documentation/question#visibleIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `boolean`

### `isVisibleInSurvey`

**Type**: `boolean`

### `visibleIndex`

Returns the visible index of the question in the survey. It can be from 0 to all visible questions count - 1
The visibleIndex is -1 if the title is 'hidden' or showNumber is false

**Type**: `number`

### `showNumber`

Specifies whether to show a number for this question. Setting this property to `false` hides the question number from the title and excludes the question from numbering.

Default value: `false` (inherited from the `SurveyModel`'s [`showQuestionNumbers`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showQuestionNumbers) property)

**Type**: `boolean`

### `hideNumber`

**Type**: `boolean`

### `isAllowTitleLeft`

Returns `true` if the question can display its title to the left of the input field.

**Type**: `boolean`

### `isQuestion`

**Type**: `boolean`

### `parent`

Returns a survey element (panel or page) that contains the question and allows you to move this question to a different survey element.

**Type**: `IPanel`

### `_singleInputBehavior`

**Type**: `QuestionSingleInputBehavior`

### `singleInputBehavior`

**Type**: `QuestionSingleInputBehavior`

### `singleInputQuestion`

**Type**: `Question`

### `singleInputSummary`

**Type**: `QuestionSingleInputSummary`

### `rootParentQuestion`

**Type**: `Question`

### `singleInputLocTitle`

**Type**: `LocalizableString`

### `singleInputActions`

**Type**: `ActionContainer<Action>`

### `singleInputHasActions`

**Type**: `boolean`

### `hasTitle`

Returns `false` if the `titleLocation` property is set to `"hidden"` or if the question cannot have a title (for example, an [HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel) question).

If the `title` property is `undefined` or set to an empty string, the `hasTitle` property returns `true`, because the question uses its `name` as a title in this case.

**Type**: `boolean`

### `titleLocation`

Sets question title location relative to the input field. Overrides the `questionTitleLocation` property specified for the question's container (survey, page, or panel).

Possible values:

- `"default"` (default) - Inherits the setting from the `questionTitleLocation` property specified for the question's container.
- `"top"` - Displays the title above the input field.
- `"bottom"` - Displays the title below the input field.
- `"left"` - Displays the title to the left of the input field.
- `"hidden"` - Hides the question title.

> Certain question types (Matrix, Multiple Text) do not support the `"left"` value. For them, the `"top"` value is used.

**Type**: `string`

### `titleWidth`

**Type**: `string`

### `errorLocation`

Specifies the error message position. Overrides the `questionErrorLocation` property specified for the question's container ([survey](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionErrorLocation), [page](https://surveyjs.io/form-library/documentation/api-reference/page-model#questionErrorLocation), or [panel](https://surveyjs.io/form-library/documentation/api-reference/panel-model#questionErrorLocation)).

Possible values:

- `"default"` (default) - Inherits the setting from the `questionErrorLocation` property specified for the question's container.
- `"top"` - Displays error messages above questions.
- `"bottom"` - Displays error messages below questions.

**Type**: `string`

### `hasInput`

Returns `false` if the question has no input fields ([HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel), and similar question types).

**Type**: `boolean`

### `hasSingleInput`

Returns `false` if the question has no input fields ([HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel)) or has multiple input fields ([Matrix](https://surveyjs.io/form-library/documentation/questionmatrixmodel), [Multiple Text](https://surveyjs.io/form-library/documentation/questionmultipletextmodel)).

**Type**: `boolean`

### `inputId`

**Type**: `string`

### `descriptionLocation`

Specifies where to display a question description.

Possible values:

- `"default"` (default) - Inherits the setting from the Survey's [`questionDescriptionLocation`](https://surveyjs.io/form-library/documentation/surveymodel#questionDescriptionLocation) property.
- `"underTitle"` - Displays the description under the question title.
- `"underInput"` - Displays the description under the interactive area.
- `"hidden"` - Hides the description.

**Type**: `string`

### `requiredErrorText`

Specifies a custom error message for a required form field.

**Type**: `string`

### `commentText`

Specifies a caption displayed above the comment area. Applies when the `showCommentArea` property is `true`.

**Type**: `string`

### `commentPlaceholder`

A placeholder for the comment area. Applies when the `showCommentArea` property is `true`.

**Type**: `string`

### `commentPlaceHolder`

**Type**: `string`

### `renderedCommentPlaceholder`

**Type**: `string`

### `defaultDisplayValue`

A value to show in HTML questions and in the dynamic titles and descriptions of survey elements when the question value is [empty](#isValueEmpty).

Default value: `""`

[Dynamic Texts](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#dynamic-texts (linkStyle))

**Type**: `string`

### `customWidget`

**Type**: `QuestionCustomWidget`

### `isCompositeQuestion`

**Type**: `boolean`

### `isContainer`

**Type**: `boolean`

### `processedTitle`

**Type**: `string`

### `fullTitle`

**Type**: `string`

### `isRequireTextOnStart`

**Type**: `boolean`

### `isRequireTextBeforeTitle`

**Type**: `boolean`

### `isRequireTextAfterTitle`

**Type**: `boolean`

### `startWithNewLine`

Disable this property if you want to render the current question on the same line or row with the previous question or panel.

[View Demo](https://surveyjs.io/form-library/examples/arrange-multiple-questions-in-single-line/ (linkStyle))

**Type**: `boolean`

### `cssRoot`

**Type**: `string`

### `cssHeader`

**Type**: `string`

### `cssContent`

**Type**: `string`

### `cssTitle`

**Type**: `string`

### `cssDescription`

**Type**: `string`

### `showErrorsAboveQuestion`

**Type**: `boolean`

### `showErrorsBelowQuestion`

**Type**: `boolean`

### `cssError`

**Type**: `string`

### `renderCssRoot`

**Type**: `string`

### `isFocusEmpty`

**Type**: `boolean`

### `isRequired`

Makes the question required. If a respondent skips a required question, the survey displays a validation error.

**Type**: `boolean`

### `requiredIf`

A Boolean expression. If it evaluates to `true`, this question becomes required.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `string`

### `showCommentArea`

Specifies whether to display a comment area.

**Type**: `boolean`

### `hasComment`

**Type**: `boolean`

### `id`

A value to assign to the `id` attribute of the rendered HTML element. A default `id` is generated automatically.

**Type**: `string`

### `ariaTitleId`

**Type**: `string`

### `ariaDescriptionId`

**Type**: `string`

### `commentId`

**Type**: `string`

### `questionName`

A unique value for the `name` HTML attribute of grouped inputs (e.g. radio buttons), so that questions sharing the same `name` (such as copies inside a Dynamic Panel) do not collapse into one input group.

**Type**: `string`

### `requireUpdateCommentValue`

**Type**: `boolean`

### `readOnlyCallback`

**Type**: `() => boolean`

### `isReadOnly`

**Type**: `boolean`

### `isInputReadOnly`

**Type**: `boolean`

### `renderedInputReadOnly`

**Type**: `string`

### `renderedInputDisabled`

**Type**: `string`

### `isReadOnlyAttr`

**Type**: `boolean`

### `isDisabledAttr`

**Type**: `boolean`

### `enableIf`

A Boolean expression. If it evaluates to `false`, this question becomes read-only.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

[View Demo](https://surveyjs.io/form-library/examples/how-to-conditionally-make-input-field-read-only/ (linkStyle))

**Type**: `string`

### `isInDesignMode`

**Type**: `boolean`

### `no`

A question number or letter (depends on the `questionStartIndex` property of the question container (panel, page, or survey)).

When the question number, title, or the entire question is invisible, this property returns an empty string.

**Type**: `string`

### `onGetNoCallback`

**Type**: `(no: string) => string`

### `isValueArray`

**Type**: `boolean`

### `value`

Gets or sets the question value.

The following table illustrates how the value type depends on the question type:

| Question type | Value type(s) |
| ------------- | ------------- |
| Checkboxes | <code>Array&lt;string &#124; number&gt;</code> |
| Dropdown | `string` \| `number` |
| Dynamic Matrix | `Array<object>` |
| Dynamic Panel | `Array<object>` |
| Expression | `string` \| `number` \| `boolean` |
| File Upload | `File` \| `Array<File>` |
| Image Picker | <code>Array&lt;string &#124; number&gt;</code> |
| Long Text | `string` |
| Multi-Select Dropdown | <code>Array&lt;string &#124; number&gt;</code> |
| Multi-Select Matrix | `object` |
| Multiple Textboxes | `Array<string>` |
| Radio Button Group | `string` \| `number` |
| Ranking | <code>Array&lt;string &#124; number&gt;</code> |
| Rating Scale | `number` \| `string` |
| Slider | <code>Array&lt;string &#124; number&gt;</code> |
| Signature | `string` (base64-encoded image) |
| Single-Line Input | `string` \| `number` \| `Date` |
| Single-Select Matrix | `object` |
| Yes/No (Boolean) | `boolean` \| `string` |

**Type**: `any`

### `hasFilteredValue`

**Type**: `boolean`

### `valueForSurvey`

**Type**: `any`

### `isParentVisible`

Returns `true` if a parent element (page or panel) is visible.

**Type**: `boolean`

### `clearIfInvisible`

Specifies when to clear the question value if the question becomes invisible.

Possible values:

- `"default"` (default) - Inherits the setting from the Survey's [`clearInvisibleValues`](https://surveyjs.io/form-library/documentation/surveymodel#clearInvisibleValues) property.
- `"onHidden"` - Clears the value when the question becomes invisible. If a question is invisible on startup and has an initial value, this value will be cleared when the survey is complete.
- `"onHiddenContainer"` - Clears the value when the question or its container (page or panel) becomes invisible. If a question is invisible on startup and has an initial value, this value will be cleared when the survey is complete.
- `"onComplete"` - Clears the value when the survey is complete.
- `"none"` - Never clears the value of an invisible question.

**Type**: `string`

### `displayValue`

**Type**: `any`

### `defaultValue`

A default value for the question. Ignored for question types that cannot have a [value](https://surveyjs.io/form-library/documentation/question#value) (for example, HTML).

The default value is used as a question value in the following cases:

- While the survey is being loaded from JSON.
- The question is just added to the survey and does not yet have an answer.
- The respondent left the answer empty.

[View Demo](https://surveyjs.io/form-library/examples/specify-default-question-value-dynamically (linkStyle))

**Type**: `any`

### `defaultValueExpression`

An expression used to calculate the [`defaultValue`](https://surveyjs.io/form-library/documentation/question#defaultValue).

This expression applies until the question [`value`](https://surveyjs.io/form-library/documentation/question#value) is specified by an end user or programmatically.

An expression can reference other questions as follows:

- `{other_question_name}`
- `{panel.other_question_name}` (to access questions inside the same dynamic panel)
- `{row.other_question_name}` (to access questions inside the same dynamic matrix or multi-column dropdown)

An expression can also include built-in and custom functions for advanced calculations. For example, if the `defaultValue` should be today's date, set the `defaultValueExpression` to `"today()"`, and the corresponding built-in function will be executed each time the survey is loaded. Refer to the following help topic for more information: [Built-In Functions](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#built-in-functions).

[View Demo](https://surveyjs.io/form-library/examples/specify-default-question-value-dynamically (linkStyle))

**Type**: `any`

### `resetValueIf`

A Boolean [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). If it evaluates to `true`, the question value is reset to [default](#defaultValue).

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

[View Demo](https://surveyjs.io/form-library/examples/set-question-value-dynamically/ (linkStyle))

**Type**: `string`

### `setValueIf`

A Boolean [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions). If it evaluates to `true`, the question value is set to a value calculated using the [`setValueExpression`](#setValueExpression).

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

[View Demo](https://surveyjs.io/form-library/examples/set-question-value-dynamically/ (linkStyle))

**Type**: `string`

### `setValueExpression`

An [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) that calculates the question value.

The `setValueExpression` is re-evaluated whenever a referenced question's value changes. If you also specify the [`setValueIf`](#setValueIf) expression, re-evaluation occurs only when it returns `true`.

[View Demo](https://surveyjs.io/form-library/examples/set-question-value-dynamically/ (linkStyle))

**Type**: `string`

### `resizeStyle`

**Type**: `"both" | "none"`

### `correctAnswer`

A correct answer to this question. Specify this property if you want to [create a quiz](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

[View Demo](https://surveyjs.io/form-library/examples/make-quiz-javascript/ (linkStyle))

**Type**: `any`

### `quizQuestionCount`

The number of quiz questions. A question counts if it is visible, has an input field, and specifies `correctAnswer`.

**Type**: `number`

### `correctAnswerCount`

**Type**: `number`

### `isValueDefault`

**Type**: `boolean`

### `comment`

A comment to the selected question value. Enable the `showCommentArea` property to allow users to leave comments.

**Type**: `string`

### `isAnswered`

**Type**: `boolean`

### `validators`

Question validators.

[Data Validation](https://surveyjs.io/form-library/documentation/data-validation (linkStyle))

**Type**: `SurveyValidator[]`

### `currentErrorCount`

**Type**: `number`

### `requiredMark`

Returns a character or text string that indicates a required question.

**Type**: `string`

### `requiredText`

**Type**: `string`

### `validatorRunner`

**Type**: `ValidatorRunner`

### `isRunningValidators`

**Type**: `boolean`

### `allowSpaceAsAnswer`

**Type**: `boolean`

### `isValueChangedInSurvey`

**Type**: `boolean`

### `isOldAnswered`

**Type**: `boolean`

### `isSettingQuestionValue`

**Type**: `boolean`

### `isInputTextUpdate`

**Type**: `boolean`

### `renderAs`

**Type**: `string`

### `inMatrixMode`

**Type**: `boolean`

### `resizeObserver`

**Type**: `any`

### `onMobileChangedCallback`

**Type**: `() => void`

### `triggerResponsivenessCallback`

**Type**: `(hard: boolean) => void`

### `validationDependentNames`

**Type**: `string[]`

### `isNewA11yStructure`

**Type**: `boolean`

### `ariaLabel`

**Type**: `string`

### `ariaRole`

**Type**: `string`

### `ariaRequired`

**Type**: `"true" | "false"`

### `ariaInvalid`

**Type**: `"true" | "false"`

### `ariaLabelledBy`

**Type**: `string`

### `ariaDescribedBy`

**Type**: `string`

### `contentAriaHidden`

**Type**: `boolean`

### `ariaErrormessage`

**Type**: `string`

### `a11y_input_ariaRole`

**Type**: `string`

### `a11y_input_ariaRequired`

**Type**: `"true" | "false"`

### `a11y_input_ariaInvalid`

**Type**: `"true" | "false"`

### `a11y_input_ariaLabel`

**Type**: `string`

### `a11y_input_ariaLabelledBy`

**Type**: `string`

### `a11y_input_ariaDescribedBy`

**Type**: `string`

### `a11y_input_ariaErrormessage`

**Type**: `string`

### `a11y_input_ariaExpanded`

**Type**: `"true" | "false"`

### `dragDropMatrixAttribute`

**Type**: `string`

### `randomize`

**Type**: `boolean`

### `randomizeCategory`

**Type**: `string`

## Methods

### `isReadOnlyRenderDiv()`

**Return value:** `boolean`

### `updateIsMobileFromSurvey()`

### `setIsMobile()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `boolean` |  |

### `themeChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `theme` | `ITheme` |  |

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `live` | `boolean` |  |

### `getValueName()`

**Return value:** `string`

### `waitForQuestionIsReady()`

**Return value:** `Promise<void><any>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `callback` | `() => void` |  |

### `choicesLoaded()`

### `getPanels()`

**Return value:** `IPanel[]<IPanel>`

### `delete()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `doDispose` | `boolean` |  |

### `getLayoutType()`

**Return value:** `string`

### `updateElementVisibility()`

### `onHidingContent()`

### `getType()`

Returns the question type.
Possible values:
- [*"boolean"*](https://surveyjs.io/Documentation/Library?id=questionbooleanmodel)
- [*"checkbox"*](https://surveyjs.io/Documentation/Library?id=questioncheckboxmodel)
- [*"comment"*](https://surveyjs.io/Documentation/Library?id=questioncommentmodel)
- [*"dropdown"*](https://surveyjs.io/Documentation/Library?id=questiondropdownmodel)
- [*"tagbox"*](https://surveyjs.io/form-library/documentation/questiontagboxmodel)
- [*"expression"*](https://surveyjs.io/Documentation/Library?id=questionexpressionmodel)
- [*"file"*](https://surveyjs.io/Documentation/Library?id=questionfilemodel)
- [*"html"*](https://surveyjs.io/Documentation/Library?id=questionhtmlmodel)
- [*"image"*](https://surveyjs.io/Documentation/Library?id=questionimagemodel)
- [*"imagepicker"*](https://surveyjs.io/Documentation/Library?id=questionimagepickermodel)
- [*"matrix"*](https://surveyjs.io/Documentation/Library?id=questionmatrixmodel)
- [*"matrixdropdown"*](https://surveyjs.io/Documentation/Library?id=questionmatrixdropdownmodel)
- [*"matrixdynamic"*](https://surveyjs.io/Documentation/Library?id=questionmatrixdynamicmodel)
- [*"multipletext"*](https://surveyjs.io/Documentation/Library?id=questionmultipletextmodel)
- [*"panel"*](https://surveyjs.io/Documentation/Library?id=panelmodel)
- [*"paneldynamic"*](https://surveyjs.io/Documentation/Library?id=questionpaneldynamicmodel)
- [*"radiogroup"*](https://surveyjs.io/Documentation/Library?id=questionradiogroupmodel)
- [*"rating"*](https://surveyjs.io/Documentation/Library?id=questionratingmodel)
- [*"ranking"*](https://surveyjs.io/Documentation/Library?id=questionrankingmodel)
- [*"signaturepad"*](https://surveyjs.io/Documentation/Library?id=questionsignaturepadmodel)
- [*"text"*](https://surveyjs.io/Documentation/Library?id=questiontextmodel)

**Return value:** `string`

### `getOwner()`

**Return value:** `Question | IPanel`

### `moveTo()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `container` | `IPanel` |  |
| `insertBefore` | `any` |  |

### `getProgressInfo()`

**Return value:** `IProgressInfo`

### `getValueGetterContext()`

**Return value:** `IValueGetterContext`

### `runTriggers()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `value` | `any` |  |
| `keys` | `any` |  |

### `setSurveyImpl()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `ISurveyImpl` |  |
| `isLight` | `boolean` |  |

### `resetSingleInput()`

### `validateSingleInput()`

**Return value:** `boolean`

### `getSingleInputElementPos()`

**Return value:** `number`

### `onSetAsSingleInput()`

### `nextSingleInput()`

**Return value:** `boolean`

### `prevSingleInput()`

**Return value:** `boolean`

### `getSingleInputAddText()`

**Return value:** `string`

### `singleInputAddItem()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `checkErrors` | `boolean` |  |

### `getTitleOwner()`

**Return value:** `ITitleOwner`

### `getTitleLocation()`

Returns title location calculated based on the question's `titleLocation` property and the `questionTitleLocation` property of the question's containers (survey, page, or panel).

**Return value:** `string`

### `getErrorLocation()`

**Return value:** `string`

### `getChildErrorLocation()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `child` | `Question` |  |

### `getAllErrors()`

**Return value:** `SurveyError[]<SurveyError>`

### `getErrorByType()`

**Return value:** `SurveyError`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `errorType` | `string` |  |

### `updateCustomWidget()`

### `localeChanged()`

### `onCommentInput()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `event` | `any` |  |

### `onCommentChange()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `event` | `any` |  |

### `afterRenderQuestionElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `afterRender()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `afterRenderCore()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `any` |  |

### `beforeDestroyQuestionElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `getRootCss()`

**Return value:** `string`

### `getQuestionRootCss()`

**Return value:** `string`

### `updateElementCss()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `reNew` | `boolean` |  |

### `focus()`

Moves focus to the input field of this question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `onError` | `boolean` | Pass `true` if you want to focus an input field with the first validation error. Default value: `false` (focuses the first input field). Applies to question types with multiple input fields. |
| `scrollIfVisible` | `boolean` |  |

### `expandAllParents()`

### `focusIn()`

### `getOthersMaxLength()`

**Return value:** `any`

### `getFirstQuestionToFocus()`

**Return value:** `Question`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `withError` | `boolean` |  |

### `supportComment()`

**Return value:** `boolean`

### `supportOther()`

**Return value:** `boolean`

### `surveyChoiceItemVisibilityChange()`

### `runCondition()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `properties` | `HashTable<any>` |  |

### `onSurveyLoad()`

### `getStructuredValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `level` | `number` |  |

### `getFilteredValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `isUnwrapped` | `boolean` |  |

### `getFilteredName()`

**Return value:** `any`

### `clearValue()`

Sets the question's `value` and `comment` properties to `undefined`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `keepComment` | `boolean` |  |
| `fromUI` | `boolean` |  |

### `unbindValue()`

### `createValueCopy()`

**Return value:** `any`

### `clearValueIfInvisible()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `reason` | `string` |  |

### `getDisplayValue()`

Returns a display text that corresponds to the question value. For example, if you call this method for a Dropdown question, it returns an item text instead of an item value.

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `keysAsText` | `boolean` | Applies when the question value is an object (in Matrix, Multiple Text, and similar questions). Pass `true` if not only values in the object should be display texts, but also keys. Default value: `false`. |
| `value` | `any` | Specify this parameter to get a display text for a specific value, not for the current question value. If the question value is an object, this parameter should be a similar object. |
| `isReadOnly` | `boolean` |  |

### `getPlainData()`

Returns the question value as an object in which the question name, title, value, and other parameters are stored as individual properties.

If the question can have more than one value (Matrix, Multiple Text), the object enables the `isNode` flag and stores information about these values in the `data` property. Refer to the following help topic for more information: [Access Full Survey Results](https://surveyjs.io/form-library/documentation/handle-survey-results-access#access-full-survey-results).

Pass an object with the `includeEmpty` property set to `false` if you want to skip empty answers.

**Return value:** `IQuestionPlainData`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IPlainDataOptions` |  |

### `isAnswerCorrect()`

Returns `true` if a question answer matches the [`correctAnswer`](#correctAnswer) property value.

[View Demo](https://surveyjs.io/form-library/examples/create-a-scored-quiz (linkStyle))

**Return value:** `boolean`

### `updateValueWithDefaults()`

### `getDefaultValue()`

**Return value:** `any`

### `getCommentAreaCss()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `isOther` | `boolean` |  |

### `isEmpty()`

Returns `true` if the question value is an empty string, array, or object or if it equals `undefined` or `null`.

**Return value:** `boolean`

### `getValidators()`

**Return value:** `SurveyValidator[]<SurveyValidator>`

### `getSupportedValidators()`

**Return value:** `string[]<any>`

### `addConditionObjectsByContext()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `objects` | `IConditionObject[]` |  |
| `context` | `any` |  |

### `getNestedQuestions()`

Returns an array of questions nested within the current question. Use this method to obtain questions within [Multiple Text](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model), [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model), and [Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model)-like questions.

**Return value:** `Question[]<Question>` &ndash; An array of nested questions.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `visibleOnly` | `boolean` | A Boolean value that specifies whether to include only visible nested questions. |
| `includeNested` | `boolean` |  |
| `includeItSelf` | `boolean` |  |

### `collectNestedQuestions()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questions` | `Question[]` |  |
| `visibleOnly` | `boolean` |  |
| `includeNested` | `boolean` |  |
| `includeItSelf` | `boolean` |  |

### `getConditionJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `operator` | `string` |  |
| `path` | `string` |  |

### `hasErrors()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fireCallback` | `boolean` |  |
| `focusOnFirstError` | `boolean` |  |

### `validate()`

Validates this question and returns `false` if the validation fails.

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fireCallback` | `boolean` | *(Optional)* Pass `false` if you do not want to show validation errors in the UI. |
| `focusFirstError` | `boolean` |  |
| `isOnValueChanged` | `boolean` |  |
| `callbackResult` | `(res: boolean, question: Question) => void` |  |
| `isOnValueChanging` | `boolean` |  |

### `validateElement()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `context` | `ValidationContext` |  |

### `addError()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `error` | `string \| SurveyError` |  |

### `removeError()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `error` | `SurveyError` |  |

### `hasRequiredError()`

**Return value:** `boolean`

### `getValueChangingOptions()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `childQuestion` | `Question` |  |

### `setVisibleIndex()`

**Return value:** `number`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `number` |  |

### `removeElement()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `IElement` |  |

### `supportAutoAdvance()`

**Return value:** `boolean`

### `supportGoNextPageError()`

**Return value:** `boolean`

### `clearIncorrectValues()`

Removes values that cannot be assigned to this question, for example, choices unlisted in the `choices` array.

Call this method after you assign new question values in code to ensure that they are acceptable.

> This method does not remove values that fail validation. Call the `validate()` method to validate newly assigned values.

### `clearOnDeletingContainer()`

### `clearErrors()`

Empties the `errors` array.

### `clearUnusedValues()`

### `getComponentName()`

**Return value:** `string`

### `isDefaultRendering()`

**Return value:** `boolean`

### `processPopupVisiblilityChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `popupModel` | `PopupModel<any>` |  |
| `visible` | `boolean` |  |

### `processOpenDropdownMenu()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IDropdownMenuOptions` |  |

### `transformToMobileView()`

### `transformToDesktopView()`

### `needResponsiveWidth()`

**Return value:** `boolean`

### `triggerResponsiveness()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `hard` | `boolean` |  |

### `destroyResizeObserver()`

### `dispose()`

### `resetValidationDependencies()`

## Events

### `onReadyChanged`

An event that is raised when the question's ready state has changed (expressions are evaluated, choices are loaded from a web resource specified by the `choicesByUrl` property, etc.).

Parameters:

- `sender`: `SurveyModel`\
A survey instance that contains the question whose ready state has changed.
- `options.isReady`: `boolean`\
Indicates whether the question is ready.
- `options.oldIsReady`: `boolean`\
Indicates the previous ready state.

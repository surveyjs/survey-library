---
title: SurveyModel
product: Form Library
api-type: class
description: The `SurveyModel` object contains properties and methods that allow you to control the survey and access its elements.
source: https://surveyjs.io/form-library/documentation/api-reference/surveymodel
---

# `SurveyModel`

The `SurveyModel` object contains properties and methods that allow you to control the survey and access its elements.

[View Demo](https://surveyjs.io/form-library/examples/nps-question/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; `SurveyModel`

## Properties

### `activePage`

**Type**: `any`

Returns [`startPage`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#startPage) if the survey currently displays a start page; otherwise, returns [`currentPage`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#currentPage).

**Related APIs:** [`startPage`](#startPage), [`currentPage`](#currentPage), [`firstPageIsStartPage`](#firstPageIsStartPage)

### `allowResizeComment`

**Type**: `boolean`

Specifies whether to display a resize handle for [Long Text](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/) questions and other text areas intended for multi-line text content.

Default value: `true`

You can override this property for individual Long Text questions: [`allowResize`](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model#allowResize).

**Related APIs:** [`autoGrowComment`](#autoGrowComment), [`commentAreaRows`](#commentAreaRows)

### `autoAdvanceAllowComplete`

**Type**: `boolean`

Specifies whether to complete the survey automatically after a user answers all questions on the last page. Applies only if the [`autoAdvanceEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#autoAdvanceEnabled) property is `true`.

Default value: `true`

**Related APIs:** [`[`settings.autoAdvanceDelay`](https://surveyjs.io/form-library/documentation/api-reference/settings#autoAdvanceDelay)`](#[`settings.autoAdvanceDelay`](https://surveyjs.io/form-library/documentation/api-reference/settings#autoAdvanceDelay))

### `autoAdvanceEnabled`

**Type**: `boolean`

Specifies whether the survey switches to the next page automatically after a user answers all questions on the current page.

Default value: `false`

If you enable this property, the survey is also completed automatically. Set the [`autoAdvanceAllowComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#autoAdvanceAllowComplete) property to `false` if you want to disable this behavior.

> If any of the following questions is answered last, the survey does not switch to the next page: Checkboxes, Yes/No (Boolean) (rendered as Checkbox), Long Text, Signature, Image Picker (with Multi Select), File Upload, Single-Select Matrix (not all rows are answered), Dynamic Matrix, Dynamic Panel.

[View Demo](https://surveyjs.io/form-library/examples/automatically-move-to-next-page-if-answer-selected/ (linkStyle))

**Related APIs:** [`[`settings.autoAdvanceDelay`](https://surveyjs.io/form-library/documentation/api-reference/settings#autoAdvanceDelay)`](#[`settings.autoAdvanceDelay`](https://surveyjs.io/form-library/documentation/api-reference/settings#autoAdvanceDelay))

### `autoFocusFirstError`

**Type**: `boolean`

Specifies whether to focus the first question with a validation error on the current page.

Default value: `true`

**Related APIs:** [`validate`](#validate), [`autoFocusFirstQuestion`](#autoFocusFirstQuestion)

### `autoFocusFirstQuestion`

**Type**: `boolean`

Specifies whether to focus the first question on the page on survey startup or when users switch between pages.

Default value: `false` in v1.9.114 and later, `true` in earlier versions

**Related APIs:** [`autoFocusFirstError`](#autoFocusFirstError), [`focusFirstQuestion`](#focusFirstQuestion), [`focusQuestion`](#focusQuestion)

### `autoGrowComment`

**Type**: `boolean`

Specifies whether to increase the height of [Long Text](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/) questions and other text areas to accommodate multi-line text content.

Default value: `false`

You can override this property for individual Long Text questions: [`autoGrow`](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model#autoGrow).

**Related APIs:** [`allowResizeComment`](#allowResizeComment), [`commentAreaRows`](#commentAreaRows)

### `backgroundImage`

**Type**: `string`

An image to display in the background of the survey or form. Accepts a base64 or URL string value.

**Related APIs:** [`backgroundOpacity`](#backgroundOpacity)

### `backgroundOpacity`

**Type**: `number`

A value from 0 to 1 that specifies how transparent the [background image](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#backgroundImage) should be: 0 makes the image completely transparent, and 1 makes it opaque.

### `calculatedValues`

**Type**: `CalculatedValue[]`

An array of [calculated values](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#calculated-values).

[View Demo](https://surveyjs.io/form-library/examples/custom-variables-for-background-form-calculations/ (linkStyle))

### `checkErrorsMode`

**Type**: `string`

Specifies when the survey validates answers.

Possible values:

- `"onNextPage"` (default) - Triggers validation before the survey is switched to the next page or completed.
- `"onValueChanged"` - Triggers validation each time a question value is changed. [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/)
- `"onComplete"` - Triggers validation when a user clicks the Complete button. If previous pages contain errors, the survey switches to the page with the first error.

> In SurveyJS Form Library v1.12.5 and earlier, the `"onValueChanged"` mode doesn't work with date input fields because of the way browsers process date values. In most browsers, the value is considered changed as soon as a user starts entering the date in a text input field. This means that a user may only enter the day without having the chance to enter the month and year before validation is triggered. For this reason, date input fields are validated before the survey is switched to the next page or completed. Starting with v1.12.6, `"onValueChanged"` works for date input fields as well as for input fields of other types.

Refer to the following help topic for more information: [Data Validation](https://surveyjs.io/form-library/documentation/data-validation).

**Related APIs:** [`validationEnabled`](#validationEnabled), [`validationAllowSwitchPages`](#validationAllowSwitchPages), [`validationAllowComplete`](#validationAllowComplete), [`validate`](#validate)

### `clearDisabledChoices`

**Type**: `boolean`

Specifies whether to remove disabled choices from the value in [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model), [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model), and [Radio Button Group](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model) questions.

Default value: `false`

> This property cannot be specified in the survey JSON schema. Use dot notation to specify it.

### `clearInvisibleValues`

**Type**: `any`

Specifies when to remove values of invisible questions from [survey results](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data).

Possible values:

- `"onComplete"` (default) - Clears invisible question values when the survey is complete.
- `"onHidden"` - Clears a question value when the question becomes invisible. If the question is invisible initially, its value is removed on survey completion.
- `"onHiddenContainer"` - Clears a question value when the question or its containter (page or panel) becomes invisible. If the question is invisible initially, its value is removed on survey completion.
- `"none"` - Keeps invisible values in survey results.
- `true` - Equivalent to `"onComplete"`.
- `false` - Equivalent to `"none"`.

**Related APIs:** [`[Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility)`](#[Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility)), [`onComplete`](#onComplete)

### `commentAreaRows`

**Type**: `number`

Specifies the visible height of comment areas, measured in lines. Applies to the questions with the [`showCommentArea`](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea) or [`showOtherItem`](https://surveyjs.io/form-library/documentation/api-reference/question#showOtherItem) property enabled.

Default value: 2

The value of this property is passed on to the `rows` attribute of the underlying `<textarea>` element.

**Related APIs:** [`autoGrowComment`](#autoGrowComment), [`allowResizeComment`](#allowResizeComment)

### `comments`

**Type**: `any`

An object with all comment values.

**Related APIs:** [`Question.showCommentArea`](#Question.showCommentArea), [`storeOthersAsComment`](#storeOthersAsComment)

### `commentSuffix`

**Type**: `string`

A suffix added to the name of the property that stores comments.

Default value: "-Comment"

Many question types allow respondents to leave comments. To enable this functionality, set a question's [`showCommentArea`](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#showCommentArea) property to `true`. Comment values are saved in a separate property. The property name is composed of the question `name` and `commentSuffix`.

Respondents can also leave comments when they select "Other" in choice-based questions, such as Dropdown or Checkboxes. The property name for the comment value is composed according to the same rules. However, you can use the question `name` as a key to store the comment value instead. Disable the [`storeOthersAsComment`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#storeOthersAsComment) property in this case.

[View Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

### `completedBeforeHtml`

**Type**: `string`

HTML content displayed to a user who has completed the survey before. To identify such users, the survey uses a [cookie name](#cookieName).

[View Demo](https://surveyjs.io/form-library/examples/how-to-prevent-duplicate-form-submissions/ (linkStyle))

**Related APIs:** [`processedCompletedBeforeHtml`](#processedCompletedBeforeHtml)

### `completedHtml`

**Type**: `string`

HTML content displayed on the [complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page).

[View Demo](https://surveyjs.io/form-library/examples/modify-survey-navigation-settings/ (linkStyle))

**Related APIs:** [`showCompletePage`](#showCompletePage), [`completedHtmlOnCondition`](#completedHtmlOnCondition)

### `completedHtmlOnCondition`

**Type**: `HtmlConditionItem[]`

An array of objects that allows you to specify different HTML content for the [complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page).

Each object should include the [`expression`](https://surveyjs.io/form-library/documentation/api-reference/htmlconditionitem#expression) and [`html`](https://surveyjs.io/form-library/documentation/api-reference/htmlconditionitem#html) properties. When `expression` evaluates to `true`, the survey uses the corresponding HTML markup instead of [`completedHtml`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#completedHtml). Refer to the following help topic for more information about expressions: [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions).

[View Demo](https://surveyjs.io/form-library/examples/nps-question/ (linkStyle))

### `completeText`

**Type**: `string`

Gets or sets a caption for the Complete button.

**Related APIs:** [`[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization)`](#[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization))

### `cookieName`

**Type**: `string`

A cookie name used to save information about survey completion.

When this property has a value, the survey creates a cookie with the specified name on completion. This cookie helps ensure that users do not pass the same survey twice. On the second run, they will see the [Completed Before page](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#completedBeforeHtml).

[View Demo](https://surveyjs.io/form-library/examples/how-to-prevent-duplicate-form-submissions/ (linkStyle))

**Related APIs:** [`clientId`](#clientId)

### `css`

**Type**: `any`

Gets or sets an object in which keys are UI elements and values are CSS classes applied to them.

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

### `currentElement`

**Type**: `ISurveyElement`

Gets or sets the current page, panel, or question (depends on the [`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) value).

The following table illustrates the dependency between `questionsOnPageMode` values and the types of survey elements that the `currentElement` property can contain:

| `questionsOnPageMode` | Survey element |
| --------------------- | -------------- |
| `"standard"` or `"singlePage"` | Page |
| `"questionPerPage"` | Question or Panel |
| `"inputPerPage"` | Question |

### `currentElementName`

**Type**: `string`

Specifies the current page, panel, or question (depends on the [`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) value) using its [`name`](https://surveyjs.io/form-library/documentation/api-reference/question#name).

The following table illustrates the dependency between `questionsOnPageMode` values and the types of survey elements that the `currentElementName` property can specify:

| `questionsOnPageMode` | Survey element |
| --------------------- | -------------- |
| `"standard"` or `"singlePage"` | Page |
| `"questionPerPage"` | Question or Panel |
| `"inputPerPage"` | Question |

**Related APIs:** [`currentElement`](#currentElement)

### `currentPage`

**Type**: `any`

Gets or sets the current page.

If you want to change the current page, set this property to a `PageModel` object. You can get this object in different ways. For example, you can call the [`getPageByName()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#getPageByName) method to obtain a `PageModel` object with a specific name:

```js
survey.currentPage = survey.getPageByName("my-page-name");
```

Alternative ways to change the current page are listed below:

- Set the [`currentPageNo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#currentPageNo) property to the index of the required page.
- Assign a required page name to the [`currentElementName`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#currentElementName) property.
- Assign a required page to the [`currentElement`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#currentElement) property.

The `currentPage` property does not return the start page even if it is current. Use the [`activePage`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#activePage) property instead if your survey contains a start page.

### `currentPageNo`

**Type**: `number`

A zero-based index of the current page in the [`visiblePages`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#visiblePages) array.

[View Demo](https://surveyjs.io/form-library/examples/survey-editprevious/ (linkStyle))

**Related APIs:** [`visiblePages`](#visiblePages)

### `data`

**Type**: `any`

Gets or sets an object with survey results. You can set this property with an object of the following structure:

```js
{
  question1Name: question1Value,
  question2Name: question2Value,
  // ...
}
```

[View Demo](https://surveyjs.io/form-library/examples/auto-populate-form-fields/ (linkStyle))

When you set the `data` property in code, the new object overrides the old object that may contain default question values and entered data. If you want to *merge* the new and old objects, call the [`mergeData(newDataObj)`](https://surveyjs.io/form-library/documentation/surveymodel#mergeData) method.

If you assign a new object while a respondent takes the survey, set the [`currentPageNo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#currentPageNo) property to 0 to start the survey from the beginning. This will also cause the survey to re-evaluate the [`visibleIf`](https://surveyjs.io/form-library/documentation/api-reference/question#visibleIf), [`enableIf`](https://surveyjs.io/form-library/documentation/api-reference/question#enableIf), and other [expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions).

**Related APIs:** [`setValue`](#setValue), [`getValue`](#getValue)

### `editText`

**Type**: `string`

Gets or sets a caption for the Edit button displayed when the survey shows a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).

**Related APIs:** [`showPreviewBeforeComplete`](#showPreviewBeforeComplete), [`cancelPreview`](#cancelPreview), [`previewText`](#previewText)

### `emptySurveyText`

**Type**: `string`

A message that is displayed when a survey does not contain visible pages or questions.

**Related APIs:** [`[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization)`](#[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization))

### `firstPageIsStartPage`

**Type**: `boolean`

Gets or sets a Boolean value that specifies whether the first page is a start page.

Refer to the following help topic for more information: [Start Page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#start-page).

**Related APIs:** [`startPage`](#startPage), [`activePage`](#activePage)

### `gridLayoutEnabled`

**Type**: `boolean`

Enables the grid layout, which structures form elements using a column-based system.

Default value: `false`

Specify the [`gridLayoutColumns`](https://surveyjs.io/form-library/documentation/api-reference/page-model#gridLayoutColumns) property for pages and panels to configure layout columns. Set the [`colSpan`](https://surveyjs.io/form-library/documentation/api-reference/question#colSpan) property for an individual question or panel to adjust how many columns this survey element spans.

### `hasCookie`

**Type**: `boolean`

Indicates whether the browser has a cookie with a specified [`cookieName`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#cookieName). If this property's value is `true`, the respondent has passed the survey previously.

**Related APIs:** [`setCookie`](#setCookie), [`deleteCookie`](#deleteCookie)

### `hideRequiredErrors`

**Type**: `boolean`

Specifies whether to hide validation errors thrown by the Required validation in the UI.

[Built-In Client-Side Validators](https://surveyjs.io/form-library/documentation/data-validation#built-in-client-side-validators (linkStyle))

**Related APIs:** [`validationEnabled`](#validationEnabled), [`validationAllowSwitchPages`](#validationAllowSwitchPages)

### `isCurrentPageValid`

**Type**: `boolean`

Returns `true` if the current page does not contain errors.

**Related APIs:** [`currentPage`](#currentPage)

### `isDesignMode`

**Type**: `boolean`

Indicates whether the survey is being designed in [Survey Creator](https://surveyjs.io/survey-creator/documentation/overview).

### `isEmpty`

**Type**: `boolean`

Returns `true` if the survey contains zero pages.

**Related APIs:** [`emptySurveyText`](#emptySurveyText)

### `isFirstPage`

**Type**: `boolean`

Indicates whether the [current page](#currentPage) is the first page.

> If the survey displays the [start page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#start-page), this property contains `false`. Use the [`isStartPageActive`](#isStartPageActive) property to find out whether the start page is currently displayed.

### `isLastPage`

**Type**: `boolean`

Indicates whether the [current page](#currentPage) is the last page.

### `isStartPageActive`

**Type**: `boolean`

A Boolean value that indicates whether the [start page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#start-page) is currently displayed.

### `isValidatingOnServer`

**Type**: `boolean`

Indicates whether the current page is being [validated on a server](#onServerValidateQuestions).

### `jsonErrors`

**Type**: `JsonError[]`

A list of errors in a survey JSON schema.

### `keepIncorrectValues`

**Type**: `boolean`

Specifies whether to keep values that cannot be assigned to questions, for example, choices unlisted in the `choices` array.

> This property cannot be specified in the survey JSON schema. Use dot notation to specify it.

**Related APIs:** [`clearIncorrectValues`](#clearIncorrectValues)

### `lazyRenderEnabled`

**Type**: `boolean`

Specifies whether to enable lazy rendering.

In default mode, a survey renders the entire current page. With lazy rendering, the survey renders the page gradually as a user scrolls it. This helps reduce survey startup time and optimizes large surveys for low-end devices.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/survey-lazy/ (linkStyle))

**Related APIs:** [`[settings.lazyRender](https://surveyjs.io/form-library/documentation/api-reference/settings#lazyRender)`](#[settings.lazyRender](https://surveyjs.io/form-library/documentation/api-reference/settings#lazyRender))

### `loadingHtml`

**Type**: `string`

HTML content displayed while a survey JSON schema is [being loaded](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#beginLoading).

**Related APIs:** [`processedLoadingHtml`](#processedLoadingHtml)

### `locale`

**Type**: `string`

Specifies the survey's locale.

Default value: `""` (a default locale is used)

[Localization & Globalization help topic](https://surveyjs.io/form-library/documentation/survey-localization (linkStyle))

[Survey Localization demo](https://surveyjs.io/form-library/examples/survey-localization/ (linkStyle))

### `logo`

**Type**: `string`

An image URL or a Base64-encoded image to use as a survey logo.

[View Demo](https://surveyjs.io/form-library/examples/survey-logo/ (linkStyle))

**Related APIs:** [`logoPosition`](#logoPosition), [`logoFit`](#logoFit)

### `logoFit`

**Type**: `string`

Specifies how to resize a logo to fit it into its container.

Possible values:

- `"contain"` (default)
- `"cover"`
- `"fill"`
- `"none"`

Refer to the [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property description for information on the possible values.

[View Demo](https://surveyjs.io/form-library/examples/survey-logo/ (linkStyle))

**Related APIs:** [`logo`](#logo), [`logoPosition`](#logoPosition)

### `logoHeight`

**Type**: `any`

A logo height in CSS-accepted values.

Default value: `40px`

[View Demo](https://surveyjs.io/form-library/examples/survey-logo/ (linkStyle))

**Related APIs:** [`logoWidth`](#logoWidth), [`logo`](#logo), [`logoPosition`](#logoPosition), [`logoFit`](#logoFit)

### `logoPosition`

**Type**: `string`

A logo position relative to the [survey title](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title).

Possible values:

- `"left"` (default) - Places the logo to the left of the survey title.
- `"right"` - Places the logo to the right of the survey title.
- `"none"` - Hides the logo.

[View Demo](https://surveyjs.io/form-library/examples/survey-logo/ (linkStyle))

**Related APIs:** [`logo`](#logo), [`logoFit`](#logoFit)

### `logoWidth`

**Type**: `any`

A logo width in CSS-accepted values.

Default value: `auto` (the width is calculated automatically based on the [`logoHeight`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoHeight) value to keep the original aspect ratio)

[View Demo](https://surveyjs.io/form-library/examples/survey-logo/ (linkStyle))

**Related APIs:** [`logo`](#logo), [`logoPosition`](#logoPosition), [`logoFit`](#logoFit)

### `matraixDragHandleArea`

**Type**: `string`

Specifies which part of a matrix row responds to a drag gesture in [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/) questions.

Possible values:

- `"entireItem"` (default) - Users can use the entire matrix row as a drag handle.
- `"icon"` - Users can only use a drag icon as a drag handle.

### `maxCommentLength`

**Type**: `number`

Specifies the maximum text length for question comments. Applies to questions with the [`showCommentArea`](https://surveyjs.io/form-library/documentation/api-reference/question#showCommentArea) or [`showOtherItem`](https://surveyjs.io/form-library/documentation/api-reference/question#showOtherItem) property set to `true`.

Default value: 0 (unlimited)

**Related APIs:** [`maxTextLength`](#maxTextLength)

### `maxTextLength`

**Type**: `number`

Specifies the maximum text length in textual questions ([Single-Line Input](https://surveyjs.io/form-library/examples/text-entry-question/), [Long Text](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/), [Multiple Textboxes](https://surveyjs.io/form-library/examples/multiple-text-box-question/)), measured in characters.

Default value: 0 (unlimited)

You can override this setting for individual questions if you specify their [`maxLength`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maxLength) property.

**Related APIs:** [`maxCommentLength`](#maxCommentLength)

### `navigateToUrl`

**Type**: `string`

A URL to which respondents should be navigated after survey completion.

**Related APIs:** [`onNavigateToUrl`](#onNavigateToUrl), [`navigateToUrlOnCondition`](#navigateToUrlOnCondition)

### `navigateToUrlOnCondition`

**Type**: `UrlConditionItem[]`

An array of objects that allows you to navigate respondents to different URLs after survey completion.

Each object should include the [`expression`](https://surveyjs.io/form-library/documentation/api-reference/urlconditionitem#url) and [`url`](https://surveyjs.io/form-library/documentation/api-reference/urlconditionitem#expression) properties. When `expression` evaluates to `true`, the survey navigates to the corresponding `url`. Refer to the following help topic for more information about expressions: [Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions).

**Related APIs:** [`onNavigateToUrl`](#onNavigateToUrl), [`navigateToUrl`](#navigateToUrl)

### `navigationButtonsLocation`

**Type**: `any`

Gets or sets the position of the Start, Next, Previous, and Complete navigation buttons. Applies only if the [`showNavigationButtons`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showNavigationButtons) property is `true`.

Possible values:

- `"bottom"` (default) - Displays the navigation buttons below survey content.
- `"top"` - Displays the navigation buttons above survey content.
- `"topBottom"` - Displays the navigation buttons above and below survey content.

**Related APIs:** [`autoAdvanceEnabled`](#autoAdvanceEnabled), [`showPrevButton`](#showPrevButton), [`showCompleteButton`](#showCompleteButton)

### `pageCount`

**Type**: `number`

Returns a total number of survey pages.

To get the number of visible pages, use the [`visiblePageCount`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#visiblePageCount) property.

**Related APIs:** [`pages`](#pages)

### `pageNextText`

**Type**: `string`

Gets or sets a caption for the Next button.

**Related APIs:** [`[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization)`](#[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization))

### `pagePrevText`

**Type**: `string`

Gets or sets a caption for the Previous button.

**Related APIs:** [`[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization)`](#[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization))

### `pages`

**Type**: `PageModel[]`

Returns an array of all pages in the survey.

To get an array of only visible pages, use the [`visiblePages`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#visiblePages) array.

**Related APIs:** [`PageModel`](#PageModel)

### `partialSendEnabled`

**Type**: `boolean`

Specifies whether to save survey results when respondents switch between pages. Handle the [`onPartialSend`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onPartialSend) event to implement the save operation.

Alternatively, you can handle the [`onCurrentPageChanged`](#onCurrentPageChanged) and [`onValueChanged`](#onValueChanged) events, as shown in the following demo: [Continue an Incomplete Survey](https://surveyjs.io/form-library/examples/survey-editprevious/).

### `previewMode`

**Type**: `string`

Specifies whether the [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page) includes all or only answered questions.

Possible values:

- `"allQuestions"` (default)
- `"answeredQuestions"`

[View Demo](https://surveyjs.io/form-library/examples/survey-preview/ (linkStyle))

### `previewText`

**Type**: `string`

Gets or sets a caption for the Preview button.

**Related APIs:** [`showPreviewBeforeComplete`](#showPreviewBeforeComplete), [`showPreview`](#showPreview), [`editText`](#editText)

### `processedCompletedBeforeHtml`

**Type**: `string`

Returns HTML content displayed to a user who has completed the survey before. To identify such users, the survey uses a [cookie name](#cookieName).

To specify HTML content, use the [`completedBeforeHtml`](#completedBeforeHtml) property.

### `processedCompletedHtml`

**Type**: `string`

Returns HTML content displayed on the [complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page).

To specify HTML content, use the [`completedHtml`](#completedHtml) property.

### `processedLoadingHtml`

**Type**: `string`

Returns HTML content displayed while a survey JSON schema is [being loaded](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#beginLoading).

To specify HTML content, use the [`loadingHtml`](#loadingHtml) property.

### `progressBarInheritWidthFrom`

**Type**: `"survey" | "container"`

Specifies whether the progress bar spans the width of the survey or that of the survey container. Applies only when the [progress bar is visible](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showProgressBar) and [`progressBarType`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#progressBarType) is `"pages"`.

Possible values:

- `"survey"`\
The progress bar width is the same as the survey width.
- `"container"` (default)\
The progress bar width is the same as the survey container width.

**Related APIs:** [`progressBarShowPageTitles`](#progressBarShowPageTitles), [`progressBarShowPageNumbers`](#progressBarShowPageNumbers)

### `progressBarLocation`

**Type**: `string`

Specifies the alignment of the progress bar. Applies only if the [`showProgressBar`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showProgressBar) property is `true`.

Possible values:

- `"aboveHeader"` - Displays the progress bar above the survey header.
- `"belowHeader"` - Displays the progress bar below the survey header.
- `"bottom"` - Displays the progress bar below survey content.
- `"topBottom"` - Displays the progress bar above and below survey content.
- `"auto"` (default) - Displays the progress bar below the survey header if the header has a [background image](https://surveyjs.io/form-library/documentation/api-reference/iheader#backgroundImage) or color. Otherwise, the progress bar is displayed above the header.

[View Demo](https://surveyjs.io/form-library/examples/navigation-default/ (linkStyle))

**Related APIs:** [`showProgressBar`](#showProgressBar), [`progressBarType`](#progressBarType), [`progressValue`](#progressValue)

### `progressBarShowPageNumbers`

**Type**: `boolean`

Specifies whether the progress bar displays page numbers. Applies only when the [progress bar is visible](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showProgressBar) and [`progressBarType`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#progressBarType) is `"pages"`.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/configure-form-navigation-with-progress-indicators/ (linkStyle))

**Related APIs:** [`progressBarShowPageTitles`](#progressBarShowPageTitles), [`progressBarInheritWidthFrom`](#progressBarInheritWidthFrom)

### `progressBarShowPageTitles`

**Type**: `boolean`

Specifies whether the progress bar displays page titles. Applies only when the [progress bar is visible](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showProgressBar) and [`progressBarType`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#progressBarType) is `"pages"`.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/configure-form-navigation-with-progress-indicators/ (linkStyle))

**Related APIs:** [`progressBarShowPageNumbers`](#progressBarShowPageNumbers), [`progressBarInheritWidthFrom`](#progressBarInheritWidthFrom)

### `progressBarType`

**Type**: `string`

Specifies the type of information displayed by the progress bar. Applies only when [`showProgressBar`](#showProgressBar) is `true`.

Possible values:

- `"pages"` (default) - The number of completed pages.
- `"questions"` - The number of answered questions.
- `"requiredQuestions"` - The number of answered [required questions](https://surveyjs.io/form-library/documentation/api-reference/question#isRequired).
- `"correctQuestions"` - The number of correct questions in a [quiz](https://surveyjs.io/form-library/documentation/design-survey/create-a-quiz).
- `"buttons"` - *(Obsolete)* Use the `"pages"` property value with the [`progressBarShowPageTitles`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#progressBarShowPageTitles) property set to `true` instead.

> When `progressBarType` is set to `"pages"`, you can also enable the [`progressBarShowPageNumbers`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#progressBarShowPageNumbers) and [`progressBarShowPageTitles`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#progressBarShowPageTitles) properties if you want to display page numbers and titles in the progress bar.

[View Demo](https://surveyjs.io/form-library/examples/navigation-buttons/ (linkStyle))

**Related APIs:** [`progressValue`](#progressValue)

### `progressText`

**Type**: `string`

Returns text displayed by the progress bar (for instance, "Page 2 of 3" or "Answered 3/8 questions"). Handle the [`onGetProgressText`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onGetProgressText) event to change this text.

**Related APIs:** [`progressValue`](#progressValue), [`showProgressBar`](#showProgressBar), [`progressBarType`](#progressBarType), [`getProgressInfo`](#getProgressInfo)

### `progressValue`

**Type**: `number`

Returns a percentage value that indicates user progress in the survey.

**Related APIs:** [`showProgressBar`](#showProgressBar), [`progressBarType`](#progressBarType), [`progressText`](#progressText), [`getProgressInfo`](#getProgressInfo)

### `questionDescriptionLocation`

**Type**: `string`

Specifies where to display question descriptions.

Possible values:

- `"underTitle"` (default) - Displays descriptions under question titles.
- `"underInput"` - Displays descriptions under the interactive area.
- `"hidden"` - Hides question descriptions.

You can override this setting for individual questions if you specify their [`descriptionLocation`](https://surveyjs.io/form-library/documentation/api-reference/question#descriptionLocation) property.

### `questionErrorLocation`

**Type**: `string`

Specifies the error message position.

Possible values:

- `"top"` (default) - Displays error messages above questions.
- `"bottom"` - Displays error messages below questions.

You can override this setting if you specify the `questionErrorLocation` property for an [individual page](https://surveyjs.io/form-library/documentation/pagemodel#questionErrorLocation) or [panel](https://surveyjs.io/form-library/documentation/panelmodel#questionErrorLocation) or set the `errorLocation` property for a [specific question](https://surveyjs.io/form-library/documentation/question#errorLocation).

### `questionOrder`

**Type**: `string`

Specifies the sort order of questions in the survey.

Possible values:

- `"initial"` (default) - Preserves the original order of questions.
- `"random"` - Displays questions in random order.

You can override this property for individual pages and panels.

**Related APIs:** [`PageModel.questionOrder`](#PageModel.questionOrder), [`PanelModel.questionOrder`](#PanelModel.questionOrder)

### `questionsOnPageMode`

**Type**: `string`

Specifies how to distribute survey elements between pages.

Possible values:

- `"singlePage"` - Combines all survey pages into a single page.
- `"questionPerPage"` - Displays each question on a separate page.
- `"inputPerPage"` - Displays each input field on a separate page. Complex questions&mdash;such as [Single-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-question-model), [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list), [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model), [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model), and [Multiple Textboxes](https://surveyjs.io/form-library/documentation/api-reference/multiple-text-entry-question-model)&mdash;are split so that each input field appears on its own page. [View Demo](https://surveyjs.io/form-library/examples/loop-and-merge/)
- `"standard"` (default) - Retains the original structure specified in the JSON schema.

### `questionStartIndex`

**Type**: `string`

Specifies the initial number or letter from which to start question numbering.

[Question Numbers](https://surveyjs.io/form-library/documentation/design-survey/configure-question-titles#question-numbers (linkStyle))

### `questionTitleLocation`

**Type**: `string`

Gets or sets question title location relative to the input field: `"top"`, `"bottom"`, or `"left"`.

> Certain question types (Matrix, Multiple Text) do not support the `"left"` value. For them, the `"top"` value is used.

You can override this setting if you specify the `questionTitleLocation` property for an [individual page](https://surveyjs.io/form-library/documentation/pagemodel#questionTitleLocation) or [panel](https://surveyjs.io/form-library/documentation/panelmodel#questionTitleLocation) or set the `titleLocation` property for a [specific question](https://surveyjs.io/form-library/documentation/question#titleLocation).

### `questionTitlePattern`

**Type**: `string`

Specifies a pattern for question titles.

Refer to the following help topic for more information: [Title Pattern](https://surveyjs.io/form-library/documentation/design-survey/configure-question-titles#title-pattern).

### `readOnly`

**Type**: `boolean`

Enables the read-only mode. If you set this property to `true`, users cannot take the survey.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/prevent-form-editing-with-read-only-mode/ (linkStyle))

### `requiredMark`

**Type**: `string`

Specifies one or multiple characters that designate required questions.

Default value: `*`

[View Demo](https://surveyjs.io/form-library/examples/modify-question-title/ (linkStyle))

### `showCompleteButton`

**Type**: `boolean`

Specifies whether to display the Complete button. Set this property to `false` if respondents should not complete the survey.

**Related APIs:** [`showNavigationButtons`](#showNavigationButtons), [`showPrevButton`](#showPrevButton)

### `showCompletePage`

**Type**: `boolean`

Specifies whether to show the [complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page).

**Related APIs:** [`onComplete`](#onComplete), [`navigateToUrl`](#navigateToUrl)

### `showHeaderOnCompletePage`

**Type**: `boolean | "auto"`

Specifies whether the [Complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page) should display the [survey header](https://surveyjs.io/form-library/examples/brand-your-survey-header/).

Possible values:

- `true` - Displays the survey header on the Complete page.
- `false` - Hides the header when users reach the Complete page.
- `"auto"` (default) - Displays a header with the basic view, but hides a header with the advanced view (see the [`headerView`](https://surveyjs.io/form-library/documentation/api-reference/itheme#headerView) property description).

> This property cannot be specified in the survey JSON schema. Use dot notation to specify it.

### `showInvisibleElements`

**Type**: `boolean`

Specifies whether to show all survey elements, regardless of their visibility.

Default value: `false`

### `showNavigationButtons`

**Type**: `any`

Gets or sets the visibility of the Start, Next, Previous, and Complete navigation buttons.

Possible values:

- `true` (default) - Displays the navigation buttons.
- `false` - Hides the navigation buttons. This setting may be useful if you [implement custom external navigation](https://surveyjs.io/form-library/examples/external-form-navigation-system/).

**Related APIs:** [`navigationButtonsLocation`](#navigationButtonsLocation), [`autoAdvanceEnabled`](#autoAdvanceEnabled), [`showPrevButton`](#showPrevButton), [`showCompleteButton`](#showCompleteButton)

### `showPageNumbers`

**Type**: `boolean`

Specifies whether page titles contain page numbers.

[View Demo](https://surveyjs.io/form-library/examples/how-to-number-pages-and-questions/ (linkStyle))

**Related APIs:** [`onGetPageNumber`](#onGetPageNumber)

### `showPageTitles`

**Type**: `boolean`

Specifies whether to display [page titles](https://surveyjs.io/form-library/documentation/api-reference/page-model#title).

### `showPrevButton`

**Type**: `boolean`

Specifies whether to display the Previous button. Set this property to `false` if respondents should not move backward along the survey.

**Related APIs:** [`showNavigationButtons`](#showNavigationButtons), [`showCompleteButton`](#showCompleteButton)

### `showPreviewBeforeComplete`

**Type**: `any`

Specifies whether to show a preview of given answers before they are submitted.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/survey-preview/ (linkStyle))

**Related APIs:** [`previewMode`](#previewMode), [`showPreview`](#showPreview), [`cancelPreview`](#cancelPreview)

### `showProgressBar`

**Type**: `boolean`

Specifies the visibility of the progress bar.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/navigation-default/ (linkStyle))

**Related APIs:** [`progressBarLocation`](#progressBarLocation), [`progressBarType`](#progressBarType), [`progressValue`](#progressValue), [`getProgressInfo`](#getProgressInfo)

### `showQuestionNumbers`

**Type**: `string | boolean`

Specifies whether to display survey element numbers and how to calculate them.

Possible values:

- `true` or `"on"` - Numbers survey elements in order, regardless of their nesting level.
- `"recursive"` - Applies recursive numbering to elements nested in panels (for example, 1 -> 1.1 -> 1.1.1, etc.).
- `"onpage"` - Starts numbering on each page from scratch.
- `false` or `"off"` - Hides question numbers.

[View Demo](https://surveyjs.io/form-library/examples/how-to-number-pages-and-questions/ (linkStyle))

If you want to hide the number of an individual question, disable its [`showNumber`](https://surveyjs.io/form-library/documentation/api-reference/question#showNumber) property.

**Related APIs:** [`onGetQuestionNumber`](#onGetQuestionNumber)

### `showTimer`

**Type**: `boolean`

Specifies the timer's visibility. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

Default value: `false`

If you set this property to `true`, the timer starts automatically when the survey begins. To specify time limits, use the [`timeLimit`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#timeLimit) and [`timeLimitPerPage`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#timeLimitPerPage) properties.

[View Demo](https://surveyjs.io/form-library/examples/make-quiz-javascript/ (linkStyle))

The timer displays information about time spent on an individual page and the entire survey. If you want to display only the page timer or the survey timer, set the [`timerInfoMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#timerInfoMode) property to `"page"` or `"survey"`.

You can enable the timer without displaying it. In this case, you need to specify the required time limits and use the [`startTimer()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#startTimer) and [`stopTimer()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#stopTimer) methods to control the timer.

**Related APIs:** [`timerLocation`](#timerLocation), [`timeSpent`](#timeSpent), [`onTimerTick`](#onTimerTick)

### `showTitle`

**Type**: `boolean`

Specifies whether to display the [survey title](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title).

[View Demo](https://surveyjs.io/form-library/examples/brand-your-survey-header/ (linkStyle))

**Related APIs:** [`title`](#title)

### `showTOC`

**Type**: `boolean`

Gets or sets the visibility of the table of contents.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/toc-feature/ (linkStyle))

**Related APIs:** [`tocLocation`](#tocLocation)

### `startPage`

**Type**: `PageModel`

Returns the start page. Applies only if the [`firstPageIsStartPage`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#firstPageIsStartPage) property is set to `true`.

Refer to the following help topic for more information: [Start Page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#start-page).

**Related APIs:** [`firstPageIsStartPage`](#firstPageIsStartPage), [`activePage`](#activePage)

### `startSurveyText`

**Type**: `string`

Gets or sets a caption for the Start button.

[View Demo](https://surveyjs.io/form-library/examples/make-quiz-javascript/ (linkStyle))

**Related APIs:** [`firstPageIsStartPage`](#firstPageIsStartPage), [`[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization)`](#[Localization & Globalization](https://surveyjs.io/form-library/documentation/survey-localization))

### `state`

**Type**: `string`

Returns the current survey state.

Possible values:

- `"loading"` - The survey is being loaded from a JSON schema.
- `"empty"` - The survey has no elements to display.
- `"starting"` - The survey displays a [start page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#start-page).
- `"running"` - A respondent is taking the survey.
- `"preview"` - A respondent is [previewing](https://surveyjs.io/form-library/examples/survey-showpreview/) answers before submitting them.
- `"completed"` - A respondent has completed the survey and submitted the results.

### `storeOthersAsComment`

**Type**: `boolean`

Specifies whether to store the "Other" option response in a separate property.

Default value: `true`

Respondents can leave comments when they select "Other" in choice-based questions, such as Dropdown or Checkboxes. Comment values are saved in a separate property. The property name is composed of the question `name` and [`commentSuffix`](#commentSuffix). However, you can use the question `name` as a key to store the comment value instead. Disable the `storeOthersAsComment` property in this case.

**Related APIs:** [`maxCommentLength`](#maxCommentLength)

### `textUpdateMode`

**Type**: `string`

Specifies when to update the question value in questions with a text input field.

Possible values:

- `"onBlur"` (default) - Updates the value after the input field loses focus.
- `"onTyping"` - Updates the value on every key press.

[View Demo](https://surveyjs.io/form-library/examples/set-question-value-dynamically/ (linkStyle))

> Do not use the `"onTyping"` mode if your survey contains many expressions. Expressions are re-evaluated each time a question value is changed. In `"onTyping"` mode, the question value changes frequently. This may cause performance degradation.

You can override this setting for individual questions: [`textUpdateMode`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#textUpdateMode).

### `timeLimit`

**Type**: `number`

A time period that a respondent has to complete the survey; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

Default value: 0 (time is unlimited)

[View Demo](https://surveyjs.io/form-library/examples/make-quiz-javascript/ (linkStyle))

**Related APIs:** [`timeLimitPerPage`](#timeLimitPerPage), [`startTimer`](#startTimer), [`timeSpent`](#timeSpent)

### `timeLimitPerPage`

**Type**: `number`

A time period that a respondent has to complete each survey page; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

Default value: 0 (time is unlimited)

You can also use `PageModel`'s [`timeLimit`](https://surveyjs.io/form-library/documentation/api-reference/page-model#timeLimit) property to specify a time period for an individual survey page.

[View Demo](https://surveyjs.io/form-library/examples/make-quiz-javascript/ (linkStyle))

**Related APIs:** [`timeLimit`](#timeLimit), [`startTimer`](#startTimer), [`timeSpent`](#timeSpent)

### `timerInfoMode`

**Type**: `string`

Specifies whether the timer panel displays timers for the current page, the entire survey, or both. Applies only if the timer panel is [visible](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showTimer).

Possible values:

- `"survey"` - Displays only the survey timer.
- `"page"` - Displays only the page timer.
- `"combined"` (default) - Displays both the survey and page timers.

**Related APIs:** [`timeSpent`](#timeSpent), [`onTimerTick`](#onTimerTick), [`startTimer`](#startTimer), [`stopTimer`](#stopTimer)

### `timerLocation`

**Type**: `string`

Specifies the timer's position relative to the survey. Applies only if the [`showTimer`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showTimer) property is set to `true`.

Possible values:

- `"top"` (default) - Displays the timer at the top of the survey.
- `"bottom"` - Displays the timer at the bottom of the survey.

**Related APIs:** [`onTimerTick`](#onTimerTick)

### `timeSpent`

**Type**: `number`

A time period that a respondent has spent on the survey so far; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

Assign a number to this property if you need to start the quiz timer from a specific time (for instance, if you want to continue an interrupted quiz).

You can also find out how many seconds a respondent has spent on an individual survey page. To do this, use the [`timeSpent`](https://surveyjs.io/form-library/documentation/api-reference/page-model#timeSpent) property of a [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model) object.

**Related APIs:** [`timeLimit`](#timeLimit), [`timeLimitPerPage`](#timeLimitPerPage), [`startTimer`](#startTimer)

### `tocLocation`

**Type**: `"left" | "right"`

Gets or sets the position of the table of contents. Applies only when the table of contents is visible.

Possible values:

- `"left"` (default)
- `"right"`

[View Demo](https://surveyjs.io/form-library/examples/toc-feature/ (linkStyle))

**Related APIs:** [`showTOC`](#showTOC)

### `triggers`

**Type**: `SurveyTrigger[]`

A list of triggers in the survey.

[Conditional Survey Logic (Triggers)](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-survey-logic-triggers (linkStyle))

**Related APIs:** [`runTriggers`](#runTriggers), [`onTriggerExecuted`](#onTriggerExecuted)

### `uiState`

**Type**: `ISurveyUIState`

Represents the current state of the survey UI.

This state captures transient UI details required to restore the respondent's progress and interaction context, including:

- Expanded and collapsed question boxes
- Order of randomized choice options
- Last visited question
- Last active panel within a [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model)
- Pages that the respondent has already passed (used to display progress in the progress bar)

Handle the [`onUIStateChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUIStateChanged) event to track changes and persist the state for later restoration.

[View Demo](https://surveyjs.io/form-library/examples/save-and-restore-user-responses-to-complete-survey/ (linkStyle))

### `validateVisitedEmptyFields`

**Type**: `boolean`

Specifies whether to trigger validation when a user focuses on an empty input field and then leaves it without making any changes. Applies only if [`checkErrorsMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#checkErrorsMode) is set to `"onValueChanged"`.

Default value: `false`

This property changes validation behavior for the following question types:

- [Single-Line Input](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model)
- [Long Text](https://surveyjs.io/form-library/documentation/api-reference/comment-field-model)
- [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model)

**Related APIs:** [`validationEnabled`](#validationEnabled), [`validationAllowSwitchPages`](#validationAllowSwitchPages), [`validationAllowComplete`](#validationAllowComplete), [`validate`](#validate)

### `validationAllowComplete`

**Type**: `boolean`

Specifies whether respondents can end a survey with validation errors.

Default value: `false`

**Related APIs:** [`checkErrorsMode`](#checkErrorsMode)

### `validationAllowSwitchPages`

**Type**: `boolean`

Specifies whether respondents can switch the current page even if it contains validation errors.

Default value: `false`

**Related APIs:** [`checkErrorsMode`](#checkErrorsMode)

### `validationEnabled`

**Type**: `boolean`

Specifies whether data validation is enabled.

Default value: `true`

**Related APIs:** [`checkErrorsMode`](#checkErrorsMode), [`hideRequiredErrors`](#hideRequiredErrors)

### `visiblePageCount`

**Type**: `number`

Returns the number of visible survey pages.

To get a total number of survey pages, use the [`pageCount`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#pageCount) property.

**Related APIs:** [`visiblePages`](#visiblePages), [`[Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility)`](#[Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility))

### `visiblePages`

**Type**: `PageModel[]`

Returns an array of visible pages without the start page.

To get an array of all pages, use the [`pages`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#pages) property. If all pages are visible, the `pages` and `visiblePages` arrays are identical.

**Related APIs:** [`[Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility)`](#[Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility))

### `width`

**Type**: `string`

A survey width in CSS values.

Default value: `undefined` (the survey inherits the width from its container)

**Related APIs:** [`onResize`](#onResize)

### `widthMode`

**Type**: `string`

Specifies how to calculate the survey width.

Possible values:

- `"static"` - A survey has a [fixed width](#width).
- `"responsive"` - A survey occupies all available horizontal space and stretches or shrinks horizontally to fit in the screen size.
- `"auto"` (default) - Survey width depends on a question type and corresponds to the `"static"` or `"responsive"` mode.

## Methods

### `addLayoutElement()`

**Return value:** `ISurveyLayoutElement` &ndash; The configuration of the previous layout element with the same `id`.

Adds an element to the survey layout.

This method accepts an object with the following layout element properties:

- `id`: `string` | `"timerpanel"` | `"progress-buttons"` | `"progress-questions"` | `"progress-pages"` | `"progress-correctquestions"` | `"progress-requiredquestions"` | `"toc-navigation"` | `"buttons-navigation"`\
A layout element identifier. You can use possible values to access and relocate or customize predefined layout elements.

- `container`: `"header"` | `"footer"` | `"left"` | `"right"` | `"contentTop"` | `"contentBottom"`\
A layout container that holds the element. If you want to display the element within multiple containers, set this property to an array of possible values.

- `component`: `string`\
The name of the component that renders the layout element.

- `data`: `any`\
Data passed as props to `component`.

[View Demo](https://surveyjs.io/form-library/examples/progress-bar-with-percentage/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `layoutElement` | `ISurveyLayoutElement` | A layout element configuration. |

### `addNavigationItem()`

**Return value:** `Action`

Adds a custom navigation item similar to the Previous Page, Next Page, and Complete buttons. Accepts an object described in the [IAction](https://surveyjs.io/Documentation/Library?id=IAction) help section.

[View Demo](https://surveyjs.io/form-library/examples/survey-changenavigation/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `IAction` |  |

### `addNewPage()`

**Return value:** `PageModel` &ndash; The created and added page.

Creates a new page and adds it to the survey.

If you want to switch a survey to the newly added page, assign its index to the [`currentPageNo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#currentPageNo) property or assign the entire page to the [`currentPage`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#currentPage) property.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A page name. If you do not specify this parameter, it will be generated automatically. |
| `index` | `number` | An index at which to insert the page. If you do not specify this parameter, the page will be added to the end. |

**Related APIs:** [`addPage`](#addPage), [`createNewPage`](#createNewPage)

### `addPage()`

Adds an existing page to the survey.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `page` | `PageModel` | A page to add. |
| `index` | `number` | An index at which to insert the page. If you do not specify this parameter, the page will be added to the end. |

**Related APIs:** [`addNewPage`](#addNewPage), [`createNewPage`](#createNewPage)

### `applyTheme()`

Applies a specified theme to the survey.

[Themes & Styles](https://surveyjs.io/form-library/documentation/manage-default-themes-and-styles (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `theme` | `ITheme` | An [`ITheme`](https://surveyjs.io/form-library/documentation/api-reference/itheme) object with theme settings. |

### `beginLoading()`

Displays the [Loading page](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#loadingHtml).

**Related APIs:** [`endLoading`](#endLoading)

### `cancelPreview()`

Cancels a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page) and switches the survey to the page specified by the `currentPage` parameter.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `currentPage` | `any` | A new current page. If you do not specify this parameter, the survey displays the last page. |

**Related APIs:** [`showPreview`](#showPreview), [`showPreviewBeforeComplete`](#showPreviewBeforeComplete), [`state`](#state)

### `chooseFiles()`

Opens a dialog window for users to select files.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `input` | `any` | A [file input HTML element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement). |
| `callback` | `(files: any[]) => void` | A callback function that you can use to process selected files. Accepts an array of JavaScript <a href="https://developer.mozilla.org/en-US/docs/Web/API/File" target="_blank">File</a> objects. |
| `context` | `{ element: Base; item?: any; elementType?: string; propertyName?: string; }` |  |

**Related APIs:** [`onOpenFileChooser`](#onOpenFileChooser), [`onUploadFile`](#onUploadFile)

### `clear()`

Resets the survey [`state`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#state) and, optionally, [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data). If `state` is `"completed"`, it becomes `"running"`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `clearData` | `boolean` | *(Optional)* Specifies whether to clear survey data. Default value: `true`. |
| `goToFirstPage` | `boolean` | *(Optional)* Specifies whether to switch the survey to the first page. Default value: `true`. |

### `clearIncorrectValues()`

Removes values that cannot be assigned to a question, for example, choices unlisted in the `choices` array.

Call this method after you assign new question values in code to ensure that they are acceptable.

> This method does not remove values that fail validation. Call the [`validate()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#validate) method to validate newly assigned values.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `removeNonExistingRootKeys` | `boolean` | Pass `true` to remove values that do not correspond to any question or [calculated value](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#calculated-values). |

### `clearValue()`

Deletes an answer from survey results.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | An object property that stores the answer to delete. Pass a question's [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/question#valueName) or [`name`](https://surveyjs.io/form-library/documentation/api-reference/question#name). |

### `createNewPage()`

**Return value:** `PageModel`

Creates and returns a new page but does not add it to the survey.

Call the [`addPage(page)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#addPage) method to add the created page to the survey later or the [`addNewPage(name, index)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#addNewPage) method to create _and_ add a page to the survey.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

**Related APIs:** [`addPage`](#addPage), [`addNewPage`](#addNewPage)

### `deleteCookie()`

Deletes a cookie with a specified [`cookieName`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#cookieName) from the browser.

**Related APIs:** [`hasCookie`](#hasCookie), [`setCookie`](#setCookie)

### `dispose()`

Disposes of the survey model.

Call this method to release resources if your application contains multiple survey models or if you re-create a survey model at runtime.

### `doComplete()`

**Return value:** `boolean` &ndash; `false` if survey completion is cancelled within the [`onCompleting`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCompleting) event handler; otherwise, `true`.

Completes the survey.

When you call this method, Form Library performs the following actions:

1. Saves a cookie if the [`cookieName`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#cookieName) property is set.
1. Switches the survey [`state`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#state) to `"completed"`.
1. Raises the [`onComplete`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onComplete) event.
1. Navigates the user to a URL specified by the [`navigateToUrl`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#navigateToUrl) or [`navigateToUrlOnCondition`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#navigateToUrlOnCondition) property.

The `doComplete()` method completes the survey regardless of validation errors and the current page. If you need to ensure that survey results are valid and full, call the [`tryComplete()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#tryComplete) method instead.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `isCompleteOnTrigger` | `boolean` | For internal use. |
| `completeTrigger` | `Trigger` | For internal use. |

### `endLoading()`

Stops displaying the [Loading page](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#loadingHtml).

**Related APIs:** [`beginLoading`](#beginLoading)

### `focusFirstQuestion()`

Focuses the first question on the current page.

**Related APIs:** [`focusQuestion`](#focusQuestion), [`autoFocusFirstQuestion`](#autoFocusFirstQuestion)

### `focusQuestion()`

**Return value:** `boolean` &ndash; `false` if the survey does not contain a question with the specified name or this question is hidden; otherwise, `true`.

Focuses a question with a specified name. Switches the current page if needed.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A question name. |

**Related APIs:** [`focusFirstQuestion`](#focusFirstQuestion), [`autoFocusFirstQuestion`](#autoFocusFirstQuestion)

### `getAllPanels()`

**Return value:** `IPanel[]<IPanel>` &ndash; An array of panels.

Returns a list of all [panels](https://surveyjs.io/form-library/documentation/api-reference/panel-model) in the survey.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `visibleOnly` | `boolean` | A Boolean value that specifies whether to include only visible panels. |
| `includeDesignTime` | `boolean` | For internal use. |

**Related APIs:** [`getPanelByName`](#getPanelByName)

### `getAllQuestions()`

**Return value:** `Question[]<Question>` &ndash; An array of questions.

Returns a list of all [questions](https://surveyjs.io/form-library/documentation/api-reference/question) in the survey.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `visibleOnly` | `boolean` | A Boolean value that specifies whether to include only visible questions. |
| `includeDesignTime` | `boolean` | For internal use. |
| `includeNested` | `boolean` | A Boolean value that specifies whether to include nested questions, such as questions within matrix cells. |

**Related APIs:** [`getQuestionByName`](#getQuestionByName)

### `getComment()`

**Return value:** `string` &ndash; A comment.

Returns a comment value from a question with a specified `name`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A question name. |

**Related APIs:** [`setComment`](#setComment)

### `getCorrectAnswerCount()`

**Return value:** `number` &ndash; The number of correct answers in a quiz.

Returns the number of correct answers in a quiz.

For more information about quizzes, refer to the following tutorial: [Create a Quiz](https://surveyjs.io/form-library/documentation/design-survey/create-a-quiz).

**Related APIs:** [`getQuizQuestionCount`](#getQuizQuestionCount), [`getIncorrectAnswerCount`](#getIncorrectAnswerCount)

### `getData()`

**Return value:** `any`

Returns an object with survey results.

If you want to get a survey results object that mirrors the survey structure, call the `getData()` method with an object that has the `includePages` and `includePanels` properties enabled. Without this object, the `getData()` method returns the [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) property value.

```js
import { Model } from "survey-core";

const surveyJson = { ... };
const survey = new Model(surveyJson);
survey.getData({ includePages: true, includePanels: true });
```

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `{ includePages?: boolean; includePanels?: boolean; }` |  |

### `getElementByName()`

**Return value:** `ISurveyElement` &ndash; A survey element with the specified name.

Returns a page, panel, or question with a specified [`name`](https://surveyjs.io/form-library/documentation/api-reference/question#name).

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A survey element name. |

**Related APIs:** [`currentElementName`](#currentElementName)

### `getIncorrectAnswerCount()`

**Return value:** `number` &ndash; The number of incorrect answers in a quiz.

Returns the number of incorrect answers in a quiz.

For more information about quizzes, refer to the following tutorial: [Create a Quiz](https://surveyjs.io/form-library/documentation/design-survey/create-a-quiz).

**Related APIs:** [`getCorrectAnswerCount`](#getCorrectAnswerCount)

### `getPageByElement()`

**Return value:** `PageModel`

Returns a page to which a specified survey element (question or panel) belongs.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `IElement` | A question or panel instance. |

### `getPageByName()`

**Return value:** `PageModel` &ndash; A page with the specified name.

Returns a page with a specified name.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A page [name](https://surveyjs.io/form-library/documentation/api-reference/page-model#name). |

### `getPageByQuestion()`

**Return value:** `PageModel`

Returns a page to which a specified question belongs.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` | A question instance. |

### `getPanelByName()`

**Return value:** `PanelModel` &ndash; A panel with the specified name.

Returns a [panel](https://surveyjs.io/form-library/documentation/api-reference/panel-model) with a specified [`name`](https://surveyjs.io/form-library/documentation/api-reference/panel-model#name).

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A panel name. |
| `caseInsensitive` | `boolean` |  |

**Related APIs:** [`getAllPanels`](#getAllPanels)

### `getPlainData()`

**Return value:** `IQuestionPlainData[]<IQuestionPlainData>`

Returns survey results as an array of objects in which the question name, title, value, and other parameters are stored as individual properties.

If a question can have more than one value (Matrix, Multiple Text), its object enables the `isNode` flag and stores information about these values in the `data` property. Refer to the following help topic for more information: [Access Full Survey Results](https://surveyjs.io/form-library/documentation/handle-survey-results-access#access-full-survey-results).

If you want to skip empty answers, pass an object with the `includeEmpty` property set to `false`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IPlainDataOptions` |  |

### `getProgressInfo()`

**Return value:** `IProgressInfo` &ndash; An object containing survey progress information.

Returns an object that provides information about survey progress.

The returned object includes the following properties:

- `questionCount`: `number`\
The total number of questions with input fields. [Image](https://surveyjs.io/form-library/examples/add-image-and-video-to-survey/), [HTML](https://surveyjs.io/form-library/examples/questiontype-html/), and [Expression](https://surveyjs.io/form-library/examples/questiontype-expression/) questions are excluded.

- `answeredQuestionCount`: `number`\
The number of questions that have been answered.

- `requiredQuestionCount`: `number`\
The number of questions marked as required.

- `requiredAnsweredQuestionCount`: `number`\
The number of required questions that have been answered.

**Related APIs:** [`showProgressBar`](#showProgressBar), [`progressValue`](#progressValue), [`progressText`](#progressText), [`onGetProgressText`](#onGetProgressText)

### `getQuestionByName()`

**Return value:** `Question` &ndash; A question with the specified name.

Returns a question with a specified [`name`](https://surveyjs.io/form-library/documentation/api-reference/question#name).

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A question name. |
| `caseInsensitive` | `boolean` |  |

**Related APIs:** [`getAllQuestions`](#getAllQuestions), [`getQuestionByValueName`](#getQuestionByValueName)

### `getQuestionByValueName()`

**Return value:** `Question` &ndash; A question with a specified `valueName`.

Returns a question with a specified [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/question#valueName).

> Since `valueName` does not have to be unique, multiple questions can have the same `valueName` value. In this case, the `getQuestionByValueName()` method returns the first such question. If you need to get all questions with the same `valueName`, call the `getQuestionsByValueName()` method.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `valueName` | `string` | A question's `valueName` property value. |
| `caseInsensitive` | `boolean` |  |

**Related APIs:** [`getAllQuestions`](#getAllQuestions), [`getQuestionByName`](#getQuestionByName)

### `getQuestionsByValueName()`

**Return value:** `Question[]<Question>` &ndash; An array of questions with a specified `valueName`.

Returns all questions with a specified [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/question#valueName). If a question's `valueName` is undefined, its [`name`](https://surveyjs.io/form-library/documentation/api-reference/question#name) property is used.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `valueName` | `string` | A question's `valueName` property value. |
| `caseInsensitive` | `boolean` |  |

**Related APIs:** [`getAllQuestions`](#getAllQuestions), [`getQuestionByName`](#getQuestionByName)

### `getQuizQuestionCount()`

**Return value:** `number` &ndash; The number of quiz questions.

Returns the number of quiz questions. A question counts if it is visible, has an input field, and specifies [`correctAnswer`](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#correctAnswer).

This number may be different from `getQuizQuestions().length` because certain question types (for instance, matrix-like types) include more than one question.

For more information about quizzes, refer to the following tutorial: [Create a Quiz](https://surveyjs.io/form-library/documentation/design-survey/create-a-quiz).

**Related APIs:** [`getQuizQuestions`](#getQuizQuestions)

### `getQuizQuestions()`

**Return value:** `IQuestion[]<IQuestion>` &ndash; An array of quiz questions.

Returns an array of quiz questions. A question counts if it is visible, has an input field, and specifies [`correctAnswer`](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#correctAnswer).

For more information about quizzes, refer to the following tutorial: [Create a Quiz](https://surveyjs.io/form-library/documentation/design-survey/create-a-quiz).

**Related APIs:** [`getQuizQuestionCount`](#getQuizQuestionCount)

### `getUsedLocales()`

**Return value:** `string[]<any>`

Returns an array of locales whose translations are used in the survey.

[Localization & Globalization help topic](https://surveyjs.io/form-library/documentation/survey-localization (linkStyle))

[Survey Localization demo](https://surveyjs.io/form-library/examples/survey-localization/ (linkStyle))

### `getValue()`

**Return value:** `any` &ndash; A question value (answer).

Returns a value (answer) for a question with a specified `name`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A question name. |

**Related APIs:** [`data`](#data), [`setValue`](#setValue)

### `getVariable()`

**Return value:** `any`

Returns a variable value.

[Variables help topic](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#variables (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A variable name. |

**Related APIs:** [`setVariable`](#setVariable), [`getVariableNames`](#getVariableNames)

### `getVariableNames()`

**Return value:** `string[]<any>` &ndash; An array of variable names.

Returns the names of all variables in the survey.

[Variables help topic](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#variables (linkStyle))

**Related APIs:** [`getVariable`](#getVariable), [`setVariable`](#setVariable)

### `mergeData()`

Merges a specified data object with the object from the [`data`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#data) property.

Refer to the following help topic for more information: [Populate Form Fields | Multiple Question Values](https://surveyjs.io/form-library/documentation/design-survey/pre-populate-form-fields#multiple-question-values).

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `data` | `any` | A data object to merge. It should have the following structure: `{ questionName: questionValue, ... }` |

**Related APIs:** [`setValue`](#setValue)

### `mergeLocalizationJSON()`

Applies a locale-strings-only JSON schema to the survey model.

The JSON schema should contain only locale strings and identifier properties; all other properties are ignored. To generate a locale-strings-only schema, call the [`getLocalizationJSON(locales)`](#getLocalizationJSON) method.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `json` | `any` | A JSON schema that contains locale strings. |
| `locales` | `string[]` | *(Optional)* An array of locale identifiers to apply from the JSON schema. |

### `nextPage()`

**Return value:** `boolean` &ndash; `true` if the page was successfully switched; `false` otherwise.

Switches the survey to the next page.

This method returns a Boolean value that indicates whether the page was successfully switched. `false` is returned if the current page is the last page or if it contains validation errors.

**Related APIs:** [`isLastPage`](#isLastPage), [`prevPage`](#prevPage), [`completeLastPage`](#completeLastPage)

### `notify()`

Displays a toast notification with a specified message.

Depending on the `type` argument, a survey can display the following notification types:

![Toast notification types in SurveyJS Form Library](https://surveyjs.io//Content/Images/docs/notification-types.png)

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `message` | `string` | A message to display. |
| `type` | `string` | A notification type: `"info"` (default), `"success"`, or `"error"`. |
| `showActions` | `boolean` | For internal use. |

### `prevPage()`

**Return value:** `boolean` &ndash; `true` if the page was successfully switched; `false` otherwise.

Switches the survey to the previous page.

This method returns a Boolean value that indicates whether the page was successfully switched. `false` is returned if the current page is the first page.

**Related APIs:** [`isFirstPage`](#isFirstPage), [`nextPage`](#nextPage)

### `removePage()`

Removes a page from the survey.

Pass a `PageModel` object to this method. You can get this object in different ways. For example, you can call the [`getPageByName()`](#getPageByName) method to obtain a `PageModel` object with a specific name or use the [`currentPage`](#currentPage) property to access and delete the current page, as shown in the code below.

```js
// Delete the current page
survey.removePage(survey.currentPage);
```

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `page` | `PageModel` | A page to remove. |

**Related APIs:** [`addNewPage`](#addNewPage)

### `runCondition()`

**Return value:** `boolean`

Calculates a given [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) and returns `true` or `false`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `expression` | `string` | An expression to calculate. |

### `runExpression()`

**Return value:** `any`

Calculates a given [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) and returns a result value.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `expression` | `string` | An expression to calculate. |
| `callback` | `(res: any) => void` | A callback function that you can use to access the calculation result if the expression uses asynchronous functions. |

### `runExpressions()`

Recalculates all [expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) in the survey.

### `runTriggers()`

Executes [all triggers](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#triggers), except ["complete"](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete).

[Conditional Survey Logic (Triggers)](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-survey-logic-triggers (linkStyle))

**Related APIs:** [`onTriggerExecuted`](#onTriggerExecuted)

### `setComment()`

Sets a comment value to a question with a specified `name`.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A question name. |
| `newValue` | `string` | A new comment value. |
| `locNotification` | `boolean \| "text"` | For internal use. |

**Related APIs:** [`getComment`](#getComment)

### `setCookie()`

Sets a cookie with a specified [`cookieName`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#cookieName) in the browser. If the `cookieName` property value is defined, this method is automatically called on survey completion.

**Related APIs:** [`hasCookie`](#hasCookie), [`deleteCookie`](#deleteCookie)

### `setValue()`

Sets a question value (answer).

[View Demo](https://surveyjs.io/form-library/examples/create-a-scored-quiz/ (linkStyle))

> This method executes all triggers and reevaluates conditions (`visibleIf`, `requiredId`, and others). It also switches the survey to the next page if the [`autoAdvanceEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#autoAdvanceEnabled) property is enabled and all questions on the current page have correct answers.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A question name. |
| `newQuestionValue` | `any` |  |
| `locNotification` | `boolean \| "text"` | For internal use. |
| `allowNotifyValueChanged` | `boolean` | For internal use. |
| `questionName` | `string` |  |

**Related APIs:** [`data`](#data), [`getValue`](#getValue)

### `setVariable()`

Sets a variable value.

[Variables help topic](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#variables (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A variable name. |
| `newValue` | `any` | A new variable value. |

**Related APIs:** [`getVariable`](#getVariable), [`getVariableNames`](#getVariableNames)

### `showPreview()`

**Return value:** `boolean`

Displays a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page). Returns `false` if the preview cannot be displayed because of validation errors.

**Related APIs:** [`cancelPreview`](#cancelPreview), [`showPreviewBeforeComplete`](#showPreviewBeforeComplete), [`onShowingPreview`](#onShowingPreview), [`state`](#state)

### `start()`

**Return value:** `boolean`

Starts the survey. Applies only if the survey has a [start page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#start-page).

**Related APIs:** [`firstPageIsStartPage`](#firstPageIsStartPage), [`completeLastPage`](#completeLastPage)

### `startTimer()`

Starts a timer that calculates how many seconds a respondent has spent on the survey. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

**Related APIs:** [`stopTimer`](#stopTimer), [`timeLimit`](#timeLimit), [`timeLimitPerPage`](#timeLimitPerPage), [`timeSpent`](#timeSpent), [`onTimerTick`](#onTimerTick)

### `stopTimer()`

Stops the timer. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

**Related APIs:** [`startTimer`](#startTimer), [`timeLimit`](#timeLimit), [`timeLimitPerPage`](#timeLimitPerPage), [`timeSpent`](#timeSpent), [`onTimerTick`](#onTimerTick)

### `tryComplete()`

**Return value:** `boolean`

Completes the survey if it currently displays the last page and the page contains no validation errors. If both these conditions are met, this method returns `true`; otherwise, `false`.

If you want to complete the survey regardless of the current page and validation errors, use the [`doComplete()`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#doComplete) method.

**Related APIs:** [`isCurrentPageValid`](#isCurrentPageValid), [`nextPage`](#nextPage)

### `uploadFiles()`

Uploads files to a server.

The following code shows how to call this method:

```js
const question = survey.getQuestionByName("myFileQuestion");
survey.uploadFiles(
  question,
  question.name,
  question.value,
  (data, errors) => {
    // ...
  }
);
```

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `QuestionFileModel \| QuestionSignaturePadModel` | A [File Upload question instance](https://surveyjs.io/form-library/documentation/api-reference/file-model) or [Signature Pad question instance](https://surveyjs.io/form-library/documentation/api-reference/signature-pad-model). |
| `name` | `string` | The File Upload question's [`name`](https://surveyjs.io/form-library/documentation/api-reference/file-model#name) or Signature Pad question's [`name`](https://surveyjs.io/form-library/documentation/api-reference/signature-pad-model#name). |
| `files` | `any[]` | An array of JavaScript <a href="https://developer.mozilla.org/en-US/docs/Web/API/File" target="_blank">File</a> objects that represent files to upload. |
| `callback` | `(data: any, errors?: any) => any` | A callback function that allows you to access successfully uploaded files as the first argument. If any files fail to upload, the second argument contains an array of error messages. |
| `sourceType` | `string` |  |

**Related APIs:** [`onUploadFiles`](#onUploadFiles), [`downloadFile`](#downloadFile)

### `validate()`

**Return value:** `boolean`

Validates all questions and returns `false` if the validation fails.

If you use validation expressions and at least one of them calls an async function, the `validate` method returns `undefined`. In this case, you should pass a callback function as the `onAsyncValidation` parameter. The function's `hasErrors` Boolean parameter will contain the validation result.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fireCallback` | `boolean` | *(Optional)* Pass `false` if you do not want to show validation errors in the UI. |
| `focusFirstError` | `boolean` | *(Optional)* Pass `true` if you want to focus the first question with a validation error. The survey will be switched to the page that contains this question if required. |
| `onAsyncValidation` | `(hasErrors: boolean) => void` | *(Optional)* Pass a callback function. It accepts a Boolean `hasErrors` parameter that equals `true` if the validation fails or `false` otherwise. |
| `changeCurrentPage` | `boolean` |  |

**Related APIs:** [`validateCurrentPage`](#validateCurrentPage), [`validatePage`](#validatePage)

### `validateCurrentPage()`

**Return value:** `boolean`

Validates all questions on the current page and returns `false` if the validation fails.

If you use validation expressions and at least one of them calls an async function, the `validateCurrentPage` method returns `undefined`. In this case, you should pass a callback function as the `onAsyncValidation` parameter. The function's `hasErrors` Boolean parameter will contain the validation result.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `onAsyncValidation` | `(hasErrors: boolean) => void` | *(Optional)* Pass a callback function. It accepts a Boolean `hasErrors` parameter that equals `true` if the validation fails or `false` otherwise. |

**Related APIs:** [`currentPage`](#currentPage), [`validate`](#validate), [`validateCurrentPage`](#validateCurrentPage)

### `validatePage()`

**Return value:** `boolean`

Validates all questions on a specified page and returns `false` if the validation fails.

If you use validation expressions and at least one of them calls an async function, the `validatePage` method returns `undefined`. In this case, you should pass a callback function as the `onAsyncValidation` parameter. The function's `hasErrors` Boolean parameter will contain the validation result.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `page` | `PageModel` | Pass the `PageModel` that you want to validate. You can pass `undefined` to validate the [`activePage`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#activePage). |
| `onAsyncValidation` | `(hasErrors: boolean) => void` | *(Optional)* Pass a callback function. It accepts a Boolean `hasErrors` parameter that equals `true` if the validation fails or `false` otherwise. |

**Related APIs:** [`validate`](#validate), [`validateCurrentPage`](#validateCurrentPage)

## Events

### `onAfterRenderMatrixCell`

An event that is raised after a cell in a [Multi-Select Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/) or [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/) is rendered to the DOM.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.htmlElement`: `any`  
A rendered HTML element.
- `options.cell`: `MatrixDropdownCell`  
A matrix cell for which the event is raised.
- `options.cellQuestion`: `Question`  
A Question instance within the matrix cell.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to which the cell belongs.
- `options.column`: `MatrixDropdownColumn | MatrixDropdownCell`  
A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.

**Related APIs:** [`onMatrixCellCreated`](#onMatrixCellCreated)

### `onAfterRenderPage`

An event that is raised after a page is rendered to the DOM. Use it to modify page markup.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.htmlElement`: `any`  
A rendered HTML element.
- `options.page`: `PageModel`  
A Page instance for which the event is raised.

[View Demo](https://surveyjs.io/form-library/examples/survey-afterrender/ (linkStyle))

### `onAfterRenderPanel`

An event that is raised after a panel is rendered to the DOM. Use it to modify panel markup.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.htmlElement`: `any`  
A rendered HTML element.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.

> This event is raised for static [Panels](https://surveyjs.io/form-library/examples/set-properties-on-multiple-questions-using-panel/) as well as panels within a [Dynamic Panel](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/).

### `onAfterRenderQuestion`

An event that is raised after a question is rendered to the DOM. Use it to modify question markup.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.htmlElement`: `any`  
A rendered HTML element.

[View Demo](https://surveyjs.io/form-library/examples/survey-afterrender/ (linkStyle))

### `onAfterRenderQuestionInput`

An event that is raised after a question with a single input field is rendered to the DOM. Use it to modify question markup.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.htmlElement`: `any`  
A rendered HTML element.

> This event is not raised for questions without input fields ([HTML](https://surveyjs.io/form-library/documentation/questionhtmlmodel), [Image](https://surveyjs.io/form-library/documentation/questionimagemodel)) or questions with multiple input fields ([Matrix](https://surveyjs.io/form-library/documentation/questionmatrixmodel), [Multiple Text](https://surveyjs.io/form-library/documentation/questionmultipletextmodel)).

### `onAfterRenderSurvey`

An event that is raised after the survey is rendered to the DOM. Use this event to modify survey markup.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.htmlElement`: `any`  
A rendered HTML element.

[View Demo](https://surveyjs.io/form-library/examples/survey-animation/ (linkStyle))

### `onCheckAnswerCorrect`

An event that is raised to define whether a question answer is correct. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey/create-a-quiz).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.result`: `boolean`  
A Boolean property that specifies whether the answer is correct (`true`) or incorrect (`false`). Use the `options.question.value` and `options.question.correctAnswer` properties to check the answer.
- `options.correctAnswerCount`: `number`  
The number of correct answers in a matrix where each row is considered as one quiz question.
- `options.incorrectAnswerCount`: `number`  
The number of incorrect answers in a matrix where each row is considered as one quiz question.

### `onChoicesLazyLoad`

Use this event to load choice items in [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel) and [Tag Box](https://surveyjs.io/form-library/documentation/questiontagboxmodel) questions on demand.

This event is raised only for those questions that have the [`choicesLazyLoadEnabled`](https://surveyjs.io/form-library/documentation/questiondropdownmodel#choicesLazyLoadEnabled) property set to `true`.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.setItems`: `(items: (string | { value: any; text?: string; imageLink?: string; customProperty?: any; })[], totalCount: number) => void`  
A method that you should call to assign loaded items to the question. Item objects should be structured as specified in the [`choices`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#choices) property description. If their structure is different, [map their properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to bring them to the required structure.
- `options.filter`: `string`  
A search string used to filter choices.
- `options.take`: `number`  
The number of choice items to load. You can use the question's [`choicesLazyLoadPageSize`](https://surveyjs.io/form-library/documentation/questiondropdownmodel#choicesLazyLoadPageSize) property to change this number.
- `options.skip`: `number`  
The number of choice items to skip.

[View Demo](https://surveyjs.io/form-library/examples/lazy-loading-dropdown/ (linkStyle))

### `onChoicesLoaded`

An event that is raised after choices are loaded from a server but before they are assigned to a choice-based question, such as [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) or [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model). Handle this event if you need to modify the loaded choices.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.serverResult`: `any`  
A query result as it came from the server.
- `options.choices`: `ItemValue[]`  
An array of loaded choices. You can modify this array.

### `onChoicesSearch`

An event that is raised each time a search string in a [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) or [Tag Box](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model) question changes. Use this event to implement custom filtering of choice options.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.filter`: `string`  
A search string used to filter choice options.
- `options.choices`: `ItemValue[]`  
An array of all choice options.
- `options.filteredChoices`: `ItemValue[]`  
A filtered array of choice options. Apply `options.filter` to the `options.choices` array and assign the result to this parameter.

**Related APIs:** [`[QuestionDropdownModel.searchEnabled](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#searchEnabled)`](#[QuestionDropdownModel.searchEnabled](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#searchEnabled)), [`[QuestionDropdownModel.searchMode](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#searchMode)`](#[QuestionDropdownModel.searchMode](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#searchMode))

### `onClearFiles`

An event that is raised when users clear files in a [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) question or clear signature in a [Signature Pad](https://surveyjs.io/form-library/documentation/api-reference/signature-pad-model) question. Use this event to delete files from your server.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionFileModel | QuestionSignaturePadModel`  
A File Upload or Signature Pad question instance for which the event is raised.
- `options.name`: `string`  
A File Upload question's name.
- `options.callback`: `(status: string, data?: any) => any`  
A callback function that you should call when files are deleted successfully or when deletion fails. Pass `"success"` or `"error"` as the first argument to indicate the operation status. As the second argument, you can pass deleted files' data (`options.value`) if file deletion was successful or an error message if file deletion failed.
- `options.fileName`: `string`  
The name of a file to delete. When this parameter is `null`, all files should be deleted.
- `options.value`: `any`  
The File Upload question's [`value`](https://surveyjs.io/form-library/documentation/api-reference/file-model#value) that contains metadata about uploaded files.

[File Upload Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

[Signature Pad Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

**Related APIs:** [`clearFiles`](#clearFiles), [`onDownloadFile`](#onDownloadFile), [`onUploadFiles`](#onUploadFiles)

### `onComplete`

An event that is raised after the survey is completed. Use this event to send survey results to the server.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.isCompleteOnTrigger`: `boolean`  
Returns `true` if survey completion is caused by a ["complete" trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete).
- `options.completeTrigger`: `Trigger`  
A "complete" trigger that has been executed. This parameter has a value only if `options.isCompleteOnTrigger` is `true`.
- `options.clearSaveMessages`: `(test?: string) => void`  
Call this method to hide the save operation messages.
- `options.showSaveSuccess`: `(text?: string) => void`  
Call this method to indicate that survey results are successfully saved. You can use the `text` parameter to display a custom message.
- `options.showSaveError`: `(text?: string) => void`  
Call this method to indicate that an error occurred during the save operation. You can use the `text` parameter to display a custom error message.
- `options.showSaveInProgress`: `(text?: string) => void`  
Call this method to indicate that the save operation is in progress. You can use the `text` parameter to display a custom message.

For an example of how to use the methods described above, refer to the following help topic: [Store Survey Results in Your Own Database](https://surveyjs.io/form-library/documentation/handle-survey-results-store#store-survey-results-in-your-own-database).

> Do not disable the [`showCompletePage`](https://surveyjs.io/form-library/documentation/surveymodel#showCompletePage) property if you call one of the `options.showSave...` methods. This is required because the UI that indicates data saving progress is integrated into the complete page. If you hide the complete page, the UI also becomes invisible.

**Related APIs:** [`onPartialSend`](#onPartialSend), [`doComplete`](#doComplete), [`autoAdvanceAllowComplete`](#autoAdvanceAllowComplete)

### `onCompleting`

An event that is raised before the survey is completed. Use this event to prevent survey completion.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.isCompleteOnTrigger`: `boolean`  
Returns `true` if survey completion is caused by a ["complete" trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete).
- `options.completeTrigger`: `Trigger`  
A "complete" trigger that has been executed. This parameter has a value only if `options.isCompleteOnTrigger` is `true`.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to prevent survey completion.
- `options.message`: `string`  
A notification message to display when survey results cannot be saved or after they have been saved successfully.

This event supports asynchronous operations. Declare the handler as `async` to run asynchronous logic; the survey will wait for the handler to resolve before completing. To block survey completion, set `options.allow` to `false`; to display an error or notification message, assign a string to `options.message`.

The example below shows how to submit survey results asynchronously before completion:

```js
function postJson(url, data) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(data)
  });
}

// ...
// Omitted: `SurveyModel` creation
// ...

survey.onCompleting.add(async (_, options) => {
  try {
    const response = await postJson(surveyServiceUrl + "/post/", {
      postId: surveyPostId,
      surveyResult: JSON.stringify(survey.data)
    });
    if (!response.ok) {
      options.allow = false;
      options.message = "Could not post the survey results";
    } else {
      // Optionally show a success message
      options.message = "Your data has been saved";
    }
  } catch (e) {
    options.allow = false;
    options.message = e.message;
    console.error(e.message);
  }
});
```

**Related APIs:** [`onComplete`](#onComplete), [`doComplete`](#doComplete), [`autoAdvanceAllowComplete`](#autoAdvanceAllowComplete)

### `onCreateCustomChoiceItem`

An event that is raised when users add a custom choice option to a [Single-](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) or [Multi-Select Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model) question. Handle this event to save the choice option in a data storage.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionSelectBase`  
A question for which the event is raised.
- `options.item`: `ItemValue`  
A custom choice item. To access its value and display text, use the `options.item.value` and `options.item.text` properties.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to prevent the item from being added.

To let users add their own choice options, enable the [`allowCustomChoices`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#allowCustomChoices) property for individual dropdown questions.

[View Demo](https://surveyjs.io/form-library/examples/dropdown-custom-choice-options/ (linkStyle))

### `onCreateRegexValidator`

An event that is raised when a [`RegexValidator`](https://surveyjs.io/form-library/documentation/api-reference/regexvalidator) instance is created. Use this event to customize the regular expression pattern and its flags.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.validator`: `RegexValidator`  
A validator instance for which the event is raised.
- `options.pattern`: `string`  
A regular expression pattern used by the validator. You can modify this value to change the validation logic.
- `options.flags`: `string`  
Optional regular expression flags that control additional matching behavior, such as case-insensitive searching. You can modify this value. For more information about supported flags, refer to the MDN article: [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags).

### `onCurrentPageChanged`

An event that is raised after the current page is switched.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.isPrevPage`: `boolean`  
Returns `true` if the respondent is switching to the previous page.
- `options.isNextPage`: `boolean`  
Returns `true` if the respondent is switching to the next page.
- `options.isGoingBackward`: `boolean`  
Returns `true` if the respondent is going backward, that is, `newCurrentPage` or `newCurrentQuestion` is earlier in the survey than `oldCurrentPage`  or `oldCurrentQuestion`.
- `options.isGoingForward`: `boolean`  
Returns `true` if the respondent is going forward along the survey.
- `options.isAfterPreview`: `boolean`  
Returns `true` if the respondent is switching from the [preview page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).
- `options.newCurrentPage`: `PageModel`  
The current page.
- `options.oldCurrentPage`: `PageModel`  
A page that used to be current.\
In [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode), the `oldCurrentPage` and `newCurrentPage` parameters may contain the same `PageModel` instance. This is because the survey doesn't create artificial pages to display only one question per page. If both the previous and current questions belong to the same page in the survey JSON schema, they have the same parent `PageModel` instance.
- `options.oldCurrentQuestion`: `Question`  
The current question.\
This parameter has a value only in [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).
- `options.newCurrentQuestion`: `Question`  
A question that used to be current.\
This parameter has a value only in [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).

[View Demo](https://surveyjs.io/form-library/examples/save-and-restore-user-responses-to-complete-survey/ (linkStyle))

**Related APIs:** [`currentPageNo`](#currentPageNo), [`nextPage`](#nextPage), [`prevPage`](#prevPage)

### `onCurrentPageChanging`

An event that is raised before the current page is switched.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.isPrevPage`: `boolean`  
Returns `true` if the respondent is switching to the previous page.
- `options.isNextPage`: `boolean`  
Returns `true` if the respondent is switching to the next page.
- `options.isGoingBackward`: `boolean`  
Returns `true` if the respondent is going backward, that is, `newCurrentPage` or `newCurrentQuestion` is earlier in the survey than `oldCurrentPage`  or `oldCurrentQuestion`.
- `options.isGoingForward`: `boolean`  
Returns `true` if the respondent is going forward along the survey.
- `options.isAfterPreview`: `boolean`  
Returns `true` if the respondent is switching from the [preview page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).
- `options.newCurrentPage`: `PageModel`  
The current page.
- `options.oldCurrentPage`: `PageModel`  
A page that used to be current.\
In [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode), the `oldCurrentPage` and `newCurrentPage` parameters may contain the same `PageModel` instance. This is because the survey doesn't create artificial pages to display only one question per page. If both the previous and current questions belong to the same page in the survey JSON schema, they have the same parent `PageModel` instance.
- `options.oldCurrentQuestion`: `Question`  
The current question.\
This parameter has a value only in [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).
- `options.newCurrentQuestion`: `Question`  
A question that used to be current.\
This parameter has a value only in [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you do not want to switch the current page.
- `options.message`: `string`  
A notification message to display when the page cannot be switched.

This event supports asynchronous operations. Declare the handler as `async` to run asynchronous logic; the survey will wait for the handler to resolve before switching pages. To block navigation, set `options.allow` to `false`; to display an error or notification message, assign a string to `options.message`.

The example below shows how to save the last active page number on a server before switching pages:

```js
function postJson(url, data) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(data)
  });
}

// ...
// Omitted: `SurveyModel` creation
// ...

survey.onCurrentPageChanging.add(async (_, options) => {
  try {
    const response = await postJson(surveyServiceUrl + "/post/page-number/", {
      postId: surveyPostId,
      lastActivePageIndex: options.oldCurrentPage.visibleIndex
    });
    if (!response.ok) {
      options.allow = false;
      options.message = "Could not save the last page number";
    }
  } catch (e) {
    options.allow = false;
    options.message = e.message;
    console.error(e.message);
  }
});
```

**Related APIs:** [`currentPageNo`](#currentPageNo), [`nextPage`](#nextPage), [`prevPage`](#prevPage)

### `onDownloadFile`

An event that is raised when a File Upload question starts to download a file. Use this event to implement file preview when your server stores only file names.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionFileModel | QuestionSignaturePadModel`  
A File Upload or Signature Pad question instance for which the event is raised.
- `options.name`: `string`  
A File Upload question's name.
- `options.callback`: `(status: string, data?: any) => any`  
A callback function that you should call when a file is downloaded successfully or when deletion fails. Pass `"success"` or `"error"` as the first argument to indicate the operation status. As the second argument, you can pass the downloaded file's data as a Base64 string if file download was successful or an error message if file download failed.
- `options.fileValue`: `any`  
The File Upload question's [`value`](https://surveyjs.io/form-library/documentation/api-reference/file-model#value) that contains metadata about uploaded files.
- `options.content`: `any`  
A file identifier (URL, file name, etc.) stored in survey results.

[View Demo](https://surveyjs.io/form-library/examples/store-file-names-in-survey-results/ (linkStyle))

**Related APIs:** [`downloadFile`](#downloadFile), [`onClearFiles`](#onClearFiles), [`onUploadFiles`](#onUploadFiles)

### `onDragDropAllow`

An event that is raised when users drag and drop survey elements while designing the survey in [Survey Creator](https://surveyjs.io/survey-creator/documentation/overview). Use this event to control drag and drop operations.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.draggedElement`: `IElement`  
A survey element being dragged.
- `options.fromElement`: `IPanel`  
A survey element from which `draggedElement` is being dragged. This parameter is `null` if `draggedElement` is being dragged from the [Toolbox](https://surveyjs.io/survey-creator/documentation/toolbox).
- `options.toElement`: `IElement`  
A survey element to which `draggedElement` is being dragged.
- `options.insertBefore`: `IElement`  
A survey element before which the target element will be placed. This parameter is `null` if the parent container (page or panel) has no elements or if the target element will be placed below all other elements within the container.
- `options.insertAfter`: `IElement`  
A survey element after which `draggedElement` will be placed. This parameter is `null` if the parent container (page or panel) has no elements or if `draggedElement` will be placed above all other elements within the container.
- `options.parent`: `ISurveyElement`  
A parent container (page or panel) within which `draggedElement` will be placed.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to cancel the drag and drop operation.

**Related APIs:** [`isDesignMode`](#isDesignMode)

### `onDynamicPanelAdded`

An event that is raised after a new panel is added to a [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/) question.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionPanelDynamicModel`  
A Dynamic Panel question instance for which the event is raised.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.panelIndex`: `number`  
The panel's index within Dynamic Panel.

### `onDynamicPanelCurrentIndexChanged`

An event that is raised after the current panel is changed in a [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/) question.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionPanelDynamicModel`  
A Dynamic Panel question instance for which the event is raised.
- `options.panel`: `PanelModel`  
A panel for which the event is raised.
- `options.visiblePanelIndex`: `number`  
The panel's index in the [`visiblePanels`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#visiblePanels) array of the Dynamic Panel.

### `onDynamicPanelRemoved`

An event that is raised after a panel is deleted from a [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/) question.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionPanelDynamicModel`  
A Dynamic Panel question instance for which the event is raised.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.panelIndex`: `number`  
The panel's index within Dynamic Panel.

### `onDynamicPanelRemoving`

An event that is raised before a panel is deleted from a [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/) question. Use this event to cancel the deletion.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionPanelDynamicModel`  
A Dynamic Panel question instance for which the event is raised.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.panelIndex`: `number`  
The panel's index within Dynamic Panel.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to cancel panel deletion.

### `onDynamicPanelValueChanged`

An event that is raised after a value is changed in a panel within a [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/) question.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionPanelDynamicModel`  
A Dynamic Panel question instance for which the event is raised.
- `options.panelData`: `{ [index: string]: any; }`  
The panel's data object that includes all item values.
- `options.panelIndex`: `number`  
The panel's index within Dynamic Panel.
- `options.name`: `string`  
The item's name.
- `options.panel`: `PanelModel`  
A panel that nests the item with a changed value.
- `options.value`: `any`  
The item's new value.

### `onDynamicPanelValueChanging`

An event that is raised before a value is changed in a panel within a [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/) question.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionPanelDynamicModel`  
A Dynamic Panel question instance for which the event is raised.
- `options.panelData`: `{ [index: string]: any; }`  
The panel's data object that includes all item values.
- `options.panelIndex`: `number`  
The panel's index within Dynamic Panel.
- `options.name`: `string`  
The item's name.
- `options.panel`: `PanelModel`  
A panel that nests the item with a changed value.
- `options.value`: `any`  
The item's new value.
- `options.oldValue`: `any`  
The item's old value.

### `onExpressionRunning`

An event that is raised when an [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) is about to be evaluated. Use this event to intercept or cancel the evaluation.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.element`: `Base`  
A survey element (question, panel, page, choice option, matrix row, column, trigger, validator, survey, etc.) for which the event is raised.
- `options.propertyName`: `string`  
The name of the survey element property that contains the expression (for example, `visibleIf`).
- `options.expression`: `string`  
The expression being evaluated.\
You can modify this value to substitute a different expression for evaluation. The original expression property remains unchanged.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to cancel the expression eveluation.

### `onFocusInPanel`

An event that is raised when an element within a panel gets focus.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.

**Related APIs:** [`onFocusInQuestion`](#onFocusInQuestion), [`autoFocusFirstQuestion`](#autoFocusFirstQuestion), [`focusQuestion`](#focusQuestion)

### `onFocusInQuestion`

An event that is raised when an element (input field, checkbox, radio button) within a question gets focus.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.

**Related APIs:** [`onFocusInPanel`](#onFocusInPanel), [`autoFocusFirstQuestion`](#autoFocusFirstQuestion), [`focusQuestion`](#focusQuestion)

### `onGetChoiceDisplayValue`

Use this event to load a display text for the [default choice item](https://surveyjs.io/form-library/documentation/questiondropdownmodel#defaultValue) in [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel) and [Tag Box](https://surveyjs.io/form-library/documentation/questiontagboxmodel) questions.

If you load choices from a server (use [`choicesByUrl`](https://surveyjs.io/form-library/documentation/questiondropdownmodel#choicesByUrl) or [`onChoicesLazyLoad`](https://surveyjs.io/form-library/documentation/surveymodel#onChoicesLazyLoad)), display texts become available only when data is loaded, which does not happen until a user opens the drop-down menu. However, a display text for a default choice item is required before that. In this case, you can load data individually for the default item within the `onGetChoiceDisplayValue` event handler.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.setItems`: `(displayValues: string[], ...customValues: IValueItemCustomPropValues[]) => void`  
A method that you should call to assign display texts to the question.
- `options.values`: `any[]`  
An array of one (in Dropdown) or more (in Tag Box) default values.

[View Demo](https://surveyjs.io/form-library/examples/lazy-loading-dropdown/ (linkStyle))

### `onGetDynamicPanelTabTitle`

An event that is raised before a [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/) renders [tab titles](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateTabTitle). Use this event to change individual tab titles.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionPanelDynamicModel`  
A Dynamic Panel question instance for which the event is raised.
- `options.panel`: `PanelModel`  
A panel for which the event is raised.
- `options.visiblePanelIndex`: `number`  
The panel's index in the [`visiblePanels`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#visiblePanels) array of the Dynamic Panel.
- `options.title`: `string`  
A tab title. You can change this parameter's value.

[View Demo](https://surveyjs.io/form-library/examples/tabbed-interface-for-duplicate-group-option/ (linkStyle))

### `onGetExpressionDisplayValue`

An event that is raised before an [Expression](https://surveyjs.io/form-library/documentation/api-reference/expression-model) question displays a value. Use this event to override the display value.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.displayValue`: `any`  
A question's display text. You can assign a custom value to this parameter.
- `options.value`: `any`  
An expression value.

### `onGetMatrixRowActions`

An event that allows you to add, delete, or modify actions in rows of a [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/).


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.actions`: `IAction[]`  
An array of [actions](https://surveyjs.io/form-library/documentation/iaction). You can modify the entire array or individual actions within it.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row for which the event is raised.

[View Demo](https://surveyjs.io/form-library/examples/employee-information-form/ (linkStyle))

**Related APIs:** [`[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction)`](#[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction))

### `onGetPageNumber`

An event that is raised before the survey calculates a page number. Handle this event to modify page numbers.

This event is raised only if the [`showPageNumbers`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showPageNumbers) property is enabled.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.page`: `PageModel`  
A Page instance for which the event is raised.
- `options.number`: `string`  
A page number. Note that this is a string value that contains not only the number itself but also the characters that separate the number from the page title: `"1. "`, `"2. "`, etc. You can change this parameter's value.

**Related APIs:** [`onGetQuestionTitle`](#onGetQuestionTitle), [`questionStartIndex`](#questionStartIndex)

### `onGetPageTitleActions`

An event that allows you to add, delete, or modify actions in a page title.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.page`: `PageModel`  
A Page instance for which the event is raised.
- `options.actions`: `IAction[]`  
An array of [actions](https://surveyjs.io/form-library/documentation/iaction) associated with the processed element.

[View Demo](https://surveyjs.io/form-library/examples/modify-titles-of-survey-elements/ (linkStyle))

**Related APIs:** [`[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction)`](#[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction))

### `onGetPanelFooterActions`

An event that allows you to add, delete, or modify actions in the footer of a [Panel](https://surveyjs.io/form-library/documentation/panelmodel). This panel may belong to a [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model) or be a standalone survey element.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.actions`: `IAction[]`  
An array of [actions](https://surveyjs.io/form-library/documentation/iaction). You can modify the entire array or individual actions within it.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.question`: `QuestionPanelDynamicModel`  
A [Dynamic Panel](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel) to which the Panel belongs. This field is `undefined` if the Panel does not belong to any Dynamic Panel.

**Related APIs:** [`[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction)`](#[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction))

### `onGetPanelNumber`

An event that is raised before the survey calculates a panel number. Handle this event to modify panel numbers.

This event is raised only for the panels with a [specified title](https://surveyjs.io/form-library/documentation/api-reference/panel-model#title) and [visible number](https://surveyjs.io/form-library/documentation/api-reference/panel-model#showNumber).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.number`: `string`  
A panel number. Note that this is a string value that contains not only the number itself but also the characters that separate the number from the panel title: `"1. "`, `"2. "`, etc. You can change this parameter's value.

### `onGetPanelTitleActions`

An event that allows you to add, delete, or modify actions in a panel title.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.actions`: `IAction[]`  
An array of [actions](https://surveyjs.io/form-library/documentation/iaction) associated with the processed element.

**Related APIs:** [`[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction)`](#[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction))

### `onGetProgressText`

An event that is raised before the survey displays progress text. Handle this event to change the progress text in code.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.questionCount`: `number`  
The total number of questions with input fields. [Image](https://surveyjs.io/form-library/examples/add-image-and-video-to-survey/), [HTML](https://surveyjs.io/form-library/examples/questiontype-html/), and [Expression](https://surveyjs.io/form-library/examples/questiontype-expression/) questions are excluded.
- `options.answeredQuestionCount`: `number`  
The number of questions that have been answered.
- `options.requiredQuestionCount`: `number`  
The number of questions marked as required.
- `options.requiredAnsweredQuestionCount`: `number`  
The number of required questions that have been answered.
- `options.text`: `string`  
Progress text rendered in the [progress bar](#showProgressBar). You can change this parameter's value.

**Related APIs:** [`showProgressBar`](#showProgressBar), [`progressBarLocation`](#progressBarLocation), [`progressBarType`](#progressBarType), [`getProgressInfo`](#getProgressInfo)

### `onGetQuestionDisplayValue`

Use this event to change a question's display text.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.displayValue`: `any`  
A question's display text. You can assign a custom value to this parameter.

### `onGetQuestionNumber`

An event that is raised before the survey calculates a question number. Handle this event to modify question numbers.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.number`: `string`  
A question number that is calculated based upon the question's [`visibleIndex`](https://surveyjs.io/form-library/documentation/api-reference/question#visibleIndex) and survey's [`questionStartIndex`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionStartIndex) properties. You can change this parameter's value.

If you want to hide question numbers, disable the [`showQuestionNumbers`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showQuestionNumbers) property.

**Related APIs:** [`onGetQuestionTitle`](#onGetQuestionTitle), [`questionStartIndex`](#questionStartIndex)

### `onGetQuestionTitle`

An event that is raised before the survey displays a question title. Handle this event to modify question titles.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.title`: `string`  
A question title taken from the question's `title` or `name` property. You can change this parameter's value.

If you want to modify question numbers, handle the [`onGetQuestionNumber`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onGetQuestionNumber) event.

**Related APIs:** [`requiredMark`](#requiredMark)

### `onGetQuestionTitleActions`

An event that allows you to add, delete, or modify actions in a question title.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.actions`: `IAction[]`  
An array of [actions](https://surveyjs.io/form-library/documentation/iaction) associated with the processed element.

[View Demo](https://surveyjs.io/form-library/examples/survey-titleactions/ (linkStyle))

**Related APIs:** [`[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction)`](#[IAction](https://surveyjs.io/form-library/documentation/api-reference/iaction))

### `onGetTitleTagName`

An event that is raised when the survey applies HTML tags to a survey, page, panel, and question title. Handle this event to change the HTML tag of individual titles.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.element`: `Base`  
A survey element (question, panel, page, or the survey itself) for which the event is raised.
- `options.tagName`: `string`  
An HTML tag used to render the title (`"div"`). You can change this parameter's value.

If you want to specify HTML tags for all titles, use the [`titleTags`](https://surveyjs.io/form-library/documentation/api-reference/settings#titleTags) object in [global settings](https://surveyjs.io/form-library/documentation/api-reference/settings).

[View Demo](https://surveyjs.io/form-library/examples/survey-titletagnames/ (linkStyle))

**Related APIs:** [`onGetQuestionTitle`](#onGetQuestionTitle), [`onGetQuestionNumber`](#onGetQuestionNumber)

### `onMatrixCellCreated`

An event that is raised after a cell in a [Multi-Select Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/) or [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/) is created.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDropdownModelBase`  
A Multi-Select Matrix question instance for which the event is raised.
- `options.column`: `MatrixDropdownColumn`  
A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.
- `options.columnName`: `string`  
The name of the matrix column to which the cell belongs.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to which the cell belongs.
- `options.rowValue`: `any`  
The values of this matrix row.\
To access a particular column's value, use the following code: `options.rowValue["columnName"]`
- `options.cell`: `MatrixDropdownCell`  
A matrix cell for which the event is raised.
- `options.cellQuestion`: `Question`  
A Question instance within the matrix cell. You can use the properties and methods exposed by the instance to customize it.

**Related APIs:** [`onAfterRenderMatrixCell`](#onAfterRenderMatrixCell)

### `onMatrixCellCreating`

An event that is raised before a cell in a [Multi-Select Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/) or [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/) is created. Use this event to change the type of individual matrix cells.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDropdownModelBase`  
A Multi-Select Matrix question instance for which the event is raised.
- `options.column`: `MatrixDropdownColumn`  
A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.
- `options.columnName`: `string`  
The name of the matrix column to which the cell belongs.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to which the cell belongs.
- `options.rowValue`: `any`  
The values of this matrix row.\
To access a particular column's value, use the following code: `options.rowValue["columnName"]`
- `options.cellType`: `string`  
The type of this matrix cell. You can change this property value to one of the values described in the [`cellType`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#cellType) documentation.

**Related APIs:** [`onAfterRenderMatrixCell`](#onAfterRenderMatrixCell)

### `onMatrixCellValidate`

An event that is raised for [Multi-Select Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/) and [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/) questions when they validate a cell value. Use this event to display a custom error message based on a condition.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDropdownModelBase`  
A Multi-Select Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to which the cell belongs.
- `options.column`: `MatrixDropdownColumn`  
A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.
- `options.columnName`: `string`  
The name of a matrix column to which the cell belongs.
- `options.cellQuestion`: `Question`  
A Question instance within the matrix cell. You can use the properties and methods exposed by the instance to customize it.
- `options.getCellQuestion`: `(columnName: string) => Question`  
A method that returns a Question instance within the matrix cell given a column name.
- `options.value`: `any`  
A new cell value.
- `options.error`: `string`  
A field for your custom error message. Default value: `undefined`.

**Related APIs:** [`onMatrixRowAdding`](#onMatrixRowAdding)

### `onMatrixCellValueChanged`

An event that is raised after a cell value is changed in a [Multi-Select Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/) or [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDropdownModelBase`  
A Multi-Select Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to which the cell belongs.
- `options.column`: `MatrixDropdownColumn`  
A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.
- `options.columnName`: `string`  
The name of a matrix column to which the cell belongs.
- `options.cellQuestion`: `Question`  
A Question instance within the matrix cell. You can use the properties and methods exposed by the instance to customize it.
- `options.getCellQuestion`: `(columnName: string) => Question`  
A method that returns a Question instance within the matrix cell given a column name.
- `options.value`: `any`  
A new cell value.
- `options.oldValue`: `any`  
A previous cell value.

**Related APIs:** [`onMatrixRowAdding`](#onMatrixRowAdding)

### `onMatrixCellValueChanging`

An event that is raised before a cell value is changed in a [Multi-Select Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/) or [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/). Use this event to change the cell value.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDropdownModelBase`  
A Multi-Select Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to which the cell belongs.
- `options.column`: `MatrixDropdownColumn`  
A [matrix column](https://surveyjs.io/form-library/documentation/api-reference/multi-select-matrix-column-values) to which the cell belongs.
- `options.columnName`: `string`  
The name of a matrix column to which the cell belongs.
- `options.cellQuestion`: `Question`  
A Question instance within the matrix cell. You can use the properties and methods exposed by the instance to customize it.
- `options.getCellQuestion`: `(columnName: string) => Question`  
A method that returns a Question instance within the matrix cell given a column name.
- `options.value`: `any`  
A new cell value.
- `options.oldValue`: `any`  
A previous cell value.

**Related APIs:** [`onMatrixRowAdding`](#onMatrixRowAdding)

### `onMatrixColumnAdded`

An event that is raised after a new column is added to a [Multi-Select Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdropdown/) or [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.column`: `any`  
An added matrix column.

### `onMatrixDetailPanelVisibleChanged`

An event that is raised after the visibility of an [expandable detail section](https://surveyjs.io/form-library/examples/add-expandable-details-section-under-matrix-rows/) is changed. This event can be raised for [Multi-Select](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) and [Dynamic Matrix](https://surveyjs.io/form-library/documentation/api-reference/dynamic-matrix-table-question-model) questions.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDropdownModelBase`  
A Multi-Select Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to which the detail section belongs.
- `options.rowIndex`: `number`  
A zero-based row index.
- `options.detailPanel`: `PanelModel`  
A [PanelModel](https://surveyjs.io/form-library/documentation/panelmodel) that represents the detail section.
- `options.visible`: `boolean`  
Indicates whether the detail section is visible now.

### `onMatrixRenderRemoveButton`

An event that is raised before rendering the Remove button in a row of a [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/). Use this event to hide the Remove button for individual matrix rows.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDynamicModel`  
A Dynamic Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row for which the event is raised.
- `options.rowIndex`: `number`  
A zero-based row index.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to hide the Remove button for this row.

**Related APIs:** [`onMatrixRowRemoving`](#onMatrixRowRemoving), [`onMatrixRowRemoved`](#onMatrixRowRemoved)

### `onMatrixRowAdded`

An event that is raised after a new row is added to a [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDynamicModel`  
A Dynamic Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
An added matrix row.

### `onMatrixRowAdding`

An event that is raised before a new row is added to a [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDynamicModel`  
A Dynamic Matrix question instance for which the event is raised.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you do not want to add the row.

### `onMatrixRowRemoved`

An event that is raised after a row is deleted from a [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDynamicModel`  
A Dynamic Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
A deleted matrix row.
- `options.rowIndex`: `number`  
A zero-based index of the deleted row.

**Related APIs:** [`onMatrixRenderRemoveButton`](#onMatrixRenderRemoveButton)

### `onMatrixRowRemoving`

An event that is raised before a row is deleted from a [Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/). You can cancel row deletion and clear row data instead.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionMatrixDynamicModel`  
A Dynamic Matrix question instance for which the event is raised.
- `options.row`: `MatrixDropdownRowModelBase`  
A matrix row to be deleted. If you want to clear row data, set the `options.row.value` property to `undefined`.
- `options.rowIndex`: `number`  
A zero-based index of the matrix row to be deleted.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to cancel row deletion.

**Related APIs:** [`onMatrixRenderRemoveButton`](#onMatrixRenderRemoveButton)

### `onMultipleTextItemAdded`

An event that is raised on adding a new item in Multiple Text question.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.item`: `any`  
A new added item.

### `onNavigateToUrl`

An event that is raised before the survey navigates to a specified URL. Use this event to change the URL or cancel the navigation.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to cancel the navigation and show the [complete page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#complete-page).
- `options.url`: `string`  
A URL to which respondents should be navigated. You can modify this parameter's value.

**Related APIs:** [`navigateToUrl`](#navigateToUrl), [`navigateToUrlOnCondition`](#navigateToUrlOnCondition)

### `onOpenDropdownMenu`

An event that is raised when users open a drop-down menu.

This event can be raised for [Single-](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) and [Multi-Select Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model) questions, [Rating Scale](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) questions [rendered as drop-down menus](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#displayMode), and [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) questions that contain columns of the `"dropdown"` or `"tagbox"` [`cellType`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#cellType). Handle this event to change the drop-down menu type for specific questions or device types.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A question for which the event is raised.
- `options.deviceType`: `"mobile" | "tablet" | "desktop"`  
A device type.
- `options.hasTouchScreen`: `boolean`  
A Boolean value that indicates whether the current device supports touch gestures.
- `options.screenHeight`: `number`  
The height of the device screen in pixels.
- `options.screenWidth`: `number`  
The width of the device screen in pixels.
- `options.menuType`: `"popup" | "dropdown" | "overlay"`  
A menu type to use for the question: a classic dropdown, a pop-up dialog, or an overlay window. You can modify this parameter's value.

### `onOpenFileChooser`

An event that is raised when a respondent opens a dialog window to select files.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.input`: `any`  
A file input HTML element.
- `options.element`: `Base`  
A question for which this event is raised.
- `options.elementType`: `string`  
The type of the element passed as the `options.element` parameter.\
Possible values: any value returned from the [`getType()`](https://surveyjs.io/form-library/documentation/api-reference/question#getType) method.
- `options.propertyName`: `string`  
The name of the survey element property for which files are being selected.
- `options.item`: `ItemValue`  
A choice item for which the event is raised. This parameter has a value only when the dialog window is opened to select images for an [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model) question.
- `options.callback`: `(files: any[]) => void`  
A callback function to which you should pass selected files.

**Related APIs:** [`chooseFiles`](#chooseFiles)

### `onPageAdded`

An event that is raised when a new page is added to the survey.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.page`: `PageModel`  
A Page instance for which the event is raised.

**Related APIs:** [`PanelModel`](#PanelModel)

### `onPageVisibleChanged`

An event that is raised after page visibility is changed.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.visible`: `boolean`  
Indicates whether the element is visible now.
- `options.page`: `PageModel`  
A Page instance for which the event is raised.

Refer to the following help topic for information on how to implement conditional visibility: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility).

### `onPanelAdded`

An event that is raised when a new panel is added to a page.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.page`: `PanelModelBase`  
A page that nests the added element.
- `options.parent`: `PanelModelBase`  
The parent container (panel or page).
- `options.index`: `number`  
The element's index within the parent container (panel or page).
- `options.name`: `string`  
The question's name.

### `onPanelRemoved`

An event that is raised after a panel is deleted from the survey.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.name`: `string`  
The element's name.

### `onPanelVisibleChanged`

An event that is raised after panel visibility is changed.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.visible`: `boolean`  
Indicates whether the element is visible now.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.

Refer to the following help topic for information on how to implement conditional visibility: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility).

### `onPartialSend`

An event that is raised to save incomplete survey results. Enable the [`partialSendEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#partialSendEnabled) property for this event to occur.

For information on event handler parameters, refer to descriptions within the interface.

Alternatively, you can handle the [`onCurrentPageChanged`](#onCurrentPageChanged) and [`onValueChanged`](#onValueChanged) events, as shown in the following demo: [Continue an Incomplete Survey](https://surveyjs.io/form-library/examples/survey-editprevious/).

### `onPopupVisibleChanged`

An event that is raised after the visibility of a popup is changed.

This event can be raised for [Single-](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) and [Multi-Select Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-tag-box-model) questions and [Rating Scale](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model) questions [rendered as drop-down menus](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#displayMode), and [Multi-Select Matrix](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list) questions that contain columns of the `"dropdown"` or `"tagbox"` [`cellType`](https://surveyjs.io/form-library/documentation/api-reference/matrix-table-with-dropdown-list#cellType).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.popup`: `PopupModel<any>`  
An object that describes the popup.
- `options.visible`: `boolean`  
Indicates whether the popup is visible now.

### `onProcessDynamicText`

An event that is raised when the survey processes [dynamic texts](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#dynamic-texts) and any text in curly brackets. Use this event, for instance, to substitute parameters in a RESTful URL with real values when you [load choices by URL](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model#choicesByUrl).

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.element`: `Base`  
A survey element (question, panel, page, choice option, matrix row, column, trigger, validator, survey, etc.) for which the event is raised.
- `options.name`: `string`  
The name of the value being processed (the text in curly brackets).
- `options.value`: `any`  
The value being processed. You can change this parameter's value.

### `onProcessHtml`

An event that is raised when the survey processes HTML content. Handle this event to modify HTML content before displaying.

[View Demo](https://surveyjs.io/form-library/examples/add-html-form-field/ (linkStyle))

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.html`: `string`  
HTML markup. You can modify this parameter's value.
- `options.reason`: `string`  
Indicates a page, question, or message for which HTML content is intended: [`"completed"`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#completedHtml) | [`"completed-before"`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#completedBeforeHtml) | [`"loading"`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#loadingHtml) | [`"html-question"`](https://surveyjs.io/form-library/documentation/api-reference/add-custom-html-to-survey#html).

**Related APIs:** [`completedHtml`](#completedHtml), [`loadingHtml`](#loadingHtml), [`[QuestionHtmlModel.html](https://surveyjs.io/form-library/documentation/api-reference/add-custom-html-to-survey#html)`](#[QuestionHtmlModel.html](https://surveyjs.io/form-library/documentation/api-reference/add-custom-html-to-survey#html))

### `onQuestionAdded`

An event that is raised when a new question is added to a panel or page.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.page`: `PanelModelBase`  
A page that nests the added element.
- `options.parent`: `PanelModelBase`  
The parent container (panel or page).
- `options.index`: `number`  
The element's index within the parent container (panel or page).
- `options.name`: `string`  
The question's name.

To use this event for questions loaded from JSON, create an empty survey model, add an event handler, and only then populate the model from the JSON object:

```js
import { Model } from "survey-core";

const surveyJson = {
   // ...
};
// Create an empty model
const survey = new Model();
// Add an event handler
survey.onQuestionAdded.add((sender, options) => {
  //...
});
// Load the survey JSON schema
survey.fromJSON(surveyJson);
```

**Related APIs:** [`onQuestionCreated`](#onQuestionCreated)

### `onQuestionCreated`

An event that is raised when the survey creates any new object derived from [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question).

In a survey, complex elements ([Dynamic Matrix](https://surveyjs.io/form-library/examples/questiontype-matrixdynamic/), [Multiple Text](https://surveyjs.io/form-library/examples/questiontype-multipletext/), and [Dynamic Panel](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/)) are composed of questions. Use this event to customize any question regardless of which survey element it belongs to.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.

To use this event for questions loaded from JSON, create an empty survey model, add an event handler, and only then populate the model from the JSON object:

```js
import { Model } from "survey-core";

const surveyJson = {
   // ...
};
// Create an empty model
const survey = new Model();
// Add an event handler
survey.onQuestionCreated.add((sender, options) => {
  //...
});
// Load the survey JSON schema
survey.fromJSON(surveyJson);
```

**Related APIs:** [`onQuestionAdded`](#onQuestionAdded)

### `onQuestionRemoved`

An event that is raised after a question is deleted from the survey.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.name`: `string`  
The element's name.

### `onQuestionVisibleChanged`

An event that is raised after question visibility is changed.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.visible`: `boolean`  
Indicates whether the element is visible now.
- `options.name`: `string`  
The question's name.

Refer to the following help topic for information on how to implement conditional visibility: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility).

### `onResize`

An event that is raised when the survey's width or height is changed.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.width`: `number`  
The current survey width in pixels.
- `options.height`: `number`  
The current survey height in pixels.

### `onScrollToTop`

An event this is raised before a survey element (usually page) is scrolled to the top. Use this event to cancel the scroll operation.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.element`: `ISurveyElement`  
A survey element that will be scrolled to the top.
- `options.elementId`: `string`  
A unique element ID within the DOM.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to cancel the scroll operation.

### `onServerValidateQuestions`

Use this event to validate data on your server.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.complete`: `() => void`  
A method that you should call when a request to the server has completed.
- `options.errors`: `{ [index: string]: any; }`  
An object for your error messages. Set error messages as follows: `options.errors["questionName"] = "My error message"`.
- `options.data`: `{ [index: string]: any; }`  
Question values. You can get an individual question value as follows: `options.data["questionName"]`.

[View Demo](https://surveyjs.io/form-library/examples/javascript-server-side-form-validation/ (linkStyle))

**Related APIs:** [`onValidateQuestion`](#onValidateQuestion), [`onValidatePanel`](#onValidatePanel), [`isValidatingOnServer`](#isValidatingOnServer)

### `onShowingChoiceItem`

An event that is raised before a [choice item](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase#choices) is displayed. Use this event to change the visibility of individual choice items in [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model), [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model), [Radio Button Group](https://surveyjs.io/form-library/documentation/api-reference/radio-button-question-model), and other similar question types.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.item`: `ItemValue`  
A choice item.
- `options.visible`: `boolean`  
A Boolean value that specifies item visibility. Set it to `false` to hide the item.

### `onShowingPreview`

An event that is raised before the survey displays a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page). Use this event to cancel the preview.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.allow`: `boolean`  
A Boolean property that you can set to `false` if you want to cancel the preview.

**Related APIs:** [`showPreviewBeforeComplete`](#showPreviewBeforeComplete), [`previewMode`](#previewMode), [`showPreview`](#showPreview), [`cancelPreview`](#cancelPreview)

### `onStarted`

An event that is raised when the survey [`state`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#state) changes to `"running"`.

For information on event handler parameters, refer to descriptions within the interface.

[View Demo](https://surveyjs.io/form-library/examples/automatically-move-to-next-page-if-answer-selected/ (linkStyle))

**Related APIs:** [`firstPageIsStartPage`](#firstPageIsStartPage)

### `onTextMarkdown`

An event that is raised to convert Markdown content to HTML.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.element`: `Question | PanelModel | SurveyModel | PageModel`  
A survey element (question, panel, page, or survey) for which the event is raised.
- `options.name`: `string`  
The name of the property that contains the text to process.
- `options.item`: `ItemValue`  
A choice item for which the event is raised. This parameter has a value only when `options.element` is a choice-based question, such as [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) or [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model).
- `options.text`: `string`  
A string with Markdown content. Convert this content to HTML and assign the result to the `options.html` parameter.
- `options.html`: `string`  
A property to which you should assign HTML content.

[View Demo](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/ (linkStyle))

### `onTimerTick`

An event that is raised every second while the timer is running.

Use the [`timeSpent`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#timeSpent) property to find out how many seconds have elapsed.

**Related APIs:** [`timeLimit`](#timeLimit), [`timeLimitPerPage`](#timeLimitPerPage), [`showTimer`](#showTimer), [`timerLocation`](#timerLocation), [`startTimer`](#startTimer)

### `onTriggerExecuted`

An event that is raised after a [trigger](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#triggers) is executed.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.trigger`: `Trigger`  
A trigger that has been executed.

[Conditional Survey Logic (Triggers)](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-survey-logic-triggers (linkStyle))

**Related APIs:** [`triggers`](#triggers), [`runTriggers`](#runTriggers)

### `onUIStateChanged`

An event that is raised when the [state of the survey UI](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#uiState) changes.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.element`: `ISurveyElement`  
A survey element whose state change triggered the event.
- `options.changedProperty`: `"collapsed" | "activeElementName" | "activePanelIndex" | "passed"`  
The name of the UI state property that changed.

To access the current UI state, use the [`uiState`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#uiState) property:

```js
// ...
// Omitted: `SurveyModel` creation
// ...

survey.onUIStateChanged.add((_, options) => {
  const state = survey.uiState;
  // Save the state in a storage
});
```

[View Demo](https://surveyjs.io/form-library/examples/save-and-restore-user-responses-to-complete-survey/ (linkStyle))

### `onUpdateChoiceItemCss`

An event that is raised before rendering a choice item in Radio Button Group, Checkboxes and Rating Scale questions. Use it to override default CSS classes applied to choice items.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.item`: `ItemValue`  
A choice item. To access its value and display text, use the `options.item.value` and `options.item.text` properties.
- `options.css`: `string`  
A string with CSS classes applied to the choice item. The CSS classes are separated by a space character. You can modify this string to apply custom CSS classes.

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

**Related APIs:** [`css`](#css)

### `onUpdatePageCssClasses`

An event that is raised before rendering a page. Use it to override default page CSS classes.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.page`: `PageModel`  
A Page instance for which the event is raised.
- `options.cssClasses`: `any`  
An object with CSS classes applied to the element being rendered, for example, `{ root: "class1", button: "class2" }`. You can modify this object to apply custom CSS classes.

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

**Related APIs:** [`css`](#css)

### `onUpdatePanelCssClasses`

An event that is raised before rendering a standalone panel and panels within [Dynamic Panel](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/). Use it to override default panel CSS classes.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.cssClasses`: `any`  
An object with CSS classes applied to the element being rendered, for example, `{ root: "class1", button: "class2" }`. You can modify this object to apply custom CSS classes.

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

**Related APIs:** [`css`](#css)

### `onUpdateQuestionCssClasses`

An event that is raised before rendering a question. Use it to override default question CSS classes.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.cssClasses`: `any`  
An object with CSS classes applied to the element being rendered, for example, `{ root: "class1", button: "class2" }`. You can modify this object to apply custom CSS classes.

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

**Related APIs:** [`css`](#css)

### `onUploadFiles`

An event that is raised when a [File Upload](https://surveyjs.io/form-library/documentation/api-reference/file-model) or [Signature](https://surveyjs.io/form-library/documentation/api-reference/signature-pad-model) question starts to upload a file. Applies only if [`storeDataAsText`](https://surveyjs.io/form-library/documentation/api-reference/file-model#storeDataAsText) is `false`. Use this event to upload files to your server.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `QuestionFileModel | QuestionSignaturePadModel`  
A File Upload or Signature Pad question instance for which the event is raised.
- `options.name`: `string`  
A File Upload question's name.
- `options.callback`: `(data: any, errors?: any) => any`  
A callback function that you should call when a file is uploaded successfully or when file upload fails. Pass an array of successfully uploaded files as the first argument. As the second argument, you can pass an array of error messages if file upload failed.
- `options.files`: `any[]`  
An array of JavaScript <a href="https://developer.mozilla.org/en-US/docs/Web/API/File" target="_blank">File</a> objects that represent files to upload.
- `options.sourceType`: `string`  
Indicates the origin of the uploaded files.\
Possible values: `"file"`, `"camera"`, or `"signature"`.

[File Upload Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

[Signature Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

**Related APIs:** [`uploadFiles`](#uploadFiles), [`onDownloadFile`](#onDownloadFile), [`onClearFiles`](#onClearFiles)

### `onValidatePage`

An event that is raised when a survey page is being validated. Use this event to add/remove/modify errors.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.page`: `PageModel`  
A Page instance for which the event is raised.
- `options.questions`: `Question[]`  
An array of questions with validation errors.
- `options.errors`: `SurveyError[]`  
An array of validation errors.

### `onValidatePanel`

An event that is raised when a panel is being validated. Use this event to add/remove/modify errors or specify a custom error message.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.panel`: `PanelModel`  
A Panel instance for which the event is raised.
- `options.name`: `string`  
The panel's name.
- `options.error`: `string`  
An error message that you should specify if custom validation fails.
- `options.errors`: `SurveyError[]`  
An array of other validation errors that you can modify.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-input-validation/ (linkStyle))

**Related APIs:** [`onValidateQuestion`](#onValidateQuestion), [`onServerValidateQuestions`](#onServerValidateQuestions)

### `onValidateQuestion`

An event that is raised when a question value is being validated. Use this event to add/remove/modify errors or specify a custom error message.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.value`: `any`  
A question value being validated.
- `options.name`: `string`  
The question's name.
- `options.error`: `string`  
An error message that you should specify if custom validation fails.
- `options.errors`: `SurveyError[]`  
An array of other validation errors that you can modify. The array is empty if the validated question satisfies all validation rules.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-input-validation/ (linkStyle))

**Related APIs:** [`onServerValidateQuestions`](#onServerValidateQuestions), [`onValidatePanel`](#onValidatePanel), [`onMatrixCellValidate`](#onMatrixCellValidate)

### `onValueChanged`

An event that is raised after a question value is changed.


Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.name`: `string`  
The `name` of the question whose value is being changed. If you use the [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#valueName) property, this parameter contains its value.
- `options.reason`: `"trigger" | "expression"`  
A value that indicates what caused the value change: an [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) evaluation or a run of a [trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-survey-logic-triggers). If the value is changed for other reasons, this parameter is `undefined`.
- `options.value`: `any`  
A new value.

[View Demo](https://surveyjs.io/form-library/examples/save-and-restore-user-responses-to-complete-survey/ (linkStyle))

To handle value changes in matrix cells or panels within a [Dynamic Panel](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model), use the [`onMatrixCellValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onMatrixCellValueChanged) or [`onDynamicPanelValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onDynamicPanelValueChanged) event.

**Related APIs:** [`setValue`](#setValue)

### `onValueChanging`

An event that is raised before a question value is changed.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.question`: `Question`  
A Question instance for which the event is raised.
- `options.name`: `string`  
The `name` of the question whose value is being changed. If you use the [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#valueName) property, this parameter contains its value.
- `options.reason`: `"trigger" | "expression"`  
A value that indicates what caused the value change: an [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) evaluation or a run of a [trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-survey-logic-triggers). If the value is changed for other reasons, this parameter is `undefined`.
- `options.value`: `any`  
A new value. You can change it if required.
- `options.oldValue`: `any`  
A previous value.

**Related APIs:** [`setValue`](#setValue)

### `onVariableChanged`

An event that is raised after a [variable](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#variables) or [calculated value](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#calculated-values) is changed.

Parameters:

 - `sender`: `SurveyModel`  
A survey instance that raised the event.
- `options.value`: `any`  
A new value for the variable or calculated value.
- `options.name`: `string`  
The name of the variable or calculated value that has been changed.

**Related APIs:** [`setVariable`](#setVariable), [`calculatedValues`](#calculatedValues)

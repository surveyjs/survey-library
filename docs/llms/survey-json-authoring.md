# SurveyJS survey JSON: an authoring guide

Generated from survey-core 2.5.35 by `survey-utils generate-doc --llm-guide`. Do not hand-edit: every fact below is extracted from the library, and the next run overwrites this file.

## Output rules

When you are asked for a survey, reply with **one JSON object and nothing else**:

- No Markdown fences, no prose before or after, no comments, no trailing commas.
- Omit any property whose value equals the default listed in this guide.
- Use only the `type` strings listed under "Question types". There are no others.
- Use only property names this guide lists for a type; never invent one.
- Use enum values exactly as they appear here.
- Put an expression only where a property is documented to accept one.
- Give every question a `name` that is unique in the document; it is the key in the result data.
- An expression may only reference the `name` of a question that exists in the document.

Before returning the JSON, check it against the survey definition schema and fix anything it rejects: https://unpkg.com/survey-core@2.5.35/surveyjs_definition.json. The schema catches unknown properties and malformed values; it does not catch every unknown question type, so still keep to the types listed below.

## The shape of a survey

A survey is one JSON object. It holds `pages`, each page holds `elements`, and each element is a question or a panel. A survey with no page structure may put `elements` at the root instead; the library wraps them in a page.
**A minimal survey**

```json
{
  "title": "Customer feedback",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "fullName",
          "title": "Your name"
        }
      ]
    }
  ]
}
```

`name` is required on a question, must be unique across the survey, and is the key the answer appears under in the result data and the name expressions refer to. `title` is what the respondent reads; when it is missing the `name` is shown instead.

## Survey and page properties

The survey object itself, and the pages inside it.

### `page`

The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions). Inherits the properties of `panel`.

[API](https://surveyjs.io/form-library/documentation/api-reference/pagemodel.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `navigationTitle` *(loc)* | `string` |  | A caption displayed on a navigation button in the TOC or progress bar. |
| `showNavigationButtons` | `boolean` |  | Gets or sets the visibility of the Start, Next, Previous, and Complete navigation buttons on this page. |
| `timeLimit` | `number` | `0` | A time period that a respondent has to complete this page; measured in seconds. |
| `navigationDescription` *(loc)* | `string` |  |  |

### `survey`

The `SurveyModel` object contains properties and methods that allow you to control the survey and access its elements.

[API](https://surveyjs.io/form-library/documentation/api-reference/surveymodel.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `calculatedValues` | `array` of `calculatedvalue` |  | An array of calculated values. |
| `completedHtmlOnCondition` | `array` of `htmlconditionitem` |  | An array of objects that allows you to specify different HTML content for the complete page. |
| `navigateToUrlOnCondition` | `array` of `urlconditionitem` |  | An array of objects that allows you to navigate respondents to different URLs after survey completion. |
| `pages` | `array` of `page` |  | Returns an array of all pages in the survey. |
| `checkErrorsMode` | `onNextPage, onValueChanged, onComplete` | `"onNextPage"` | Specifies when the survey validates answers. |
| `clearInvisibleValues` | `none, onComplete, onHidden, onHiddenContainer` | `"onComplete"` | Specifies when to remove values of invisible questions from survey results. |
| `logoFit` | `none, contain, cover, fill` | `"contain"` | Specifies how to resize a logo to fit it into its container. |
| `logoPosition` | `none, left, right, top, bottom` | `"left"` | A logo position relative to the survey title. |
| `navigationButtonsLocation` | `top, bottom, topBottom` | `"bottom"` | Gets or sets the position of the Start, Next, Previous, and Complete navigation buttons. |
| `previewMode` | `allQuestions, answeredQuestions` | `"allQuestions"` | Specifies whether the preview of given answers includes all or only answered questions. |
| `progressBarInheritWidthFrom` | `container, survey` | `"container"` | Specifies whether the progress bar spans the width of the survey or that of the survey container. |
| `progressBarLocation` | `auto, aboveheader, belowheader, bottom, topbottom` | `"auto"` | Specifies the alignment of the progress bar. |
| `progressBarType` | `pages, questions, requiredQuestions, correctQuestions` | `"pages"` | Specifies the type of information displayed by the progress bar. |
| `questionDescriptionLocation` | `underInput, underTitle, hidden` | `"underTitle"` | Specifies where to display question descriptions. |
| `questionErrorLocation` | `top, bottom` | `"top"` | Specifies the error message position. |
| `questionOrder` | `initial, random` | `"initial"` | Specifies the sort order of questions in the survey. |
| `questionsOnPageMode` | `standard, singlePage, questionPerPage, inputPerPage` | `"standard"` | Specifies how to distribute survey elements between pages. |
| `questionTitleLocation` | `top, bottom, left` | `"top"` | Gets or sets question title location relative to the input field: `"top"`, `"bottom"`, or `"left"`. |
| `showQuestionNumbers` | `on, onPage, recursive, off` | `"off"` | Specifies whether to display survey element numbers and how to calculate them. |
| `textUpdateMode` | `onBlur, onTyping` | `"onBlur"` | Specifies when to update the question value in questions with a text input field. |
| `timerInfoMode` | `page, survey, combined` | `"combined"` | Specifies whether the timer panel displays timers for the current page, the entire survey, or both. |
| `timerLocation` | `top, bottom` | `"top"` | Specifies the timer's position relative to the survey. |
| `tocLocation` | `left, right` | `"left"` | Gets or sets the position of the table of contents. |
| `widthMode` | `auto, static, responsive` | `"auto"` | Specifies how to calculate the survey width. |
| `allowResizeComment` | `boolean` | `true` | Specifies whether to display a resize handle for Long Text questions and other text areas intended for multi-line text content. |
| `autoAdvanceAllowComplete` | `boolean` | `true` | Specifies whether to complete the survey automatically after a user answers all questions on the last page. |
| `autoAdvanceEnabled` | `boolean` |  | Specifies whether the survey switches to the next page automatically after a user answers all questions on the current page. |
| `autoFocusFirstError` | `boolean` | `true` | Specifies whether to focus the first question with a validation error on the current page. |
| `autoFocusFirstQuestion` | `boolean` |  | Specifies whether to focus the first question on the page on survey startup or when users switch between pages. |
| `autoGrowComment` | `boolean` | `false` | Specifies whether to increase the height of Long Text questions and other text areas to accommodate multi-line text content. |
| `commentAreaRows` | `number` |  | Specifies the visible height of comment areas, measured in lines. |
| `completedBeforeHtml` *(loc)* | `string` |  | HTML content displayed to a user who has completed the survey before. |
| `completedHtml` *(loc)* | `string` |  | HTML content displayed on the complete page. |
| `completeText` *(loc)* | `string` |  | Gets or sets a caption for the Complete button. |
| `cookieName` | `string` |  | A cookie name used to save information about survey completion. |
| `description` *(loc)* | `string` |  | Explanatory text displayed under the title. |
| `editText` *(loc)* | `string` |  | Gets or sets a caption for the Edit button displayed when the survey shows a preview of given answers. |
| `firstPageIsStartPage` | `boolean` | `false` | Gets or sets a Boolean value that specifies whether the first page is a start page. |
| `gridLayoutEnabled` | `boolean` | `false` | Enables the grid layout, which structures form elements using a column-based system. |
| `loadingHtml` *(loc)* | `string` |  | HTML content displayed while a survey JSON schema is being loaded. |
| `locale` | `string` |  | Specifies the survey's locale. |
| `logo` *(loc)* | `string` |  | An image URL or a Base64-encoded image to use as a survey logo. |
| `logoHeight` | `string` | `"40px"` | A logo height in CSS-accepted values. |
| `logoWidth` | `string` | `"auto"` | A logo width in CSS-accepted values. |
| `maxCommentLength` | `number` | `0` | Specifies the maximum text length for question comments. |
| `maxTextLength` | `number` | `0` | Specifies the maximum text length in textual questions (Single-Line Input, Long Text, Multiple Textboxes), measured in characters. |
| `navigateToUrl` | `string` |  | A URL to which respondents should be navigated after survey completion. |
| `pageNextText` *(loc)* | `string` |  | Gets or sets a caption for the Next button. |
| `pagePrevText` *(loc)* | `string` |  | Gets or sets a caption for the Previous button. |
| `partialSendEnabled` | `boolean` |  | Specifies whether to save survey results when respondents switch between pages. |
| `previewText` *(loc)* | `string` |  | Gets or sets a caption for the Preview button. |
| `progressBarShowPageNumbers` | `boolean` |  | Specifies whether the progress bar displays page numbers. |
| `progressBarShowPageTitles` | `boolean` |  | Specifies whether the progress bar displays page titles. |
| `questionStartIndex` | `string` |  | Specifies the initial number or letter from which to start question numbering. |
| `questionTitlePattern` | `string` | `"numTitleRequire"` | Specifies a pattern for question titles. |
| `readOnly` | `boolean` |  | Enables the read-only mode. |
| `requiredMark` | `string` | `"*"` | Specifies one or multiple characters that designate required questions. |
| `showCompletePage` | `boolean` | `true` | Specifies whether to show the complete page. |
| `showNavigationButtons` | `boolean` | `true` | Gets or sets the visibility of the Start, Next, Previous, and Complete navigation buttons. |
| `showPageNumbers` | `boolean` |  | Specifies whether page titles contain page numbers. |
| `showPageTitles` | `boolean` | `true` | Specifies whether to display page titles. |
| `showPrevButton` | `boolean` | `true` | Specifies whether to display the Previous button. |
| `showPreviewBeforeComplete` | `boolean` | `false` | Specifies whether to show a preview of given answers before they are submitted. |
| `showProgressBar` | `boolean` | `false` | Specifies the visibility of the progress bar. |
| `showTimer` | `boolean` |  | Specifies the timer's visibility. |
| `showTitle` | `boolean` | `true` | Specifies whether to display the survey title. |
| `showTOC` | `boolean` | `false` | Gets or sets the visibility of the table of contents. |
| `startSurveyText` *(loc)* | `string` |  | Gets or sets a caption for the Start button. |
| `storeOthersAsComment` | `boolean` | `true` | Specifies whether to store the "Other" option response in a separate property. |
| `timeLimit` | `number` | `0` | A time period that a respondent has to complete the survey; measured in seconds. |
| `timeLimitPerPage` | `number` | `0` | A time period that a respondent has to complete each survey page; measured in seconds. |
| `title` *(loc)* | `string` |  | A title for the survey element. |
| `triggers` | `array` |  | A list of triggers in the survey. |
| `validateVisitedEmptyFields` | `boolean` |  | Specifies whether to trigger validation when a user focuses on an empty input field and then leaves it without making any changes. |
| `width` | `string` |  | A survey width in CSS values. |

## Shared question properties

Every question has these. They are listed once, on the class that declares them, and are **not** repeated under the individual types below.

### `checkboxbase`

Inherits the properties of `selectbase`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `colCount` | `0, 1, 2, 3, 4, 5` | `1` |  |

### `matrixbase`

A base class for all matrix question types. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixbasemodel.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `columnsVisibleIf` | `expression` |  | A Boolean expression that is evaluated against each matrix column. |
| `rowsVisibleIf` | `expression` |  | A Boolean expression that is evaluated against each matrix row. |
| `verticalAlign` | `top, middle` | `"middle"` | Aligns matrix cell content in the vertical direction. |
| `alternateRows` | `boolean` | `false` | Specifies whether to apply shading to alternate matrix rows. |
| `columnMinWidth` | `string` |  | Minimum column width in CSS values. |
| `showHeader` | `boolean` | `true` | Specifies whether to display the table header that contains column captions. |

### `matrixdropdownbase`

A base class for the `QuestionMatrixDropdownModel` and `QuestionMatrixDynamicModel` classes. Inherits the properties of `matrixbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdropdownmodelbase.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `choices` | `array` of `itemvalue` | `[]` | Gets or sets choice items for Dropdown, Checkbox, and Radiogroup matrix cells. |
| `columns` | `array` of `matrixdropdowncolumn` |  | An array of matrix columns. |
| `cellErrorLocation` | `default, top, bottom` | `"default"` | Specifies the error message position relative to matrix cells. |
| `cellType` | `dropdown, checkbox, radiogroup, tagbox, text, comment, boolean, expression, rating, slider` | `"dropdown"` | Specifies the type of matrix cells. |
| `columnColCount` | `0, 1, 2, 3, 4` | `0` | Specifies the number of columns in Radiogroup and Checkbox cells. |
| `detailErrorLocation` | `default, top, bottom` | `"default"` | Specifies the error message position for questions within detail sections. |
| `detailPanelMode` | `none, underRow, underRowSingle` | `"none"` | Specifies the location of detail sections. |
| `keyDuplicationError` *(loc)* | `string` |  | An error message displayed when users enter a duplicate value into a column that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified). |
| `placeholder` *(loc)* | `string` |  | A placeholder for Dropdown matrix cells. |
| `singleInputTitleTemplate` *(loc)* | `string` |  | A title template that applies when the survey is in input-per-page mode. |
| `transposeData` | `boolean` |  | Specifies whether to display `columns` as rows and `rows` as columns. |

### `nonvalue`

A base class for question types that cannot have a value (Html, Image). Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionnonvalue.md)

### `panelbase`

A base class for the `PanelModel` and `PageModel` classes.

[API](https://surveyjs.io/form-library/documentation/api-reference/panelmodelbase.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `gridLayoutColumns` | `array` of `panellayoutcolumn` |  | An array of columns used to arrange survey elements within this page or panel. |
| `enableIf` | `expression` |  | A Boolean expression. |
| `requiredIf` | `expression` |  | A Boolean expression. |
| `visibleIf` | `expression` |  | A Boolean expression. |
| `questionErrorLocation` | `default, top, bottom` | `"default"` | Specifies the error message position for questions that belong to this page/panel. |
| `questionOrder` | `default, initial, random` | `"default"` | Specifies the sort order of questions in the panel/page. |
| `questionTitleLocation` | `default, top, bottom, left, hidden` | `"default"` | Sets a title location relative to the input field for questions that belong to this panel/page. |
| `description` *(loc)* | `string` |  | Explanatory text displayed under the title. |
| `name` | `string` |  | A survey element identifier. |
| `questionTitleWidth` | `string` |  | Sets consistent width for question titles in CSS values. |
| `readOnly` | `boolean` |  | Makes the survey element read-only. |
| `title` *(loc)* | `string` |  | A title for the survey element. |
| `visible` | `boolean` | `true` | Gets or sets panel/page visibility. |

### `question`

A base class for all questions. Required: `name`.

[API](https://surveyjs.io/form-library/documentation/api-reference/question.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | A survey element identifier. |
| `defaultValueExpression` | `expression` |  | An expression used to calculate the `defaultValue`. |
| `enableIf` | `expression` |  | A Boolean expression. |
| `requiredIf` | `expression` |  | A Boolean expression. |
| `resetValueIf` | `expression` |  | A Boolean expression. |
| `setValueExpression` | `expression` |  | An expression that calculates the question value. |
| `setValueIf` | `expression` |  | A Boolean expression. |
| `visibleIf` | `expression` |  | A Boolean expression. |
| `clearIfInvisible` | `default, none, onComplete, onHidden, onHiddenContainer` | `"default"` | Specifies when to clear the question value if the question becomes invisible. |
| `descriptionLocation` | `default, underInput, underTitle, hidden` | `"default"` | Specifies where to display a question description. |
| `errorLocation` | `default, top, bottom` | `"default"` | Specifies the error message position. |
| `indent` | `0, 1, 2, 3` | `0` | Increases or decreases an indent of survey element content from the left edge. |
| `state` | `default, collapsed, expanded` | `"default"` | Gets and sets the survey element's expand state. |
| `titleLocation` | `default, top, bottom, left, hidden` | `"default"` | Sets question title location relative to the input field. |
| `commentPlaceholder` *(loc)* | `string` |  | A placeholder for the comment area. |
| `commentText` *(loc)* | `string` |  | Specifies a caption displayed above the comment area. |
| `correctAnswer` | `string` |  | A correct answer to this question. |
| `defaultDisplayValue` *(loc)* | `string` |  | A value to show in HTML questions and in the dynamic titles and descriptions of survey elements when the question value is empty. |
| `defaultValue` | `string` |  | A default value for the question. |
| `description` *(loc)* | `string` |  | Explanatory text displayed under the title. |
| `isRequired` | `boolean` |  | Makes the question required. |
| `maxWidth` | `string` | `"100%"` | Gets or sets maximum survey element width in CSS values. |
| `minWidth` | `string` | `"300px"` | Gets or sets minimum survey element width in CSS values. |
| `readOnly` | `boolean` |  | Makes the survey element read-only. |
| `requiredErrorText` *(loc)* | `string` |  | Specifies a custom error message for a required form field. |
| `showNumber` | `boolean` | `true` | Specifies whether to show a number for this question. |
| `startWithNewLine` | `boolean` | `true` | Disable this property if you want to render the current question on the same line or row with the previous question or panel. |
| `title` *(loc)* | `string` |  | A title for the survey element. |
| `useDisplayValuesInDynamicTexts` | `boolean` | `true` | Specifies whether to use display names for question values in placeholders. |
| `validators` | `array` |  | Question validators. |
| `valueName` | `string` |  | Specifies an object property that should store the question value. |
| `visible` | `boolean` | `true` | Gets or sets question visibility. |
| `width` | `string` |  | Sets survey element width in CSS values. |
| `bindings` | `string` |  |  |

### `selectbase`

A base class for multiple-choice question types (Checkboxes, Dropdown, Radio Button Group, etc.). Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `choices` | `array` of `choiceitem` | `[]` | Gets or sets choice items. |
| `choicesByUrl` | `choicesByUrl` |  | Configures access to a RESTful service that returns choice items. |
| `choicesEnableIf` | `expression` |  | A Boolean expression that is evaluated against each choice item. |
| `choicesVisibleIf` | `expression` |  | A Boolean expression that is evaluated against each choice item. |
| `choicesFromQuestionMode` | `all, selected, unselected` | `"all"` | Specifies which choice items to copy from another question. |
| `choicesOrder` | `none, asc, desc, random` | `"none"` | Specifies the sort order of choice items. |
| `choicesFromQuestion` | `string` |  | Copies choice items from a specified question. |
| `choiceTextsFromQuestion` | `string` |  | Specifies which matrix column or dynamic panel question supplies choice texts. |
| `choiceValuesFromQuestion` | `string` |  | Specifies which matrix column or dynamic panel question supplies choice values. |
| `dontKnowText` *(loc)* | `string` |  | Gets or sets a caption for the "Don't know" choice item. |
| `hideIfChoicesEmpty` | `boolean` |  | Specifies whether to hide the question if no choice items are visible. |
| `noneText` *(loc)* | `string` |  | Gets or sets a caption for the "None" choice item. |
| `otherErrorText` *(loc)* | `string` |  | Gets or sets an error message displayed when users select the "Other" choice item but leave the comment area empty. |
| `otherPlaceholder` *(loc)* | `string` |  | A placeholder for the comment area. |
| `otherText` *(loc)* | `string` |  | Gets or sets a caption for the "Other" choice item. |
| `refuseText` *(loc)* | `string` |  | Gets or sets a caption for the "Refuse to answer" choice item. |
| `showNoneItem` | `boolean` |  | Specifies whether to display the "None" choice item. |
| `showOtherItem` | `boolean` |  | Specifies whether to display the "Other" choice item. |

### `textbase`

A base class for the Single-Line Input and Long Text question types. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questiontextbase.md)

## Question types

These are the only `type` values that exist: `boolean`, `checkbox`, `comment`, `dropdown`, `expression`, `file`, `html`, `image`, `imagepicker`, `matrix`, `matrixdropdown`, `matrixdynamic`, `multipletext`, `panel`, `paneldynamic`, `radiogroup`, `ranking`, `rating`, `signaturepad`, `slider`, `tagbox`, `text`. Each section lists only the properties that type adds on top of the shared ones above.

### `boolean`

A class that describes the Yes/No (Boolean) question type. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionbooleanmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-boolean/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `labelFalse` *(loc)* | `string` |  | Gets or sets a text label that corresponds to a negative answer. |
| `labelTrue` *(loc)* | `string` |  | Gets or sets a text label that corresponds to a positive answer. |
| `swapOrder` | `boolean` |  | Specifies whether to swap the order of the Yes and No answers. |
| `valueFalse` | `string` |  | A value to save in survey results when respondents give a negative answer. |
| `valueTrue` | `string` |  | A value to save in survey results when respondents give a positive answer. |

```json
{
  "type": "boolean",
  "name": "question1",
  "title": "Question title"
}
```

### `checkbox`

A class that describes the Checkboxes question type. Inherits the properties of `checkboxbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-checkbox/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `maxSelectedChoices` | `number` | `0` | Specifies the maximum number of selected choices. |
| `minSelectedChoices` | `number` | `0` | Specifies the minimum number of selected choices. |
| `selectAllText` *(loc)* | `string` |  | Gets or sets a caption for the "Select All" choice item. |
| `showSelectAllItem` | `boolean` |  | Enable this property to display a "Select All" item. |
| `valuePropertyName` | `string` |  | Specifies a property name used to store selected values. |

```json
{
  "type": "checkbox",
  "name": "question1",
  "title": "Question title",
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### `comment`

A class that describes the Long Text question type. Inherits the properties of `textbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questioncommentmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-comment/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `textUpdateMode` | `default, onBlur, onTyping` | `"default"` | Specifies when to update the question value. |
| `allowResize` | `boolean` |  | Specifies whether to display a resize handle for the comment area. |
| `autoGrow` | `boolean` |  | Specifies whether the comment area automatically increases its height to accomodate multi-line content. |
| `maxLength` | `number` | `-1` | The maximum text length measured in characters. |
| `placeholder` *(loc)* | `string` |  | A placeholder for the input field. |
| `rows` | `number` | `4` | Specifies the visible height of the comment area, measured in lines. |

```json
{
  "type": "comment",
  "name": "question1",
  "title": "Question title"
}
```

### `dropdown`

A class that describes the Dropdown question type. Inherits the properties of `selectbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questiondropdownmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-dropdown/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `autocomplete` | `name, honorific-prefix, given-name, additional-name, family-name, honorific-suffix, nickname, organization-title, username, new-password, current-password, organization, street-address, address-line1, address-line2, address-line3, address-level4, address-level3, address-level2, address-level1, country, country-name, postal-code, cc-name, cc-given-name, cc-additional-name, cc-family-name, cc-number, cc-exp, cc-exp-month, cc-exp-year, cc-csc, cc-type, transaction-currency, transaction-amount, language, bday, bday-day, bday-month, bday-year, sex, url, photo, tel, tel-country-code, tel-national, tel-area-code, tel-local, tel-local-prefix, tel-local-suffix, tel-extension, email, impp` |  |  |
| `searchMode` | `contains, startsWith` | `"contains"` | Specifies a comparison operation used to filter the drop-down list. |
| `allowClear` | `boolean` | `true` | Specifies whether to display a button that clears the selected value. |
| `allowCustomChoices` | `boolean` |  | Specifies whether users can add their own choices if the desired option isn't available in the dropdown. |
| `choicesMax` | `number` | `0` | Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. |
| `choicesMin` | `number` | `0` | Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. |
| `choicesStep` | `number` | `1` | Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. |
| `createCustomChoiceText` *(loc)* | `string` |  | Specifies the text displayed for the command that creates a custom choice. |
| `placeholder` *(loc)* | `string` |  | A placeholder for the input field. |
| `textWrapEnabled` | `boolean` | `true` | Specifies whether to wrap long texts in choice options onto a new line. |

```json
{
  "type": "dropdown",
  "name": "question1",
  "title": "Question title",
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### `expression`

A class that describes the Expression question type. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionexpressionmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-expression/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `expression` | `expression` |  | An expression used to calculate the question value. |
| `currency` | `AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BOV, BRL, BSD, BTN, BWP, BYN, BZD, CAD, CDF, CHE, CHF, CHW, CLF, CLP, CNY, COP, COU, CRC, CUC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EGP, ERN, ETB, EUR, FJD, FKP, GBP, GEL, GHS, GIP, GMD, GNF, GTQ, GYD, HKD, HNL, HRK, HTG, HUF, IDR, ILS, INR, IQD, IRR, ISK, JMD, JOD, JPY, KES, KGS, KHR, KMF, KPW, KRW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRO, MUR, MVR, MWK, MXN, MXV, MYR, MZN, NAD, NGN, NIO, NOK, NPR, NZD, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, RON, RSD, RUB, RWF, SAR, SBD, SCR, SDG, SEK, SGD, SHP, SLL, SOS, SRD, SSP, STD, SVC, SYP, SZL, THB, TJS, TMT, TND, TOP, TRY, TTD, TWD, TZS, UAH, UGX, USD, USN, UYI, UYU, UZS, VEF, VND, VUV, WST, XAF, XAG, XAU, XBA, XBB, XBC, XBD, XCD, XDR, XOF, XPD, XPF, XPT, XSU, XTS, XUA, XXX, YER, ZAR, ZMW, ZWL` | `"USD"` | A three-letter currency code. |
| `displayStyle` | `none, decimal, currency, percent, date` | `"none"` | Specifies a display style for the question value. |
| `format` *(loc)* | `string` |  | A string that formats a question value. |
| `maximumFractionDigits` | `number` | `-1` | The maximum number of fraction digits. |
| `minimumFractionDigits` | `number` | `-1` | The minimum number of fraction digits. |
| `precision` | `number` | `-1` | Specifies how many decimal digits to keep in the expression value. |
| `useGrouping` | `boolean` | `true` | Specifies whether to use grouping separators in number representation. |

```json
{
  "type": "expression",
  "name": "question1",
  "title": "Question title",
  "expression": "{q1} + 1"
}
```

### `file`

A class that describes the File Upload question type. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionfilemodel.md) · [Demo](https://surveyjs.io/form-library/examples/file-upload/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `acceptedCategories` | `image, video, audio, document, archive, custom` |  | An array of predefined file category names used to control which files users can upload. |
| `sourceType` | `file, camera, file-camera` | `"file"` | Specifies the source of uploaded files. |
| `acceptedTypes` | `string` |  | An `accept` attribute value for the underlying `<input>` element. |
| `allowImagesPreview` | `boolean` | `true` | Specifies whether to show a preview of image files. |
| `allowMultiple` | `boolean` |  | Specifies whether users can upload multiple files. |
| `fileOrPhotoPlaceholder` *(loc)* | `string` |  | A placeholder text displayed when the File Upload question doesn't contain any files or photos to upload. |
| `filePlaceholder` *(loc)* | `string` |  | A placeholder text displayed when the File Upload question doesn't contain any files to upload. |
| `imageHeight` | `string` |  | The height of the following images: - Images in the preview - Photos taken using the camera - Uploaded images in a generated PDF form > The sizes of previewed images are limited by the height and width of the preview area in single file upload mode or that of a thumbnail area in multiple file upload mode. |
| `imageWidth` | `string` |  | The width of the following images: - Images in the preview - Photos taken using the camera - Uploaded images in a generated PDF form > The sizes of previewed images are limited by the height and width of the preview area in single file upload mode or that of a thumbnail area in multiple file upload mode. |
| `maxFiles` | `number` | `1000` | Maximum number of files a user can upload. |
| `maxSize` | `number` | `0` | Maximum allowed file size, measured in bytes. |
| `needConfirmRemoveFile` | `boolean` |  | Specifies whether users should confirm file deletion. |
| `photoPlaceholder` *(loc)* | `string` |  | A placeholder text displayed when the File Upload question doesn't contain any photos to upload. |
| `storeDataAsText` | `boolean` | `true` | Specifies whether to store file or signature content as text in `SurveyModel`'s `data` property. |
| `waitForUpload` | `boolean` | `false` | Enable this property if you want to wait until files are uploaded to complete the survey. |

```json
{
  "type": "file",
  "name": "question1",
  "title": "Question title"
}
```

### `html`

A class that describes the HTML question type. Inherits the properties of `nonvalue`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionhtmlmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-html/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `html` *(loc)* | `string` |  | HTML markup to display. |

```json
{
  "type": "html",
  "name": "html1",
  "title": "Question title",
  "html": "<p>Some text</p>"
}
```

### `image`

A class that describes the Image question type. Inherits the properties of `nonvalue`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionimagemodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-image/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `contentMode` | `auto, image, video, youtube` | `"auto"` | Specifies the type of content that the Image question displays. |
| `imageFit` | `none, contain, cover, fill` | `"contain"` | Specifies how to resize the image or video to fit it into its container. |
| `altText` *(loc)* | `string` |  | Specifies a value for the `alt` attribute of the underlying `<img>` element. |
| `imageHeight` | `string` | `"150"` | Specifies the height of a container for the image or video. |
| `imageLink` *(loc)* | `string` |  | Specifies an image or video URL. |
| `imageWidth` | `string` | `"200"` | Specifies the width of a container for the image or video. |

```json
{
  "type": "image",
  "name": "image1",
  "title": "Question title",
  "imageLink": "https://surveyjs.io/logo.png"
}
```

### `imagepicker`

A class that describes the Image Picker question type. Inherits the properties of `checkboxbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionimagepickermodel.md) · [Demo](https://surveyjs.io/form-library/examples/image-picker-question/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `contentMode` | `image, video` | `"image"` | Specifies the type of content that choice items display. |
| `imageFit` | `none, contain, cover, fill` | `"contain"` | Specifies how to resize images or videos to fit them into their containers. |
| `imageHeight` | `number` |  | Specifies the height of containers for images or videos. |
| `imageWidth` | `number` |  | Specifies the width of containers for images or videos. |
| `maxImageHeight` | `string` | `3000` | Specifies a maximum height for image or video containers. |
| `maxImageWidth` | `string` | `3000` | Specifies a maximum width for image or video containers. |
| `minImageHeight` | `string` | `133` | Specifies a minimum height for image or video containers. |
| `minImageWidth` | `string` | `200` | Specifies a minimum width for image or video containers. |
| `multiSelect` | `boolean` |  | Specifies whether users can select multiple images or videos. |
| `showLabel` | `boolean` |  | Specifies whether to display labels under images or videos. |

```json
{
  "type": "imagepicker",
  "name": "question1",
  "title": "Question title",
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### `matrix`

A class that describes the Single-Select Matrix question type. Inherits the properties of `matrixbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixmodel.md) · [Demo](https://surveyjs.io/form-library/examples/single-selection-matrix-table-question/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `array` of `matrixcolumn` | `[]` | An array of matrix columns. |
| `rows` | `array` of `itemvalue` | `[]` | An array of matrix rows. |
| `cellType` | `radio, checkbox` | `"radio"` | Specifies the type of matrix cells. |
| `rowOrder` | `initial, random` | `"initial"` | Specifies a sort order for matrix rows. |
| `cells` | `string` |  | An array of matrix cells. |
| `eachRowRequired` | `boolean` |  | Specifies whether each row requires an answer. |
| `eachRowUnique` | `boolean` |  | Specifies whether answers in all rows should be unique. |
| `hideIfRowsEmpty` | `boolean` |  | Specifies whether to hide the question when the matrix has no visible rows. |
| `rowTitleWidth` | `string` |  | A width for the column that displays row titles (first column). |

```json
{
  "type": "matrix",
  "name": "question1",
  "title": "Question title",
  "columns": [
    {
      "name": "col1"
    }
  ],
  "rows": [
    "Row 1"
  ]
}
```

### `matrixdropdown`

A class that describes the Multi-Select Matrix question type. Inherits the properties of `matrixdropdownbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdropdownmodel.md) · [Demo](https://surveyjs.io/form-library/documentation/questiondropdownmodel)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `array` of `itemvalue` | `[]` | An array of matrix rows. |
| `rowOrder` | `initial, random` | `"initial"` | Specifies a sort order for matrix rows. |
| `hideIfRowsEmpty` | `boolean` |  | Specifies whether to hide the question when the matrix has no visible rows. |
| `rowTitleWidth` | `string` |  | A width for the column that displays row titles (first column). |
| `totalText` *(loc)* | `string` |  | A title for the total row. |

```json
{
  "type": "matrixdropdown",
  "name": "question1",
  "title": "Question title",
  "columns": [
    {
      "name": "col1"
    }
  ],
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ],
  "rows": [
    "Row 1"
  ]
}
```

### `matrixdynamic`

A class that describes the Dynamic Matrix question type. Inherits the properties of `matrixdropdownbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionmatrixdynamicmodel.md) · [Demo](https://surveyjs.io/form-library/documentation/questiondropdownmodel)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `addRowButtonLocation` | `default, top, bottom, topBottom` | `"default"` | Specifies the location of the Add Row button. |
| `addRowText` *(loc)* | `string` |  | A caption for the Add Row button. |
| `allowAddRows` | `boolean` | `true` | Specifies whether users are allowed to add new rows. |
| `allowRemoveRows` | `boolean` | `true` | Specifies whether users are allowed to delete rows. |
| `allowRowReorder` | `boolean` |  | Specifies whether users can drag and drop matrix rows to reorder them. |
| `confirmDelete` | `boolean` |  | Specifies whether to display a confirmation dialog when a respondent wants to delete a row. |
| `confirmDeleteText` *(loc)* | `string` |  | A message displayed in a confirmation dialog that appears when a respondent wants to delete a row. |
| `copyDefaultValueFromLastEntry` | `boolean` |  | Specifies whether default values for a new row/column should be copied from the last row/column. |
| `defaultRowValue` | `string` |  | If it is not empty, then this value is set to every new row, including rows created initially, unless the defaultValue is not empty |
| `detailPanelShowOnAdding` | `boolean` |  | Specifies whether to expand the detail section immediately when a respondent adds a new row. |
| `hideColumnsIfEmpty` | `boolean` |  | Specifies whether to hide columns when the matrix does not contain any rows. |
| `keyName` | `string` |  | Specifies a key column. |
| `maxRowCount` | `number` | `1000` | A maximum number of rows in the matrix. |
| `minRowCount` | `number` | `0` | A minimum number of rows in the matrix. |
| `noRowsText` *(loc)* | `string` |  | A message displayed when the matrix does not contain any rows. |
| `removeRowText` *(loc)* | `string` |  | Use this property to change the default value of remove row button text. |
| `rowCount` | `number` | `2` | The number of rows in the matrix. |

```json
{
  "type": "matrixdynamic",
  "name": "question1",
  "title": "Question title",
  "columns": [
    {
      "name": "col1",
      "cellType": "text"
    }
  ],
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### `multipletext`

A class that describes the Multiple Text question type. Inherits the properties of `question`. Required: `items`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionmultipletextmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-multipletext/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `array` of `multipletextitem` |  | Gets or sets an array of `MultipleTextItemModel` objects that represent input items. |
| `colCount` | `1, 2, 3, 4, 5` | `1` | The number of columns used to arrange input items. |
| `itemTitleWidth` | `string` |  | Specifies a uniform width for all text box titles. |

```json
{
  "type": "multipletext",
  "name": "question1",
  "title": "Question title",
  "items": [
    {
      "name": "item1"
    },
    {
      "name": "item2"
    }
  ]
}
```

### `panel`

A class that describes the Panel container element. Inherits the properties of `panelbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/panelmodel.md) · [Demo](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `innerIndent` | `0, 1, 2, 3` | `0` | Increases or decreases an indent of panel content from the left edge. |
| `showQuestionNumbers` | `default, onpanel, recursive, off` | `"default"` | Specifies whether to display survey element numbers within this page/panel and how to calculate them. |
| `state` | `default, collapsed, expanded` | `"default"` | Gets and sets the survey element's expand state. |
| `isRequired` | `boolean` |  | Makes the panel/page require an answer at least in one nested question. |
| `maxWidth` | `string` | `"100%"` | Gets or sets maximum survey element width in CSS values. |
| `minWidth` | `string` | `"auto"` | Gets or sets minimum survey element width in CSS values. |
| `questionStartIndex` | `string` |  | Specifies a number or letter used to start numbering of elements inside this page/panel. |
| `requiredErrorText` *(loc)* | `string` |  | Specifies a custom error message for a required panel/page. |
| `showNumber` | `boolean` |  | Specifies whether to show the panel number in the title. |
| `startWithNewLine` | `boolean` | `true` | Disable this property if you want to render the current panel on the same line or row with the previous question or panel. |
| `width` | `string` |  | Sets survey element width in CSS values. |

```json
{
  "type": "panel",
  "name": "question1",
  "title": "Question title"
}
```

### `paneldynamic`

A class that describes the Dynamic Panel question type. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionpaneldynamicmodel.md) · [Demo](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel#templateElements)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `templateVisibleIf` | `expression` |  | A Boolean expression that is evaluated against each panel. |
| `displayMode` | `list, carousel, tab` | `"list"` | Specifies how to display panels. |
| `newPanelPosition` | `next, last` | `"last"` | Specifies the position of newly added panels. |
| `panelCount` | `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10` | `0` | The number of panels in Dynamic Panel. |
| `panelsState` | `default, collapsed, expanded, firstExpanded` | `"default"` | Specifies whether users can expand and collapse panels. |
| `progressBarLocation` | `top, bottom, topBottom` | `"top"` | Specifies the alignment of the progress bar relative to the currently displayed panel. |
| `removePanelButtonLocation` | `bottom, right` | `"bottom"` | Specifies the location of the Remove Panel button relative to panel content. |
| `showQuestionNumbers` | `default, onpanel, recursive, off` | `"off"` | Specifies whether to display survey element numbers within the dynamic panel and how to calculate them. |
| `tabAlign` | `left, center, right` | `"center"` |  |
| `templateErrorLocation` | `default, top, bottom` | `"default"` | Specifies the error message position. |
| `templateQuestionTitleLocation` | `default, top, bottom, left` | `"default"` | Gets or sets the location of question titles relative to their input fields. |
| `addPanelText` *(loc)* | `string` |  | A caption for the Add Panel button. |
| `allowAddPanel` | `boolean` | `true` | Specifies whether users are allowed to add new panels. |
| `allowRemovePanel` | `boolean` | `true` | Specifies whether users are allowed to delete panels. |
| `confirmDelete` | `boolean` |  | Specifies whether to display a confirmation dialog when a respondent wants to delete a panel. |
| `confirmDeleteText` *(loc)* | `string` |  | A message displayed in a confirmation dialog that appears when a respondent wants to delete a panel. |
| `copyDefaultValueFromLastEntry` | `boolean` |  | Specifies whether default values for a new panel should be copied from the last panel. |
| `defaultPanelValue` | `string` |  | If it is not empty, then this value is set to every new panel, including panels created initially, unless the defaultValue is not empty |
| `keyDuplicationError` *(loc)* | `string` |  | An error message displayed when users enter a duplicate value into a question that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified). |
| `keyName` | `string` |  | Specifies a key question. |
| `maxPanelCount` | `number` | `100` | A maximum number of panels in Dynamic Panel. |
| `minPanelCount` | `number` | `0` | A minimum number of panels in Dynamic Panel. |
| `nextPanelText` *(loc)* | `string` |  | A caption for the Next button. |
| `noEntriesText` *(loc)* | `string` |  | A text displayed when Dynamic Panel contains no entries. |
| `prevPanelText` *(loc)* | `string` |  | A caption for the Previous button. |
| `questionStartIndex` | `string` |  | Specifies a number or letter used to start numbering of elements inside the dynamic panel. |
| `removePanelText` *(loc)* | `string` |  | A caption for the Remove Panel button. |
| `showProgressBar` | `boolean` | `true` | Specifies whether to display the progress bar. |
| `tabTitlePlaceholder` *(loc)* | `string` |  | A placeholder for tab titles that applies when the `templateTabTitle` expression doesn't produce a meaningful value. |
| `templateDescription` *(loc)* | `string` |  | A template for panel descriptions. |
| `templateQuestionTitleWidth` | `string` |  | Sets consistent width for question titles in CSS values. |
| `templateTabTitle` *(loc)* | `string` |  | A template for tab titles. |
| `templateTitle` *(loc)* | `string` |  | A template for panel titles. |

```json
{
  "type": "paneldynamic",
  "name": "question1",
  "title": "Question title",
  "templateElements": [
    {
      "type": "text",
      "name": "nestedQuestion"
    }
  ]
}
```

### `radiogroup`

A class that describes the Radio Button Group question type. Inherits the properties of `checkboxbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionradiogroupmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-radiogroup/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `allowClear` | `boolean` |  | Specifies whether to display a button that clears the question value. |

```json
{
  "type": "radiogroup",
  "name": "question1",
  "title": "Question title",
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### `ranking`

A class that describes the Ranking question type. Inherits the properties of `checkbox`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionrankingmodel.md) · [Demo](https://surveyjs.io/form-library/examples/questiontype-ranking/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `selectToRankAreasLayout` | `horizontal, vertical` | `"horizontal"` | Specifies the layout of the ranked and unranked areas. |
| `selectToRankEmptyRankedAreaText` *(loc)* | `string` |  | A placeholder displayed in the area for ranked choices. |
| `selectToRankEmptyUnrankedAreaText` *(loc)* | `string` |  | A placeholder displayed in the area for unranked choices. |
| `selectToRankEnabled` | `boolean` | `false` | Specifies whether users can select choices they want to rank. |

```json
{
  "type": "ranking",
  "name": "question1",
  "title": "Question title",
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### `rating`

A class that describes the Rating Scale question type. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionratingmodel.md) · [Demo](https://surveyjs.io/form-library/examples/rating-scale/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `rateValues` | `array` of `ratingitem` | `[]` | A list of rate values. |
| `autoGenerate` | `true, false` | `true` |  |
| `displayMode` | `auto, buttons, dropdown` | `"auto"` | Specifies whether to display rate values as buttons or items in a drop-down list. |
| `rateColorMode` | `default, scale` | `"scale"` | Specifies how to colorize the selected emoji. |
| `rateDescriptionLocation` | `leftRight, top, bottom, topBottom` | `"leftRight"` | Specifies the alignment of `minRateDescription` and `maxRateDescription` texts. |
| `rateType` | `labels, stars, smileys` | `"labels"` | Specifies the visual representation of rate values. |
| `scaleColorMode` | `monochrome, colored` | `"monochrome"` | Specifies how to colorize the smiley face rating scale. |
| `displayRateDescriptionsAsExtremeItems` | `boolean` | `false` | Specifies whether to display `minRateDescription` and `maxRateDescription` values as captions for buttons that correspond to the extreme (first and last) rate values. |
| `maxRateDescription` *(loc)* | `string` |  | Specifies a description for the maximum (last) rate value. |
| `minRateDescription` *(loc)* | `string` |  | Specifies a description for the minimum (first) rate value. |
| `rateCount` | `number` | `5` | Specifies the number of rate values you want to generate. |
| `rateMax` | `number` | `5` | Specifies the last rate value in the generated sequence of rate values. |
| `rateMin` | `number` | `1` | Specifies the first rate value in the generated sequence of rate values. |
| `rateStep` | `number` | `1` | Specifies a step with which to generate rate values. |

```json
{
  "type": "rating",
  "name": "question1",
  "title": "Question title"
}
```

### `signaturepad`

A class that describes the Signature question type. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionsignaturepadmodel.md) · [Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `dataFormat` | `png, jpeg, svg` | `"png"` | Specifies the format in which to store the signature image. |
| `allowClear` | `boolean` | `true` | Specifies whether to display a button that clears the signature area. |
| `backgroundColor` | `string` |  | Specifies a color for the signature area background. |
| `backgroundImage` | `string` |  | An image to display in the background of the signature area. |
| `penColor` | `string` |  | Specifies a color for the pen. |
| `penMaxWidth` | `number` | `2.5` | Speicifies the maximum width of pen strokes, measured in pixels. |
| `penMinWidth` | `number` | `0.5` | Speicifies the minimum width of pen strokes, measured in pixels. |
| `placeholder` *(loc)* | `string` |  | A placeholder text for the signature area. |
| `placeholderReadOnly` *(loc)* | `string` |  | A placeholder text for the signature area in read-only or preview mode. |
| `showPlaceholder` | `boolean` | `true` | A Boolean value that specifies whether to show the placeholder text in the signature area. |
| `signatureAutoScaleEnabled` | `boolean` | `false` | Specifies whether the signature area should be scaled to fit into the question width. |
| `signatureHeight` | `number` | `200` | Specifies the height of the signature area. |
| `signatureWidth` | `number` | `300` | Specifies the width of the signature area. |
| `storeDataAsText` | `boolean` | `true` | Specifies whether to store file or signature content as text in `SurveyModel`'s `data` property. |
| `waitForUpload` | `boolean` | `false` | Enable this property if you want to wait until files are uploaded to complete the survey. |

```json
{
  "type": "signaturepad",
  "name": "question1",
  "title": "Question title"
}
```

### `slider`

A class that describes the Slider question type. Inherits the properties of `question`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel.md) · [Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `customLabels` | `array` of `sliderlabel` | `[]` | Specifies custom scale labels. |
| `maxValueExpression` | `expression` |  | An expression that dynamically calculates the maximum scale value. |
| `minValueExpression` | `expression` |  | An expression that dynamically calculates the minimum scale value. |
| `sliderType` | `single, range` | `"single"` | Specifies whether the slider allows selecting a single value (`"single"`) or a value range (`"range"`). |
| `tooltipVisibility` | `auto, always, never` | `"auto"` | Controls the visibility of thumb tooltips. |
| `allowClear` | `boolean` | `false` | Specifies whether to display a button that clears the selected slider value and resets it to `undefined`. |
| `allowSwap` | `boolean` | `true` | Allows the start and end thumbs to cross over each other. |
| `labelCount` | `number` | `-1` | Defines how many auto-generated labels should be displayed along the slider scale. |
| `labelFormat` | `string` | `"{0}"` | A formatting string for auto-generated or custom labels. |
| `max` | `number` | `100` | Defines the maximum value on the slider scale. |
| `maxRangeLength` | `number` |  | Specifies the maximum length between the two thumbs of a range slider. |
| `min` | `number` | `0` | Defines the minimum value on the slider scale. |
| `minRangeLength` | `number` |  | Specifies the minimum length between the two thumbs of a range slider. |
| `showLabels` | `boolean` | `true` | Specifies whether the slider displays value labels along the scale. |
| `step` | `number` | `1` | Sets the interval between selectable scale values. |
| `tooltipFormat` | `string` | `"{0}"` | A formatting string for thumb tooltips. |

```json
{
  "type": "slider",
  "name": "question1",
  "title": "Question title"
}
```

### `tagbox`

A class that describes the Multi-Select Dropdown (Tag Box) question type. Inherits the properties of `checkbox`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questiontagboxmodel.md) · [Demo](https://surveyjs.io/form-library/examples/how-to-create-multiselect-tag-box/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `searchMode` | `contains, startsWith` | `"contains"` | Specifies a comparison operation used to filter the drop-down list. |
| `allowClear` | `boolean` | `true` | Specifies whether to display a button that clears the selected value. |
| `allowCustomChoices` | `boolean` | `false` | Specifies whether users can add their own choices if the desired option isn't available in the dropdown. |
| `closeOnSelect` | `boolean` |  | Specifies whether to close the drop-down menu after a user selects a value. |
| `hideSelectedItems` | `boolean` | `false` | Specifies whether to remove selected items from the drop-down list. |
| `placeholder` *(loc)* | `string` |  | A text displayed in the input field when it doesn't have a value. |
| `searchEnabled` | `boolean` | `true` | Specifies whether users can enter a value into the input field to filter the drop-down list. |
| `createCustomChoiceText` *(loc)* | `string` |  |  |
| `textWrapEnabled` | `boolean` | `true` |  |

```json
{
  "type": "tagbox",
  "name": "question1",
  "title": "Question title",
  "choices": [
    "Item 1",
    "Item 2",
    "Item 3"
  ]
}
```

### `text`

A class that describes the Single-Line Input question type, which is used to create textual, numeric, date-time, and color input fields. Inherits the properties of `textbase`.

[API](https://surveyjs.io/form-library/documentation/api-reference/questiontextmodel.md) · [Demo](https://surveyjs.io/form-library/examples/text-entry-question/)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `maskSettings` | `masksettings` |  | An object with properties that configure the mask applied to the input. |
| `maxValueExpression` | `expression` |  | The maximum value specified as an expression. |
| `minValueExpression` | `expression` |  | The minimum value specified as an expression. |
| `autocomplete` | `name, honorific-prefix, given-name, additional-name, family-name, honorific-suffix, nickname, organization-title, username, new-password, current-password, organization, street-address, address-line1, address-line2, address-line3, address-level4, address-level3, address-level2, address-level1, country, country-name, postal-code, cc-name, cc-given-name, cc-additional-name, cc-family-name, cc-number, cc-exp, cc-exp-month, cc-exp-year, cc-csc, cc-type, transaction-currency, transaction-amount, language, bday, bday-day, bday-month, bday-year, sex, url, photo, tel, tel-country-code, tel-national, tel-area-code, tel-local, tel-local-prefix, tel-local-suffix, tel-extension, email, impp` |  | A value passed on to the `autocomplete` attribute of the underlying `<input>` element. |
| `inputTextAlignment` | `left, right, auto` | `"auto"` | Specifies text alignment within the input field. |
| `inputType` | `color, date, datetime-local, email, month, number, password, range, tel, text, time, url, week` | `"text"` | A value passed on to the `type` attribute of the underlying `<input>` element. |
| `maskType` | `none, pattern, datetime, numeric, currency` | `"none"` | Specifies the type of a mask applied to the input. |
| `textUpdateMode` | `default, onBlur, onTyping` | `"default"` | Specifies when to update the question value. |
| `dataList` *(loc)* | `string` |  | An array of predefined options from which users can select. |
| `inputSize` | `number` |  | A value passed on to the `size` attribute of the underlying `<input>` element. |
| `max` | `string` |  | A value passed on to the `max` attribute of the underlying `<input>` element. |
| `maxErrorText` *(loc)* | `string` |  | An error message to display when the entered value exceeds the maximum accepted value. |
| `maxLength` | `number` | `-1` | The maximum text length measured in characters. |
| `min` | `string` |  | A value passed on to the `min` attribute of the underlying `<input>` element. |
| `minErrorText` *(loc)* | `string` |  | An error message to display when the entered value is less than the minimum accepted value. |
| `placeholder` *(loc)* | `string` |  | A placeholder for the input field. |
| `step` | `number` |  | A value passed on to the `step` attribute of the underlying `<input>` element. |
| `stepErrorText` *(loc)* | `string` |  | An error message to display when the entered value does not match the step size. |

```json
{
  "type": "text",
  "name": "question1",
  "title": "Question title"
}
```

## Choices

A choice may be a plain string, which is used as both the stored value and the visible text. Use the object form when the two differ, or when an item needs its own `visibleIf`/`enableIf`. Mixing the two forms in one list is allowed.
**Choices as strings (shorthand)**

```json
{
  "type": "radiogroup",
  "name": "color",
  "title": "Pick a color",
  "choices": [
    "Red",
    "Green",
    "Blue"
  ]
}
```

**Choices as objects (value differs from text)**

```json
{
  "type": "dropdown",
  "name": "country",
  "title": "Country",
  "choices": [
    {
      "value": "us",
      "text": "United States"
    },
    {
      "value": "de",
      "text": "Germany"
    }
  ]
}
```

## Localizable strings

A property marked *(loc)* in the tables below is localizable: it accepts either a plain string or an object keyed by locale, `{ "default": "Your name", "de": "Ihr Name" }`. Prefer the plain string unless the request actually asks for more than one language.

## Expressions

`visibleIf`, `enableIf`, `requiredIf`, `setValueIf`, a trigger's `expression` and an `expression` question all take an expression.

Write a question's value as its name in braces: `{age}`. String literals are quoted: `{country} = 'us'`. The expression as a whole is **not** wrapped in braces -- `{age} > 18 and {country} notempty` is right, `{{age} > 18}` is not. Inside a dynamic panel use `{panel.question}` and inside a matrix `{row.column}` to reach a sibling.

**Operators.** `!=` (or `notequal`, `<>`), `%`, `*`, `+`, `-`, `/`, `<` (or `less`), `<=` (or `lessorequal`), `==` (or `equal`, `=`), `>` (or `greater`), `>=` (or `greaterorequal`), `^` (or `power`), `allof`, `and`, `anyof`, `contains`, `empty`, `noneof`, `notcontains`, `notempty`, `or`.

**Functions.** `age()`, `avg()`, `avgInArray()`, `count()`, `countInArray()`, `currentDate()`, `currentYear()`, `dateAdd()`, `dateDiff()`, `day()`, `diffDays()`, `displayValue()`, `getComment()`, `getDate()`, `getYear()`, `iif()`, `isContainerReady()`, `isDisplayMode()`, `max()`, `maxInArray()`, `min()`, `minInArray()`, `month()`, `propertyValue()`, `round()`, `substring()`, `sum()`, `sumInArray()`, `today()`, `trunc()`, `weekday()`, `year()`.

## Triggers

A trigger sits in the survey's `triggers` array and fires when its `expression` becomes true. The `type` is the trigger name without the `trigger` suffix.

### `completetrigger`

Inherits the properties of `surveytrigger`.

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2"
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "complete",
      "expression": "{q1} = 'yes'"
    }
  ]
}
```

### `copyvaluetrigger`

Inherits the properties of `surveytrigger`. Required: `fromName`, `setToName`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `fromName` | `string` |  |  |
| `setToName` | `string` |  |  |

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2"
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "copyvalue",
      "expression": "{q1} = 'yes'",
      "fromName": "q1",
      "setToName": "q2"
    }
  ]
}
```

### `runexpressiontrigger`

Inherits the properties of `surveytrigger`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `runExpression` | `expression` |  |  |
| `setToName` | `string` |  |  |

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2"
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "runexpression",
      "expression": "{q1} = 'yes'",
      "setToName": "q2",
      "runExpression": "{q1} + 1"
    }
  ]
}
```

### `setvaluetrigger`

Inherits the properties of `surveytrigger`. Required: `setToName`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `setToName` | `string` |  |  |
| `setValue` | `string` |  |  |

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2"
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "setvalue",
      "expression": "{q1} = 'yes'",
      "setToName": "q2",
      "setValue": "ok"
    }
  ]
}
```

### `skiptrigger`

Inherits the properties of `surveytrigger`. Required: `gotoName`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `gotoName` | `string` |  |  |

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2"
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "skip",
      "expression": "{q1} = 'yes'",
      "gotoName": "q2"
    }
  ]
}
```

### `surveytrigger`

Inherits the properties of `trigger`.

### `trigger`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `expression` | `expression` |  |  |

### `visibletrigger`

Inherits the properties of `surveytrigger`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `pages` | `string` |  |  |
| `questions` | `string` |  |  |

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2"
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "visible",
      "expression": "{q1} = 'yes'"
    }
  ]
}
```

## Validators

A validator sits in a question's `validators` array. The `type` is the validator name without the `validator` suffix.

### `answercountvalidator`

A class that implements answer count validation in the question types that can have multiple values (for instance, Checkboxes). Inherits the properties of `surveyvalidator`.

[API](https://surveyjs.io/form-library/documentation/api-reference/answercountvalidator.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `maxCount` | `number` |  | A maximum number of selected answers. |
| `minCount` | `number` |  | A minimum number of selected answers. |

```json
{
  "type": "checkbox",
  "name": "q1",
  "validators": [
    {
      "type": "answercount",
      "minCount": 1,
      "maxCount": 3
    }
  ],
  "choices": [
    "Item 1",
    "Item 2"
  ]
}
```

### `emailvalidator`

A class that implements a validator for e-mail addresses. Inherits the properties of `surveyvalidator`.

[API](https://surveyjs.io/form-library/documentation/api-reference/emailvalidator.md)

```json
{
  "type": "text",
  "name": "q1",
  "validators": [
    {
      "type": "email"
    }
  ]
}
```

### `expressionvalidator`

A class that implements validation using expressions. Inherits the properties of `surveyvalidator`.

[API](https://surveyjs.io/form-library/documentation/api-reference/expressionvalidator.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `expression` | `expression` |  | A Boolean expression. |

```json
{
  "type": "text",
  "name": "q1",
  "validators": [
    {
      "type": "expression",
      "expression": "{q1} > 0"
    }
  ]
}
```

### `numericvalidator`

A class that implements a validator for numeric values. Inherits the properties of `surveyvalidator`.

[API](https://surveyjs.io/form-library/documentation/api-reference/numericvalidator.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `maxValue` | `number` |  | A maximum allowed numeric value. |
| `minValue` | `number` |  | A minimum allowed numeric value. |

```json
{
  "type": "text",
  "name": "q1",
  "validators": [
    {
      "type": "numeric",
      "minValue": 1,
      "maxValue": 10
    }
  ]
}
```

### `regexvalidator`

A class that implements validation using regular expressions. Inherits the properties of `surveyvalidator`.

[API](https://surveyjs.io/form-library/documentation/api-reference/regexvalidator.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `caseInsensitive` | `boolean` |  | Specifies whether uppercase and lowercase letters must be treated as distinct or equivalent when validating values. |
| `regex` | `string` |  | A regular expression used to validate values. |

```json
{
  "type": "text",
  "name": "q1",
  "validators": [
    {
      "type": "regex",
      "regex": "^[0-9]+$"
    }
  ]
}
```

### `surveyvalidator`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `notificationType` | `error, warning, info` | `"error"` |  |
| `text` *(loc)* | `string` |  |  |

### `textvalidator`

A class that implements a validator for text values. Inherits the properties of `surveyvalidator`.

[API](https://surveyjs.io/form-library/documentation/api-reference/textvalidator.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `allowDigits` | `boolean` | `true` | Specifies whether a text value can include numerical digits. |
| `maxLength` | `number` | `0` | The maximum length of a text value measured in characters. |
| `minLength` | `number` | `0` | The minimum length of a text value measured in characters. |

```json
{
  "type": "text",
  "name": "q1",
  "validators": [
    {
      "type": "text",
      "minLength": 2,
      "maxLength": 20
    }
  ]
}
```

## Nested objects

The objects that appear inside a question: choice items, matrix columns, and the like.

### `calculatedvalue`

Required: `name`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | Unique. |
| `expression` | `expression` |  |  |
| `includeIntoResult` | `boolean` |  |  |

### `checkboxitem`

Inherits the properties of `choiceitem`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `isExclusive` | `boolean` |  |  |

### `choiceitem`

Inherits the properties of `itemvalue`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `commentPlaceholder` *(loc)* | `string` |  |  |
| `isCommentRequired` | `boolean` |  |  |
| `showCommentArea` | `boolean` |  |  |

### `choicesByUrl`

Configures access to a RESTful service that returns choices for Checkbox, Dropdown, Radiogroup, and other multiple-choice question types.

[API](https://surveyjs.io/form-library/documentation/api-reference/choicesrestful.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `allowEmptyResponse` | `boolean` |  | Specifies whether the service is allowed to return an empty response or an empty array in a response. |
| `imageLinkName` | `string` |  | Specifies which property in the obtained data object contains image URLs. |
| `path` | `string` |  | Path to the array of choices. |
| `titleName` | `string` |  | Specifies which property in the obtained data object contains display texts for choices. |
| `url` | `string` |  | A RESTful service's URL. |
| `valueName` | `string` |  | Specifies which property in the obtained data object contains choice values. |

### `expressionitem`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `expression` | `expression` |  |  |

### `htmlconditionitem`

Inherits the properties of `expressionitem`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `html` *(loc)* | `string` |  |  |

### `imageitemvalue`

Inherits the properties of `itemvalue`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `imageLink` *(loc)* | `string` |  |  |

### `itemvalue`

Required: `value`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` |  | Unique. |
| `enableIf` | `expression` |  |  |
| `visibleIf` | `expression` |  |  |
| `text` *(loc)* | `string` |  |  |

### `masksettings`

A base class for classes that implement input masks: - `InputMaskNumeric` - `InputMaskCurrency` - `InputMaskDateTime` - `InputMaskPattern`

[API](https://surveyjs.io/form-library/documentation/api-reference/inputmaskbase.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `saveMaskedValue` | `boolean` |  | Specifies whether to store the question value with an applied mask in survey results. |

### `matrixcolumn`

Inherits the properties of `itemvalue`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `isExclusive` | `boolean` |  |  |

### `matrixdropdowncolumn`

An auxiliary class that describes a column in a Multi-Select Matrix or Dynamic Matrix. Required: `name`.

[API](https://surveyjs.io/form-library/documentation/api-reference/matrixdropdowncolumn.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | A column ID that is not visible to respondents. Unique. |
| `enableIf` | `expression` |  | A Boolean expression. |
| `requiredIf` | `expression` |  | A Boolean expression. |
| `resetValueIf` | `expression` |  | A Boolean expression. |
| `setValueExpression` | `expression` |  | An expression that calculates a value for all cells in this column. |
| `setValueIf` | `expression` |  | A Boolean expression. |
| `totalExpression` | `expression` |  | An expression used to calculate total values. |
| `visibleIf` | `expression` |  | A Boolean expression. |
| `cellType` | `default, dropdown, checkbox, radiogroup, tagbox, text, comment, boolean, expression, rating, slider` | `"default"` | Specifies the type of column cells. |
| `colCount` | `-1, 0, 1, 2, 3, 4` | `-1` | Gets or sets the number of columns used to arrange choice options. |
| `totalAlignment` | `auto, left, center, right` | `"auto"` | An alignment for calculated total values. |
| `totalCurrency` | `AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BOV, BRL, BSD, BTN, BWP, BYN, BZD, CAD, CDF, CHE, CHF, CHW, CLF, CLP, CNY, COP, COU, CRC, CUC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EGP, ERN, ETB, EUR, FJD, FKP, GBP, GEL, GHS, GIP, GMD, GNF, GTQ, GYD, HKD, HNL, HRK, HTG, HUF, IDR, ILS, INR, IQD, IRR, ISK, JMD, JOD, JPY, KES, KGS, KHR, KMF, KPW, KRW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRO, MUR, MVR, MWK, MXN, MXV, MYR, MZN, NAD, NGN, NIO, NOK, NPR, NZD, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, RON, RSD, RUB, RWF, SAR, SBD, SCR, SDG, SEK, SGD, SHP, SLL, SOS, SRD, SSP, STD, SVC, SYP, SZL, THB, TJS, TMT, TND, TOP, TRY, TTD, TWD, TZS, UAH, UGX, USD, USN, UYI, UYU, UZS, VEF, VND, VUV, WST, XAF, XAG, XAU, XBA, XBB, XBC, XBD, XCD, XDR, XOF, XPD, XPF, XPT, XSU, XTS, XUA, XXX, YER, ZAR, ZMW, ZWL` | `"USD"` | Specifies a currency used to display calculated total values. |
| `totalDisplayStyle` | `none, decimal, currency, percent` | `"none"` | A format for calculated total values. |
| `totalType` | `none, sum, count, min, max, avg` | `"none"` | An aggregation method used to calculate the column total. |
| `defaultDisplayValue` *(loc)* | `string` |  | A value to show in HTML questions and in the dynamic titles and descriptions of survey elements when the cell value is empty. |
| `isRequired` | `boolean` | `false` | Marks the column as required. |
| `isUnique` | `boolean` |  | Specifies whether a respondent is required to provide a unique response for each question within this column. |
| `minWidth` | `string` |  | Gets or sets minimum column width in CSS values. |
| `readOnly` | `boolean` |  | Makes the column read-only. |
| `requiredErrorText` *(loc)* | `string` |  | Specifies a custom error message for a required column. |
| `showInMultipleColumns` | `boolean` |  | Specifies whether to create an individual column for each choice option. |
| `title` *(loc)* | `string` |  | A user-friendly column caption to display. |
| `totalFormat` *(loc)* | `string` |  | A string pattern used to display column totals. |
| `validators` | `array` |  | Column validators. |
| `visible` | `boolean` | `true` | Gets or sets column visibility. |
| `width` | `string` |  | Gets or sets column width in CSS values. |
| `totalMaximumFractionDigits` | `number` | `-1` |  |
| `totalMinimumFractionDigits` | `number` | `-1` |  |

### `multipletextitem`

A class that describes an item in a Multiple Textboxes question. Required: `name`.

[API](https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel.md)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` |  | An item ID that is not visible to respondents. Unique. |
| `maskSettings` | `masksettings` |  | An object with properties that configure the mask applied to the input. |
| `defaultValueExpression` | `expression` |  | An expression used to calculate the default item value. |
| `maxValueExpression` | `expression` |  | An expression used to calculate the maximum item value. |
| `minValueExpression` | `expression` |  | An expression used to calculate the minimum item value. |
| `inputTextAlignment` | `left, right, auto` | `"auto"` | Specifies text alignment within the input field. |
| `inputType` | `color, date, datetime-local, email, month, number, password, range, tel, text, time, url, week` | `"text"` | A value passed on to the `type` attribute of the underlying `<input>` element. |
| `maskType` | `none, pattern, datetime, numeric, currency` | `"none"` | Specifies the type of a mask applied to the input. |
| `inputSize` | `number` |  | A value passed on to the `size` attribute of the underlying `<input>` element. |
| `isRequired` | `boolean` |  | Marks the item as required. |
| `maxLength` | `number` | `-1` | The maximum text length measured in characters. |
| `placeholder` *(loc)* | `string` |  | A placeholder for the input field. |
| `requiredErrorText` *(loc)* | `string` |  | Specifies a custom error message for a required item. |
| `title` *(loc)* | `string` |  | A user-friendly item label to display. |
| `validators` | `array` |  | Item validators. |

### `panellayoutcolumn`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `questionTitleWidth` | `string` |  |  |

### `ratingitem`

Inherits the properties of `itemvalue`.

### `sliderlabel`

Inherits the properties of `itemvalue`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `showValue` | `boolean` | `false` |  |

### `urlconditionitem`

Inherits the properties of `expressionitem`.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `url` *(loc)* | `string` |  |  |

## Composite structures

Nesting is where generated JSON most often goes wrong. A `paneldynamic` repeats its `templateElements` once per entry; a `matrixdynamic` repeats its `columns` once per row; a `matrixdropdown` crosses fixed `rows` with typed `columns`. Inside a dynamic panel a question refers to its siblings as `{panel.otherQuestion}`, and inside a matrix a column refers to its row as `{row.otherColumn}`.
**paneldynamic: a repeating group of questions**

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "paneldynamic",
          "name": "children",
          "title": "Children",
          "templateElements": [
            {
              "type": "text",
              "name": "childName",
              "title": "Name"
            },
            {
              "type": "text",
              "name": "childAge",
              "title": "Age",
              "inputType": "number"
            }
          ],
          "panelCount": 1
        }
      ]
    }
  ]
}
```

**matrixdynamic: rows the respondent adds**

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "employers",
          "title": "Employers",
          "columns": [
            {
              "name": "company",
              "title": "Company",
              "cellType": "text"
            },
            {
              "name": "years",
              "title": "Years",
              "cellType": "text",
              "inputType": "number"
            }
          ],
          "rowCount": 1
        }
      ]
    }
  ]
}
```

**matrixdropdown: fixed rows, typed columns**

```json
{
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "ratings",
          "title": "Rate each area",
          "columns": [
            {
              "name": "score",
              "cellType": "rating"
            }
          ],
          "rows": [
            {
              "value": "support",
              "text": "Support"
            },
            {
              "value": "docs",
              "text": "Documentation"
            }
          ]
        }
      ]
    }
  ]
}
```

## Rules

- The `type` of a question must be one of the types listed above. `radio`, `dropdownlist` and `multiselect` are **not** SurveyJS types; the equivalents are `radiogroup`, `dropdown` and `tagbox`.
- Every `name` in the document is unique, and an expression may only reference a name that exists.
- Leave out any property that would be set to its default value.
- Emit the JSON object on its own: no fences, no comments, no trailing commas.
- Never emit these legacy aliases -- the library still parses them, but they are not the property names: `addRowLocation`, `allowCompleteSurveyAutomatic`, `allowRowsDragAndDrop`, `attachOriginalItems`, `autoComplete`, `commentPlaceHolder`, `defaultValueFromLastPanel`, `defaultValueFromLastRow`, `emptyRowsText`, `firstPageIsStarted`, `focusFirstQuestionAutomatic`, `focusOnFirstError`, `goNextPageAutomatic`, `hasComment`, `hasNone`, `hasOther`, `hasSelectAll`, `insensitive`, `isAllRowRequired`, `itemSize`, `maxOthersLength`, `maxTimeToFinish`, `maxTimeToFinishPage`, `maximumRateDescription`, `mininumRateDescription`, `navigationButtonsVisibility`, `optionsCaption`, `otherPlaceHolder`, `panelAddText`, `panelNextText`, `panelPrevText`, `panelRemoveButtonLocation`, `panelRemoveText`, `placeHolder`, `questionsOrder`, `rateDisplayMode`, `requiredText`, `rowsOrder`, `sendResultOnPageNext`, `showClearButton`, `showCompletedPage`, `showOptionsCaption`, `showRangeInProgress`, `showTimerPanelMode`, `size`, `templateTitleLocation`, `useDisplayValuesInTitle`.

## Complete examples

**1. A simple form**

```json
{
  "title": "Contact us",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "fullName",
          "title": "Your name",
          "isRequired": true
        },
        {
          "type": "text",
          "name": "email",
          "title": "Email",
          "isRequired": true,
          "inputType": "email"
        },
        {
          "type": "comment",
          "name": "message",
          "title": "How can we help?"
        }
      ]
    }
  ]
}
```

**2. Multiple pages, a branch, and a trigger**

```json
{
  "title": "Net Promoter Score",
  "pages": [
    {
      "name": "score",
      "elements": [
        {
          "type": "rating",
          "name": "nps",
          "title": "How likely are you to recommend us?",
          "isRequired": true,
          "rateCount": 11,
          "rateMin": 0,
          "rateMax": 10
        }
      ]
    },
    {
      "name": "followUp",
      "elements": [
        {
          "type": "comment",
          "name": "reason",
          "visible": false,
          "visibleIf": "{nps} < 7",
          "title": "What went wrong?"
        }
      ]
    }
  ],
  "triggers": [
    {
      "type": "complete",
      "expression": "{nps} >= 9"
    }
  ]
}
```

**3. A matrix, a dynamic panel, and validators**

```json
{
  "title": "Team review",
  "pages": [
    {
      "name": "team",
      "elements": [
        {
          "type": "paneldynamic",
          "name": "members",
          "title": "Team members",
          "templateElements": [
            {
              "type": "text",
              "name": "memberName",
              "title": "Name",
              "isRequired": true
            },
            {
              "type": "text",
              "name": "memberEmail",
              "title": "Email",
              "validators": [
                {
                  "type": "email"
                }
              ]
            }
          ],
          "panelCount": 1
        }
      ]
    },
    {
      "name": "scores",
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "areas",
          "title": "Score each area",
          "columns": [
            {
              "name": "area",
              "cellType": "text",
              "isRequired": true
            },
            {
              "name": "score",
              "cellType": "text",
              "validators": [
                {
                  "type": "numeric",
                  "minValue": 1,
                  "maxValue": 5
                }
              ],
              "inputType": "number"
            }
          ],
          "rowCount": 1
        }
      ]
    }
  ]
}
```

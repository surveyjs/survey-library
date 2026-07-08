---
title: PopupSurveyModel
product: Form Library
api-type: class
description: A class that renders a survey in a pop-up window.
source: https://surveyjs.io/form-library/documentation/api-reference/popupsurveymodel
---

# `PopupSurveyModel`

A class that renders a survey in a pop-up window.

[View Demo](https://surveyjs.io/form-library/examples/popup-survey/ (linkStyle))

## Inheritance

`Base` &rarr; `PopupSurveyModel`

## Properties

### `allowClose`

Specifies whether to display a button that closes the pop-up window.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/popup-survey/ (linkStyle))

If you allow users to close the pop-up window, make sure to implement a UI element that opens it. This element should call the [`show()`](#show) method or enable the [`isShowing`](#isShowing) property.

**Type**: `boolean`

### `allowFullScreen`

Specifies whether to display a button that allows respondents to show the pop-up survey in full screen mode.

Default value: `false`

**Type**: `boolean`

### `closeOnCompleteTimeout`

Specifies how many seconds the pop-up window should remain open after users complete the survey.

Default value: 0 (the window is closed immediately)

Set this property to a negative value (for instance, -1) to keep the pop-up window open without a time limit.

[View Demo](https://surveyjs.io/form-library/examples/popup-survey/ (linkStyle))

**Type**: `number`

### `isExpanded`

Indicates whether the pop-up window is expanded or collapsed.

[View Demo](https://surveyjs.io/form-library/examples/popup-survey/ (linkStyle))

You can set this property to `true` or `false` to control the expand state of the pop-up survey. Alternatively, you can use the [`expand()`](#expand) and [`collapse()`](#collapse) methods.

**Type**: `boolean`

### `isShowing`

Indicates whether the pop-up survey appears on the page, regardless of its [expand state](#isExpanded).

You can set this property to `true` or `false` to control visibility of the pop-up survey. Alternatively, you can use the [`show()`](#show) and [`hide()`](#hide) methods.

**Type**: `boolean`

### `survey`

A [`SurveyModel`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model) instance rendered in the pop-up window.

**Type**: `SurveyModel`

### `title`

A title for the pop-up window. If this property is undefined, the title is taken from [`SurveyModel`](#survey)'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.

**Type**: `string`

## Methods

### `collapse()`

Collapses the pop-up window, leaving only the survey title visible.

As an alternative to this method, you can set the [`isExpanded`](#isExpanded) property to `false`.

### `expand()`

Expands the pop-up window.

As an alternative to this method, you can set the [`isExpanded`](#isExpanded) property to `true`.

### `hide()`

Hides the pop-up survey.

As an alternative to this method, you can set the [`isShowing`](#isShowing) property to `false`.

### `show()`

Shows the pop-up survey. The survey may appear [expanded or collapsed](#isExpanded).

As an alternative to this method, you can set the [`isShowing`](#isShowing) property to `true`.

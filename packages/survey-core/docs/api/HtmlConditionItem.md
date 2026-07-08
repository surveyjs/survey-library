---
title: HtmlConditionItem
product: Form Library
api-type: class
description: A class that contains expression and html propeties.
source: https://surveyjs.io/form-library/documentation/api-reference/htmlconditionitem
---

# `HtmlConditionItem`

A class that contains expression and html propeties. It uses in survey.completedHtmlOnCondition array.
If the expression returns true then html of this item uses instead of survey.completedHtml property

## Inheritance

`Base` &rarr; `ExpressionItem` &rarr; `HtmlConditionItem`

## Properties

### `html`

The html that shows on completed ('Thank you') page. The expression should return true

**Type**: `string`

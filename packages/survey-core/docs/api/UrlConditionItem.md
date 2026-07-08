---
title: UrlConditionItem
product: Form Library
api-type: class
description: A class that contains expression and url propeties.
source: https://surveyjs.io/form-library/documentation/api-reference/urlconditionitem
---

# `UrlConditionItem`

A class that contains expression and url propeties. It uses in survey.navigateToUrlOnCondition array.
If the expression returns true then url of this item uses instead of survey.navigateToUrl property

## Inheritance

`Base` &rarr; `ExpressionItem` &rarr; `UrlConditionItem`

## Properties

### `url`

The url that survey navigates to on completing the survey. The expression should return true

**Type**: `string`

---
title: QuestionRecordsModel
product: Form Library
api-type: class
description: A base class for questions whose answers contain collections of records.
source: https://surveyjs.io/form-library/documentation/api-reference/questionrecordsmodel
---

# `QuestionRecordsModel`

A base class for questions whose answers contain collections of records. Manages shared data, paging, and validation behavior.

Available since: v3.2.2

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionRecordsModel`

## Properties

### `allowSort`

**Type**: `boolean`

Specifies whether respondents can sort data in the UI.

Default value: `false`

Sorting in code is available regardless of this property's value.

In matrix questions, you can set an individual column's [`allowSort`](/form-library/documentation/api-reference/multi-select-matrix-column-values#allowSort) property to `false` to disable sorting by that column.

**Related APIs:** [`maxSortLevel`](#maxSortLevel), [`sortCriteria`](#sortCriteria), [`sort`](#sort)

### `maxSortLevel`

**Type**: `number`

Specifies the maximum number of fields respondents can add to a sort.

Default value: `1`

Each field defines a sorting level. Set this property to a value greater than 1 to enable sorting by multiple fields.

This limit applies only to respondent sorting. You can specify more fields in code using [`sortCriteria`](#sortCriteria) or the [`sort()`](#sort) method.

**Related APIs:** [`allowSort`](#allowSort)

### `pageCount`

**Type**: `number`

Gets the number of data pages used to display rows or panels. Returns 1 when the question is empty or pagination is disabled.

Available since: v3.2.2

**Related APIs:** [`pageSize`](#pageSize), [`pageIndex`](#pageIndex)

### `pageIndex`

**Type**: `number`

Gets or sets the zero-based index of the current data page containing rows or panels. Set this property to switch between data pages.

Available since: v3.2.2

**Related APIs:** [`pageSize`](#pageSize), [`pageCount`](#pageCount)

### `pageSize`

**Type**: `number`

Specifies the number of rows or panels per data page.

Default value: 0 (pagination is disabled)

The effective page size is limited by the [`settings.maxPageSize`](https://surveyjs.io/form-library/documentation/api-reference/settings#maxPageSize) property.

Available since: v3.2.2

**Related APIs:** [`pageIndex`](#pageIndex), [`pageCount`](#pageCount)

### `sortCriteria`

**Type**: `ISortCriterion[]`

Specifies the sort order used to display data.

Default value: `[]` (no sorting)

Each array item is an object with the following properties:

- `field` &ndash; The name of the field to sort by.
- `direction` &ndash; `"asc"` (default) for ascending order or `"desc"` for descending order.

Criteria are applied in array order. Each subsequent field sorts records with equal values in the preceding fields.

Assigning an array, adding or removing criteria, or changing an item's `field` or `direction` reapplies sorting. This property reflects the current sort, including changes made by respondents.

Sorting changes the display order while preserving the record order in the question's `value`.

**Related APIs:** [`sort`](#sort), [`clearSort`](#clearSort), [`allowSort`](#allowSort), [`maxSortLevel`](#maxSortLevel)

## Methods

### `clearSort()`

Clears all sorting criteria and displays data in the original order.

Equivalent to setting [`sortCriteria`](#sortCriteria) to an empty array.

**Related APIs:** [`sort`](#sort)

### `sort()`

Sorts data by the specified field or criteria.

Updates [`sortCriteria`](#sortCriteria) and applies sorting without validating the current data page. Available regardless of the [`allowSort`](#allowSort) and [`maxSortLevel`](#maxSortLevel) settings.

When an array of sorting criteria is passed, it replaces all existing criteria, and the `direction` and `append` parameters are ignored.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fieldOrCriteria` | `string \| ISortCriterion[]` | A field name or an array of objects with a `field` name and an optional `direction` (`"asc"` or `"desc"`). Criteria are applied in array order; the default direction is `"asc"`. |
| `direction` | `SortDirection` | The sort direction: `"asc"` (default) or `"desc"`. Applies when `fieldOrCriteria` is a field name. |
| `append` | `boolean` | Pass `true` to preserve existing criteria and add the field as the last sorting level. If the field is already present, its direction is updated in place. Defaults to `false`, which replaces all existing criteria. Applies when `fieldOrCriteria` is a field name. |

**Related APIs:** [`clearSort`](#clearSort)

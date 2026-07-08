---
title: IAction
product: Form Library
api-type: interface
description: An action item.
source: https://surveyjs.io/form-library/documentation/api-reference/iaction
---

# `IAction`

An action item.

Action items are used in the Toolbar, matrix rows, titles of pages, panels, questions, and other survey elements.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

## Properties

### `action`

**Type**: `(context?: any) => void`

A function that is executed when users click the action item.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

### `active`

**Type**: `boolean`

Specifies whether the action item is active.

Use this property as a flag to specify different action item appearances in different states.

### `component`

**Type**: `string`

Specifies the name of a component used to render the action item.

### `css`

**Type**: `string`

One or several CSS classes that you want to apply to the outer `<div>` element.

In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `css` property applies classes to the `<div>` element.

To apply several classes, separate them with a space character: `"myclass1 myclass2"`.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

### `data`

**Type**: `any`

The action item's data object. Use it to pass required data to a custom template or component.

### `disableShrink`

**Type**: `boolean`

Set this property to `true` if you want the item's `title` to be always visible.
If you set it to `false`, the `title` hides when the screen space is limited, and the item displays only the icon.

### `disableTabStop`

**Type**: `boolean`

Set this property to `true` if you want to disable keyboard navigation for the action item (sets the `tabIndex` attribute to -1).

### `enabled`

**Type**: `boolean | ComputedUpdater<boolean>`

Specifies whether users can interact with the action item.

### `iconName`

**Type**: `string`

The action item's icon name.

### `iconSize`

**Type**: `string | number`

The action item's icon size in pixels.

### `id`

**Type**: `string`

A unique action item identifier.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

### `innerCss`

**Type**: `string`

One or several CSS classes that you want to apply to the inner `<input>` or `<button>` element.

In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `innerCss` property applies classes to the `<input>`/`<button>` element.

To apply several classes, separate them with a space character: `"myclass1 myclass2"`.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

### `location`

**Type**: `string`

The action item's location in a matrix question's row.

The following values are available:

- `"start"` - The action item is located at the beginning of the row.
- `"end"` - The action is located at the end of the row.

### `showTitle`

**Type**: `boolean`

Specifies the visibility of the action item's title.

### `template`

**Type**: `string`

Specifies the name of a template used to render the action item.

### `title`

**Type**: `string`

The action item's title.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

### `tooltip`

**Type**: `string`

The action item's tooltip.

### `visible`

**Type**: `boolean | ComputedUpdater<boolean>`

Specifies the action item's visibility.

### `visibleIndex`

**Type**: `number`

A number that specifies the action's position relative to other actions.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

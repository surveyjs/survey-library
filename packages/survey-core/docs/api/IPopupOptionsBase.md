---
title: IPopupOptionsBase
product: Form Library
api-type: interface
description: 
source: 
---

# `IPopupOptionsBase`

## Properties

### `onBlur`

**Type**: `() => void`

### `onHide`

**Type**: `() => void`

### `onShow`

A callback function executed when the dialog is opened.

**Type**: `() => void`

### `onCancel`

A callback function executed when users click the Cancel button in the dialog.

**Type**: `() => void`

### `onDispose`

**Type**: `() => void`

### `getTargetCallback`

**Type**: `(container: any) => any`

### `getAreaCallback`

**Type**: `(container: any) => any`

### `cssClass`

A CSS class to apply to the root element of the dialog for custom styling.

**Type**: `string`

### `title`

The dialog's title.

**Type**: `string`

### `verticalPosition`

**Type**: `"top" | "middle" | "bottom"`

### `horizontalPosition`

**Type**: `"left" | "center" | "right"`

### `showPointer`

**Type**: `boolean`

### `isModal`

**Type**: `boolean`

### `canShrink`

**Type**: `boolean`

### `displayMode`

**Type**: `"popup" | "overlay"`

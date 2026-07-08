---
title: IDialogOptions
product: Form Library
api-type: interface
description: "An interface used to configure the content and behavior of a modal dialog displayed via the [`showDialog()`](https://surveyjs.io/form-library/documentation/api-reference/settings#showDialog) method. [View Demo](https://surveyjs.io/survey-creator/examples/add-modal-property-editor-to-property-grid/ (linkStyle))"
source: 
---

# `IDialogOptions`

An interface used to configure the content and behavior of a modal dialog displayed via the [`showDialog()`](https://surveyjs.io/form-library/documentation/api-reference/settings#showDialog) method.

[View Demo](https://surveyjs.io/survey-creator/examples/add-modal-property-editor-to-property-grid/ (linkStyle))

## Inheritance

`IPopupOptionsBase` &rarr; `IDialogOptions`

## Properties

### `componentName`

The name of the component to render inside the dialog.

This component should be registered in the component collection used by the application (e.g., in `ReactElementFactory` for React and HTML/JS/CSS, `AngularComponentFactory` for Angular, or `app.component()` for Vue.js).

**Type**: `string`

### `data`

An object with component props.

**Type**: `any`

### `onApply`

A callback function executed when users click the Apply button in the dialog.

This function should return `true` to close the dialog or `false` to keep it open (for example, if validation fails).

**Type**: `() => boolean`

### `isFocusedContent`

**Type**: `boolean`

### `showCloseButton`

**Type**: `boolean`

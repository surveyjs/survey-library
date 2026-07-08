---
title: ErrorCustomTextEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ErrorCustomTextEvent`

## Properties

### `name`

A validation error type: `"required"`, `"requireoneanswer"`, `"requirenumeric"`, `"exceedsize"`, `"webrequest"`, `"webrequestempty"`, `"otherempty"`, `"uploadingfile"`, `"requiredinallrowserror"`, `"minrowcounterror"`, `"keyduplicationerror"`, or `"custom"`.

**Type**: `string`

### `obj`

A survey element to which the validation error belongs.

**Type**: `Question | PanelModel | SurveyModel`

### `error`

A validation error.

**Type**: `SurveyError`

### `text`

An error message. You can assign a custom message to this parameter.

**Type**: `string`

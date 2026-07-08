---
title: CreateRegexValidatorEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `CreateRegexValidatorEvent`

## Inheritance

`QuestionEventMixin` &rarr; `CreateRegexValidatorEvent`

## Properties

### `validator`

A validator instance for which the event is raised.

**Type**: `RegexValidator`

### `pattern`

A regular expression pattern used by the validator. You can modify this value to change the validation logic.

**Type**: `string`

### `flags`

Optional regular expression flags that control additional matching behavior, such as case-insensitive searching. You can modify this value. For more information about supported flags, refer to the MDN article: [Advanced searching with flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags).

**Type**: `string`

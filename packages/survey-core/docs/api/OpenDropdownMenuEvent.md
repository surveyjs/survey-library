---
title: OpenDropdownMenuEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `OpenDropdownMenuEvent`

## Inheritance

`QuestionEventMixin` &rarr; `OpenDropdownMenuEvent`

## Properties

### `question`

A question for which the event is raised.

**Type**: `Question`

### `deviceType`

A device type.

**Type**: `"mobile" | "tablet" | "desktop"`

### `hasTouchScreen`

A Boolean value that indicates whether the current device supports touch gestures.

**Type**: `boolean`

### `screenHeight`

The height of the device screen in pixels.

**Type**: `number`

### `screenWidth`

The width of the device screen in pixels.

**Type**: `number`

### `menuType`

A menu type to use for the question: a classic dropdown, a pop-up dialog, or an overlay window. You can modify this parameter's value.

**Type**: `"popup" | "dropdown" | "overlay"`

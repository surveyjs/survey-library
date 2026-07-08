---
title: DragDropAllowEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `DragDropAllowEvent`

## Properties

### `draggedElement`

A survey element being dragged.

**Type**: `IElement`

### `fromElement`

A survey element from which `draggedElement` is being dragged. This parameter is `null` if `draggedElement` is being dragged from the [Toolbox](https://surveyjs.io/survey-creator/documentation/toolbox).

**Type**: `IPanel`

### `toElement`

A survey element to which `draggedElement` is being dragged.

**Type**: `IElement`

### `insertBefore`

A survey element before which the target element will be placed. This parameter is `null` if the parent container (page or panel) has no elements or if the target element will be placed below all other elements within the container.

**Type**: `IElement`

### `insertAfter`

A survey element after which `draggedElement` will be placed. This parameter is `null` if the parent container (page or panel) has no elements or if `draggedElement` will be placed above all other elements within the container.

**Type**: `IElement`

### `parent`

A parent container (page or panel) within which `draggedElement` will be placed.

**Type**: `ISurveyElement`

### `allow`

A Boolean property that you can set to `false` if you want to cancel the drag and drop operation.

**Type**: `boolean`

### `allowDropNextToAnother`

**Type**: `boolean`

### `target`

**Type**: `IElement`

### `source`

**Type**: `IElement`

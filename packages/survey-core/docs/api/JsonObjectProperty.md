---
title: JsonObjectProperty
product: Form Library
api-type: class
description: Contains information about a property of a survey element (page, panel, questions, and etc).
source: 
---

# `JsonObjectProperty`

Contains information about a property of a survey element (page, panel, questions, and etc).

## Properties

### `getItemValuesDefaultValue`

**Type**: `(val: any, type: string) => any`

### `Index`

**Type**: `number`

### `idValue`

**Type**: `number`

### `classInfoValue`

**Type**: `JsonMetadataClass`

### `typeValue`

**Type**: `string`

### `choicesValue`

**Type**: `any[]`

### `acceptedValues`

**Type**: `any[]`

### `baseValue`

**Type**: `any`

### `isRequiredValue`

**Type**: `boolean`

### `isUniqueValue`

**Type**: `boolean`

### `uniquePropertyValue`

**Type**: `string`

### `readOnlyValue`

**Type**: `boolean`

### `visibleValue`

**Type**: `boolean`

### `isLocalizableValue`

**Type**: `boolean`

### `choicesfunc`

**Type**: `(obj: any, choicesCallback: any) => any[]`

### `dependedProperties`

**Type**: `string[]`

### `isSerializable`

**Type**: `boolean`

### `isSerializableFunc`

**Type**: `(obj: any) => boolean`

### `isLightSerializable`

**Type**: `boolean`

### `isCustom`

**Type**: `boolean`

### `isDynamicChoices`

**Type**: `boolean`

### `isBindable`

**Type**: `boolean`

### `className`

**Type**: `string`

### `alternativeName`

**Type**: `string`

### `oldName`

**Type**: `string`

### `classNamePart`

**Type**: `string`

### `baseClassName`

**Type**: `string`

### `defaultValueValue`

**Type**: `any`

### `defaultValueFunc`

**Type**: `(obj: Base) => any`

### `serializationProperty`

**Type**: `string`

### `displayName`

**Type**: `string`

### `category`

**Type**: `string`

### `categoryIndex`

**Type**: `number`

### `visibleIndex`

**Type**: `number`

### `nextToProperty`

**Type**: `string`

### `overridingProperty`

**Type**: `string`

### `availableInMatrixColumn`

**Type**: `boolean`

### `maxLength`

**Type**: `number`

### `maxValue`

**Type**: `any`

### `minValue`

**Type**: `any`

### `dataListValue`

**Type**: `string[]`

### `locationInTableValue`

**Type**: `string`

### `layout`

**Type**: `string`

### `version`

**Type**: `string`

### `onSerializeValue`

**Type**: `(obj: any) => any`

### `onGetValue`

**Type**: `(obj: any) => any`

### `onSettingValue`

**Type**: `(obj: any, value: any) => any`

### `onSetValue`

**Type**: `(obj: any, value: any, jsonConv: JsonObject) => any`

### `visibleIf`

**Type**: `(obj: any) => boolean`

### `enableIf`

**Type**: `(obj: any) => boolean`

### `onExecuteExpression`

**Type**: `(obj: any, res: any) => any`

### `onPropertyEditorUpdate`

**Type**: `(obj: any, propEditor: any) => any`

### `uniqueProperty`

**Type**: `string`

### `dependsOn`

**Type**: `string | string[]`

### `default`

**Type**: `any`

### `defaultFunc`

**Type**: `(obj: Base) => any`

### `id`

**Type**: `number`

### `classInfo`

**Type**: `JsonMetadataClass`

### `type`

**Type**: `string`

### `isExpression`

**Type**: `boolean`

### `locationInTable`

**Type**: `string`

### `showMode`

**Type**: `string`

### `isArray`

**Type**: `boolean`

### `isRequired`

**Type**: `boolean`

### `isUnique`

**Type**: `boolean`

### `uniquePropertyName`

**Type**: `string`

### `defaultValue`

**Type**: `any`

### `hasToUseSetValue`

**Type**: `string | ((obj: any, value: any, jsonConv: JsonObject) => any)`

### `choices`

Depricated, please use getChoices

**Type**: `any[]`

### `hasChoices`

**Type**: `boolean`

### `readOnly`

**Type**: `boolean`

### `visible`

**Type**: `boolean`

### `isLocalizable`

**Type**: `boolean`

### `isMultipleText`

**Type**: `boolean`

### `dataList`

**Type**: `string[]`

## Methods

### `isPropertySerializable()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |

### `getDefaultValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `Base` |  |

### `isDefaultValue()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |

### `isDefaultValueByObj()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `Base` |  |
| `value` | `any` |  |

### `getSerializableValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `storeDefaults` | `boolean` |  |
| `options` | `ISaveToJSONOptions` |  |

### `getValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `options` | `ISaveToJSONOptions` |  |

### `getPropertyValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |

### `settingValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `value` | `any` |  |

### `setValue()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `value` | `any` |  |
| `jsonConv` | `JsonObject` |  |

### `validateValue()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `Base` |  |
| `value` | `any` |  |

### `getObjType()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `objType` | `string` |  |

### `getChoices()`

**Return value:** `any[]<any>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `choicesCallback` | `any` |  |

### `setChoices()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any[]` |  |
| `valueFunc` | `(obj: any) => any[]` |  |

### `getBaseValue()`

**Return value:** `string`

### `setBaseValue()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `any` |  |

### `isEnable()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |

### `isVisible()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `layout` | `string` |  |
| `obj` | `any` |  |

### `isAvailableInVersion()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `ver` | `string` |  |

### `getSerializedName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `ver` | `string` |  |

### `getSerializedProperty()`

**Return value:** `JsonObjectProperty`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `ver` | `string` |  |

### `mergeWith()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `prop` | `JsonObjectProperty` |  |

### `addDependedProperty()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `getDependedProperties()`

**Return value:** `string[]<any>`

### `schemaType()`

**Return value:** `string`

### `schemaRef()`

**Return value:** `string`

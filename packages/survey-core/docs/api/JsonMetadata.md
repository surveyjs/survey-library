---
title: JsonMetadata
product: Form Library
api-type: class
description: "The metadata object. It contains object properties' runtime information and allows you to modify it."
source: 
---

# `JsonMetadata`

The metadata object. It contains object properties' runtime information and allows you to modify it.

## Properties

### `classes`

**Type**: `HashTable<JsonMetadataClass>`

### `alternativeNames`

**Type**: `HashTable<string>`

### `childrenClasses`

**Type**: `HashTable<JsonMetadataClass[]>`

### `dynamicPropsCache`

**Type**: `HashTable<JsonObjectProperty[]>`

### `onSerializingProperty`

**Type**: `(obj: Base, prop: JsonObjectProperty, value: any, json: any) => boolean`

## Methods

### `getObjPropertyValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `name` | `string` |  |

### `setObjPropertyValue()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `name` | `string` |  |
| `val` | `any` |  |

### `addClass()`

**Return value:** `JsonMetadataClass`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `properties` | `(string \| IJsonPropertyInfo)[]` |  |
| `creator` | `(json?: any) => any` |  |
| `parentName` | `string` |  |

### `removeClass()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `overrideClassCreatore()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `creator` | `() => any` |  |

### `overrideClassCreator()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `creator` | `() => any` |  |

### `getProperties()`

**Return value:** `JsonObjectProperty[]<JsonObjectProperty>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |

### `getPropertiesByObj()`

**Return value:** `JsonObjectProperty[]<JsonObjectProperty>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |

### `addDynamicPropertiesIntoObj()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `dest` | `any` |  |
| `src` | `any` |  |
| `props` | `JsonObjectProperty[]` |  |

### `getDynamicPropertiesByObj()`

**Return value:** `JsonObjectProperty[]<JsonObjectProperty>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `any` |  |
| `dynamicType` | `string` |  |

### `getDynamicPropertiesByTypes()`

**Return value:** `JsonObjectProperty[]<JsonObjectProperty>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `objType` | `string` |  |
| `dynamicType` | `string` |  |
| `nonSerialableProps` | `string[]` |  |

### `hasOriginalProperty()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `Base` |  |
| `propName` | `string` |  |

### `getOriginalProperty()`

**Return value:** `JsonObjectProperty`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `Base` |  |
| `propName` | `string` |  |

### `getProperty()`

**Return value:** `JsonObjectProperty`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |
| `propertyName` | `string` |  |

### `findProperty()`

**Return value:** `JsonObjectProperty`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |
| `propertyName` | `string` |  |

### `findProperties()`

**Return value:** `JsonObjectProperty[]<JsonObjectProperty>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |
| `propertyNames` | `string[]` |  |

### `getAllPropertiesByName()`

**Return value:** `JsonObjectProperty[]<JsonObjectProperty>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `propertyName` | `string` |  |

### `getAllClasses()`

**Return value:** `string[]<any>`

### `createClass()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `json` | `any` |  |

### `getChildrenClasses()`

**Return value:** `JsonMetadataClass[]<JsonMetadataClass>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `canBeCreated` | `boolean` |  |

### `getRequiredProperties()`

**Return value:** `string[]<any>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `addProperties()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |
| `propertiesInfos` | `(string \| IJsonPropertyInfo)[]` |  |

### `addProperty()`

**Return value:** `JsonObjectProperty`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |
| `propertyInfo` | `string \| IJsonPropertyInfo` |  |

### `removeProperty()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |
| `propertyName` | `string` |  |

### `findClass()`

**Return value:** `JsonMetadataClass`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `isDescendantOf()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |
| `ancestorClassName` | `string` |  |

### `addAlterNativeClassName()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `alternativeName` | `string` |  |

### `generateSchema()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `className` | `string` |  |

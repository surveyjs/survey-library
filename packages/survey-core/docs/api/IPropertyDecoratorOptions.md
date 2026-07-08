---
title: IPropertyDecoratorOptions
product: Form Library
api-type: interface
description: 
source: 
---

# `IPropertyDecoratorOptions`

## Properties

### `defaultValue`

**Type**: `T`

### `defaultSource`

**Type**: `string`

### `getDefaultValue`

**Type**: `(objectInstance?: any) => T`

### `calcFunc`

**Type**: `(objectInstance?: any) => T`

### `returnValue`

**Type**: `T`

### `localizable`

**Type**: `boolean | { name?: string; onCreate?: (obj: Base, locStr: any) => void; defaultStr?: string | boolean; markdown?: boolean; }`

### `onSet`

**Type**: `(val: T, objectInstance: any, prevVal?: T) => void`

### `onSetting`

**Type**: `(val: T, objectInstance: any, prevVal?: T) => T`

### `isLowerCase`

**Type**: `boolean`

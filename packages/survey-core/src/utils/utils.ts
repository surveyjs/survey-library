export function compareVersions(a: any, b: any): number {
  const regExStrip0: RegExp = /(\.0+)+$/;
  const segmentsA: string[] = a.replace(regExStrip0, "").split(".");
  const segmentsB: string[] = b.replace(regExStrip0, "").split(".");
  const len: number = Math.min(segmentsA.length, segmentsB.length);
  for (let i: number = 0; i < len; i++) {
    const diff: number =
      parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff) {
      return diff;
    }
  }
  return segmentsA.length - segmentsB.length;
}

export function unwrap<T>(value: T | (() => T)): T {
  if (typeof value !== "function") {
    return value;
  } else {
    return (<() => T>value)();
  }
}

export function getRenderedSize(val: string | number): number {
  if (typeof val == "string") {
    if (!isNaN(Number(val))) {
      return Number(val);
    } else if (val.includes("px")) {
      return parseFloat(val);
    }
  }
  if (typeof val == "number") {
    return val;
  }
  return undefined;
}
export function getRenderedStyleSize(val: string | number): string {
  if (getRenderedSize(val) !== undefined) {
    return undefined;
  }
  return val as string;
}

export function mergeValues(src: any, dest: any): void {
  if (!dest || !src) return;
  if (typeof dest !== "object") return;
  for (var key in src) {
    var value = src[key];
    if (!Array.isArray(value) && value && typeof value === "object") {
      if (!dest[key] || typeof dest[key] !== "object") dest[key] = {};
      mergeValues(value, dest[key]);
    } else {
      dest[key] = value;
    }
  }
}

export function compareArrays<T>(oldValue: Array<T>, newValue: Array<T>, getKey: (item: T) => any): { addedItems: Array<T>, deletedItems: Array<T>, reorderedItems: Array<{ item: T, movedForward: boolean }>, mergedItems: Array<T> } {
  const oldItemsMap = new Map<any, T>();
  const newItemsMap = new Map<any, T>();
  const commonItemsInNewMap = new Map<any, number>();
  const commonItemsInOldMap = new Map<any, number>();
  oldValue.forEach((item) => {
    const itemKey = getKey(item);
    if (!oldItemsMap.has(itemKey)) {
      oldItemsMap.set(getKey(item), item);
    } else {
      //if keys are set incorrectly do not process comparing
      throw new Error("keys must be unique");
    }
  });
  newValue.forEach((item) => {
    const itemKey = getKey(item);
    if (!newItemsMap.has(itemKey)) {
      newItemsMap.set(itemKey, item);
    } else {
      //if keys are set incorrectly do not process comparing
      throw new Error("keys must be unique");
    }
  });
  const addedItems: Array<T> = [];
  const deletedItems: Array<T> = [];

  //calculating addedItems and items that exist in both arrays
  newItemsMap.forEach((item, key) => {
    if (!oldItemsMap.has(key)) {
      addedItems.push(item);
    } else {
      commonItemsInNewMap.set(key, commonItemsInNewMap.size);
    }
  });

  //calculating deletedItems and items that exist in both arrays

  oldItemsMap.forEach((item, key) => {
    if (!newItemsMap.has(key)) {
      deletedItems.push(item);
    } else {
      commonItemsInOldMap.set(key, commonItemsInOldMap.size);
    }
  });

  //calculating reordered items
  const reorderedItems: Array<{ item: T, movedForward: boolean }> = [];
  commonItemsInNewMap.forEach((index, key) => {
    const oldIndex = commonItemsInOldMap.get(key);
    const item = newItemsMap.get(key);
    if (oldIndex !== index) reorderedItems.push({ item: item, movedForward: oldIndex < index });
  });

  //calculating merged array if multiple operations are applied at once

  const oldItemsWithCorrectOrder = new Array<T>(oldValue.length);
  let commonItemsIndex = 0;
  const commonItemsKeysOrder = Array.from(commonItemsInNewMap.keys());
  oldValue.forEach((item, index) => {
    if (commonItemsInNewMap.has(getKey(item))) {
      oldItemsWithCorrectOrder[index] = newItemsMap.get(commonItemsKeysOrder[commonItemsIndex]);
      commonItemsIndex++;
    } else {
      oldItemsWithCorrectOrder[index] = item;
    }
  });

  const valuesToInsertBeforeKey = new Map<any, Array<T>>();
  let tempValuesArray: Array<T> = [];
  oldItemsWithCorrectOrder.forEach((item) => {
    const itemKey = getKey(item);
    if (newItemsMap.has(itemKey)) {
      if (tempValuesArray.length > 0) {
        valuesToInsertBeforeKey.set(itemKey, tempValuesArray);
        tempValuesArray = [];
      }
    } else {
      tempValuesArray.push(item);
    }
  });
  const mergedItems = new Array<T>();
  newItemsMap.forEach((item, key) => {
    if (valuesToInsertBeforeKey.has(key)) {
      valuesToInsertBeforeKey.get(key).forEach((item) => {
        mergedItems.push(item);
      });
    }
    mergedItems.push(item);
  });
  tempValuesArray.forEach((item) => {
    mergedItems.push(item);
  });
  return { reorderedItems, deletedItems, addedItems, mergedItems };
}

export function floorTo2Decimals(number: number): number {
  return Math.floor(number * 100) / 100;
}

export function mulberry32(seed: number): () => number {
  return function() {
    var t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

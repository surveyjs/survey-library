export function createBoxShadow(value: Array<any>): string {
  if (!Array.isArray(value)) return undefined;
  let hasValue = false;
  value.forEach(val => { for (let key in val) { hasValue = true; } });
  if (!hasValue) return undefined;
  return value.map((val => `${val.isInset == true ? "inset " : ""}${val.x ?? 0}px ${val.y ?? 0}px ${val.blur ?? 0}px ${val.spread ?? 0}px ${val.color ?? "#000000"}`
  )).join(",");
}

export function createBoxShadowReset(value: string): string {
  const resetValue: any = parseBoxShadow(value);

  resetValue.forEach((valueItem) => {
    valueItem.x = 0;
    valueItem.y = 0;
    valueItem.blur = 0;
    valueItem.spread = 0;
  });

  return createBoxShadow(resetValue);
}

export function parseBoxShadow(value: string = ""): Array<Object> {
  return value.split(/,(?![^(]*\))/).map(value => {
    const color = value.match(/#[a-zA-Z0-9]+|rgba?\(.*?\)|var\(--sjs2-color-.*?\)/);
    const isInset = value.indexOf("inset") > -1;
    const res: Object = {};
    if (isInset) {
      value = value.replace("inset", "");
    }
    if (!!color) {
      res["color"] = color[0];
    }
    const values = value.replace(/\s+/g, " ").replace(/^\s|\s$/g, "").split(" ");
    res["x"] = parseInt(values[0]) || 0;
    res["y"] = parseInt(values[1]) || 0;
    res["blur"] = parseInt(values[2]) || 0;
    res["spread"] = parseInt(values[3]) || 0;
    res["isInset"] = isInset;
    return res;
  });
}

export function trimBoxShadowValue(value: string): string {
  if (!value) return value;
  return value.replace(/\)\,\s/g, "),");
}
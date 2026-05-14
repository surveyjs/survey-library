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

function extractColorWithBalancedParens(value: string): { color: string, rest: string } | null {
  const funcMatch = value.match(/\b(rgba?|color)\(/i);
  if (!funcMatch) return null;
  const start = value.indexOf(funcMatch[0]);
  const parenStart = start + funcMatch[0].length;
  let depth = 1;
  let i = parenStart;
  while(i < value.length && depth > 0) {
    if (value[i] === "(") depth++;
    else if (value[i] === ")") depth--;
    i++;
  }
  const color = value.substring(start, i).trim();
  const rest = (value.substring(0, start) + value.substring(i)).trim();
  return { color, rest };
}

export function parseBoxShadow(value: string = ""): Array<Object> {
  return value.split(/,(?![^(]*\))/).map(value => {
    const isInset = value.indexOf("inset") > -1;
    const res: Object = {};
    if (isInset) {
      value = value.replace("inset", "");
    }
    let restStr = value.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
    const funcColor = extractColorWithBalancedParens(restStr);
    const hexColor = restStr.match(/#[a-zA-Z0-9]+/);
    const varColor = restStr.match(/var\(--sjs2-color-[^)]*\)/);
    if (funcColor) {
      res["color"] = funcColor.color;
      restStr = funcColor.rest.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
    } else if (hexColor) {
      res["color"] = hexColor[0];
      restStr = restStr.replace(hexColor[0], "").replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
    } else if (varColor) {
      res["color"] = varColor[0];
      restStr = restStr.replace(varColor[0], "").replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
    }
    const values = restStr.split(/\s+/);
    res["x"] = parseInt(values[0], 10) || 0;
    res["y"] = parseInt(values[1], 10) || 0;
    res["blur"] = parseInt(values[2], 10) || 0;
    res["spread"] = parseInt(values[3], 10) || 0;
    res["isInset"] = isInset;
    return res;
  });
}

export function trimBoxShadowValue(value: string): string {
  if (!value) return value;
  return value.replace(/\)\,\s/g, "),");
}
// The planned counts of a generated survey JSON for meta: choice questions (counting matrix cells and the
// questions of the panels a dynamic panel starts with) and expressions per property.
const choiceTypes = ["radiogroup", "checkbox", "dropdown"];

export interface JsonCounts {
  choiceQuestions: { [type: string]: number };
  expressionsPerProperty: { [prop: string]: number };
}

function isExpressionKey(key: string): boolean {
  return /If$/.test(key) || /Expression$/.test(key) || key === "expression";
}

export function countJson(json: any): JsonCounts {
  const choiceQuestions: { [type: string]: number } = { radiogroup: 0, checkbox: 0, dropdown: 0 };
  const expressionsPerProperty: { [prop: string]: number } = {};
  const addChoice = (type: string, n: number): void => {
    if (choiceTypes.indexOf(type) > -1) choiceQuestions[type] += n;
  };
  const addExpr = (prop: string): void => { expressionsPerProperty[prop] = (expressionsPerProperty[prop] || 0) + 1; };
  const exprs = (obj: any, prefix: string): void => {
    for (const key of Object.keys(obj)) if (typeof obj[key] === "string" && isExpressionKey(key)) addExpr(prefix + key);
  };
  const walk = (el: any, prefix: string, copies: number): void => {
    exprs(el, prefix);
    (el.validators || []).forEach((v: any) => { if (v.expression) addExpr(prefix + "validators.expression"); });
    ["choices", "rows", "columns"].forEach((key: string) => (el[key] || []).forEach((item: any) => {
      if (item && typeof item === "object") exprs(item, prefix + key + ".");
    }));
    if (el.type !== "panel" && el.type !== "paneldynamic") addChoice(el.type, copies);
    if (el.type === "matrixdropdown" || el.type === "matrixdynamic") {
      const rows = el.type === "matrixdropdown" ? (el.rows || []).length : (el.rowCount === undefined ? 2 : el.rowCount);
      (el.columns || []).forEach((c: any) => addChoice(c.cellType || el.cellType || "dropdown", rows * copies));
    }
    (el.elements || []).forEach((e: any) => walk(e, prefix, copies));
    (el.templateElements || []).forEach((e: any) => walk(e, prefix + "templateElements.", copies * (el.panelCount || 0)));
  };
  (json.pages || []).forEach((p: any) => {
    exprs(p, "page.");
    (p.elements || []).forEach((e: any) => walk(e, "", 1));
  });
  (json.triggers || []).forEach(() => addExpr("triggers"));
  (json.calculatedValues || []).forEach(() => addExpr("calculatedValues"));
  (json.completedHtmlOnCondition || []).forEach(() => addExpr("completedHtmlOnCondition"));
  return { choiceQuestions: choiceQuestions, expressionsPerProperty: expressionsPerProperty };
}

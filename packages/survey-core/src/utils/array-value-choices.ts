import { Helpers } from "../helpers";

export interface IArrayValueChoice {
  value: any;
  text: any;
}

/* internal: the choices that questions with choicesFromQuestion take from an array value - one
   { value, text } per record that has a value in valueField (the first key of the record when
   valueField is empty). The owner of the array value keeps one instance for all its dependents, so the
   projection is made once per value change and per field pair, not once per dependent.
   An array value is updated in place, so its instance does not say that it changed: the owner passes a
   revision it increments on every value change. A new revision does not drop the cached choices: they
   are recomputed and the previous instance is returned when the values and texts are the same, which
   is how a dependent tells that its choices did not change. */
export class ArrayValueChoices {
  private cache: { [key: string]: { value: any, revision: number, choices: Array<IArrayValueChoice> } } = {};

  public getChoices(val: any, revision: number, valueField: string, textField: string): Array<IArrayValueChoice> {
    const key = (valueField || "") + "\n" + (textField || "");
    const cached = this.cache[key];
    if (!!cached && cached.value === val && cached.revision === revision) return cached.choices;
    const choices = this.createChoices(val, valueField, textField);
    const res = !!cached && this.isSameChoices(cached.choices, choices) ? cached.choices : choices;
    this.cache[key] = { value: val, revision: revision, choices: res };
    return res;
  }
  protected createChoices(val: any, valueField: string, textField: string): Array<IArrayValueChoice> {
    const res: Array<IArrayValueChoice> = [];
    if (!Array.isArray(val)) return res;
    for (let i = 0; i < val.length; i++) {
      const obj = val[i];
      if (!Helpers.isValueObject(obj)) continue;
      const key = valueField || Object.keys(obj)[0];
      // Base.isValueEmpty (trimmed) without the call through the question: made on the source
      // question, it met another object shape than the dropdowns and V8 deoptimized it in a loop.
      const keyValue = !!key ? obj[key] : undefined;
      if (!!key && !Helpers.isValueEmpty(typeof keyValue === "string" || keyValue instanceof String ? keyValue.trim() : keyValue)) {
        res.push({ value: obj[key], text: !!textField ? obj[textField] : undefined });
      }
    }
    return res;
  }
  protected isSameChoices(a: Array<IArrayValueChoice>, b: Array<IArrayValueChoice>): boolean {
    if (a.length !== b.length) return false;
    // Exact: a key renamed by case or by a trailing space is a new choice.
    const isSame = (x: any, y: any): boolean => x === y || Helpers.isTwoValueEquals(x, y, false, true, false);
    for (let i = 0; i < a.length; i++) {
      if (!isSame(a[i].value, b[i].value) || !isSame(a[i].text, b[i].text)) return false;
    }
    return true;
  }
}

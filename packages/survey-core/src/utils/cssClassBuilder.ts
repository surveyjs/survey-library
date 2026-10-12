export class CssClassBuilder {
  private classes: string[] = [];

  public isEmpty(): boolean {
    return this.toString() === "";
  }
  public append(value: string, condition: boolean = true): CssClassBuilder {
    if (!!value && condition) {
      if (typeof value === "string") {
        value = value.trim();
      }
      this.classes.push(value);
    }
    return this;
  }
  public toString(): string {
    return this.classes.join(" ");
  }
}

// Joins non-empty class names with a space. Falsy arguments are skipped,
// so a conditional class is passed as `condition && "class-name"`.
export function toCssClasses(...classes: Array<string | false | null | undefined | 0>): string {
  const res: string[] = [];
  for (const cls of classes) {
    if (!!cls && typeof cls === "string") {
      const val = cls.trim();
      if (!!val) res.push(val);
    }
  }
  return res.join(" ");
}

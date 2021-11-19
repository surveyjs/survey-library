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
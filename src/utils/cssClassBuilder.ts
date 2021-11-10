export class CssClassBuilder {
    private classes: string[] = [];

    public isEmpty(): boolean {
      return this.toString() === "";
    }
    public append(value: string, condition: boolean = true): CssClassBuilder {
      if (!!value && condition) this.classes.push(value.trim());
      return this;
    }
    public toString(): string {
      return this.classes.join(" ");
    }
}